import React from 'react'
import { motion } from 'framer-motion'
import { LayoutGrid, Heart, Grid2X2, Rows3, Columns3, Grid3X3 } from 'lucide-react'

/**
 * LayoutSelector - Photo Strip Layout Options
 * 
 * Color Theory Application:
 * - Selected state uses Rose/Pink gradient (primary action color)
 * - Unselected uses subtle slate backgrounds for hierarchy
 * - Preview boxes use matching gradient for consistency
 */

const LayoutSelector = ({ selectedLayout, onLayoutChange }) => {
  const layouts = [
    { id: 'layoutA', name: 'Classic', note: '3 vertical', photos: 3, icon: Rows3 },
    { id: 'layoutB', name: 'Grid', note: '2×2 grid', photos: 4, icon: Grid2X2 },
    { id: 'layoutC', name: 'Duo', note: '2 large', photos: 2, icon: Columns3 },
    { id: 'layoutD', name: 'Mosaic', note: '6 mixed', photos: 6, icon: Grid3X3 },
    { id: 'horizontal', name: 'Wide', note: '3 horizontal', photos: 3, icon: LayoutGrid },
    { id: 'layoutE', name: 'Hearts', note: '3 hearts', photos: 3, icon: Heart },
    { id: 'layoutF', name: 'Strip', note: '4 classic', photos: 4, icon: Rows3 },
  ]

  // Visual layout preview component
  const LayoutPreview = ({ layoutId, isSelected }) => {
    const boxClass = isSelected 
      ? "bg-white/30 rounded-sm" 
      : "bg-gradient-to-br from-rose-400/60 to-pink-400/60 rounded-sm"
    
    switch (layoutId) {
      case 'layoutA':
        return (
          <div className="flex flex-col gap-1 w-full h-full justify-center p-1">
            <div className={`${boxClass} w-full h-2.5`}></div>
            <div className={`${boxClass} w-full h-2.5`}></div>
            <div className={`${boxClass} w-full h-2.5`}></div>
          </div>
        )
      case 'layoutB':
        return (
          <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
            {[1, 2, 3, 4].map(i => <div key={i} className={boxClass}></div>)}
          </div>
        )
      case 'layoutC':
        return (
          <div className="flex flex-col gap-1 w-full h-full justify-center p-1">
            <div className={`${boxClass} w-full h-5`}></div>
            <div className={`${boxClass} w-full h-5`}></div>
          </div>
        )
      case 'layoutD':
        return (
          <div className="grid grid-cols-3 gap-0.5 w-full h-full p-1">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className={boxClass}></div>)}
          </div>
        )
      case 'horizontal':
        return (
          <div className="flex gap-1 w-full h-full items-center p-1">
            <div className={`${boxClass} flex-1 h-6`}></div>
            <div className={`${boxClass} flex-1 h-6`}></div>
            <div className={`${boxClass} flex-1 h-6`}></div>
          </div>
        )
      case 'layoutE':
        return (
          <div className="flex flex-col gap-0.5 items-center justify-center h-full">
            {[1, 2, 3].map(i => (
              <Heart key={i} className={`w-4 h-4 ${isSelected ? 'text-white/70' : 'text-rose-400'}`} fill="currentColor" />
            ))}
          </div>
        )
      case 'layoutF':
        return (
          <div className="flex flex-col gap-0.5 w-full h-full justify-center p-1">
            {[1, 2, 3, 4].map(i => <div key={i} className={`${boxClass} w-full h-2`}></div>)}
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
          <LayoutGrid className="w-5 h-5 text-rose-400" />
          Choose Layout
        </h3>
        <div className="text-sm text-slate-500">
          <span className="text-rose-400 font-medium">{layouts.find(l => l.id === selectedLayout)?.name}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
        {layouts.map((layout, index) => {
          const isSelected = selectedLayout === layout.id
          const Icon = layout.icon
          
          return (
            <motion.button
              key={layout.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onLayoutChange(layout.id)}
              className={`relative p-3 rounded-xl transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/20'
                  : 'bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {/* Preview Area */}
              <div className={`rounded-lg h-14 w-full mb-2 flex items-center justify-center ${
                isSelected ? 'bg-white/10' : 'bg-slate-800/50'
              }`}>
                <LayoutPreview layoutId={layout.id} isSelected={isSelected} />
              </div>
              
              {/* Layout Name */}
              <div className={`text-xs font-medium mb-0.5 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {layout.name}
              </div>
              
              {/* Photo Count Badge */}
              <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                {layout.photos} photos
              </div>
              
              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  layoutId="layoutIndicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

export default LayoutSelector
