/**
 * Photo Strip Generator - Multiple Themed Templates
 * 
 * Templates included:
 * 1. Classic Film Strip - 35mm authentic look
 * 2. Newspaper/Vintage - "Foto Series CAMERA" header with sepia effect
 * 3. Kawaii Pink - Cute pink with heart frames and decorations
 * 4. Y2K Retro - Checkerboard pattern with colorful stickers
 * 5. Starry Night - Dark with star bursts and sparkles
 * 6. Scrapbook - Tilted frames with decorations
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
 * Draw heart shape path
 */
const drawHeartPath = (ctx, x, y, width, height) => {
  const topCurveHeight = height * 0.3
  ctx.beginPath()
  ctx.moveTo(x + width / 2, y + height)
  ctx.bezierCurveTo(x, y + height * 0.7, x, y + topCurveHeight, x + width / 2, y + topCurveHeight)
  ctx.bezierCurveTo(x + width, y + topCurveHeight, x + width, y + height * 0.7, x + width / 2, y + height)
  ctx.closePath()
}

/**
 * Draw rounded rectangle
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
 * Draw star shape
 */
const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
  let rot = Math.PI / 2 * 3
  let x = cx
  let y = cy
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }
  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath()
}

/**
 * Draw 4-point star burst
 */
const drawStarBurst = (ctx, x, y, size, color) => {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y - size)
  ctx.quadraticCurveTo(x + size * 0.15, y - size * 0.15, x + size, y)
  ctx.quadraticCurveTo(x + size * 0.15, y + size * 0.15, x, y + size)
  ctx.quadraticCurveTo(x - size * 0.15, y + size * 0.15, x - size, y)
  ctx.quadraticCurveTo(x - size * 0.15, y - size * 0.15, x, y - size)
  ctx.fill()
}

/**
 * Draw checkerboard pattern
 */
const drawCheckerboard = (ctx, width, height, squareSize, color1, color2) => {
  for (let y = 0; y < height; y += squareSize) {
    for (let x = 0; x < width; x += squareSize) {
      ctx.fillStyle = ((x + y) / squareSize) % 2 === 0 ? color1 : color2
      ctx.fillRect(x, y, squareSize, squareSize)
    }
  }
}

/**
 * Draw cloud shape
 */
const drawCloud = (ctx, x, y, width, height) => {
  ctx.beginPath()
  ctx.arc(x + width * 0.25, y + height * 0.6, height * 0.35, 0, Math.PI * 2)
  ctx.arc(x + width * 0.5, y + height * 0.4, height * 0.4, 0, Math.PI * 2)
  ctx.arc(x + width * 0.75, y + height * 0.6, height * 0.35, 0, Math.PI * 2)
  ctx.closePath()
}

/**
 * Draw film sprocket holes
 */
const drawSprocketHoles = (ctx, stripWidth, stripHeight, sprocketWidth, bgColor) => {
  const holeWidth = 16
  const holeHeight = 24
  const holeRadius = 4
  const holeGap = 36
  const holeMarginX = (sprocketWidth - holeWidth) / 2
  
  ctx.fillStyle = bgColor
  
  for (let y = 18; y < stripHeight - 18; y += holeGap) {
    drawRoundedRect(ctx, holeMarginX, y, holeWidth, holeHeight, holeRadius)
    ctx.fill()
    drawRoundedRect(ctx, stripWidth - holeMarginX - holeWidth, y, holeWidth, holeHeight, holeRadius)
    ctx.fill()
  }
}

/**
 * Draw frame marker
 */
const drawFrameMarker = (ctx, x, y, frameNum, color) => {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + 10, y + 6)
  ctx.lineTo(x, y + 12)
  ctx.closePath()
  ctx.fill()
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(frameNum.toString(), x + 16, y + 11)
}

/**
 * Apply sepia/grayscale filter to image
 */
const applyFilter = (ctx, x, y, width, height, filter) => {
  const imageData = ctx.getImageData(x, y, width, height)
  const data = imageData.data
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    if (filter === 'grayscale' || filter === 'newspaper') {
      const gray = r * 0.299 + g * 0.587 + b * 0.114
      data[i] = gray
      data[i + 1] = gray
      data[i + 2] = gray
    } else if (filter === 'sepia') {
      data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
      data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
      data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
    }
  }
  
  ctx.putImageData(imageData, x, y)
}

/**
 * Draw decorative tape
 */
const drawTape = (ctx, x, y, width, height, angle, color) => {
  ctx.save()
  ctx.translate(x + width / 2, y + height / 2)
  ctx.rotate(angle)
  ctx.fillStyle = color
  ctx.globalAlpha = 0.7
  ctx.fillRect(-width / 2, -height / 2, width, height)
  ctx.globalAlpha = 1
  ctx.restore()
}

// ============================================
// TEMPLATE: NEWSPAPER / VINTAGE
// ============================================
async function generateNewspaperTemplate(photos, options, canvas, ctx) {
  const { addDate, addTime, customTitle } = options
  const stripWidth = canvas.width
  const stripHeight = canvas.height
  const numPhotos = Math.min(photos.length, 4)
  
  // Cream/paper background
  ctx.fillStyle = '#f5f0e6'
  ctx.fillRect(0, 0, stripWidth, stripHeight)
  
  // Add paper texture
  ctx.fillStyle = 'rgba(139, 119, 101, 0.03)'
  for (let i = 0; i < 5000; i++) {
    ctx.fillRect(Math.random() * stripWidth, Math.random() * stripHeight, 1, 1)
  }
  
  // Header section
  const headerHeight = 180
  ctx.fillStyle = '#f5f0e6'
  ctx.fillRect(0, 0, stripWidth, headerHeight)
  
  // Top decorative text
  ctx.fillStyle = '#2c2c2c'
  ctx.font = 'italic 14px Georgia, serif'
  ctx.textAlign = 'left'
  ctx.fillText('SPECIAL EDITION', 50, 30)
  ctx.textAlign = 'right'
  ctx.fillText('PHOTO\'S', stripWidth - 50, 30)
  
  // "Foto Series" script
  ctx.font = 'italic 32px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('✦ Foto Series ✦', stripWidth / 2, 60)
  
  // Main "CAMERA" title
  ctx.font = 'bold 72px "Times New Roman", serif'
  ctx.fillStyle = '#1a1a1a'
  ctx.fillText('CAMERA', stripWidth / 2, 130)
  
  // Decorative line under header
  ctx.strokeStyle = '#2c2c2c'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(40, 150)
  ctx.lineTo(stripWidth - 40, 150)
  ctx.stroke()
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(40, 155)
  ctx.lineTo(stripWidth - 40, 155)
  ctx.stroke()
  
  // Photo area
  const photoStartY = headerHeight + 20
  const photoPadding = 25
  const photoGap = 15
  const photoWidth = stripWidth - (photoPadding * 2)
  const availableHeight = stripHeight - headerHeight - 120
  const photoHeight = (availableHeight - (photoGap * (numPhotos - 1))) / numPhotos
  
  // Draw photos with thin black border
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoY = photoStartY + i * (photoHeight + photoGap)
    
    try {
      const img = await loadImage(photo.data)
      
      // Draw border
      ctx.strokeStyle = '#2c2c2c'
      ctx.lineWidth = 2
      ctx.strokeRect(photoPadding - 2, photoY - 2, photoWidth + 4, photoHeight + 4)
      
      // Draw photo
      const imgAspect = img.width / img.height
      const frameAspect = photoWidth / photoHeight
      let drawWidth, drawHeight, drawX, drawY
      
      if (imgAspect > frameAspect) {
        drawHeight = photoHeight
        drawWidth = photoHeight * imgAspect
        drawX = photoPadding - (drawWidth - photoWidth) / 2
        drawY = photoY
      } else {
        drawWidth = photoWidth
        drawHeight = photoWidth / imgAspect
        drawX = photoPadding
        drawY = photoY - (drawHeight - photoHeight) / 2
      }
      
      ctx.save()
      ctx.beginPath()
      ctx.rect(photoPadding, photoY, photoWidth, photoHeight)
      ctx.clip()
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
      
      // Apply grayscale filter for newspaper effect
      applyFilter(ctx, photoPadding, photoY, photoWidth, photoHeight, 'newspaper')
      
    } catch (err) {
      console.error('Error loading photo:', err)
    }
  }
  
  // Footer
  const footerY = stripHeight - 80
  ctx.fillStyle = '#2c2c2c'
  ctx.font = 'italic 18px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('by : ' + (customTitle || 'photobooth'), stripWidth / 2, footerY + 30)
  
  if (addDate) {
    const now = new Date()
    ctx.font = '14px Georgia, serif'
    ctx.fillText(now.toLocaleDateString(), stripWidth / 2, footerY + 55)
  }
}

