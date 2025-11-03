import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function Landing({ onStart }) {
  const [photoStrips, setPhotoStrips] = useState([
    { id: 1, x: 0, y: 0, rotation: 6, photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'], layout: 'row' },
    { id: 2, x: 0, y: 0, rotation: -12, photos: ['photo4.jpg', 'photo5.jpg'], layout: 'col' },
    { id: 3, x: 0, y: 0, rotation: 3, photos: ['photo6.jpg', 'photo1.jpg'], layout: 'row' },
    { id: 4, x: 0, y: 0, rotation: -6, photos: ['photo3.jpg', 'photo4.jpg', 'photo2.jpg'], layout: 'row' },
  ]);

  const [dragging, setDragging] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, id) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    setDragging(id);
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (dragging !== null) {
      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();
      
      setPhotoStrips(prev => prev.map(strip => 
        strip.id === dragging 
          ? { 
              ...strip, 
              x: e.clientX - rect.left - offset.x,
              y: e.clientY - rect.top - offset.y
            }
          : strip
      ));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Animated Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-600/30 to-indigo-700/30 animate-gradient-xy pointer-events-none"></div>
      
      {/* Animated Background Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob pointer-events-none"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-1000 pointer-events-none"></div>

      {/* Draggable Photo Strips */}
      {photoStrips.map((strip, index) => {
        const positions = [
          { top: '2rem', right: '2rem' },
          { top: '10rem', left: '2rem' },
          { bottom: '8rem', right: '4rem' },
          { bottom: '5rem', left: '3rem' }
        ];

        return (
          <Card
            key={strip.id}
            className={`absolute bg-white/90 backdrop-blur-sm shadow-xl cursor-move hover:shadow-2xl transition-shadow select-none ${
              dragging === strip.id ? 'shadow-2xl scale-105 z-50' : 'z-10'
            }`}
            style={{
              transform: `translate(${strip.x}px, ${strip.y}px) rotate(${strip.rotation}deg)`,
              ...(strip.x === 0 && strip.y === 0 ? positions[index] : {})
            }}
            onMouseDown={(e) => handleMouseDown(e, strip.id)}
          >
            <CardContent className={`p-2 flex ${strip.layout === 'col' ? 'flex-col' : ''} gap-2`}>
              {strip.photos.map((photo, idx) => (
                <img 
                  key={idx}
                  src={`/images/${photo}`} 
                  alt="Memory" 
                  className={`object-cover rounded pointer-events-none ${
                    strip.layout === 'col' ? 'w-20 h-20' : strip.photos.length === 3 ? 'w-14 h-14' : 'w-16 h-16'
                  }`}
                  draggable={false}
                />
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pointer-events-none">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl mb-8 hover:scale-105 transition-transform duration-300 pointer-events-auto">
          <CardContent className="p-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </CardContent>
        </Card>

        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 text-center animate-slide-up">
          <span className="bg-gradient-to-r from-pink-200 via-yellow-200 to-purple-200 bg-clip-text text-transparent">
            Photo Booth
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-8 text-center max-w-2xl animate-slide-up animation-delay-200">
          Create amazing memories with customizable layouts and fun effects!
        </p>

        <div className="flex gap-4 animate-slide-up animation-delay-400 pointer-events-auto">
          <Button 
            onClick={onStart}
            size="lg"
            className="bg-white text-purple-600 hover:bg-purple-50 hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl text-lg px-8 py-6"
          >
            🎉 Start Taking Photos
          </Button>
        </div>

        <div className="mt-12 flex gap-3 flex-wrap justify-center animate-fade-in animation-delay-600 pointer-events-auto">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm hover:bg-white/30 hover:scale-105 transition-all">
            ✨ Multiple Layouts
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm hover:bg-white/30 hover:scale-105 transition-all">
            🎨 Custom Colors
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm hover:bg-white/30 hover:scale-105 transition-all">
            📸 Instant Download
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default Landing;
