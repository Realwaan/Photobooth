/**
 * Photo Strip Generator - Professional Template Design
 * 
 * Inspired by classic photobooth strips with:
 * - Clean 4-photo vertical layout
 * - Elegant gold/white borders
 * - Beautiful footer with custom text
 * - Film strip markers on sides
 */

// Frame color definitions - elegant color palette
const frameColors = {
  'rainbow': { bg: 'linear', colors: ['#1a1a2e', '#16213e', '#0f3460', '#533483'] },
  '#F43F5E': { bg: '#F43F5E', text: '#ffffff' },
  '#8B5CF6': { bg: '#8B5CF6', text: '#ffffff' },
  '#F59E0B': { bg: '#F59E0B', text: '#1a1a2e' },
  '#10B981': { bg: '#10B981', text: '#ffffff' },
  '#3B82F6': { bg: '#3B82F6', text: '#ffffff' },
  '#EC4899': { bg: '#EC4899', text: '#ffffff' },
  '#ffffff': { bg: '#ffffff', text: '#1a1a2e' },
  '#1E293B': { bg: '#1E293B', text: '#ffffff' },
  '#000000': { bg: '#000000', text: '#ffffff' },
  'navy': { bg: '#1a1a2e', text: '#d4af37' },
  'burgundy': { bg: '#4a1942', text: '#d4af37' },
}

// Sticker emojis
const stickerEmojis = {
  none: '', ghost: '👻', clover: '🍀', kiss: '💋', heart: '💗',
  bow: '🎀', star: '⭐', love: '🤍', unicorn: '🦄', sparkle: '✨',
  music: '🎵', heart2: '💕', bear: '🐻', koala: '🐨', panda: '🐼',
  frog: '🐸', flower: '🌸', cherry: '🍒', cake: '🎂', pizza: '🍕',
  crown: '👑', fire: '🔥', rainbow: '🌈', moon: '🌙'
}

/**
 * Load an image from a data URL
 */
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Draw rounded rectangle
 */
const roundRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/**
 * Draw film strip holes/markers on sides
 */