// ============================================
// TEMPLATE: KAWAII PINK
// ============================================
async function generateKawaiiTemplate(photos, options, canvas, ctx) {
  const { addDate, customTitle, sticker } = options
  const stripWidth = canvas.width
  const stripHeight = canvas.height
  const numPhotos = Math.min(photos.length, 4)
  
  // Pink gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, stripHeight)
  gradient.addColorStop(0, '#ffb6c1')
  gradient.addColorStop(0.5, '#ffc0cb')
  gradient.addColorStop(1, '#ffe4e9')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, stripWidth, stripHeight)
  
  // Add small hearts pattern in background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * stripWidth
    const y = Math.random() * stripHeight
    const size = 8 + Math.random() * 12
    ctx.font = `${size}px Arial`
    ctx.fillText('♡', x, y)
  }
  
  // Header with cute text
  ctx.fillStyle = '#ff69b4'
  ctx.font = 'bold 36px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('♡ ' + (customTitle || 'Cute Moments') + ' ♡', stripWidth / 2, 50)
  
  // Decorative ribbon
  ctx.fillStyle = '#ff1493'
  ctx.fillRect(30, 70, stripWidth - 60, 4)
  
  // Photo area
  const photoStartY = 100
  const photoPadding = 40
  const photoGap = 25
  const photoWidth = stripWidth - (photoPadding * 2)
  const availableHeight = stripHeight - 200
  const photoHeight = (availableHeight - (photoGap * (numPhotos - 1))) / numPhotos
  
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoY = photoStartY + i * (photoHeight + photoGap)
    const isHeart = i % 2 === 0 // Alternate between heart and rounded frames
    
    try {
      const img = await loadImage(photo.data)
      
      // White frame with pink border
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = '#ff69b4'
      ctx.lineWidth = 4
      
      if (isHeart) {
        // Heart shaped frame
        const heartSize = Math.min(photoWidth * 0.8, photoHeight)
        const heartX = photoPadding + (photoWidth - heartSize) / 2
        
        drawHeartPath(ctx, heartX - 8, photoY - 8, heartSize + 16, photoHeight + 16)
        ctx.fill()
        ctx.stroke()
        
        ctx.save()
        drawHeartPath(ctx, heartX, photoY, heartSize, photoHeight)
        ctx.clip()
        
        const imgAspect = img.width / img.height
        let drawWidth = heartSize
        let drawHeight = heartSize / imgAspect
        if (drawHeight < photoHeight) {
          drawHeight = photoHeight
          drawWidth = photoHeight * imgAspect
        }
        const drawX = heartX + (heartSize - drawWidth) / 2
        const drawY = photoY + (photoHeight - drawHeight) / 2
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
        ctx.restore()
      } else {
        // Rounded rectangle frame
        const radius = 20
        drawRoundedRect(ctx, photoPadding - 8, photoY - 8, photoWidth + 16, photoHeight + 16, radius)
        ctx.fill()
        ctx.stroke()
        
        ctx.save()
        drawRoundedRect(ctx, photoPadding, photoY, photoWidth, photoHeight, radius - 4)
        ctx.clip()
        
        const imgAspect = img.width / img.height
        const frameAspect = photoWidth / photoHeight
        let drawWidth, drawHeight, drawX, drawY
        
        if (imgAspect > frameAspect) {
          drawHeight = photoHeight
          drawWidth = photoHeight * imgAspect
          drawX = photoPadding - (drawWidth - photoWidth) / 2
          drawY = photoY
        } else {
          drawWidth = photoWidth
          drawHeight = photoWidth / imgAspect
          drawX = photoPadding
          drawY = photoY - (drawHeight - photoHeight) / 2
        }
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
        ctx.restore()
      }
      
      // Add cute sticker near each photo
      const stickerEmoji = ['🎀', '💖', '🌸', '✨', '🍰'][i % 5]
      ctx.font = '32px Arial'
      ctx.fillText(stickerEmoji, photoPadding + photoWidth - 20, photoY + 30)
      
    } catch (err) {
      console.error('Error loading photo:', err)
    }
  }
  
  // Footer
  ctx.fillStyle = '#ff69b4'
  ctx.font = 'bold 24px Arial'
  ctx.fillText('✿ POSE CUTE ✿', stripWidth / 2, stripHeight - 60)
  
  if (addDate) {
    ctx.font = '16px Arial'
    ctx.fillStyle = '#ff1493'
    ctx.fillText(new Date().toLocaleDateString(), stripWidth / 2, stripHeight - 30)
  }
  
  // Corner decorations
  ctx.font = '40px Arial'
  ctx.fillText('🎀', 20, 40)
  ctx.fillText('🎀', stripWidth - 50, 40)
  ctx.fillText('💕', 20, stripHeight - 20)
  ctx.fillText('💕', stripWidth - 50, stripHeight - 20)
}

// ============================================
// TEMPLATE: Y2K RETRO
// ============================================
async function generateY2KTemplate(photos, options, canvas, ctx) {
  const { addDate, customTitle } = options
  const stripWidth = canvas.width
  const stripHeight = canvas.height
  const numPhotos = Math.min(photos.length, 4)
  
  // Checkerboard background
  drawCheckerboard(ctx, stripWidth, stripHeight, 40, '#e8b4f8', '#f8e4ff')
  
  // Add holographic/rainbow gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, stripWidth, stripHeight)
  gradient.addColorStop(0, 'rgba(255, 182, 193, 0.3)')
  gradient.addColorStop(0.25, 'rgba(255, 218, 185, 0.3)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 186, 0.3)')
  gradient.addColorStop(0.75, 'rgba(186, 255, 201, 0.3)')
  gradient.addColorStop(1, 'rgba(186, 225, 255, 0.3)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, stripWidth, stripHeight)
  
  // Header
  ctx.fillStyle = '#9333ea'
  ctx.font = 'bold 42px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('★ ' + (customTitle || 'Y2K VIBES') + ' ★', stripWidth / 2, 55)
  
  // Subtitle
  ctx.fillStyle = '#ec4899'
  ctx.font = '18px Arial'
  ctx.fillText('✧･ﾟ: *✧･ﾟ:* SO COOL *:･ﾟ✧*:･ﾟ✧', stripWidth / 2, 85)
  
  // Photo area
  const photoStartY = 110
  const photoPadding = 35
  const photoGap = 20
  const photoWidth = stripWidth - (photoPadding * 2)
  const availableHeight = stripHeight - 220
  const photoHeight = (availableHeight - (photoGap * (numPhotos - 1))) / numPhotos
  
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoY = photoStartY + i * (photoHeight + photoGap)
    
    try {
      const img = await loadImage(photo.data)
      
      // Colorful frame - different color for each photo
      const frameColors = ['#ff6b9d', '#c084fc', '#60a5fa', '#4ade80', '#fbbf24']
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = frameColors[i % frameColors.length]
      ctx.lineWidth = 6
      
      // Draw frame with slight rotation for Y2K effect
      ctx.save()
      const rotation = (Math.random() - 0.5) * 0.05
      ctx.translate(stripWidth / 2, photoY + photoHeight / 2)
      ctx.rotate(rotation)
      ctx.translate(-stripWidth / 2, -(photoY + photoHeight / 2))
      
      drawRoundedRect(ctx, photoPadding - 10, photoY - 10, photoWidth + 20, photoHeight + 20, 15)
      ctx.fill()
      ctx.stroke()
      
      // Photo
      ctx.beginPath()
      drawRoundedRect(ctx, photoPadding, photoY, photoWidth, photoHeight, 10)
      ctx.clip()
      
      const imgAspect = img.width / img.height
      const frameAspect = photoWidth / photoHeight
      let drawWidth, drawHeight, drawX, drawY
      
      if (imgAspect > frameAspect) {
        drawHeight = photoHeight
        drawWidth = photoHeight * imgAspect
        drawX = photoPadding - (drawWidth - photoWidth) / 2
        drawY = photoY
      } else {
        drawWidth = photoWidth
        drawHeight = photoWidth / imgAspect
        drawX = photoPadding
        drawY = photoY - (drawHeight - photoHeight) / 2
      }
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
      
    } catch (err) {
      console.error('Error loading photo:', err)
    }
  }
  
  // Scattered Y2K stickers
  const y2kStickers = ['⭐', '🌈', '🍒', '🦋', '💿', '📱', '💫', '🌸', '😎', '✨']
  ctx.font = '28px Arial'
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * (stripWidth - 40) + 20
    const y = Math.random() * (stripHeight - 40) + 20
    ctx.fillText(y2kStickers[i % y2kStickers.length], x, y)
  }
  
  // Footer
  ctx.fillStyle = '#9333ea'
  ctx.font = 'bold 28px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('♡ THAT\'S SO Y2K ♡', stripWidth / 2, stripHeight - 55)
  
  if (addDate) {
    ctx.fillStyle = '#ec4899'
    ctx.font = '16px Arial'
    ctx.fillText(new Date().toLocaleDateString(), stripWidth / 2, stripHeight - 25)
  }
}

// ============================================
// TEMPLATE: STARRY NIGHT
// ============================================
async function generateStarryTemplate(photos, options, canvas, ctx) {
  const { addDate, customTitle } = options
  const stripWidth = canvas.width
  const stripHeight = canvas.height
  const numPhotos = Math.min(photos.length, 4)
  
  // Dark gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, stripHeight)
  gradient.addColorStop(0, '#0f0c29')
  gradient.addColorStop(0.5, '#302b63')
  gradient.addColorStop(1, '#24243e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, stripWidth, stripHeight)
  
  // Add stars
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * stripWidth
    const y = Math.random() * stripHeight
    const size = Math.random() * 2 + 1
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Add star bursts
  const burstPositions = [
    { x: 60, y: 80, size: 25 },
    { x: stripWidth - 70, y: 120, size: 30 },
    { x: 80, y: stripHeight - 150, size: 28 },
    { x: stripWidth - 60, y: stripHeight - 100, size: 22 },
    { x: stripWidth / 2 - 100, y: 60, size: 20 },
    { x: stripWidth / 2 + 100, y: stripHeight - 80, size: 24 },
  ]
  
  burstPositions.forEach(pos => {
    // Multi-colored star bursts
    const colors = ['#ff6b9d', '#ffd700', '#00ffff', '#ff69b4', '#7fffd4']
    drawStarBurst(ctx, pos.x, pos.y, pos.size, colors[Math.floor(Math.random() * colors.length)])
  })
  
  // Header
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('✦ ' + (customTitle || 'STARRY MOMENTS') + ' ✦', stripWidth / 2, 50)
  
  // Photo area
  const photoStartY = 90
  const photoPadding = 45
  const photoGap = 25
  const photoWidth = stripWidth - (photoPadding * 2)
  const availableHeight = stripHeight - 200
  const photoHeight = (availableHeight - (photoGap * (numPhotos - 1))) / numPhotos
  
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoY = photoStartY + i * (photoHeight + photoGap)
    
    try {
      const img = await loadImage(photo.data)
      
      // Glowing frame
      ctx.shadowColor = '#ff69b4'
      ctx.shadowBlur = 15
      ctx.fillStyle = '#ffffff'
      
      // Rounded frame
      drawRoundedRect(ctx, photoPadding - 6, photoY - 6, photoWidth + 12, photoHeight + 12, 12)
      ctx.fill()
      
      ctx.shadowBlur = 0
      
      // Photo
      ctx.save()
      drawRoundedRect(ctx, photoPadding, photoY, photoWidth, photoHeight, 8)
      ctx.clip()
      
      const imgAspect = img.width / img.height
      const frameAspect = photoWidth / photoHeight
      let drawWidth, drawHeight, drawX, drawY
      
      if (imgAspect > frameAspect) {
        drawHeight = photoHeight
        drawWidth = photoHeight * imgAspect
        drawX = photoPadding - (drawWidth - photoWidth) / 2
        drawY = photoY
      } else {
        drawWidth = photoWidth
        drawHeight = photoWidth / imgAspect
        drawX = photoPadding
        drawY = photoY - (drawHeight - photoHeight) / 2
      }
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
      
      // Add star burst decoration at corner of each photo
      drawStarBurst(ctx, photoPadding - 5, photoY - 5, 18, '#ffd700')
      drawStarBurst(ctx, photoPadding + photoWidth + 5, photoY + photoHeight + 5, 15, '#ff69b4')
      
    } catch (err) {
      console.error('Error loading photo:', err)
    }
  }
  
  // Footer
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 24px Arial'
  ctx.fillText('☆ SHINE BRIGHT ☆', stripWidth / 2, stripHeight - 55)
  
  if (addDate) {
    ctx.font = '16px Arial'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fillText(new Date().toLocaleDateString(), stripWidth / 2, stripHeight - 25)
  }
}

