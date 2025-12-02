/**
 * Photo Strip Generator - Classic 35mm Film Strip Design
 * 
 * Authentic film strip look with:
 * - Realistic sprocket holes on both sides
 * - Film frame numbers and markers
 * - Clean white-bordered photo frames
 * - Elegant footer with custom text
 */

// Frame color definitions
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
  'vintage': { bg: '#c4a574', text: '#2c1810' },
  'silver': { bg: '#606060', text: '#ffffff' },
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
 * Draw rounded rectangle (for sprocket holes)
 */
const drawRoundedRect = (ctx, x, y, width, height, radius) => {
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
 * Draw film sprocket holes - authentic 35mm film look
 */
const drawSprocketHoles = (ctx, stripWidth, stripHeight, sprocketWidth, bgColor) => {
  const holeWidth = 16
  const holeHeight = 24
  const holeRadius = 4
  const holeGap = 36
  const holeMarginX = (sprocketWidth - holeWidth) / 2
  
  // Sprocket holes are cut-outs (show through to background or black)
  ctx.fillStyle = bgColor
  
  // Draw holes on both sides
  for (let y = 18; y < stripHeight - 18; y += holeGap) {
    // Left side holes
    drawRoundedRect(ctx, holeMarginX, y, holeWidth, holeHeight, holeRadius)
    ctx.fill()
    
    // Right side holes
    drawRoundedRect(ctx, stripWidth - holeMarginX - holeWidth, y, holeWidth, holeHeight, holeRadius)
    ctx.fill()
  }
}

/**
 * Draw frame marker (triangle + number) like on real film
 */
const drawFrameMarker = (ctx, x, y, frameNum, color) => {
  ctx.fillStyle = color
  
  // Small triangle
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + 10, y + 6)
  ctx.lineTo(x, y + 12)
  ctx.closePath()
  ctx.fill()
  
  // Frame number
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(frameNum.toString(), x + 16, y + 11)
}

/**
 * Main function to generate photo strip
 */
