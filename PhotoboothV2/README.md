# 📸 Missing Alegres - PhotoBooth V2

A beautiful, feature-rich photobooth web application built with **Vite**, **React**, and **Tailwind CSS**. Inspired by classic photobooths with modern web technology!

## ✨ Features

### 🎭 Landing Page
- Beautiful gradient background with animated floating photo strips
- Professional hero section with "EST 2025" branding
- Smooth transition to photobooth app

### 📷 Camera System
- **Live camera feed** with real-time preview
- **8 stunning filters**: Normal, B&W, Sepia, Vintage, Cool, Warm, Vivid, Hue
- **3-second countdown timer** with overlay
- **Flash effect** on capture
- **Camera flip** (front/back on supported devices)
- Capture limit based on selected layout

### 🖼️ 7 Different Layouts
1. **Layout A** - 3 photos vertical (classic strip)
2. **Layout B** - 4 photos in 2x2 grid
3. **Layout C** - 2 large photos vertical
4. **Layout D** - 6 photos mixed (2 large + 4 small)
5. **Horizontal** - 3 photos side by side
6. **Layout E** - 3 heart-framed photos
7. **Layout F** - 4 photos classic photostrip

### 🎨 Customization Options

#### Frame Colors (10+ options)
- Rainbow gradient
- Solid colors: Pink, Blue, Yellow, Green, Plum, Tan, Dark Red
- Classic: Black & White

#### Photo Shapes
- Square ⬜
- Rounded (default) ▢
- Circle ⭕
- Heart ❤️

#### 24 Stickers
Including: Ghost, Clover, Kiss, Heart, Bow, Star, Unicorn, Sparkle, Music, Animals (Bear, Koala, Panda, Frog), Flowers, Food (Cherry, Cake, Pizza), Crown, Fire, Rainbow, Moon, and more!

#### Logo Options
- ENG (English)
- KOR (Korean)
- CN (Chinese)

#### Metadata
- Toggle date display
- Toggle time display

### 🖼️ Gallery
- Grid layout for photo thumbnails
- Lightbox modal for full-size viewing
- Download individual photos
- Share photos (on supported devices)
- Delete photos with confirmation
- Photo count badge

### 🎯 Smart Features
- Dynamic photo requirements based on layout
- Real-time photo count tracking
- Automatic customization unlock when photos are complete
- Responsive design for all devices
- Touch-friendly controls

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Start the development server:**
   ```powershell
   npm run dev
   ```

3. **Open your browser:**
   - Visit `http://localhost:3000`
   - Grant camera permissions when prompted

### Build for Production

```powershell
npm run build
```

## 🎯 How to Use

### Getting Started
1. Click "START" on the landing page
2. Choose your preferred layout (determines photo count needed)
3. Select a filter for your photos

### Taking Photos
1. Click "Start Camera" to enable webcam
2. Choose between:
   - **Capture Photo** - Instant capture
   - **Timer (3s)** - 3-second countdown
3. Take required number of photos for your layout

### Customization
Once you've captured enough photos:
1. **Frame Color** - Choose from 10+ colors and patterns
2. **Photo Shape** - Square, Rounded, Circle, or Heart
3. **Stickers** - Add fun stickers to your photos (24 options)
4. **Logo** - Select language (ENG/KOR/CN)
5. **Options** - Toggle date/time display

### Download
- Click "Download Photostrip" to save your customized creation
- High-quality PNG format
- Includes all customizations, layouts, and effects

## 🛠️ Tech Stack

- **Vite** - Lightning-fast build tool
- **React 18** - Modern UI library with hooks
- **Tailwind CSS** - Utility-first styling
- **CSS Filters** - Real-time image effects
- **Canvas API** - Photo manipulation & photostrip generation
- **MediaDevices API** - Camera access

## � Project Structure

```
PhotoboothV2/
├── public/
│   └── camera.svg
├── src/
│   ├── components/
│   │   ├── Landing.jsx          # Landing page
│   │   ├── Camera.jsx            # Camera controls & capture
│   │   ├── Gallery.jsx           # Photo gallery
│   │   ├── LayoutSelector.jsx   # Layout chooser
│   │   └── Customization.jsx    # Customization panel
│   ├── App.jsx                   # Main app logic
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## � Design Philosophy

- **Modern & Clean** - Inspired by Tailwind CSS's aesthetic
- **Glass-morphism** - Frosted glass effects throughout
- **Gradients** - Purple-pink gradient theme
- **Dark Mode** - Slate dark background with vibrant accents
- **Smooth Animations** - 200-300ms transitions
- **Mobile-First** - Responsive from 320px to 4K

## 🌟 Key Improvements from Original

### UI Enhancements
✅ Modern React architecture (vs vanilla JS)
✅ Component-based structure
✅ Tailwind CSS utility classes
✅ Professional SVG icons (vs emojis in buttons)
✅ Better mobile responsiveness
✅ Smooth page transitions

### Features Added
✅ Landing page with branding
✅ Real-time filter preview
✅ Layout preview system
✅ Better countdown visualization
✅ Enhanced customization UI
✅ Improved photo management

### Performance
✅ Vite's HMR (Hot Module Replacement)
✅ Optimized React rendering
✅ Efficient state management
✅ Lazy loading potential

## 🔒 Privacy

- ✅ All photos stored locally in browser memory
- ✅ No data sent to any server
- ✅ Camera access only when explicitly enabled
- ✅ Photos cleared on page close (unless downloaded)

## � Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**
- Camera access permission
- Modern browser with MediaDevices API support
- JavaScript enabled

## 🎉 Credits

**Original Design**: Missing Alegres Photobooth
**Modernized with**: React + Vite + Tailwind CSS
**Made with** ❤️ **by**: The Development Team

## 📄 License

MIT License - Feel free to use for personal or commercial projects!

---

**Share your photostrips and tag** @andrei.regulacion13 💜
