import React from 'react';

export default function SkyBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-gradient-to-b from-[#38bdf8] via-[#7dd3fc] to-[#e0f2fe]">
      {/* Sun glow in the top corner */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl" />
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/30 blur-2xl animate-pulse-glow" />

      {/* Floating background decorative clouds */}
      <div 
        className="absolute top-[12%] -left-12 w-48 h-16 bg-white/40 rounded-full blur-sm animate-float"
        style={{ animationDuration: '9s' }}
      >
        <div className="absolute -top-8 left-8 w-20 h-20 bg-white/40 rounded-full" />
        <div className="absolute -top-12 left-16 w-24 h-24 bg-white/40 rounded-full" />
      </div>

      <div 
        className="absolute top-[35%] -right-16 w-60 h-20 bg-white/30 rounded-full blur-sm animate-float-slow"
        style={{ animationDuration: '12s', animationDelay: '2s' }}
      >
        <div className="absolute -top-10 left-10 w-24 h-24 bg-white/30 rounded-full" />
        <div className="absolute -top-14 left-24 w-28 h-28 bg-white/30 rounded-full" />
      </div>

      <div 
        className="absolute bottom-[20%] -left-10 w-52 h-16 bg-white/35 rounded-full blur-sm animate-float"
        style={{ animationDuration: '11s', animationDelay: '4s' }}
      >
        <div className="absolute -top-8 left-10 w-20 h-20 bg-white/35 rounded-full" />
        <div className="absolute -top-10 left-20 w-22 h-22 bg-white/35 rounded-full" />
      </div>

      {/* Subtle sparkling particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/80 rounded-full blur-[0.5px] animate-ping" style={{ animationDuration: '3s' }} />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/90 rounded-full blur-[0.5px] animate-ping" style={{ animationDuration: '4s', animationDelay: '1.5s' }} />
      <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-white/70 rounded-full blur-[0.5px] animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.8s' }} />
    </div>
  );
}
