import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// CORS - Allow requests from your Vercel frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://photobooth-p1gu8nd43-marc-andrei-regulacions-projects.vercel.app',
  /\.vercel\.app$/  // Allow all Vercel preview deployments
]

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true)
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) return allowed.test(origin)
      return allowed === origin
    })
    
    if (isAllowed) {
      callback(null, true)
    } else {
      callback(null, true) // Allow all for now during development
    }
  },
  credentials: true
}))

// ============================================
// CLOUDINARY CONFIGURATION
// ============================================
// Sign up for free at: https://cloudinary.com/
// Get your credentials from: Dashboard > Settings > Access Keys
//
// Option 1: Set environment variables (recommended for production)
// CLOUDINARY_CLOUD_NAME=your_cloud_name
// CLOUDINARY_API_KEY=your_api_key
// CLOUDINARY_API_SECRET=your_api_secret
//
// Option 2: Hardcode here (for testing only - don't commit secrets!)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
  api_key: process.env.CLOUDINARY_API_KEY || 'YOUR_API_KEY',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET',
  secure: true
})

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  const config = cloudinary.config()
  return config.cloud_name && 
         config.cloud_name !== 'YOUR_CLOUD_NAME' && 
         config.api_key && 
         config.api_key !== 'YOUR_API_KEY'
}

// Middleware (CORS already configured above)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Local backup directory
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
app.use('/uploads', express.static(uploadsDir))

// ============================================
// API ENDPOINTS
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    cloudinary: isCloudinaryConfigured() ? 'configured' : 'not configured (using local storage)'
  })
})

// Save a photo strip
app.post('/api/photostrip', async (req, res) => {
  try {
    const { imageData, filename } = req.body
    
    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' })
    }

    const timestamp = Date.now()
    const finalFilename = filename || `photostrip-${timestamp}`

    // Try Cloudinary first, fallback to local storage
    if (isCloudinaryConfigured()) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(imageData, {
          folder: 'photobooth',
          public_id: finalFilename,
          resource_type: 'image',
          format: 'png',
          transformation: [
            { quality: 'auto:best' },
            { fetch_format: 'auto' }
          ]
        })
        
        console.log('✅ Uploaded to Cloudinary:', result.public_id)
        
        return res.json({
          success: true,
          storage: 'cloudinary',
          filename: result.public_id,
          url: result.secure_url,
          publicId: result.public_id,
          savedAt: new Date().toISOString()
        })
      } catch (cloudError) {
        console.error('Cloudinary upload failed, falling back to local:', cloudError.message)
      }
    }
    
    // Local storage fallback
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    const localFilename = `${finalFilename}.png`
    const filePath = path.join(uploadsDir, localFilename)
    
    fs.writeFileSync(filePath, buffer)
    console.log('💾 Saved locally:', localFilename)
    
    res.json({
      success: true,
      storage: 'local',
      filename: localFilename,
      url: `/uploads/${localFilename}`,
      savedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error saving photo:', error)
    res.status(500).json({ error: 'Failed to save photo' })
  }
})

// Get all saved photo strips
app.get('/api/photostrips', async (req, res) => {
  try {
    const photostrips = []
    
    // Try to get from Cloudinary
    if (isCloudinaryConfigured()) {
      try {
        const result = await cloudinary.search
          .expression('folder:photobooth')
          .sort_by('created_at', 'desc')
          .max_results(100)
          .execute()
        
        result.resources.forEach(resource => {
          photostrips.push({
            filename: resource.public_id,
            url: resource.secure_url,
            createdAt: resource.created_at,
            size: resource.bytes,
            storage: 'cloudinary',
            publicId: resource.public_id
          })
        })
        console.log(`☁️ Found ${result.resources.length} photos in Cloudinary`)
      } catch (cloudError) {
        console.error('Cloudinary search failed:', cloudError.message)
      }
    }
    
    // Also get local files
    try {
      const localFiles = fs.readdirSync(uploadsDir)
        .filter(file => file.endsWith('.png') || file.endsWith('.jpg'))
        .map(file => {
          const stats = fs.statSync(path.join(uploadsDir, file))
          return {
            filename: file,
            url: `/uploads/${file}`,
            createdAt: stats.birthtime,
            size: stats.size,
            storage: 'local'
          }
        })
      
      photostrips.push(...localFiles)
      console.log(`💾 Found ${localFiles.length} local photos`)
    } catch (localError) {
      console.error('Error reading local files:', localError.message)
    }
    
    // Sort all by date
    photostrips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    res.json({ photostrips })
  } catch (error) {
    console.error('Error listing photos:', error)
    res.status(500).json({ error: 'Failed to list photos' })
  }
})

// Delete a photo strip
app.delete('/api/photostrip/:filename', async (req, res) => {
  try {
    const { filename } = req.params
    const { storage, publicId } = req.query
    
    // Delete from Cloudinary
    if (storage === 'cloudinary' && publicId && isCloudinaryConfigured()) {
      try {
        await cloudinary.uploader.destroy(publicId)
        console.log('🗑️ Deleted from Cloudinary:', publicId)
        return res.json({ success: true, message: 'Photo deleted from cloud' })
      } catch (cloudError) {
        console.error('Cloudinary delete failed:', cloudError.message)
      }
    }
    
    // Delete from local storage
    const filePath = path.join(uploadsDir, filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log('🗑️ Deleted locally:', filename)
      return res.json({ success: true, message: 'Photo deleted' })
    }
    
    res.status(404).json({ error: 'File not found' })
  } catch (error) {
    console.error('Error deleting photo:', error)
    res.status(500).json({ error: 'Failed to delete photo' })
  }
})

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`\n📸 Photo Booth API running on http://localhost:${PORT}`)
  console.log(`📁 Local uploads: ${uploadsDir}`)
  
  if (isCloudinaryConfigured()) {
    console.log(`☁️  Cloudinary: Connected to "${cloudinary.config().cloud_name}"`)
  } else {
    console.log(`⚠️  Cloudinary: Not configured (using local storage only)`)
    console.log(`   To enable cloud storage:`)
    console.log(`   1. Sign up at https://cloudinary.com (free)`)
    console.log(`   2. Set environment variables:`)
    console.log(`      CLOUDINARY_CLOUD_NAME=your_cloud_name`)
    console.log(`      CLOUDINARY_API_KEY=your_api_key`)
    console.log(`      CLOUDINARY_API_SECRET=your_api_secret`)
  }
  console.log('')
})