const drawFilmMarkers = (ctx, stripWidth, stripHeight, color = '#ffffff') => {
  const markerSize = 16
  const markerGap = 50
  const margin = 16
  
  ctx.fillStyle = color
  ctx.globalAlpha = 0.3
  
  // Left side markers
  for (let y = 40; y < stripHeight - 40; y += markerGap) {
    ctx.beginPath()
    ctx.arc(margin, y, markerSize / 2, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Right side markers
  for (let y = 40; y < stripHeight - 40; y += markerGap) {
    ctx.beginPath()
    ctx.arc(stripWidth - margin, y, markerSize / 2, 0, Math.PI * 2)
    ctx.fill()
  }
  
  ctx.globalAlpha = 1
}

/**
 * Draw elegant gold/metallic border around photo
 */
const drawPhotoBorder = (ctx, x, y, width, height, borderColor = '#d4af37', borderWidth = 6) => {
  // Outer glow effect
  ctx.shadowColor = borderColor
  ctx.shadowBlur = 16
  ctx.strokeStyle = borderColor
  ctx.lineWidth = borderWidth
  ctx.strokeRect(x, y, width, height)
  ctx.shadowBlur = 0
  
  // Inner white line for depth
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'
  ctx.lineWidth = 2
  ctx.strokeRect(x + 4, y + 4, width - 8, height - 8)
}

/**
 * Draw decorative corner flourishes
 */
const drawCornerFlourish = (ctx, x, y, size, rotation, color = '#d4af37') => {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.strokeStyle = color
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  
  // Simple elegant corner curve
  ctx.beginPath()
  ctx.moveTo(0, size)
  ctx.quadraticCurveTo(0, 0, size, 0)
  ctx.stroke()
  
  // Small leaf/flourish
  ctx.beginPath()
  ctx.moveTo(size * 0.3, size * 0.3)
  ctx.quadraticCurveTo(size * 0.5, 0, size * 0.7, size * 0.2)
  ctx.stroke()
  
  ctx.restore()
}

/**
 * Main function to generate photo strip
 */
export async function generatePhotoStrip(photos, options) {
  const {
    layout = 'layoutF',
    frameColor = '#1E293B',
    photoShape = 'square',
    sticker = 'none',
    logo = 'ENG',
    addDate = true,
    addTime = false,
    customTitle = 'missing minus 20',
    customSubtitle = ''
  } = options

  // HD Professional strip dimensions (2x6 inch ratio at high DPI)
  // 800x2400 = 2x the previous resolution for crisp prints
  const stripWidth = 800
  const stripHeight = 2400
  
  // Layout configuration (scaled for HD)
  const padding = 50
  const photoGap = 24
  const footerHeight = 280
  const numPhotos = Math.min(photos.length, 4)
  const photoAreaHeight = stripHeight - footerHeight - padding * 2
  const photoHeight = (photoAreaHeight - (photoGap * (numPhotos - 1))) / numPhotos
  const photoWidth = stripWidth - padding * 2

  // Create canvas
  const canvas = document.createElement('canvas')
  canvas.width = stripWidth
  canvas.height = stripHeight
  const ctx = canvas.getContext('2d')

  // Get frame color config
  const colorConfig = frameColors[frameColor] || { bg: frameColor, text: '#ffffff' }
  const bgColor = typeof colorConfig === 'object' ? colorConfig.bg : colorConfig
  const textColor = typeof colorConfig === 'object' ? colorConfig.text : '#ffffff'
  const accentColor = textColor === '#ffffff' ? '#d4af37' : '#d4af37' // Gold accent

  // Draw background
  if (bgColor === 'linear') {
    const gradient = ctx.createLinearGradient(0, 0, 0, stripHeight)
    const colors = colorConfig.colors || ['#1a1a2e', '#16213e']
    colors.forEach((color, i) => {
      gradient.addColorStop(i / (colors.length - 1), color)
    })
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = bgColor
  }
  ctx.fillRect(0, 0, stripWidth, stripHeight)

  // Add subtle texture overlay
  ctx.fillStyle = 'rgba(255,255,255,0.02)'
  for (let i = 0; i < stripHeight; i += 2) {
    ctx.fillRect(0, i, stripWidth, 1)
  }

  // Draw film strip markers
  drawFilmMarkers(ctx, stripWidth, stripHeight, textColor)

  // Draw photos with elegant borders
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoY = padding + i * (photoHeight + photoGap)
    
    try {
      const img = await loadImage(photo.data)
      
      // White background for photo area
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(padding, photoY, photoWidth, photoHeight)
      
      // Calculate aspect ratio fill
      const imgAspect = img.width / img.height
      const boxAspect = photoWidth / photoHeight
      
      let drawWidth, drawHeight, drawX, drawY
      
      if (imgAspect > boxAspect) {
        drawHeight = photoHeight
        drawWidth = drawHeight * imgAspect
        drawX = padding - (drawWidth - photoWidth) / 2
        drawY = photoY
      } else {
        drawWidth = photoWidth
        drawHeight = drawWidth / imgAspect
        drawX = padding
        drawY = photoY - (drawHeight - photoHeight) / 2
      }
      
      // Clip and draw photo
      ctx.save()
      ctx.beginPath()
      ctx.rect(padding, photoY, photoWidth, photoHeight)
      ctx.clip()
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
      
      // Draw elegant gold border
      drawPhotoBorder(ctx, padding, photoY, photoWidth, photoHeight, accentColor)
      
      // Photo number marker (subtle)
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(`${i + 1}`, padding + 16, photoY + 32)
      
    } catch (err) {
      console.error('Error loading photo:', err)
      // Draw placeholder
      ctx.fillStyle = '#333'
      ctx.fillRect(padding, photoY, photoWidth, photoHeight)
      ctx.fillStyle = '#666'
      ctx.font = '28px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Photo ' + (i + 1), stripWidth / 2, photoY + photoHeight / 2)
    }
  }

  // Draw stickers if selected
  if (sticker !== 'none' && stickerEmojis[sticker]) {
    const emoji = stickerEmojis[sticker]
    
    // Strategic positions around edges (HD scaled)
    const stickerPositions = [
      { x: 16, y: 70, size: 40 },
      { x: stripWidth - 60, y: 90, size: 36 },
      { x: 20, y: stripHeight - footerHeight - 60, size: 44 },
      { x: stripWidth - 56, y: stripHeight - footerHeight - 50, size: 38 },
      { x: stripWidth / 2 - 20, y: 30, size: 32 },
      { x: 10, y: stripHeight / 3, size: 34 },
      { x: stripWidth - 50, y: stripHeight / 2, size: 36 },
      { x: 16, y: stripHeight * 0.6, size: 32 },
    ]
    
    const numStickers = 6 + Math.floor(Math.random() * 3)
    const shuffled = [...stickerPositions].sort(() => Math.random() - 0.5)
    
    shuffled.slice(0, numStickers).forEach(pos => {
      ctx.font = `${pos.size}px Arial`
      ctx.fillText(emoji, pos.x + (Math.random() - 0.5) * 4, pos.y + (Math.random() - 0.5) * 4)
    })
  }

  // ============================================
  // FOOTER SECTION - Elegant Design
  // ============================================
  const footerY = stripHeight - footerHeight
  
  // Footer background (slightly lighter than main)
  ctx.fillStyle = bgColor === 'linear' ? 'rgba(0,0,0,0.3)' : bgColor
  ctx.fillRect(0, footerY, stripWidth, footerHeight)

  // Decorative line above footer
  ctx.strokeStyle = accentColor
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(padding, footerY + 20)
  ctx.lineTo(stripWidth - padding, footerY + 20)
  ctx.stroke()

  // Corner flourishes
  const flourishSize = 40
  drawCornerFlourish(ctx, padding + 10, footerY + 50, flourishSize, 0, accentColor)
  drawCornerFlourish(ctx, stripWidth - padding - 10, footerY + 50, flourishSize, Math.PI / 2, accentColor)

  // Hearts decoration
  ctx.fillStyle = accentColor
  ctx.font = '32px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('♥ ♥', stripWidth / 2, footerY + 70)

  // Main title (custom or default)
  ctx.fillStyle = textColor
  ctx.font = 'bold 44px Georgia, serif'
  ctx.textAlign = 'center'
  const title = customTitle || 'missing minus 20'
  ctx.fillText(title.toUpperCase(), stripWidth / 2, footerY + 130)

  // Subtitle / Secondary text
  ctx.font = 'italic 28px Georgia, serif'
  ctx.fillStyle = accentColor
  const subtitle = customSubtitle || ''
  if (subtitle) {
    ctx.fillText(subtitle, stripWidth / 2, footerY + 170)
  }

  // Date and hashtag
  if (addDate || addTime) {
    ctx.font = '22px Arial'
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
    
    let displayText = ''
    if (addDate) displayText += dateStr
    if (addTime) displayText += (addDate ? ' • ' : '') + timeStr
    
    ctx.fillText(displayText, stripWidth / 2, footerY + 210)
  }

  // Hashtag / Branding
  ctx.font = '20px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('#missingminus20', stripWidth / 2, footerY + 244)

  // Bottom decorative line
  ctx.strokeStyle = accentColor
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(stripWidth / 2 - 80, footerY + footerHeight - 20)
  ctx.lineTo(stripWidth / 2 + 80, footerY + footerHeight - 20)
  ctx.stroke()

  return canvas.toDataURL('image/png', 1.0)
}

/**
 * Download the generated photo strip
 */
export function downloadPhotoStrip(dataUrl, filename = 'photostrip') {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `${filename}-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
