import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Sparkles, 
  Layout, 
  Palette, 
  Download, 
  Heart,
  Star,
  Zap,
  ArrowRight,
  ImagePlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Landing Page - Color Theory Application
 * 
 * Color Psychology Applied:
 * - Rose/Coral (#F43F5E): Primary action color - evokes warmth, joy, excitement
 * - Violet (#8B5CF6): Secondary accent - creativity, imagination, premium feel
 * - Amber (#F59E0B): Tertiary highlights - optimism, confidence, energy
 * - Deep Slate (#0F172A → #1E293B): Background - sophistication, trust, focus
 * 
 * The warm-to-cool gradient creates visual harmony through complementary colors,
 * while the glass morphism effects add depth without overwhelming the composition.
 */

function Landing({ onStart, onViewGallery }) {
  // Photo strips with initial positions (draggable)
  const [photoStrips, setPhotoStrips] = useState([
    { id: 1, x: 0, y: 0, rotation: 8, photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'], scale: 1 },
    { id: 2, x: 0, y: 0, rotation: -12, photos: ['photo4.jpg', 'photo5.jpg'], scale: 1 },
    { id: 3, x: 0, y: 0, rotation: 5, photos: ['photo6.jpg', 'photo1.jpg'], scale: 1 },
    { id: 4, x: 0, y: 0, rotation: -7, photos: ['photo3.jpg', 'photo4.jpg', 'photo2.jpg'], scale: 1 },
  ]);

  const [dragging, setDragging] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Drag handlers
  const handleMouseDown = useCallback((e, id) => {
    e.preventDefault();
    setDragging(id);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPhotoStrips(prev => prev.map(strip => 
      strip.id === id ? { ...strip, scale: 1.05 } : strip
    ));
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (dragging === null) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setPhotoStrips(prev => prev.map(strip => 
      strip.id === dragging 
        ? { ...strip, x: strip.x + deltaX, y: strip.y + deltaY }
        : strip
    ));
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [dragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    if (dragging !== null) {
      setPhotoStrips(prev => prev.map(strip => 
        strip.id === dragging ? { ...strip, scale: 1 } : strip
      ));
    }
    setDragging(null);
  }, [dragging]);

  // Feature cards data
  const features = [
    { icon: Layout, label: 'Multiple Layouts', color: 'from-rose-500 to-pink-500' },
    { icon: Palette, label: 'Custom Themes', color: 'from-violet-500 to-purple-500' },
    { icon: Sparkles, label: 'Fun Filters', color: 'from-amber-500 to-orange-500' },
    { icon: Download, label: 'Instant Save', color: 'from-emerald-500 to-teal-500' },
  ];

  // Initial positions for floating photo strips
  const stripPositions = [
    { top: '8%', right: '5%' },
    { top: '25%', left: '3%' },
    { bottom: '20%', right: '8%' },
    { bottom: '10%', left: '5%' },
  ];

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs - Using color theory: warm (rose) and cool (violet) create visual tension */}
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(244,63,94,0.4) 0%, transparent 70%)',
            top: '-10%',
            right: '-10%',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
            bottom: '-5%',
            left: '-5%',
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.35, 0.25],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)',
            top: '40%',
            left: '30%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Draggable Photo Strips */}
      <AnimatePresence>
        {photoStrips.map((strip, index) => (
          <motion.div
            key={strip.id}
            className={`absolute z-20 cursor-grab active:cursor-grabbing select-none hidden md:block`}
            style={{
              ...stripPositions[index],
              x: strip.x,
              y: strip.y,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: strip.scale,
              rotate: strip.rotation,
            }}
            transition={{ 
              duration: 0.5, 
              delay: 0.2 + index * 0.1,
              scale: { duration: 0.2 }
            }}
            whileHover={{ scale: 1.05, zIndex: 50 }}
            onMouseDown={(e) => handleMouseDown(e, strip.id)}
          >
            <div className="bg-white p-2 rounded-lg shadow-2xl shadow-black/30">
              <div className="flex gap-1.5">
                {strip.photos.map((photo, idx) => (
                  <div key={idx} className="relative overflow-hidden rounded">
                    <img 
                      src={`/images/${photo}`} 
                      alt="Memory" 
                      className="w-16 h-16 object-cover pointer-events-none"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
              {/* Photo strip decoration */}
              <div className="mt-2 flex items-center justify-between px-1">
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-rose-400/60" />
                  ))}
                </div>
                <Heart className="w-3 h-3 text-rose-400/60" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo/Icon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Glow effect behind icon */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-violet-500 rounded-3xl blur-xl opacity-50" />
            <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-violet-500 p-6 rounded-3xl shadow-2xl">
              <Camera className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
            {/* Decorative sparkles */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-4 text-center"
        >
          <span className="bg-gradient-to-r from-white via-rose-100 to-white bg-clip-text text-transparent">
            Photo Booth
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 mb-10 text-center max-w-xl leading-relaxed"
        >
          Capture beautiful moments with customizable layouts, 
          <span className="text-rose-400"> stunning filters</span>, and 
          <span className="text-violet-400"> creative themes</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <Button 
            onClick={onStart}
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 shadow-xl shadow-rose-500/25 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-rose-500/40"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Start Capturing
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            onClick={onViewGallery}
            className="border-slate-700 bg-slate-900/50 backdrop-blur-sm text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 px-8 py-6 text-lg rounded-xl transition-all duration-300"
          >
            <ImagePlus className="w-5 h-5 mr-2" />
            View Gallery
          </Button>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 max-w-2xl"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group"
            >
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600 transition-all duration-300 cursor-default">
                <div className={`p-1.5 rounded-lg bg-gradient-to-r ${feature.color}`}>
                  <feature.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {feature.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-8 flex items-center gap-2 text-slate-500 text-sm"
        >
          <Star className="w-4 h-4 text-amber-500/50" />
          <span>Made with love for capturing memories</span>
          <Star className="w-4 h-4 text-amber-500/50" />
        </motion.div>
      </div>
    </div>
  );
}

export default Landing;
