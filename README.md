<div align="center">
</div>

# NurtureNet - Holistic Fertility Readiness Platform

A comprehensive maternal health platform providing support from pre-conception through baby care, with AI-powered guidance and personalized tracking.

View your app in AI Studio: https://ai.studio/apps/drive/1G02_3eVTEJhnWxv7TbbQ-T0vacpt-6SD


## Tech Stack used

### Languages
- **TypeScript** (~5.8.2) - Primary language for type-safe development
- **JavaScript** - Utility files and scripts
- **HTML** - Template and index files
- **CSS** - Styling with TailwindCSS utilities

### Frameworks & Libraries
- **React** (^19.2.3) - UI framework
- **React Router DOM** (^7.12.0) - Client-side routing
- **Vite** (^6.2.0) - Build tool and dev server
- **Firebase** (^12.7.0) - Backend services (Firestore, Storage, Authentication)
- **Recharts** (^3.6.0) - Data visualization and charting
- **Lucide React** (^0.562.0) - Icon library
- **Bytez.js** (^3.0.0) - AI and automation

### Styling
- **TailwindCSS** - Utility-first CSS framework
- Custom Dark Matter theme with light/dark mode support

### Architecture
- Single Page Application (SPA)
- Firebase backend integration
- AI-powered health insights and recommendations

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Troubleshooting

### Location Not Working on Vercel

If geolocation isn't working in production on Vercel:

1. **Check Browser Permissions**: Ensure location access is enabled in your browser settings
   - Click the lock icon in the address bar
   - Set "Location" to "Allow"

2. **HTTPS Required**: Geolocation API only works on HTTPS (Vercel provides this automatically)

3. **Fallback to IP Location**: The app automatically falls back to IP-based geolocation if browser location is denied

4. **Check Browser Console**: Open DevTools (F12) and check the console for detailed error messages:
   - "Location permission denied" - User blocked location access
   - "Location unavailable" - Device GPS/location services are off
   - "Location request timeout" - Network or GPS issue
   - "Geolocation requires secure context" - Page not loaded via HTTPS

5. **Environment Variables**: Ensure `VITE_WAQI_API_TOKEN` is set in Vercel's environment variables

**Debug Steps:**
```bash
# Check what location method is being used
# Browser console will show one of:
# "✓ Using browser geolocation" - GPS/browser location working
# "✓ Using IP-based location" - Fallback to IP geolocation
```