export async function generatePhotoStrip(photos, options) {
  const {
    layout = 'layoutF',
    frameColor = '#000000',
    photoShape = 'square',
    sticker = 'none',
    logo = 'ENG',
    addDate = true,
    addTime = false,
    customTitle = 'missing minus 20',
    customSubtitle = ''
  } = options

  // HD Film strip dimensions
  const sprocketWidth = 55  // Width of sprocket hole area on each side
  const stripWidth = 800
  const stripHeight = 2400
  
  // Photo area dimensions (between sprocket holes)
  const photoAreaX = sprocketWidth
  const photoAreaWidth = stripWidth - (sprocketWidth * 2)
  
  // Layout configuration
  const topPadding = 30
  const photoPadding = 20
  const photoGap = 20
  const footerHeight = 300
  const numPhotos = Math.min(photos.length, 4)
  const photoAreaHeight = stripHeight - footerHeight - topPadding
  const photoHeight = (photoAreaHeight - (photoGap * (numPhotos - 1)) - photoPadding * 2) / numPhotos
  const photoWidth = photoAreaWidth - (photoPadding * 2)
  const photoBorder = 8 // White border around each photo

  // Create canvas
  const canvas = document.createElement('canvas')
  canvas.width = stripWidth
  canvas.height = stripHeight
  const ctx = canvas.getContext('2d')

  // Get frame color config
  const colorConfig = frameColors[frameColor] || { bg: frameColor, text: '#ffffff' }
  const bgColor = typeof colorConfig === 'object' ? colorConfig.bg : colorConfig
  const textColor = typeof colorConfig === 'object' ? colorConfig.text : '#ffffff'
  
  // Determine if light or dark background
  const isLightBg = ['#ffffff', '#F59E0B', '#c4a574'].includes(bgColor)
  const markerColor = isLightBg ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'

  // Draw main background
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

  // Add subtle film grain texture
  ctx.fillStyle = 'rgba(128,128,128,0.04)'
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * stripWidth
    const y = Math.random() * stripHeight
    ctx.fillRect(x, y, 1, 1)
  }

  // Draw sprocket hole areas (slightly different shade for film edge look)
  const edgeShade = isLightBg ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.03)'
  ctx.fillStyle = edgeShade
  ctx.fillRect(0, 0, sprocketWidth, stripHeight)
  ctx.fillRect(stripWidth - sprocketWidth, 0, sprocketWidth, stripHeight)

  // Draw sprocket holes (black cutouts)
  drawSprocketHoles(ctx, stripWidth, stripHeight, sprocketWidth, '#000000')

  // Draw photos with white borders
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoY = topPadding + photoPadding + i * (photoHeight + photoGap)
    const photoX = photoAreaX + photoPadding

    try {
      const img = await loadImage(photo.data)
      
      // Calculate crop to fill frame (cover mode)
      const imgAspect = img.width / img.height
      const frameAspect = photoWidth / photoHeight
      
      let drawWidth, drawHeight, drawX, drawY
      
      if (imgAspect > frameAspect) {
        drawHeight = photoHeight
        drawWidth = photoHeight * imgAspect
        drawX = photoX - (drawWidth - photoWidth) / 2
        drawY = photoY
      } else {
        drawWidth = photoWidth
        drawHeight = photoWidth / imgAspect
        drawX = photoX
        drawY = photoY - (drawHeight - photoHeight) / 2
      }

      // Draw white border around photo
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(
        photoX - photoBorder, 
        photoY - photoBorder, 
        photoWidth + photoBorder * 2, 
        photoHeight + photoBorder * 2
      )

      // Clip and draw photo
      ctx.save()
      ctx.beginPath()
      ctx.rect(photoX, photoY, photoWidth, photoHeight)
      ctx.clip()
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
      
      // Draw frame markers on the left side (like real film)
      const markerX = 8
      const markerY = photoY + 15
      drawFrameMarker(ctx, markerX, markerY, i + 1, markerColor)
      
      // Draw vertical text on right side (film edge style)
      ctx.save()
      ctx.translate(stripWidth - 12, photoY + photoHeight / 2)
      ctx.rotate(Math.PI / 2)
      ctx.font = 'bold 14px Arial'
      ctx.fillStyle = markerColor
      ctx.textAlign = 'center'
      ctx.fillText(customTitle.toUpperCase(), 0, 0)
      ctx.restore()

    } catch (err) {
      console.error('Error loading photo:', err)
      // Draw placeholder
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(photoX - photoBorder, photoY - photoBorder, photoWidth + photoBorder * 2, photoHeight + photoBorder * 2)
      ctx.fillStyle = '#cccccc'
      ctx.fillRect(photoX, photoY, photoWidth, photoHeight)
      ctx.fillStyle = '#888888'
      ctx.font = 'bold 32px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Photo ' + (i + 1), photoX + photoWidth / 2, photoY + photoHeight / 2 + 10)
    }
  }

  // Draw stickers if selected
  if (sticker !== 'none' && stickerEmojis[sticker]) {
    const emoji = stickerEmojis[sticker]
    
    // Place stickers around the edges and between photos
    const stickerPositions = [
      { x: sprocketWidth + 15, y: 25, size: 32 },
      { x: stripWidth - sprocketWidth - 45, y: 20, size: 30 },
      { x: sprocketWidth + 10, y: stripHeight - footerHeight - 50, size: 34 },
      { x: stripWidth - sprocketWidth - 50, y: stripHeight - footerHeight - 45, size: 32 },
      { x: stripWidth / 2 - 15, y: 15, size: 28 },
    ]
    
    const numStickers = 3 + Math.floor(Math.random() * 3)
    const shuffled = [...stickerPositions].sort(() => Math.random() - 0.5)
    
    shuffled.slice(0, numStickers).forEach(pos => {
      ctx.font = `${pos.size}px Arial`
      ctx.fillText(emoji, pos.x + (Math.random() - 0.5) * 8, pos.y + (Math.random() - 0.5) * 8)
    })
  }

  // ============================================
  // FOOTER SECTION
  // ============================================
  const footerY = stripHeight - footerHeight
  const footerCenterX = stripWidth / 2
  
  // Decorative divider line
  ctx.strokeStyle = textColor
  ctx.globalAlpha = 0.3
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(sprocketWidth + photoPadding, footerY + 25)
  ctx.lineTo(stripWidth - sprocketWidth - photoPadding, footerY + 25)
  ctx.stroke()
  ctx.globalAlpha = 1

  // Decorative stars/sparkles
  ctx.font = '24px Arial'
  ctx.fillStyle = textColor
  ctx.globalAlpha = 0.6
  ctx.textAlign = 'center'
  ctx.fillText('✦  ✦  ✦', footerCenterX, footerY + 65)
  ctx.globalAlpha = 1

  // Main title
  ctx.font = 'bold 52px Georgia, serif'
  ctx.fillStyle = textColor
  ctx.textAlign = 'center'
  const title = customTitle || 'missing minus 20'
  ctx.fillText(title.toUpperCase(), footerCenterX, footerY + 135)

  // Subtitle
  if (customSubtitle) {
    ctx.font = 'italic 28px Georgia, serif'
    ctx.fillStyle = textColor
    ctx.globalAlpha = 0.85
    ctx.fillText(customSubtitle, footerCenterX, footerY + 180)
    ctx.globalAlpha = 1
  }

  // Date
  if (addDate || addTime) {
    ctx.font = '26px Arial'
    ctx.fillStyle = textColor
    ctx.globalAlpha = 0.7
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit',
      year: 'numeric'
    })
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
    
    let displayText = ''
    if (addDate) displayText += dateStr
    if (addTime) displayText += (addDate ? '  •  ' : '') + timeStr
    
    ctx.fillText(displayText, footerCenterX, footerY + 230)
    ctx.globalAlpha = 1
  }

  // Hashtag / Branding
  ctx.font = '22px Arial'
  ctx.fillStyle = textColor
  ctx.globalAlpha = 0.5
  ctx.fillText('#missingminus20', footerCenterX, footerY + 275)
  ctx.globalAlpha = 1

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
