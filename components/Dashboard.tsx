import React, { useState } from 'react';
import { auth } from '../firebase';
import RoutePlanner from './RoutePlanner';
import MapBackground from './MapBackground';
import StoryPlayer from './StoryPlayer';
import { RouteDetails, AppState, AudioStory } from '../types';
import { LogOut, Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.PLANNING);
  const [safetyScore, setSafetyScore] = useState<number | null>(null);
  const [narrative, setNarrative] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSignOut = () => {
    auth.signOut();
  };

  const handleRouteFound = async (details: RouteDetails) => {
    setRoute(details);
    setAppState(AppState.ROUTE_CONFIRMED);
    setIsGenerating(true);

    try {
      const response = await fetch('https://8080-cs-159935604833-default.cs-us-east1-pkhd.cloudshell.dev/process_route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: details.startAddress,
          destination: details.endAddress,
          speed: 55.0,
          weather: "Clear",
          traffic: "Moderate"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Support both camelCase and snake_case from backend
        setSafetyScore(data.safety_score ?? data.safetyScore);
        setNarrative(data.narrative);
        setAppState(AppState.READY_TO_PLAY);
      } else {
        console.error("Backend error:", response.statusText);
      }
    } catch (error) {
      console.error("Error processing route:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Construct a story object for the StoryPlayer if narrative exists
  const story: AudioStory | null = narrative ? {
    totalSegmentsEstimate: 1,
    outline: ["Safety Analysis"],
    segments: [{
      index: 1,
      text: narrative,
      audioBuffer: null
    }]
  } : null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-editorial-100">
      {/* Fixed Map Background */}
      <MapBackground route={route} />

      {/* Header with Sign Out */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-end z-50">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-stone-200 rounded-full text-stone-600 hover:text-editorial-900 hover:bg-white transition-all shadow-sm hover:shadow-md font-medium text-sm"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Content Overlay */}
      <main className="relative z-10 container mx-auto px-4 py-20 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-5xl">
          {!narrative ? (
            <div className="max-w-2xl mx-auto">
              <RoutePlanner 
                onRouteFound={handleRouteFound} 
                appState={isGenerating ? AppState.GENERATING_INITIAL_SEGMENT : appState} 
              />
              
              {isGenerating && (
                <div className="mt-8 flex flex-col items-center gap-4 animate-fade-in">
                  <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-stone-200 shadow-xl flex items-center gap-4">
                    <Loader2 className="w-6 h-6 text-editorial-900 animate-spin" />
                    <div className="flex flex-col">
                      <span className="text-editorial-900 font-bold">Analyzing Safety...</span>
                      <span className="text-stone-500 text-xs uppercase tracking-widest">Consulting SafeRoute AI Engine</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            route && story && (
              <StoryPlayer 
                story={story}
                route={route}
                onSegmentChange={() => {}}
                isBackgroundGenerating={false}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
