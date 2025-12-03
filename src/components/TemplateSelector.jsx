import React from 'react'
import { motion } from 'framer-motion'
import { Palette, Newspaper, Heart, Sparkles, Star, BookOpen } from 'lucide-react'

/**
 * TemplateSelector - Choose themed photo strip templates
 * 
 * Templates:
 * - Classic: Original film strip with sprocket holes
 * - Newspaper: Vintage "Foto Series CAMERA" style with B&W photos
 * - Kawaii: Cute pink theme with hearts and decorations
 * - Y2K: Retro checkerboard with colorful stickers
 * - Starry: Dark cosmic theme with star bursts
 * - Scrapbook: Tilted polaroid frames with tape decorations
 */

const TemplateSelector = ({ selectedTemplate, onTemplateChange }) => {
  const templates = [
    { 
      id: 'classic', 
      name: 'Classic', 
      description: 'Film strip',
      icon: '🎞️',
      colors: ['#1a1a2e', '#ffffff'],
      preview: 'film'
    },
    { 
      id: 'newspaper', 
      name: 'Newspaper', 
      description: 'Vintage B&W',
      icon: '📰',
      colors: ['#f5f0e6', '#2c2c2c'],
      preview: 'newspaper'
    },
    { 
      id: 'kawaii', 
      name: 'Kawaii', 
      description: 'Cute pink',
      icon: '🎀',
      colors: ['#ffb6c1', '#ff69b4'],
      preview: 'kawaii'
    },
    { 
      id: 'y2k', 
      name: 'Y2K', 
      description: 'Retro vibes',
      icon: '💿',
      colors: ['#e8b4f8', '#9333ea'],
      preview: 'y2k'
    },
    { 
      id: 'starry', 
      name: 'Starry', 
      description: 'Night sky',
      icon: '✨',
      colors: ['#0f0c29', '#302b63'],
      preview: 'starry'
    },
    { 
      id: 'scrapbook', 
      name: 'Scrapbook', 
      description: 'Polaroid style',
      icon: '📔',
      colors: ['#4a6fa5', '#ffffff'],
      preview: 'scrapbook'
    },
    { 
      id: 'picnic', 
      name: 'Picnic', 
      description: 'Gingham cute',
      icon: '🧺',
      colors: ['#FFD4DB', '#ffffff'],
      preview: 'picnic'
    },
    { 
      id: 'coquette', 
      name: 'Coquette', 
      description: 'Pink ribbons',
      icon: '🎀',
      colors: ['#FFFAFA', '#FF91A4'],
      preview: 'coquette'
    },
    { 
      id: 'borcelle', 
      name: 'Borcelle', 
      description: 'Funky purple',
      icon: '💜',
      colors: ['#C4B5E0', '#7B68A6'],
      preview: 'borcelle'
    },
    { 
      id: 'groovy', 
      name: 'Groovy', 
      description: 'Retro 70s',
      icon: '🌈',
      colors: ['#8B5A9B', '#F5E6D3'],
      preview: 'groovy'
    },
    { 
      id: 'dreamy', 
      name: 'Dreamy', 
      description: '3D pink aura',
      icon: '☁️',
      colors: ['#FFE4EC', '#FF69B4'],
      preview: 'dreamy'
    },
    { 
      id: 'y2kheart', 
      name: 'Y2K Heart', 
      description: 'OMG hearts',
      icon: '💗',
      colors: ['#FF1493', '#4B0082'],
      preview: 'y2kheart'
    },
    { 
      id: 'spring', 
      name: 'Spring', 
      description: 'Daisy garden',
      icon: '🌼',
      colors: ['#E0F0E8', '#90EE90'],
      preview: 'spring'
    },
  ]

  // Template preview component
  const TemplatePreview = ({ template, isSelected }) => {
    switch (template.preview) {
      case 'film':
        return (
          <div className="w-full h-full flex">
            {/* Sprocket holes */}
            <div className="w-2 h-full bg-black/30 flex flex-col justify-around py-1">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-1.5 h-2 bg-black/50 rounded-sm mx-auto"></div>
              ))}
            </div>
            {/* Photos */}
            <div className="flex-1 flex flex-col gap-1 p-1">
              {[1,2,3].map(i => (
                <div key={i} className={`flex-1 rounded-sm ${isSelected ? 'bg-white/40' : 'bg-slate-600/60'}`}></div>
              ))}
            </div>
            {/* Sprocket holes */}
            <div className="w-2 h-full bg-black/30 flex flex-col justify-around py-1">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-1.5 h-2 bg-black/50 rounded-sm mx-auto"></div>
              ))}
            </div>
          </div>
        )
      case 'newspaper':
        return (
          <div className="w-full h-full bg-amber-50/80 rounded-sm p-1 flex flex-col">
            <div className={`text-[6px] font-bold text-center mb-1 ${isSelected ? 'text-amber-900' : 'text-amber-800'}`}>CAMERA</div>
            <div className="flex-1 flex flex-col gap-0.5">
              {[1,2,3].map(i => (
                <div key={i} className={`flex-1 rounded-sm ${isSelected ? 'bg-gray-400' : 'bg-gray-500/60'}`}></div>
              ))}
            </div>
          </div>
        )
      case 'kawaii':
        return (
          <div className="w-full h-full rounded-sm p-1 flex flex-col" style={{ background: 'linear-gradient(180deg, #ffb6c1, #ffc0cb)' }}>
            <div className="flex justify-between text-[8px]">
              <span>♡</span>
              <span>♡</span>
            </div>
            <div className="flex-1 flex flex-col gap-0.5 mt-0.5">
              {[1,2].map(i => (
                <div key={i} className={`flex-1 rounded-full ${isSelected ? 'bg-white/60' : 'bg-white/40'}`}></div>
              ))}
            </div>
            <div className="text-[6px] text-center text-pink-600 mt-0.5">cute!</div>
          </div>
        )
      case 'y2k':
        return (
          <div className="w-full h-full rounded-sm overflow-hidden">
            {/* Checkerboard */}
            <div className="w-full h-full grid grid-cols-4 grid-rows-4">
              {[...Array(16)].map((_, i) => (
                <div key={i} className={`${i % 2 === Math.floor(i/4) % 2 ? 'bg-purple-300' : 'bg-purple-100'}`}></div>
              ))}
            </div>
            {/* Overlay photos */}
            <div className="absolute inset-0 flex flex-col gap-0.5 p-1">
              {[1,2].map(i => (
                <div key={i} className={`flex-1 rounded-sm border-2 border-purple-500 ${isSelected ? 'bg-white/70' : 'bg-white/50'}`}></div>
              ))}
            </div>
          </div>
        )
      case 'starry':
        return (
          <div className="w-full h-full rounded-sm p-1 flex flex-col" style={{ background: 'linear-gradient(180deg, #0f0c29, #302b63)' }}>
            <div className="flex justify-between text-[8px] text-yellow-300">
              <span>✦</span>
              <span>✦</span>
            </div>
            <div className="flex-1 flex flex-col gap-0.5 mt-0.5">
              {[1,2,3].map(i => (
                <div key={i} className={`flex-1 rounded-sm ${isSelected ? 'bg-white/50' : 'bg-white/30'}`}></div>
              ))}
            </div>
            <div className="text-[6px] text-center text-purple-300 mt-0.5">☆</div>
          </div>
        )
      case 'scrapbook':
        return (
          <div className="w-full h-full rounded-sm p-1 flex flex-col" style={{ background: '#4a6fa5' }}>
            <div className="flex-1 flex flex-col gap-1">
              {[1,2].map(i => (
                <div key={i} className={`flex-1 bg-white rounded-sm shadow-sm ${i === 1 ? 'rotate-2' : '-rotate-1'}`}>
                  <div className={`w-full h-3/4 ${isSelected ? 'bg-gray-300' : 'bg-gray-400'}`}></div>
                </div>
              ))}
            </div>
            <div className="text-[6px] text-center text-white/80 mt-0.5">📎</div>
          </div>
        )
      case 'picnic':
        return (
          <div className="w-full h-full rounded-sm overflow-hidden relative">
            {/* Gingham pattern */}
            <div className="w-full h-full grid grid-cols-4 grid-rows-6">
              {[...Array(24)].map((_, i) => (
                <div key={i} className={`${(Math.floor(i/4) + i%4) % 2 === 0 ? 'bg-pink-200' : 'bg-white'}`}></div>
              ))}
            </div>
            {/* Photo strip overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-1">
              <div className={`w-3/4 h-5/6 bg-amber-50 rounded-sm shadow-sm flex flex-col gap-0.5 p-0.5 ${isSelected ? 'rotate-1' : 'rotate-2'}`}>
                {[1,2,3].map(i => (
                  <div key={i} className={`flex-1 rounded-sm border ${isSelected ? 'bg-gray-200 border-gray-400' : 'bg-gray-300 border-gray-500'}`}></div>
                ))}
              </div>
            </div>
            {/* Decorations */}
            <div className="absolute top-0 left-0 text-[6px]">🌸</div>
            <div className="absolute bottom-0 right-0 text-[6px]">🍒</div>
          </div>
        )
      case 'coquette':
        return (
          <div className="w-full h-full rounded-sm p-1 flex flex-col relative" style={{ background: 'linear-gradient(180deg, #fff5f8, #ffe4ec)' }}>
            {/* Ribbon decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] text-pink-400">🎀</div>
            <div className="flex-1 flex flex-col gap-0.5 mt-2">
              {[1,2,3,4].map(i => (
                <div key={i} className={`flex-1 rounded-full border border-pink-300 ${isSelected ? 'bg-white/80' : 'bg-white/60'}`}></div>
              ))}
            </div>
            <div className="text-[6px] text-center text-pink-400 mt-0.5">♡</div>
          </div>
        )
      case 'borcelle':
        return (
          <div className="w-full h-full rounded-sm overflow-hidden relative">
            {/* Purple checker pattern */}
            <div className="w-full h-full grid grid-cols-3 grid-rows-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`${(Math.floor(i/3) + i%3) % 2 === 0 ? 'bg-purple-300' : 'bg-purple-100'}`}></div>
              ))}
            </div>
            {/* Heart frames overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-1">
              {[1,2,3].map(i => (
                <div key={i} className={`w-3 h-3 ${isSelected ? 'bg-white' : 'bg-white/80'}`} style={{ clipPath: 'polygon(50% 0%, 100% 35%, 80% 100%, 50% 80%, 20% 100%, 0% 35%)' }}></div>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 text-[6px]">💜</div>
          </div>
        )
      case 'groovy':
        return (
          <div className="w-full h-full rounded-sm p-1 flex flex-col" style={{ background: 'conic-gradient(from 0deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #ff6b6b)' }}>
            <div className="flex-1 flex flex-col gap-0.5">
              {[1,2,3].map(i => (
                <div key={i} className={`flex-1 rounded-full border-2 border-white ${isSelected ? 'bg-yellow-100' : 'bg-yellow-50'}`}></div>
              ))}
            </div>
            <div className="text-[6px] text-center text-white font-bold mt-0.5">groovy</div>
          </div>
        )
      case 'dreamy':
        return (
          <div className="w-full h-full rounded-sm p-1 flex flex-col relative" style={{ background: 'linear-gradient(180deg, #ffd1dc, #fff0f5)' }}>
            {/* Soft glow circles */}
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-300/50 blur-sm"></div>
            <div className="absolute bottom-2 left-1 w-1.5 h-1.5 rounded-full bg-purple-300/50 blur-sm"></div>
            <div className="flex-1 flex flex-col gap-0.5 mt-1">
              {[1,2,3].map(i => (
                <div key={i} className={`flex-1 rounded-lg ${isSelected ? 'bg-white/90' : 'bg-white/70'}`} style={{ boxShadow: '0 0 8px rgba(255,182,193,0.5)' }}></div>
              ))}
            </div>
            <div className="text-[6px] text-center text-pink-400 mt-0.5">✨</div>
          </div>
        )
      case 'y2kheart':
        return (
          <div className="w-full h-full rounded-sm overflow-hidden relative" style={{ background: 'linear-gradient(180deg, #ff69b4, #ff1493)' }}>
            {/* Radiating heart pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[16px] opacity-20">💗</div>
            </div>
            <div className="absolute inset-0 flex flex-col gap-0.5 p-1">
              {[1,2,3].map(i => (
                <div key={i} className={`flex-1 rounded-sm ${isSelected ? 'bg-white/70' : 'bg-white/50'}`}></div>
              ))}
            </div>
            <div className="absolute top-0 left-0 text-[6px]">♥</div>
            <div className="absolute bottom-0 right-0 text-[6px]">♥</div>
          </div>
        )
      case 'spring':
        return (
          <div className="w-full h-full rounded-sm p-1 flex flex-col" style={{ background: 'linear-gradient(180deg, #98fb98, #f0fff0)' }}>
            <div className="flex justify-between text-[8px]">
              <span>🌸</span>
              <span>🌷</span>
            </div>
            <div className="flex-1 flex flex-col gap-0.5 mt-0.5">
              {[1,2,3].map(i => (
                <div key={i} className={`flex-1 rounded-full ${isSelected ? 'bg-white/80' : 'bg-white/60'}`} style={{ borderRadius: '50%' }}></div>
              ))}
            </div>
            <div className="text-[6px] text-center text-green-600 mt-0.5">🌼</div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Palette className="w-5 h-5 text-rose-400" />
          Choose Template
        </h3>
        <div className="text-sm text-slate-500">
          <span className="text-rose-400 font-medium">{templates.find(t => t.id === selectedTemplate)?.name}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {templates.map((template, index) => {
          const isSelected = selectedTemplate === template.id
          
          return (
            <motion.button
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTemplateChange(template.id)}
              className={`relative p-3 rounded-xl transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/20'
                  : 'bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {/* Preview Area */}
              <div className={`relative rounded-lg h-16 w-full mb-2 overflow-hidden ${
                isSelected ? 'ring-2 ring-white/30' : ''
              }`}>
                <TemplatePreview template={template} isSelected={isSelected} />
              </div>
              
              {/* Icon & Name */}
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="text-sm">{template.icon}</span>
                <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {template.name}
                </span>
              </div>
              
              {/* Description */}
              <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                {template.description}
              </div>
              
              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  layoutId="templateIndicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
                />
              )}
            </motion.button>
          )
        })}
      </div>
      
      {/* Template Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 p-3 bg-slate-900/30 rounded-lg border border-slate-700/30"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">{templates.find(t => t.id === selectedTemplate)?.icon}</span>
          <div>
            <h4 className="text-white font-medium text-sm">
              {templates.find(t => t.id === selectedTemplate)?.name} Template
            </h4>
            <p className="text-slate-400 text-xs mt-0.5">
              {selectedTemplate === 'classic' && 'Authentic 35mm film strip with sprocket holes and frame markers'}
              {selectedTemplate === 'newspaper' && 'Vintage newspaper style with "CAMERA" header and grayscale photos'}
              {selectedTemplate === 'kawaii' && 'Cute pink aesthetic with heart frames and adorable stickers'}
              {selectedTemplate === 'y2k' && 'Retro checkerboard pattern with holographic colors and Y2K vibes'}
              {selectedTemplate === 'starry' && 'Cosmic dark theme with glowing frames and colorful star bursts'}
              {selectedTemplate === 'scrapbook' && 'Polaroid-style tilted frames with washi tape decorations'}
              {selectedTemplate === 'picnic' && 'Pink gingham background with flowers, cherries, hearts and cute decorations'}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TemplateSelector
