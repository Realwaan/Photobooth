import React from 'react'

const Customization = ({ customOptions, onChange, onRetake, onDownload }) => {
  const frameColors = [
    { id: 'rainbow', label: 'Rainbow', style: 'linear-gradient(45deg, red, orange, yellow, green, blue, purple)' },
    { id: '#ffb6c1', label: 'Pink', style: '#ffb6c1' },
    { id: '#add8e6', label: 'Blue', style: '#add8e6' },
    { id: '#ffffe0', label: 'Yellow', style: '#ffffe0' },
    { id: '#90ee90', label: 'Green', style: '#90ee90' },
    { id: '#dda0dd', label: 'Plum', style: '#dda0dd' },
    { id: '#d2b48c', label: 'Tan', style: '#d2b48c' },
    { id: '#8b0000', label: 'Dark Red', style: '#8b0000' },
    { id: '#ffffff', label: 'White', style: '#ffffff' },
    { id: '#000000', label: 'Black', style: '#000000' },
  ]

  const shapes = [
    { id: 'square', icon: '⬜', label: 'Square' },
    { id: 'rounded', icon: '▢', label: 'Rounded' },
    { id: 'circle', icon: '⭕', label: 'Circle' },
    { id: 'heart', icon: '❤️', label: 'Heart' },
  ]

  const stickers = [
    'none', 'ghost', 'clover', 'kiss', 'heart', 'bow', 'star', 'love', 
    'unicorn', 'sparkle', 'music', 'heart2', 'bear', 'koala', 'panda', 
    'frog', 'flower', 'cherry', 'cake', 'pizza', 'crown', 'fire', 'rainbow', 'moon'
  ]

  const stickerEmojis = {
    none: '🚫', ghost: '👻', clover: '🍀', kiss: '💋', heart: '💗',
    bow: '🎀', star: '⭐', love: '🤍', unicorn: '🦄', sparkle: '✨',
    music: '🎵', heart2: '💕', bear: '🐻', koala: '🐨', panda: '🐼',
    frog: '🐸', flower: '🌸', cherry: '🍒', cake: '🎂', pizza: '🍕',
    crown: '👑', fire: '🔥', rainbow: '🌈', moon: '🌙'
  }

  return (
    <div className="space-y-6 card p-8">
      <h3 className="text-3xl font-bold text-white text-center mb-6">
        Customize Your Photo
      </h3>

      <div className="space-y-6">
        {/* Frame Color */}
        <div className="bg-slate-700/30 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">🎨</span> Frame Color
          </h4>
          <div className="flex flex-wrap gap-3">
            {frameColors.map((color) => (
              <button
                key={color.id}
                onClick={() => onChange({ frameColor: color.id })}
                className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${
                  customOptions.frameColor === color.id
                    ? 'border-white scale-110 shadow-lg'
                    : 'border-transparent hover:border-slate-400 hover:scale-105'
                }`}
                style={{ background: color.style }}
                title={color.label}
              >
                {customOptions.frameColor === color.id && (
                  <span className="text-white text-xl drop-shadow-lg">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Shape */}
        <div className="bg-slate-700/30 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">📐</span> Photo Shape
          </h4>
          <div className="flex gap-3 flex-wrap">
            {shapes.map((shape) => (
              <button
                key={shape.id}
                onClick={() => onChange({ photoShape: shape.id })}
                className={`w-16 h-16 rounded-xl transition-all duration-200 flex items-center justify-center text-3xl ${
                  customOptions.photoShape === shape.id
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg scale-110'
                    : 'bg-slate-600/50 hover:bg-slate-500/50 hover:scale-105'
                }`}
                title={shape.label}
              >
                {shape.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Stickers */}
        <div className="bg-slate-700/30 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">✨</span> Stickers
          </h4>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {stickers.map((sticker) => (
              <button
                key={sticker}
                onClick={() => onChange({ sticker })}
                className={`w-12 h-12 rounded-lg transition-all duration-200 flex items-center justify-center text-2xl ${
                  customOptions.sticker === sticker
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg scale-110'
                    : 'bg-slate-600/50 hover:bg-slate-500/50 hover:scale-105'
                }`}
              >
                {stickerEmojis[sticker]}
              </button>
            ))}
          </div>
        </div>

        {/* Logo & Options */}
        <div className="bg-slate-700/30 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">🏷️</span> Logo & Options
          </h4>
          <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              {['ENG', 'KOR', 'CN'].map((logo) => (
                <button
                  key={logo}
                  onClick={() => onChange({ logo })}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    customOptions.logo === logo
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'
                  }`}
                >
                  {logo}
                </button>
              ))}
            </div>
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-white cursor-pointer hover:text-pink-300 transition-colors">
                <input
                  type="checkbox"
                  checked={customOptions.addDate}
                  onChange={(e) => onChange({ addDate: e.target.checked })}
                  className="w-5 h-5 rounded accent-pink-500"
                />
                <span>Add Date</span>
              </label>
              <label className="flex items-center gap-2 text-white cursor-pointer hover:text-pink-300 transition-colors">
                <input
                  type="checkbox"
                  checked={customOptions.addTime}
                  onChange={(e) => onChange({ addTime: e.target.checked })}
                  className="w-5 h-5 rounded accent-pink-500"
                />
                <span>Add Time</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 flex-wrap justify-center">
        <button
          onClick={onRetake}
          className="px-8 py-4 bg-white text-pink-500 border-2 border-pink-500 rounded-xl font-bold hover:bg-pink-50 transition-all hover:scale-105"
        >
          Retake Photos
        </button>
        <button
          onClick={onDownload}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-pink-500/50 transition-all hover:scale-105"
        >
          Download Photostrip
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(148, 163, 184, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  )
}

export default Customization
