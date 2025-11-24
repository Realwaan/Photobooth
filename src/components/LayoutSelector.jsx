import React from 'react'

const LayoutSelector = ({ selectedLayout, onLayoutChange }) => {
  const layouts = [
    { id: 'layoutA', name: 'Layout A', note: '3 photos vertical', photos: 3 },
    { id: 'layoutB', name: 'Layout B', note: '4 photos - 2x2 grid', photos: 4 },
    { id: 'layoutC', name: 'Layout C', note: '2 photos large', photos: 2 },
    { id: 'layoutD', name: 'Layout D', note: '6 photos mixed', photos: 6 },
    { id: 'horizontal', name: 'Horizontal', note: '3 photos side by side', photos: 3 },
    { id: 'layoutE', name: 'Heart Frames', note: '3 photos with hearts', photos: 3 },
    { id: 'layoutF', name: 'Classic Strip', note: '4 photos classic', photos: 4 },
  ]

  const LayoutPreview = ({ layoutId }) => {
    const boxClass = "bg-gradient-to-br from-purple-400 to-pink-400 rounded-sm"
    
    switch (layoutId) {
      case 'layoutA':
        return (
          <div className="flex flex-col gap-1 w-full h-full justify-center">
            <div className={`${boxClass} w-full h-3`}></div>
            <div className={`${boxClass} w-full h-3`}></div>
            <div className={`${boxClass} w-full h-3`}></div>
          </div>
        )
      case 'layoutB':
        return (
          <div className="grid grid-cols-2 gap-1 w-full h-full">
            {[1, 2, 3, 4].map(i => <div key={i} className={`${boxClass}`}></div>)}
          </div>
        )
      case 'layoutC':
        return (
          <div className="flex flex-col gap-1 w-full h-full justify-center">
            <div className={`${boxClass} w-full h-6`}></div>
            <div className={`${boxClass} w-full h-6`}></div>
          </div>
        )
      case 'layoutD':
        return (
          <div className="grid grid-cols-3 gap-1 w-full h-full">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className={`${boxClass}`}></div>)}
          </div>
        )
      case 'horizontal':
        return (
          <div className="flex gap-1 w-full h-full items-center">
            <div className={`${boxClass} flex-1 h-8`}></div>
            <div className={`${boxClass} flex-1 h-8`}></div>
            <div className={`${boxClass} flex-1 h-8`}></div>
          </div>
        )
      case 'layoutE':
        return (
          <div className="flex flex-col gap-0.5 items-center justify-center h-full">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-xl">❤️</div>
            ))}
          </div>
        )
      case 'layoutF':
        return (
          <div className="flex flex-col gap-1 w-full h-full justify-center">
            {[1, 2, 3, 4].map(i => <div key={i} className={`${boxClass} w-full h-2.5`}></div>)}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-xl flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
          </svg>
          Choose Your Layout
        </h3>
        <div className="text-sm text-slate-400">
          Selected: <span className="text-purple-400 font-semibold">{layouts.find(l => l.id === selectedLayout)?.name}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onLayoutChange(layout.id)}
            className={`group p-4 rounded-xl transition-all duration-200 ${
              selectedLayout === layout.id
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 scale-105 ring-2 ring-purple-400'
                : 'bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:scale-105 hover:border-purple-400/50'
            }`}
          >
            <div className="bg-slate-900/80 rounded-lg p-3 mb-3 h-20 w-full flex items-center justify-center">
              <div className="w-full h-full">
                <LayoutPreview layoutId={layout.id} />
              </div>
            </div>
            <div className={`text-sm font-bold mb-1 ${selectedLayout === layout.id ? 'text-white' : 'text-slate-200'}`}>
              {layout.name}
            </div>
            <div className={`text-xs ${selectedLayout === layout.id ? 'text-white/90' : 'text-slate-400'}`}>
              {layout.note}
            </div>
            <div className={`text-xs mt-1 font-semibold ${selectedLayout === layout.id ? 'text-white' : 'text-purple-400'}`}>
              {layout.photos} photos
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default LayoutSelector