// ============================================
// TEMPLATE: SCRAPBOOK
// ============================================
async function generateScrapbookTemplate(photos, options, canvas, ctx) {
  const { addDate, customTitle } = options
  const stripWidth = canvas.width
  const stripHeight = canvas.height
  const numPhotos = Math.min(photos.length, 4)
  
  // Craft paper background
  const gradient = ctx.createLinearGradient(0, 0, stripWidth, stripHeight)
  gradient.addColorStop(0, '#4a6fa5')
  gradient.addColorStop(1, '#3d5a80')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, stripWidth, stripHeight)
  
  // Add paper texture dots
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
  for (let i = 0; i < 3000; i++) {
    ctx.fillRect(Math.random() * stripWidth, Math.random() * stripHeight, 2, 2)
  }
  
  // Add decorative elements - clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  drawCloud(ctx, 20, 30, 80, 40)
  ctx.fill()
  drawCloud(ctx, stripWidth - 120, 50, 100, 50)
  ctx.fill()
  
  // Header with handwritten style
  ctx.fillStyle = '#ffffff'
  ctx.font = 'italic 40px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText(customTitle || 'My Memories', stripWidth / 2, 60)
  
  // Decorative tape at top
  drawTape(ctx, stripWidth / 2 - 40, 15, 80, 25, 0.1, 'rgba(255, 182, 193, 0.8)')
  
  // Photo area - tilted frames like scrapbook
  const photoStartY = 100
  const photoPadding = 50
  const photoGap = 30
  const photoWidth = stripWidth - (photoPadding * 2) - 20
  const availableHeight = stripHeight - 220
  const photoHeight = (availableHeight - (photoGap * (numPhotos - 1))) / numPhotos
  
  const rotations = [-0.05, 0.04, -0.03, 0.05]
  
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoY = photoStartY + i * (photoHeight + photoGap)
    const rotation = rotations[i % rotations.length]
    
    try {
      const img = await loadImage(photo.data)
      
      ctx.save()
      ctx.translate(stripWidth / 2, photoY + photoHeight / 2)
      ctx.rotate(rotation)
      ctx.translate(-stripWidth / 2, -(photoY + photoHeight / 2))
      
      // White polaroid-style frame
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 3
      ctx.shadowOffsetY = 3
      ctx.fillRect(photoPadding - 15, photoY - 15, photoWidth + 30, photoHeight + 50)
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      
      // Photo
      ctx.beginPath()
      ctx.rect(photoPadding, photoY, photoWidth, photoHeight)
      ctx.clip()
      
      const imgAspect = img.width / img.height
      const frameAspect = photoWidth / photoHeight
      let drawWidth, drawHeight, drawX, drawY
      
      if (imgAspect > frameAspect) {
        drawHeight = photoHeight
        drawWidth = photoHeight * imgAspect
        drawX = photoPadding - (drawWidth - photoWidth) / 2
        drawY = photoY
      } else {
        drawWidth = photoWidth
        drawHeight = photoWidth / imgAspect
        drawX = photoPadding
        drawY = photoY - (drawHeight - photoHeight) / 2
      }
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
      
      // Add washi tape
      const tapeColors = ['rgba(255, 182, 193, 0.8)', 'rgba(176, 224, 230, 0.8)', 'rgba(255, 218, 185, 0.8)', 'rgba(221, 160, 221, 0.8)']
      drawTape(ctx, photoPadding + photoWidth - 30, photoY - 10, 60, 20, rotation + 0.3, tapeColors[i % tapeColors.length])
      
      // Add small decorations
      const decorEmojis = ['🌸', '⭐', '💕', '🌿', '✨']
      ctx.font = '24px Arial'
      ctx.fillText(decorEmojis[i % decorEmojis.length], photoPadding - 10, photoY + photoHeight + 35)
      
    } catch (err) {
      console.error('Error loading photo:', err)
    }
  }
  
  // Scattered stickers
  const scrapStickers = ['🌸', '🌻', '🍀', '💝', '🦋', '✂️', '📎']
  ctx.font = '26px Arial'
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * (stripWidth - 60) + 30
    const y = Math.random() * (stripHeight - 60) + 30
    ctx.fillText(scrapStickers[i % scrapStickers.length], x, y)
  }
  
  // Footer
  ctx.fillStyle = '#ffffff'
  ctx.font = 'italic 22px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('✿ Cherished Moments ✿', stripWidth / 2, stripHeight - 50)
  
  if (addDate) {
    ctx.font = '14px Georgia, serif'
    ctx.fillText(new Date().toLocaleDateString(), stripWidth / 2, stripHeight - 25)
  }
}

// ============================================
// TEMPLATE: CLASSIC FILM STRIP (Original)
// ============================================
async function generateClassicTemplate(photos, options, canvas, ctx) {
  const {
    frameColor = '#000000',
    sticker = 'none',
    addDate = true,
    addTime = false,
    customTitle = 'photobooth',
    layout = 'layoutF'
  } = options

  const stripWidth = canvas.width
  const stripHeight = canvas.height
  const isHeartLayout = layout === 'layoutE'
  
  const layoutConfig = { layoutA: 3, layoutB: 4, layoutC: 2, layoutD: 6, horizontal: 3, layoutE: 3, layoutF: 4 }
  const maxPhotos = layoutConfig[layout] || 4
  const numPhotos = Math.min(photos.length, maxPhotos)

  const sprocketWidth = 55
  const photoAreaX = sprocketWidth
  const photoAreaWidth = stripWidth - (sprocketWidth * 2)
  const topPadding = 30
  const photoPadding = 20
  const photoGap = 20
  const footerHeight = 300
  const photoAreaHeight = stripHeight - footerHeight - topPadding
  const photoHeight = (photoAreaHeight - (photoGap * (numPhotos - 1)) - photoPadding * 2) / numPhotos
  const photoWidth = photoAreaWidth - (photoPadding * 2)
  const photoBorder = 8

  const colorConfig = frameColors[frameColor] || { bg: frameColor, text: '#ffffff' }
  const bgColor = typeof colorConfig === 'object' ? colorConfig.bg : colorConfig
  const textColor = typeof colorConfig === 'object' ? colorConfig.text : '#ffffff'
  const isLightBg = ['#ffffff', '#F59E0B', '#c4a574'].includes(bgColor)
  const markerColor = isLightBg ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'

  // Background
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

  // Film grain
  ctx.fillStyle = 'rgba(128,128,128,0.04)'
  for (let i = 0; i < 8000; i++) {
    ctx.fillRect(Math.random() * stripWidth, Math.random() * stripHeight, 1, 1)
  }

  // Sprocket areas
  const edgeShade = isLightBg ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.03)'
  ctx.fillStyle = edgeShade
  ctx.fillRect(0, 0, sprocketWidth, stripHeight)
  ctx.fillRect(stripWidth - sprocketWidth, 0, sprocketWidth, stripHeight)

  drawSprocketHoles(ctx, stripWidth, stripHeight, sprocketWidth, '#000000')

  // Photos
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoY = topPadding + photoPadding + i * (photoHeight + photoGap)
    const photoX = photoAreaX + photoPadding

    try {
      const img = await loadImage(photo.data)
      const actualPhotoWidth = isHeartLayout ? Math.min(photoWidth, photoHeight) : photoWidth
      const actualPhotoHeight = isHeartLayout ? Math.min(photoWidth, photoHeight) : photoHeight
      const actualPhotoX = isHeartLayout ? photoX + (photoWidth - actualPhotoWidth) / 2 : photoX
      
      const imgAspect = img.width / img.height
      const frameAspect = actualPhotoWidth / actualPhotoHeight
      let drawWidth, drawHeight, drawX, drawY
      
      if (imgAspect > frameAspect) {
        drawHeight = actualPhotoHeight
        drawWidth = actualPhotoHeight * imgAspect
        drawX = actualPhotoX - (drawWidth - actualPhotoWidth) / 2
        drawY = photoY
      } else {
        drawWidth = actualPhotoWidth
        drawHeight = actualPhotoWidth / imgAspect
        drawX = actualPhotoX
        drawY = photoY - (drawHeight - actualPhotoHeight) / 2
      }

      if (isHeartLayout) {
        ctx.fillStyle = '#ffffff'
        ctx.save()
        drawHeartPath(ctx, actualPhotoX - photoBorder, photoY - photoBorder, actualPhotoWidth + photoBorder * 2, actualPhotoHeight + photoBorder * 2)
        ctx.fill()
        ctx.restore()
        
        ctx.save()
        drawHeartPath(ctx, actualPhotoX, photoY, actualPhotoWidth, actualPhotoHeight)
        ctx.clip()
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
        ctx.restore()
        
        ctx.strokeStyle = '#ff6b9d'
        ctx.lineWidth = 3
        drawHeartPath(ctx, actualPhotoX, photoY, actualPhotoWidth, actualPhotoHeight)
        ctx.stroke()
      } else {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(photoX - photoBorder, photoY - photoBorder, photoWidth + photoBorder * 2, photoHeight + photoBorder * 2)

        ctx.save()
        ctx.beginPath()
        ctx.rect(photoX, photoY, photoWidth, photoHeight)
        ctx.clip()
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
        ctx.restore()
      }
      
      drawFrameMarker(ctx, 8, photoY + 15, i + 1, markerColor)
      
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
    }
  }

  // Stickers
  if (sticker !== 'none' && stickerEmojis[sticker]) {
    const emoji = stickerEmojis[sticker]
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

  // Footer
  const footerY = stripHeight - footerHeight
  const footerCenterX = stripWidth / 2
  
  ctx.strokeStyle = textColor
  ctx.globalAlpha = 0.3
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(sprocketWidth + photoPadding, footerY + 25)
  ctx.lineTo(stripWidth - sprocketWidth - photoPadding, footerY + 25)
  ctx.stroke()
  ctx.globalAlpha = 1

  ctx.font = '24px Arial'
  ctx.fillStyle = textColor
  ctx.globalAlpha = 0.6
  ctx.textAlign = 'center'
  ctx.fillText('✦  ✦  ✦', footerCenterX, footerY + 65)
  ctx.globalAlpha = 1

  ctx.font = 'bold 52px Georgia, serif'
  ctx.fillStyle = textColor
  ctx.fillText((customTitle || 'photobooth').toUpperCase(), footerCenterX, footerY + 135)

  if (addDate || addTime) {
    ctx.font = '26px Arial'
    ctx.fillStyle = textColor
    ctx.globalAlpha = 0.7
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    
    let displayText = ''
    if (addDate) displayText += dateStr
    if (addTime) displayText += (addDate ? '  •  ' : '') + timeStr
    
    ctx.fillText(displayText, footerCenterX, footerY + 230)
    ctx.globalAlpha = 1
  }

  ctx.font = '22px Arial'
  ctx.fillStyle = textColor
  ctx.globalAlpha = 0.5
  ctx.fillText('#photobooth', footerCenterX, footerY + 275)
  ctx.globalAlpha = 1
}

