'use client';
import { useState } from 'react';
import { Music, X } from 'lucide-react';

export function LofiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
      {isOpen && (
        <div className="bg-slate-900 text-white rounded-lg p-3 shadow-lg w-72 flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-200">Focus Radio</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <iframe 
            width="100%" 
            height="100" 
            src={`https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=${isPlaying ? 1 : 0}&controls=1`} 
            title="Lofi Radio" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            className="rounded border border-slate-700"
          />
        </div>
      )}
      {!isOpen && (
        <button 
          onClick={() => {
            setIsOpen(true);
            setIsPlaying(true);
          }}
          className="bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-colors"
          title="Productivity Radio"
        >
          <Music className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
