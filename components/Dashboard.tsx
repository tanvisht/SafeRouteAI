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
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = () => {
    auth.signOut();
  };

  const handleRouteFound = async (details: RouteDetails) => {
    setRoute(details);
    setAppState(AppState.ROUTE_CONFIRMED);
    setIsGenerating(true);
    setError(null);

    try {
      // THIS IS THE UPDATED TUNNEL URL AND HEADER
      const response = await fetch('https://cruel-birds-cheer.loca.lt/process_route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true' 
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
        setSafetyScore(data.safety_score ?? data.safetyScore);
        setNarrative(data.narrative);
        setAppState(AppState.READY_TO_PLAY);
      } else {
        const errorText = await response.text();
        console.error("Backend error:", response.status, errorText);
        setError(`Backend Error (${response.status}): ${errorText || response.statusText}`);
      }
    } catch (err: any) {
      console.error("Error processing route:", err);
      setError(`Connection Failed: ${err.message || 'Could not connect to the safety analysis engine.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

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
      <MapBackground route={route} />

      <div className="absolute top-0 left-0 right-0 p-6 flex justify-end z-50">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-stone-200 rounded-full text-stone-600 hover:text-editorial-900 hover:bg-white transition-all shadow-sm hover:shadow-md font-medium text-sm"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

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

              {error && (
                <div className="mt-8 max-w-md mx-auto animate-fade-in">
                  <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-red-600 font-bold">
                      <span className="text-sm uppercase tracking-widest">Analysis Failed</span>
                    </div>
                    <p className="text-red-500 text-sm leading-relaxed">
                      {error}
                    </p>
                    <button 
                      onClick={() => setError(null)}
                      className="text-red-600 text-[10px] uppercase tracking-widest font-bold hover:underline mt-2 self-start"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            route && story && (
              <div className="animate-fade-in space-y-8">
                {/* Custom Card to clearly show the Safety Score and Gemini Text */}
                <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-stone-200 max-w-3xl mx-auto mt-12">
                   <div className="flex items-center justify-between mb-6 border-b pb-4">
                      <h2 className="text-2xl font-serif text-editorial-900">Route Safety Analysis</h2>
                      <div className={`px-4 py-2 rounded-full font-bold text-white ${safetyScore && safetyScore > 70 ? 'bg-green-500' : 'bg-amber-500'}`}>
                         Score: {safetyScore}/100
                      </div>
                   </div>
                   <p className="text-lg text-stone-700 leading-relaxed font-serif">
                      {narrative}
                   </p>
                </div>
                
                <StoryPlayer 
                  story={story}
                  route={route}
                  onSegmentChange={() => {}}
                  isBackgroundGenerating={false}
                />
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;