// ============================================
// TEMPLATE: PICNIC (Gingham/Cute Style)
// ============================================
async function generatePicnicTemplate(photos, options, canvas, ctx) {
  const { addDate, customTitle } = options
  const stripWidth = canvas.width
  const stripHeight = canvas.height
  const numPhotos = Math.min(photos.length, 3)
  
  // Pink and white gingham/checkered background
  const squareSize = 50
  for (let y = 0; y < stripHeight; y += squareSize) {
    for (let x = 0; x < stripWidth; x += squareSize) {
      const isEven = ((x + y) / squareSize) % 2 === 0
      ctx.fillStyle = isEven ? '#ffffff' : '#FFD4DB'
      ctx.fillRect(x, y, squareSize, squareSize)
    }
  }
  
  // Main photo strip container (cream/white, slightly tilted)
  const stripMargin = 80
  const photoStripWidth = stripWidth - stripMargin * 2
  const photoStripHeight = stripHeight - 100
  const centerX = stripWidth / 2
  const centerY = stripHeight / 2
  const tiltAngle = 0.03 // Slight tilt like the design
  
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(tiltAngle)
  ctx.translate(-centerX, -centerY)
  
  // Draw cream background for photo strip
  ctx.fillStyle = '#FDF8F3'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
  ctx.shadowBlur = 20
  ctx.shadowOffsetX = 5
  ctx.shadowOffsetY = 5
  ctx.fillRect(stripMargin, 50, photoStripWidth, photoStripHeight)
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  
  // Draw thin dark border around the strip
  ctx.strokeStyle = '#4a4a4a'
  ctx.lineWidth = 2
  ctx.strokeRect(stripMargin + 5, 55, photoStripWidth - 10, photoStripHeight - 10)
  
  // Photo dimensions
  const photoPadding = 30
  const photoGap = 25
  const photoStartY = 80
  const photoWidth = photoStripWidth - photoPadding * 2 - 10
  const availableHeight = photoStripHeight - 150
  const photoHeight = (availableHeight - (photoGap * (numPhotos - 1))) / numPhotos
  
  // Draw photos with thin border
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoX = stripMargin + photoPadding + 5
    const photoY = photoStartY + i * (photoHeight + photoGap)
    
    try {
      const img = await loadImage(photo.data)
      
      // Photo border (thin dark line)
      ctx.strokeStyle = '#3a3a3a'
      ctx.lineWidth = 1.5
      ctx.strokeRect(photoX - 2, photoY - 2, photoWidth + 4, photoHeight + 4)
      
      // Draw photo
      ctx.save()
      ctx.beginPath()
      ctx.rect(photoX, photoY, photoWidth, photoHeight)
      ctx.clip()
      
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
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
      
    } catch (err) {
      console.error('Error loading photo:', err)
    }
  }
  
  ctx.restore() // Restore from tilt
  
  // ============================================
  // DECORATIONS - Drawn on top without tilt
  // ============================================
  
  // Party banner/flags at top left
  const drawFlag = (x, y, width, height, color, pattern) => {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + width, y)
    ctx.lineTo(x + width / 2, y + height)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = '#666'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // Add pattern
    if (pattern === 'dots') {
      ctx.fillStyle = '#fff'
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.arc(x + width/2 + (Math.random()-0.5)*10, y + 10 + i*8, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (pattern === 'stripes') {
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      for (let i = 0; i < 4; i++) {
        ctx.beginPath()
        ctx.moveTo(x + 3, y + 5 + i*7)
        ctx.lineTo(x + width - 3, y + 5 + i*7)
        ctx.stroke()
      }
    }
  }
  
  // Draw party flags
  ctx.strokeStyle = '#888'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(60, 60)
  ctx.lineTo(180, 30)
  ctx.stroke()
  
  drawFlag(80, 45, 25, 35, '#F7E07F', 'dots') // Yellow flag
  drawFlag(110, 35, 25, 35, '#E8A0A0', 'stripes') // Pink flag
  drawFlag(140, 40, 25, 35, '#B8E0B8', '') // Green flag
  
  // Leaves decoration (scattered around)
  const drawLeaf = (x, y, size, rotation, color) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.ellipse(0, 0, size, size/2.5, 0, 0, Math.PI * 2)
    ctx.fill()
    // Leaf vein
    ctx.strokeStyle = '#5a8a5a'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(-size + 3, 0)
    ctx.lineTo(size - 3, 0)
    ctx.stroke()
    ctx.restore()
  }
  
  // Draw scattered leaves
  drawLeaf(50, 350, 18, -0.5, '#98D4A0')
  drawLeaf(35, 580, 15, 0.3, '#7BC47F')
  drawLeaf(55, 620, 12, -0.2, '#98D4A0')
  drawLeaf(stripWidth - 60, 750, 16, 0.4, '#7BC47F')
  drawLeaf(stripWidth - 45, 790, 13, -0.3, '#98D4A0')
  drawLeaf(stripWidth - 70, 820, 14, 0.6, '#7BC47F')
  
  // Curly vine/stem lines
  ctx.strokeStyle = '#aaa'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(40, 340)
  ctx.bezierCurveTo(60, 380, 30, 420, 50, 460)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(30, 700)
  ctx.bezierCurveTo(50, 740, 20, 780, 45, 820)
  ctx.stroke()
  
  // Blue water drops/petals (top right area)
  const drawDrop = (x, y, size, color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.ellipse(x, y, size/2, size, Math.PI/6, 0, Math.PI * 2)
    ctx.fill()
  }
  
  drawDrop(stripWidth - 55, 200, 25, '#A8D8E8')
  drawDrop(stripWidth - 35, 230, 20, '#8CC8D8')
  
  // Pink heart
  const drawCuteHeart = (x, y, size, color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    const topY = y - size * 0.3
    ctx.moveTo(x, y + size * 0.5)
    ctx.bezierCurveTo(x - size, y, x - size, topY, x, topY + size * 0.3)
    ctx.bezierCurveTo(x + size, topY, x + size, y, x, y + size * 0.5)
    ctx.fill()
  }
  
  drawCuteHeart(stripWidth - 50, 520, 30, '#FFB6C1')
  
  // Small sparkle stars
  const drawSparkle = (x, y, size, color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    // 4-point star
    ctx.moveTo(x, y - size)
    ctx.lineTo(x + size*0.3, y - size*0.3)
    ctx.lineTo(x + size, y)
    ctx.lineTo(x + size*0.3, y + size*0.3)
    ctx.lineTo(x, y + size)
    ctx.lineTo(x - size*0.3, y + size*0.3)
    ctx.lineTo(x - size, y)
    ctx.lineTo(x - size*0.3, y - size*0.3)
    ctx.closePath()
    ctx.fill()
  }
  
  drawSparkle(stripWidth - 80, 490, 8, '#FFE066')
  drawSparkle(stripWidth - 100, 540, 6, '#FFE066')
  
  // Cherries decoration
  const drawCherry = (x, y, size) => {
    // Stems
    ctx.strokeStyle = '#5a8a5a'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, y - size)
    ctx.quadraticCurveTo(x + size*0.5, y - size*1.5, x + size*0.3, y - size*2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + size*1.5, y - size*0.5)
    ctx.quadraticCurveTo(x + size, y - size*1.5, x + size*0.3, y - size*2)
    ctx.stroke()
    
    // Cherry 1
    ctx.fillStyle = '#E85A71'
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.beginPath()
    ctx.arc(x - size*0.3, y - size*0.3, size*0.3, 0, Math.PI * 2)
    ctx.fill()
    
    // Cherry 2
    ctx.fillStyle = '#E85A71'
    ctx.beginPath()
    ctx.arc(x + size*1.5, y + size*0.5, size, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.beginPath()
    ctx.arc(x + size*1.5 - size*0.3, y + size*0.5 - size*0.3, size*0.3, 0, Math.PI * 2)
    ctx.fill()
  }
  
  drawCherry(stripWidth - 70, stripHeight - 280, 15)
  
  // Flowers at bottom left
  const drawFlower = (x, y, size, petalColor, centerColor) => {
    const petalCount = 5
    ctx.fillStyle = petalColor
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2 - Math.PI/2
      const petalX = x + Math.cos(angle) * size * 0.6
      const petalY = y + Math.sin(angle) * size * 0.6
      ctx.beginPath()
      ctx.ellipse(petalX, petalY, size * 0.5, size * 0.35, angle, 0, Math.PI * 2)
      ctx.fill()
    }
    // Center
    ctx.fillStyle = centerColor
    ctx.beginPath()
    ctx.arc(x, y, size * 0.3, 0, Math.PI * 2)
    ctx.fill()
  }
  
  drawFlower(80, stripHeight - 150, 28, '#FFB6C1', '#FFE066')
  drawFlower(50, stripHeight - 100, 22, '#FFE066', '#FF9999')
  drawFlower(110, stripHeight - 90, 18, '#FFE066', '#FFCC66')
  
  // Yellow stars at bottom right
  const drawStar = (x, y, size, color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI / 5) - Math.PI / 2
      const nextAngle = ((i + 1) * 4 * Math.PI / 5) - Math.PI / 2
      if (i === 0) {
        ctx.moveTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size)
      }
      ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size)
      const midAngle = angle + (2 * Math.PI / 5)
      ctx.lineTo(x + Math.cos(midAngle) * size * 0.4, y + Math.sin(midAngle) * size * 0.4)
    }
    ctx.closePath()
    ctx.fill()
  }
  
  drawStar(stripWidth - 60, stripHeight - 120, 18, '#FFE066')
  drawStar(stripWidth - 90, stripHeight - 80, 14, '#FFE066')
  drawStar(stripWidth - 50, stripHeight - 60, 12, '#FFCC44')
  
  // Small butterfly
  const drawButterfly = (x, y, size, color) => {
    ctx.fillStyle = color
    // Left wing
    ctx.beginPath()
    ctx.ellipse(x - size*0.6, y, size*0.7, size*0.4, -Math.PI/4, 0, Math.PI * 2)
    ctx.fill()
    // Right wing
    ctx.beginPath()
    ctx.ellipse(x + size*0.6, y, size*0.7, size*0.4, Math.PI/4, 0, Math.PI * 2)
    ctx.fill()
    // Body
    ctx.fillStyle = '#666'
    ctx.beginPath()
    ctx.ellipse(x, y, size*0.15, size*0.5, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  
  drawButterfly(stripWidth - 100, stripHeight - 150, 18, '#FFE066')
}

// ============================================
// TEMPLATE: COQUETTE (Pink Ribbons & Bows)
// ============================================
async function generateCoquetteTemplate(photos, options, canvas, ctx) {
  const { customTitle } = options
  const stripWidth = canvas.width
  const stripHeight = canvas.height
  const numPhotos = Math.min(photos.length, 4)
  
  // White/cream background
  ctx.fillStyle = '#FFFAFA'
  ctx.fillRect(0, 0, stripWidth, stripHeight)
  
  // Add subtle pink sparkles in background
  ctx.fillStyle = '#FFB6C1'
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * stripWidth
    const y = Math.random() * stripHeight
    ctx.font = '12px Arial'
    ctx.fillText('✦', x, y)
  }
  
  // Draw ribbon/bow decoration
  const drawBow = (x, y, size, color) => {
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    
    // Left loop
    ctx.beginPath()
    ctx.ellipse(x - size * 0.7, y, size * 0.6, size * 0.35, -Math.PI / 6, 0, Math.PI * 2)
    ctx.fill()
    
    // Right loop
    ctx.beginPath()
    ctx.ellipse(x + size * 0.7, y, size * 0.6, size * 0.35, Math.PI / 6, 0, Math.PI * 2)
    ctx.fill()
    
    // Center knot
    ctx.beginPath()
    ctx.arc(x, y, size * 0.25, 0, Math.PI * 2)
    ctx.fill()
    
    // Ribbons hanging down
    ctx.beginPath()
    ctx.moveTo(x - size * 0.15, y + size * 0.2)
    ctx.quadraticCurveTo(x - size * 0.3, y + size * 0.8, x - size * 0.5, y + size * 1.2)
    ctx.lineWidth = size * 0.15
    ctx.lineCap = 'round'
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(x + size * 0.15, y + size * 0.2)
    ctx.quadraticCurveTo(x + size * 0.3, y + size * 0.8, x + size * 0.5, y + size * 1.2)
    ctx.stroke()
  }
  
  // Photo dimensions - 4 circular frames
  const photoGap = 25
  const photoPadding = 80
  const headerSpace = 100  // Space for top decorations
  const footerSpace = 120  // Space for footer bar and text
  const availableHeight = stripHeight - headerSpace - footerSpace
  const photoSize = (availableHeight - (photoGap * (numPhotos - 1))) / numPhotos
  const photoRadius = Math.min(photoSize * 0.45, (stripWidth - photoPadding * 2) * 0.45)
  
  // Draw photos in circular frames with ribbon borders
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const centerX = stripWidth / 2
    const centerY = headerSpace + photoRadius + i * (photoRadius * 2 + photoGap)
    
    try {
      const img = await loadImage(photo.data)
      
      // Pink circular border
      ctx.strokeStyle = '#FF91A4'
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.arc(centerX, centerY, photoRadius + 5, 0, Math.PI * 2)
      ctx.stroke()
      
      // Draw photo in circle
      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, photoRadius, 0, Math.PI * 2)
      ctx.clip()
      
      const imgSize = Math.max(photoRadius * 2, photoRadius * 2)
      const imgAspect = img.width / img.height
      let drawWidth, drawHeight
      if (imgAspect > 1) {
        drawHeight = imgSize
        drawWidth = imgSize * imgAspect
      } else {
        drawWidth = imgSize
        drawHeight = imgSize / imgAspect
      }
      ctx.drawImage(img, centerX - drawWidth/2, centerY - drawHeight/2, drawWidth, drawHeight)
      ctx.restore()
      
      // Add bows at corners
      drawBow(centerX - photoRadius - 10, centerY - photoRadius + 20, 20, '#FF91A4')
      drawBow(centerX + photoRadius + 10, centerY - photoRadius + 20, 20, '#FF91A4')
      
    } catch (err) {
      console.error('Error loading photo:', err)
    }
  }
  
  // Decorative bows in corners
  drawBow(80, 60, 30, '#FF91A4')
  drawBow(stripWidth - 80, 60, 30, '#FF91A4')
  drawBow(80, stripHeight - 140, 25, '#FFB6C1')
  drawBow(stripWidth - 80, stripHeight - 140, 25, '#FFB6C1')
  
  // Pink footer bar
  ctx.fillStyle = '#FF91A4'
  ctx.fillRect(0, stripHeight - 80, stripWidth, 80)
  
  // Footer text
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 28px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText(customTitle || 'xoxo', stripWidth / 2, stripHeight - 35)
  
  // Add small hearts around footer text
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '16px Arial'
  ctx.fillText('♡', stripWidth / 2 - 80, stripHeight - 32)
  ctx.fillText('♡', stripWidth / 2 + 80, stripHeight - 32)
}

