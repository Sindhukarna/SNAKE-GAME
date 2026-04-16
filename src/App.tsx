import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px]" />
        <div className="absolute left-0 right-0 bottom-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-pink-500 opacity-20 blur-[100px]" />
      </div>

      <div className="z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12">
        
        {/* Left/Top Panel: Title & Music Player */}
        <div className="flex flex-col gap-8 w-full lg:w-1/3">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-black italic tracking-tighter neon-text-cyan mb-2 uppercase">
              Cyber<span className="text-pink-500 neon-text-pink">Snake</span>
            </h1>
            <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase">
              Retro Arcade // AI Mixtape
            </p>
          </div>

          <div className="w-full flex justify-center lg:justify-start">
            <MusicPlayer />
          </div>

          <div className="hidden lg:block mt-auto">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
              <h3 className="text-zinc-500 font-mono text-xs tracking-widest uppercase mb-4">System Status</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">CONNECTION</span>
                  <span className="text-cyan-400 neon-text-cyan">STABLE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">AUDIO_SYNC</span>
                  <span className="text-pink-400 neon-text-pink">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right/Center Panel: Game & Score */}
        <div className="flex flex-col items-center w-full lg:w-2/3">
          <div className="w-full flex justify-between items-end mb-6 px-4">
            <div className="flex flex-col">
              <span className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Current Score</span>
              <span className="text-5xl font-black neon-text-green font-mono leading-none">
                {score.toString().padStart(4, '0')}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Status</span>
              <span className={`text-xl font-bold uppercase tracking-widest ${isGameOver ? 'text-pink-500 neon-text-pink' : 'text-cyan-400 neon-text-cyan'}`}>
                {isGameOver ? 'SYSTEM FAILURE' : 'RUNNING'}
              </span>
            </div>
          </div>

          <SnakeGame 
            onScoreChange={setScore} 
            isGameOver={isGameOver}
            setIsGameOver={setIsGameOver}
          />
        </div>

      </div>
    </div>
  );
}