// ============================================
// TEMPLATE: BORCELLE (Funky Purple Hearts)
// ============================================
async function generateBorcelleTemplate(photos, options, canvas, ctx) {
  const { customTitle } = options
  const stripWidth = canvas.width
  const stripHeight = canvas.height
  const numPhotos = Math.min(photos.length, 3)
  
  // Purple/pink checkered background
  const squareSize = 60
  for (let y = 0; y < stripHeight; y += squareSize) {
    for (let x = 0; x < stripWidth; x += squareSize) {
      const isEven = ((x + y) / squareSize) % 2 === 0
      ctx.fillStyle = isEven ? '#C4B5E0' : '#E8D4F0'
      ctx.fillRect(x, y, squareSize, squareSize)
    }
  }
  
  // Draw abstract blob shape
  const drawBlob = (x, y, size, fillColor, strokeColor) => {
    ctx.fillStyle = fillColor
    ctx.beginPath()
    ctx.moveTo(x, y - size)
    ctx.bezierCurveTo(x + size * 1.5, y - size * 0.5, x + size * 1.2, y + size * 0.8, x, y + size)
    ctx.bezierCurveTo(x - size * 1.2, y + size * 0.8, x - size * 1.5, y - size * 0.5, x, y - size)
    ctx.fill()
    if (strokeColor) {
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = 3
      ctx.stroke()
    }
  }
  
  // Draw rounded heart/blob frame
  const drawHeartBlob = (ctx, x, y, width, height) => {
    ctx.beginPath()
    // Top left curve
    ctx.moveTo(x + width * 0.5, y + height * 0.2)
    ctx.bezierCurveTo(x + width * 0.15, y - height * 0.1, x - width * 0.1, y + height * 0.4, x + width * 0.1, y + height * 0.7)
    // Bottom point
    ctx.bezierCurveTo(x + width * 0.25, y + height * 0.95, x + width * 0.5, y + height, x + width * 0.5, y + height)
    ctx.bezierCurveTo(x + width * 0.5, y + height, x + width * 0.75, y + height * 0.95, x + width * 0.9, y + height * 0.7)
    // Top right curve
    ctx.bezierCurveTo(x + width * 1.1, y + height * 0.4, x + width * 0.85, y - height * 0.1, x + width * 0.5, y + height * 0.2)
    ctx.closePath()
  }
  
  // Pink blobs decoration
  drawBlob(100, 180, 60, '#E84A7F', '#FFD93D')
  drawBlob(stripWidth - 100, 550, 50, '#E84A7F', '#FFD93D')
  
  // Photo frames
  const photoGap = 50
  const photoStartY = 100
  const photoWidth = stripWidth - 160
  const photoHeight = (stripHeight - 350 - (photoGap * (numPhotos - 1))) / numPhotos
  
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoX = 80
    const photoY = photoStartY + i * (photoHeight + photoGap)
    
    try {
      const img = await loadImage(photo.data)
      
      // Draw heart-blob frame with navy border
      ctx.save()
      drawHeartBlob(ctx, photoX, photoY, photoWidth, photoHeight)
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()
      ctx.strokeStyle = '#1E2952'
      ctx.lineWidth = 4
      ctx.stroke()
      
      // Clip and draw photo
      drawHeartBlob(ctx, photoX + 8, photoY + 8, photoWidth - 16, photoHeight - 16)
      ctx.clip()
      
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
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
      
    } catch (err) {
      console.error('Error loading photo:', err)
    }
  }
  
  // "BORCELLE" label
  ctx.save()
  ctx.translate(stripWidth / 2, stripHeight / 2)
  ctx.rotate(-0.1)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 36px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(customTitle || 'BORCELLE', 0, 0)
  ctx.restore()
  
  // Monster character at bottom
  const monsterY = stripHeight - 120
  const monsterX = stripWidth / 2
  
  // Monster face
  ctx.fillStyle = '#7B68A6'
  ctx.beginPath()
  ctx.arc(monsterX, monsterY + 30, 80, Math.PI, 0, false)
  ctx.fill()
  
  // Pink spiky hair/crown
  ctx.fillStyle = '#FFB6C1'
  for (let i = 0; i < 8; i++) {
    const angle = Math.PI + (i / 7) * Math.PI
    const spikeX = monsterX + Math.cos(angle) * 70
    const spikeY = monsterY + 30 + Math.sin(angle) * 70
    ctx.beginPath()
    ctx.arc(spikeX, spikeY - 15, 15, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Eyes
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.ellipse(monsterX - 25, monsterY + 20, 20, 25, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(monsterX + 25, monsterY + 20, 20, 25, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Pupils
  ctx.fillStyle = '#1a1a1a'
  ctx.beginPath()
  ctx.arc(monsterX - 22, monsterY + 22, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(monsterX + 28, monsterY + 22, 10, 0, Math.PI * 2)
  ctx.fill()
  
  // Eyebrows
  ctx.strokeStyle = '#1a1a1a'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(monsterX - 40, monsterY - 5)
  ctx.quadraticCurveTo(monsterX - 25, monsterY - 15, monsterX - 10, monsterY - 5)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(monsterX + 10, monsterY - 5)
  ctx.quadraticCurveTo(monsterX + 25, monsterY - 15, monsterX + 40, monsterY - 5)
  ctx.stroke()
}

// ============================================
// TEMPLATE: GROOVY (Retro 70s Psychedelic)
// ============================================
async function generateGroovyTemplate(photos, options, canvas, ctx) {
  const { customTitle } = options
  const stripWidth = canvas.width
  const stripHeight = canvas.height
  const numPhotos = Math.min(photos.length, 3)
  
  // Psychedelic swirl background
  const drawSwirl = () => {
    const colors = ['#8B5A9B', '#F5E6D3']
    const centerX = stripWidth / 2
    const centerY = stripHeight / 2
    
    // Draw wavy stripes
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = colors[i % 2]
      ctx.beginPath()
      
      for (let y = 0; y <= stripHeight; y += 10) {
        const wave = Math.sin((y / 80) + (i * 0.5)) * 100
        const x = (i / 30) * stripWidth + wave
        if (y === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      for (let y = stripHeight; y >= 0; y -= 10) {
        const wave = Math.sin((y / 80) + ((i + 1) * 0.5)) * 100
        const x = ((i + 1) / 30) * stripWidth + wave
        ctx.lineTo(x, y)
      }
      
      ctx.closePath()
      ctx.fill()
    }
  }
  
  drawSwirl()
  
  // Draw wavy/scalloped rectangle frame
  const drawScallopedRect = (x, y, width, height, scallops, borderColor) => {
    ctx.fillStyle = '#FFFFFF'
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 4
    
    ctx.beginPath()
    const scallopSize = width / scallops
    
    // Top edge
    for (let i = 0; i <= scallops; i++) {
      const cx = x + i * scallopSize
      const cy = y
      if (i === 0) ctx.moveTo(cx, cy)
      ctx.quadraticCurveTo(cx + scallopSize/2, cy - 15, cx + scallopSize, cy)
    }
    
    // Right edge
    const rightScallops = Math.floor(height / scallopSize)
    for (let i = 0; i <= rightScallops; i++) {
      const cx = x + width
      const cy = y + i * scallopSize
      ctx.quadraticCurveTo(cx + 15, cy + scallopSize/2, cx, cy + scallopSize)
    }
    
    // Bottom edge
    for (let i = scallops; i >= 0; i--) {
      const cx = x + i * scallopSize
      const cy = y + height
      ctx.quadraticCurveTo(cx + scallopSize/2, cy + 15, cx, cy)
    }
    
    // Left edge  
    for (let i = rightScallops; i >= 0; i--) {
      const cx = x
      const cy = y + i * scallopSize
      ctx.quadraticCurveTo(cx - 15, cy + scallopSize/2, cx, cy)
    }
    
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
  
  // Draw smiley face
  const drawSmiley = (x, y, size, color) => {
    // Face
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Eyes
    ctx.fillStyle = '#1a1a1a'
    ctx.beginPath()
    ctx.arc(x - size * 0.3, y - size * 0.15, size * 0.12, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x + size * 0.3, y - size * 0.15, size * 0.12, 0, Math.PI * 2)
    ctx.fill()
    
    // Smile
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(x, y + size * 0.05, size * 0.45, 0.2, Math.PI - 0.2)
    ctx.stroke()
  }
  
  // Draw flower with face
  const drawFlowerFace = (x, y, size, petalColor) => {
    // Petals
    ctx.fillStyle = petalColor
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const petalX = x + Math.cos(angle) * size * 0.7
      const petalY = y + Math.sin(angle) * size * 0.7
      ctx.beginPath()
      ctx.ellipse(petalX, petalY, size * 0.4, size * 0.25, angle, 0, Math.PI * 2)
      ctx.fill()
    }
    // Face center
    drawSmiley(x, y, size * 0.45, '#FFD93D')
  }
  
  // Photo frames
  const photoGap = 40
  const photoStartY = 120
  const photoPadding = 100
  const photoWidth = stripWidth - photoPadding * 2
  const photoHeight = (stripHeight - 350 - (photoGap * (numPhotos - 1))) / numPhotos
  const borderColors = ['#FFFFFF', '#FF6B35', '#FFFFFF']
  
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoX = photoPadding
    const photoY = photoStartY + i * (photoHeight + photoGap)
    
    try {
      const img = await loadImage(photo.data)
      
      // Draw scalloped frame
      drawScallopedRect(photoX, photoY, photoWidth, photoHeight, 8, borderColors[i])
      
      // Draw photo
      ctx.save()
      ctx.beginPath()
      ctx.rect(photoX + 15, photoY + 15, photoWidth - 30, photoHeight - 30)
      ctx.clip()
      
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
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
      
    } catch (err) {
      console.error('Error loading photo:', err)
    }
  }
  
  // Decorations - smiley faces
  drawSmiley(100, 80, 45, '#FFD93D')  // Sun-like smiley top left
  drawSmiley(stripWidth - 80, stripHeight - 350, 35, '#FFD93D')
  
  // Flowers with faces
  drawFlowerFace(100, 400, 35, '#FFB6C1')
  drawFlowerFace(stripWidth - 80, 280, 30, '#FFB6C1')
  drawFlowerFace(stripWidth - 100, stripHeight - 200, 35, '#FFB6C1')
  
  // Daisy decoration top left
  ctx.fillStyle = '#FFF8DC'
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2
    const petalX = 180 + Math.cos(angle) * 30
    const petalY = 60 + Math.sin(angle) * 30
    ctx.beginPath()
    ctx.ellipse(petalX, petalY, 20, 8, angle, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = '#FFD93D'
  ctx.beginPath()
  ctx.arc(180, 60, 15, 0, Math.PI * 2)
  ctx.fill()
  
  // Rainbow at top right
  const rainbowColors = ['#FF6B6B', '#FFA500', '#FFD93D', '#90EE90', '#87CEEB', '#9370DB']
  const rainbowX = stripWidth - 60
  const rainbowY = 50
  for (let i = 0; i < rainbowColors.length; i++) {
    ctx.strokeStyle = rainbowColors[i]
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.arc(rainbowX, rainbowY + 20, 20 + i * 6, Math.PI, 0)
    ctx.stroke()
  }
  
  // Rainbow stripes at bottom
  const stripeY = stripHeight - 80
  for (let i = 0; i < rainbowColors.length; i++) {
    ctx.fillStyle = rainbowColors[i]
    ctx.fillRect(0, stripeY + i * 12, stripWidth, 12)
  }
}

// ============================================
// TEMPLATE: DREAMY (3D Pink Aura)
// ============================================
async function generateDreamyTemplate(photos, options, canvas, ctx) {
  const { customTitle } = options
  const stripWidth = canvas.width
  const stripHeight = canvas.height
  const numPhotos = Math.min(photos.length, 3)
  
  // Soft pink gradient background with aura effect
  const gradient = ctx.createRadialGradient(
    stripWidth / 2, stripHeight / 2, 0,
    stripWidth / 2, stripHeight / 2, stripHeight
  )
  gradient.addColorStop(0, '#FFF0F5')
  gradient.addColorStop(0.5, '#FFE4EC')
  gradient.addColorStop(1, '#FFD4E5')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, stripWidth, stripHeight)
  
  // Add subtle texture/hearts in background
  ctx.fillStyle = 'rgba(255, 182, 193, 0.15)'
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * stripWidth
    const y = Math.random() * stripHeight
    ctx.font = '20px Arial'
    ctx.fillText('♡', x, y)
  }
  
  // Draw 3D glossy cloud
  const draw3DCloud = (x, y, size) => {
    // Shadow
    ctx.fillStyle = 'rgba(200, 150, 200, 0.3)'
    ctx.beginPath()
    ctx.arc(x + 5, y + 5, size * 0.4, 0, Math.PI * 2)
    ctx.arc(x + size * 0.4 + 5, y + 5, size * 0.35, 0, Math.PI * 2)
    ctx.arc(x + size * 0.8 + 5, y + 5, size * 0.3, 0, Math.PI * 2)
    ctx.fill()
    
    // Main cloud
    const cloudGradient = ctx.createRadialGradient(x, y - size * 0.2, 0, x, y, size)
    cloudGradient.addColorStop(0, '#FFFFFF')
    cloudGradient.addColorStop(0.5, '#E8D4F0')
    cloudGradient.addColorStop(1, '#DDA0DD')
    ctx.fillStyle = cloudGradient
    ctx.beginPath()
    ctx.arc(x, y, size * 0.4, 0, Math.PI * 2)
    ctx.arc(x + size * 0.4, y, size * 0.35, 0, Math.PI * 2)
    ctx.arc(x + size * 0.8, y, size * 0.3, 0, Math.PI * 2)
    ctx.fill()
    
    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.beginPath()
    ctx.arc(x - size * 0.1, y - size * 0.15, size * 0.15, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Draw 3D heart planet
  const draw3DHeart = (x, y, size) => {
    // Glow
    ctx.fillStyle = 'rgba(255, 105, 180, 0.2)'
    ctx.beginPath()
    ctx.arc(x, y, size * 1.3, 0, Math.PI * 2)
    ctx.fill()
    
    // Heart
    const heartGradient = ctx.createRadialGradient(x - size * 0.2, y - size * 0.2, 0, x, y, size)
    heartGradient.addColorStop(0, '#FF69B4')
    heartGradient.addColorStop(1, '#FF1493')
    ctx.fillStyle = heartGradient
    
    ctx.beginPath()
    const topY = y - size * 0.3
    ctx.moveTo(x, y + size * 0.6)
    ctx.bezierCurveTo(x - size, y, x - size, topY, x, topY + size * 0.3)
    ctx.bezierCurveTo(x + size, topY, x + size, y, x, y + size * 0.6)
    ctx.fill()
    
    // Ring around heart
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.ellipse(x, y + size * 0.1, size * 1.1, size * 0.3, Math.PI / 6, 0, Math.PI * 2)
    ctx.stroke()
    
    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.beginPath()
    ctx.arc(x - size * 0.25, y - size * 0.1, size * 0.2, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Draw 3D sparkle star
  const draw3DSparkle = (x, y, size) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
    gradient.addColorStop(0, '#FFFFFF')
    gradient.addColorStop(0.5, '#FFB6C1')
    gradient.addColorStop(1, '#FF69B4')
    ctx.fillStyle = gradient
    
    // 4-point star
    ctx.beginPath()
    ctx.moveTo(x, y - size)
    ctx.quadraticCurveTo(x + size * 0.15, y - size * 0.15, x + size, y)
    ctx.quadraticCurveTo(x + size * 0.15, y + size * 0.15, x, y + size)
    ctx.quadraticCurveTo(x - size * 0.15, y + size * 0.15, x - size, y)
    ctx.quadraticCurveTo(x - size * 0.15, y - size * 0.15, x, y - size)
    ctx.fill()
    
    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.beginPath()
    ctx.arc(x - size * 0.2, y - size * 0.2, size * 0.15, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Draw 3D cherry
  const draw3DCherry = (x, y, size) => {
    // Stems
    ctx.strokeStyle = '#FFB6C1'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x, y - size)
    ctx.quadraticCurveTo(x + size * 0.3, y - size * 1.5, x + size * 0.5, y - size * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + size * 1.2, y - size * 0.5)
    ctx.quadraticCurveTo(x + size * 0.8, y - size * 1.5, x + size * 0.5, y - size * 2)
    ctx.stroke()
    
    // Cherry 1
    let cherryGradient = ctx.createRadialGradient(x - size * 0.2, y - size * 0.3, 0, x, y, size)
    cherryGradient.addColorStop(0, '#FFB6C1')
    cherryGradient.addColorStop(1, '#FF69B4')
    ctx.fillStyle = cherryGradient
    ctx.beginPath()
    ctx.arc(x, y, size * 0.7, 0, Math.PI * 2)
    ctx.fill()
    
    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.beginPath()
    ctx.arc(x - size * 0.2, y - size * 0.2, size * 0.2, 0, Math.PI * 2)
    ctx.fill()
    
    // Cherry 2
    cherryGradient = ctx.createRadialGradient(x + size * 1, y - size * 0.8, 0, x + size * 1.2, y - size * 0.5, size)
    cherryGradient.addColorStop(0, '#FFB6C1')
    cherryGradient.addColorStop(1, '#FF69B4')
    ctx.fillStyle = cherryGradient
    ctx.beginPath()
    ctx.arc(x + size * 1.2, y - size * 0.5, size * 0.6, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.beginPath()
    ctx.arc(x + size * 1, y - size * 0.7, size * 0.15, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Draw 3D flower
  const draw3DFlower = (x, y, size) => {
    // Petals
    const petalColors = ['#FFB6C1', '#DDA0DD', '#E6E6FA', '#FFB6C1', '#DDA0DD']
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
      const petalX = x + Math.cos(angle) * size * 0.5
      const petalY = y + Math.sin(angle) * size * 0.5
      
      const petalGradient = ctx.createRadialGradient(petalX, petalY - 5, 0, petalX, petalY, size * 0.4)
      petalGradient.addColorStop(0, '#FFFFFF')
      petalGradient.addColorStop(1, petalColors[i])
      ctx.fillStyle = petalGradient
      ctx.beginPath()
      ctx.arc(petalX, petalY, size * 0.35, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Center
    const centerGradient = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, size * 0.25)
    centerGradient.addColorStop(0, '#FFFFFF')
    centerGradient.addColorStop(1, '#E6E6FA')
    ctx.fillStyle = centerGradient
    ctx.beginPath()
    ctx.arc(x, y, size * 0.25, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Photo frames - simple rectangles
  const photoGap = 30
  const photoStartY = 80
  const photoPadding = 50
  const photoWidth = stripWidth - photoPadding * 2
  const photoHeight = (stripHeight - 200 - (photoGap * (numPhotos - 1))) / numPhotos
  
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoX = photoPadding
    const photoY = photoStartY + i * (photoHeight + photoGap)
    
    try {
      const img = await loadImage(photo.data)
      
      // Soft shadow
      ctx.shadowColor = 'rgba(255, 105, 180, 0.3)'
      ctx.shadowBlur = 20
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(photoX, photoY, photoWidth, photoHeight)
      ctx.shadowBlur = 0
      
      // Draw photo
      ctx.save()
      ctx.beginPath()
      ctx.rect(photoX, photoY, photoWidth, photoHeight)
      ctx.clip()
      
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
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
      
    } catch (err) {
      console.error('Error loading photo:', err)
    }
  }
  
  // Add 3D decorations
  draw3DCloud(100, 80, 60)
  draw3DHeart(stripWidth - 100, 280, 40)
  draw3DSparkle(stripWidth - 80, 450, 30)
  draw3DSparkle(120, 520, 25)
  draw3DCherry(80, stripHeight - 400, 35)
  draw3DFlower(stripWidth - 80, stripHeight - 150, 45)
}

// ============================================
// TEMPLATE: Y2K HEART (OMG Radiating Hearts)
// ============================================
async function generateY2KHeartTemplate(photos, options, canvas, ctx) {
  const { customTitle } = options
  const stripWidth = canvas.width
  const stripHeight = canvas.height
  const numPhotos = Math.min(photos.length, 3)
  
  // Radiating heart background
  const centerX = stripWidth / 2
  const centerY = stripHeight / 2
  const colors = ['#4B0082', '#8B008B', '#FF1493', '#FF69B4', '#4B0082', '#8B008B', '#FF1493']
  
  // Draw radiating pattern
  for (let ring = 20; ring >= 0; ring--) {
    ctx.fillStyle = colors[ring % colors.length]
    const size = (ring + 1) * 120
    
    // Heart shape for each ring
    ctx.beginPath()
    const topY = centerY - size * 0.3
    ctx.moveTo(centerX, centerY + size * 0.7)
    ctx.bezierCurveTo(centerX - size * 1.2, centerY + size * 0.2, centerX - size * 1.2, topY, centerX, topY + size * 0.3)
    ctx.bezierCurveTo(centerX + size * 1.2, topY, centerX + size * 1.2, centerY + size * 0.2, centerX, centerY + size * 0.7)
    ctx.fill()
  }
  
  // Photo frames with pink border
  const photoGap = 25
  const photoStartY = 60
  const photoPadding = 80
  const photoWidth = stripWidth - photoPadding * 2
  const photoHeight = (stripHeight - 180 - (photoGap * (numPhotos - 1))) / numPhotos
  
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoX = photoPadding
    const photoY = photoStartY + i * (photoHeight + photoGap)
    
    try {
      const img = await loadImage(photo.data)
      
      // Pink frame border
      ctx.fillStyle = '#FF69B4'
      ctx.fillRect(photoX - 5, photoY - 5, photoWidth + 10, photoHeight + 10)
      
      // White inner
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(photoX, photoY, photoWidth, photoHeight)
      
      // Draw photo
      ctx.save()
      ctx.beginPath()
      ctx.rect(photoX, photoY, photoWidth, photoHeight)
      ctx.clip()
      
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
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
      
    } catch (err) {
      console.error('Error loading photo:', err)
    }
  }
  
  // Smiley face sticker
  const drawSmileySticker = (x, y, size, color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Winking eye
    ctx.fillStyle = '#1a1a1a'
    ctx.beginPath()
    ctx.arc(x - size * 0.3, y - size * 0.1, size * 0.08, 0, Math.PI * 2)
    ctx.fill()
    
    // Closed eye (wink)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x + size * 0.3, y - size * 0.1, size * 0.12, 0, Math.PI)
    ctx.stroke()
    
    // Smile
    ctx.beginPath()
    ctx.arc(x, y + size * 0.15, size * 0.35, 0.2, Math.PI - 0.2)
    ctx.stroke()
  }
  
  // OMG sticker
  ctx.fillStyle = '#4B0082'
  ctx.beginPath()
  ctx.ellipse(100, 380, 70, 35, -0.1, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#00CED1'
  ctx.lineWidth = 3
  ctx.stroke()
  
  ctx.fillStyle = '#FF69B4'
  ctx.font = 'bold 28px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('OMG', 100, 390)
  
  // Exclamation marks
  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 20px Arial'
  ctx.fillText('!?', 160, 360)
  ctx.fillText('!!', 50, 400)
  
  // Smiley stickers
  drawSmileySticker(stripWidth - 80, 80, 30, '#FFD700')
  
  // Globe icon
  ctx.strokeStyle = '#00CED1'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(60, stripHeight - 300, 25, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(60, stripHeight - 300, 25, 10, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(60, stripHeight - 325)
  ctx.lineTo(60, stripHeight - 275)
  ctx.stroke()
  
  // Pearl necklace
  ctx.fillStyle = '#FFE4E1'
  const pearlStartX = stripWidth - 60
  const pearlStartY = 350
  for (let i = 0; i < 12; i++) {
    const px = pearlStartX - Math.sin(i * 0.3) * 30
    const py = pearlStartY + i * 25
    ctx.beginPath()
    ctx.arc(px, py, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#DDA0DD'
    ctx.lineWidth = 1
    ctx.stroke()
  }
  
  // Smiley circles at bottom
  ctx.fillStyle = '#DDA0DD'
  ctx.beginPath()
  ctx.arc(80, stripHeight - 80, 30, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#1a1a1a'
  ctx.beginPath()
  ctx.arc(70, stripHeight - 85, 4, 0, Math.PI * 2)
  ctx.arc(90, stripHeight - 85, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(80, stripHeight - 75, 10, 0.2, Math.PI - 0.2)
  ctx.stroke()
  
  ctx.fillStyle = '#87CEEB'
  ctx.beginPath()
  ctx.arc(130, stripHeight - 70, 25, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#1a1a1a'
  ctx.beginPath()
  ctx.arc(122, stripHeight - 75, 3, 0, Math.PI * 2)
  ctx.arc(138, stripHeight - 75, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(130, stripHeight - 65, 8, 0.2, Math.PI - 0.2)
  ctx.stroke()
  
  // Heart sticker bottom right
  ctx.fillStyle = '#00CED1'
  ctx.beginPath()
  const hx = stripWidth - 80
  const hy = stripHeight - 80
  ctx.moveTo(hx, hy + 25)
  ctx.bezierCurveTo(hx - 30, hy, hx - 30, hy - 20, hx, hy - 5)
  ctx.bezierCurveTo(hx + 30, hy - 20, hx + 30, hy, hx, hy + 25)
  ctx.fill()
  
  // Inner heart
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.moveTo(hx, hy + 15)
  ctx.bezierCurveTo(hx - 18, hy + 5, hx - 18, hy - 8, hx, hy)
  ctx.bezierCurveTo(hx + 18, hy - 8, hx + 18, hy + 5, hx, hy + 15)
  ctx.fill()
  
  // Smile in heart
  ctx.strokeStyle = '#1a1a1a'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(hx, hy + 3, 6, 0.3, Math.PI - 0.3)
  ctx.stroke()
  
  // Sparkles
  ctx.fillStyle = '#FFD700'
  ctx.font = '16px Arial'
  ctx.fillText('✦', stripWidth - 60, stripHeight - 110)
  ctx.fillText('★', stripWidth - 100, stripHeight - 60)
}

// ============================================
// TEMPLATE: SPRING (Daisy Garden)
// ============================================
async function generateSpringTemplate(photos, options, canvas, ctx) {
  const { customTitle } = options
  const stripWidth = canvas.width
  const stripHeight = canvas.height
  const numPhotos = Math.min(photos.length, 3)
  
  // Mint green background
  ctx.fillStyle = '#E0F0E8'
  ctx.fillRect(0, 0, stripWidth, stripHeight)
  
  // Background leaf pattern
  ctx.fillStyle = 'rgba(176, 224, 200, 0.4)'
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * stripWidth
    const y = Math.random() * stripHeight
    const size = 15 + Math.random() * 25
    const angle = Math.random() * Math.PI * 2
    
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.beginPath()
    ctx.ellipse(0, 0, size, size / 3, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  
  // Draw daisy flower
  const drawDaisy = (x, y, size, petalColor) => {
    // Petals
    ctx.fillStyle = petalColor
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const petalX = x + Math.cos(angle) * size * 0.5
      const petalY = y + Math.sin(angle) * size * 0.5
      ctx.beginPath()
      ctx.ellipse(petalX, petalY, size * 0.35, size * 0.15, angle, 0, Math.PI * 2)
      ctx.fill()
    }
    // Center
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.arc(x, y, size * 0.25, 0, Math.PI * 2)
    ctx.fill()
    // Texture dots
    ctx.fillStyle = '#FFA500'
    for (let i = 0; i < 5; i++) {
      const dotAngle = Math.random() * Math.PI * 2
      const dotR = Math.random() * size * 0.15
      ctx.beginPath()
      ctx.arc(x + Math.cos(dotAngle) * dotR, y + Math.sin(dotAngle) * dotR, 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  
  // Draw lily flower
  const drawLily = (x, y, size) => {
    ctx.fillStyle = '#90EE90'
    // Petals
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(size * 0.3, -size * 0.3, 0, -size)
      ctx.quadraticCurveTo(-size * 0.3, -size * 0.3, 0, 0)
      ctx.fill()
      ctx.restore()
    }
    // Center dots
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.arc(x, y, size * 0.1, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Draw flower-shaped frame (pixelated clover style)
  const drawFlowerFrame = (ctx, x, y, size) => {
    const lobeSize = size * 0.55
    ctx.beginPath()
    // Four lobes like a clover/flower
    ctx.arc(x + size/2, y + lobeSize/2, lobeSize, Math.PI * 1.2, Math.PI * 1.8)
    ctx.arc(x + size - lobeSize/2, y + size/2, lobeSize, Math.PI * 1.7, Math.PI * 0.3)
    ctx.arc(x + size/2, y + size - lobeSize/2, lobeSize, Math.PI * 0.2, Math.PI * 0.8)
    ctx.arc(x + lobeSize/2, y + size/2, lobeSize, Math.PI * 0.7, Math.PI * 1.3)
    ctx.closePath()
  }
  
  // Photo frames
  const photoGap = 40
  const photoStartY = 80
  const photoPadding = 80
  const photoSize = Math.min(
    (stripHeight - 250 - (photoGap * (numPhotos - 1))) / numPhotos,
    stripWidth - photoPadding * 2
  )
  
  for (let i = 0; i < numPhotos && i < photos.length; i++) {
    const photo = photos[i]
    const photoX = (stripWidth - photoSize) / 2
    const photoY = photoStartY + i * (photoSize + photoGap)
    
    try {
      const img = await loadImage(photo.data)
      
      // Draw flower-shaped frame
      ctx.save()
      drawFlowerFrame(ctx, photoX, photoY, photoSize)
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()
      ctx.strokeStyle = '#2F4F4F'
      ctx.lineWidth = 4
      ctx.setLineDash([8, 4]) // Pixelated/dashed look
      ctx.stroke()
      ctx.setLineDash([])
      
      // Clip and draw photo
      drawFlowerFrame(ctx, photoX + 10, photoY + 10, photoSize - 20)
      ctx.clip()
      
      const imgAspect = img.width / img.height
      let drawWidth, drawHeight, drawX, drawY
      
      if (imgAspect > 1) {
        drawHeight = photoSize
        drawWidth = photoSize * imgAspect
        drawX = photoX - (drawWidth - photoSize) / 2
        drawY = photoY
      } else {
        drawWidth = photoSize
        drawHeight = photoSize / imgAspect
        drawX = photoX
        drawY = photoY - (drawHeight - photoSize) / 2
      }
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
      
    } catch (err) {
      console.error('Error loading photo:', err)
    }
  }
  
  // Decorations - Daisies
  drawDaisy(120, 120, 50, '#FFFFFF')
  drawDaisy(stripWidth - 100, 200, 45, '#FFFFFF')
  drawDaisy(80, stripHeight - 350, 40, '#FFFFFF')
  drawDaisy(stripWidth - 120, stripHeight - 280, 50, '#FFFFFF')
  drawDaisy(stripWidth / 2 + 100, stripHeight - 180, 35, '#FFFFFF')
  
  // Lilies
  drawLily(stripWidth - 80, 100, 45)
  drawLily(100, 450, 40)
  drawLily(stripWidth - 100, stripHeight - 400, 50)
  
  // <3 text
  ctx.fillStyle = '#2F4F4F'
  ctx.font = 'bold 36px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('<3', stripWidth / 2 + 50, 250)
  
  // Grass at bottom
  ctx.fillStyle = '#228B22'
  for (let x = 0; x < stripWidth; x += 15) {
    const height = 40 + Math.random() * 40
    ctx.beginPath()
    ctx.moveTo(x, stripHeight)
    ctx.quadraticCurveTo(x + 5, stripHeight - height, x + 10, stripHeight)
    ctx.fill()
  }
  
  // Leaves in grass
  ctx.fillStyle = '#32CD32'
  for (let i = 0; i < 10; i++) {
    const lx = Math.random() * stripWidth
    const ly = stripHeight - 30 - Math.random() * 50
    const lsize = 20 + Math.random() * 20
    ctx.save()
    ctx.translate(lx, ly)
    ctx.rotate(-0.3 + Math.random() * 0.6)
    ctx.beginPath()
    ctx.ellipse(0, 0, lsize, lsize / 3, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  
  // Small yellow flowers in grass
  for (let i = 0; i < 8; i++) {
    const fx = 50 + Math.random() * (stripWidth - 100)
    const fy = stripHeight - 60 - Math.random() * 30
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.arc(fx, fy, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFA500'
    ctx.beginPath()
    ctx.arc(fx, fy, 3, 0, Math.PI * 2)
    ctx.fill()
  }
}

// ============================================
// MAIN EXPORT FUNCTION
// ============================================
export async function generatePhotoStrip(photos, options) {
  const {
    layout = 'layoutF',
    template = 'classic'
  } = options

  console.log('generatePhotoStrip called with template:', template, 'layout:', layout)

  // Layout configurations
  const layoutConfig = {
    layoutA: 3, layoutB: 4, layoutC: 2, layoutD: 6, horizontal: 3, layoutE: 3, layoutF: 4,
    newspaper: 4, kawaii: 4, y2k: 4, starry: 4, scrapbook: 4, picnic: 3,
    coquette: 4, borcelle: 3, groovy: 3, dreamy: 3, y2kheart: 3, spring: 3
  }
  
  const maxPhotos = layoutConfig[layout] || layoutConfig[template] || 4
  const numPhotos = Math.min(photos.length, maxPhotos)

  // Canvas dimensions
  const stripWidth = 800
  const baseHeight = 500
  const stripHeight = Math.max(1600, numPhotos * baseHeight + 400)

  const canvas = document.createElement('canvas')
  canvas.width = stripWidth
  canvas.height = stripHeight
  const ctx = canvas.getContext('2d')

  // Select template
  switch (template) {
    case 'newspaper':
      await generateNewspaperTemplate(photos, options, canvas, ctx)
      break
    case 'kawaii':
      await generateKawaiiTemplate(photos, options, canvas, ctx)
      break
    case 'y2k':
      await generateY2KTemplate(photos, options, canvas, ctx)
      break
    case 'starry':
      await generateStarryTemplate(photos, options, canvas, ctx)
      break
    case 'scrapbook':
      await generateScrapbookTemplate(photos, options, canvas, ctx)
      break
    case 'picnic':
      await generatePicnicTemplate(photos, options, canvas, ctx)
      break
    case 'coquette':
      await generateCoquetteTemplate(photos, options, canvas, ctx)
      break
    case 'borcelle':
      await generateBorcelleTemplate(photos, options, canvas, ctx)
      break
    case 'groovy':
      await generateGroovyTemplate(photos, options, canvas, ctx)
      break
    case 'dreamy':
      await generateDreamyTemplate(photos, options, canvas, ctx)
      break
    case 'y2kheart':
      await generateY2KHeartTemplate(photos, options, canvas, ctx)
      break
    case 'spring':
      await generateSpringTemplate(photos, options, canvas, ctx)
      break
    case 'classic':
    default:
      await generateClassicTemplate(photos, options, canvas, ctx)
      break
  }

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
