import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import BackgroundEffect from '../components/BackgroundEffect';

interface AboutLandingProps {
  onGetStarted: () => void;
}

// Configuration
const CONFIG = {
  totalFrames: {
    light: 192,
    dark: 240
  },
  path: {
    light: '/frames/light/',
    dark: '/frames/dark/'
  },
  delays: {
    light: ['0.041s', '0.042s', '0.042s'],
    dark: ['0.033s', '0.033s', '0.034s']
  },
  sections: {
    intro: { start: 0, end: 0.12 },
    problem: { start: 0.08, end: 0.22 },
    features: { start: 0.18, end: 0.96 },
    cta: { start: 0.92, end: 1.0 }
  },
  featureCards: [
    { id: 'feature-1', start: 0.0, end: 0.28 },
    { id: 'feature-2', start: 0.24, end: 0.52 },
    { id: 'feature-3', start: 0.48, end: 0.76 },
    { id: 'feature-4', start: 0.72, end: 1.0 }
  ]
};

// Utility functions
const getFrameFilename = (index: number, theme: 'light' | 'dark'): string => {
  const pattern = CONFIG.delays[theme];
  const delay = pattern[index % pattern.length];
  const number = index.toString().padStart(3, '0');
  return `frame_${number}_delay-${delay}.webp`;
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const AboutLanding: React.FC<AboutLandingProps> = ({ onGetStarted }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('maternal-care-theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<{ light: HTMLImageElement[], dark: HTMLImageElement[] }>({ light: [], dark: [] });
  const rafIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check mobile and reduced motion
  useEffect(() => {
    const checkMobile = () => {
      return window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const checkReducedMotion = () => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    setIsMobile(checkMobile());
    setReducedMotion(checkReducedMotion());

    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => setReducedMotion(motionQuery.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Load frames
  useEffect(() => {
    const loadFramesForTheme = async (t: 'light' | 'dark') => {
      const total = CONFIG.totalFrames[t];
      const path = CONFIG.path[t];

      if (framesRef.current[t].filter(Boolean).length >= total) return;

      for (let i = 0; i < total; i++) {
        if (framesRef.current[t][i]) continue;

        const img = new Image();
        const filename = getFrameFilename(i, t);
        img.src = path + filename;

        img.onload = () => {
          framesRef.current[t][i] = img;
          if (i === 0 && t === theme) {
            renderFrame(0);
          }
        };
      }
    };

    if (!isMobile && !reducedMotion) {
      loadFramesForTheme(theme);
      // Load other theme in background
      const otherTheme = theme === 'light' ? 'dark' : 'light';
      setTimeout(() => loadFramesForTheme(otherTheme), 100);
    }
  }, [theme, isMobile, reducedMotion]);

  // Render frame to canvas
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frames = framesRef.current[theme];
    const img = frames[frameIndex];
    if (!img || !img.complete) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const canvasRatio = width / height;
    const imgRatio = img.width / img.height;

    let drawWidth, drawHeight, drawX, drawY;

    if (imgRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = drawHeight * imgRatio;
      drawX = (width - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = width;
      drawHeight = drawWidth / imgRatio;
      drawX = 0;
      drawY = (height - drawHeight) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, [theme]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const progress = clamp(window.scrollY / scrollHeight, 0, 1);
      setScrollProgress(progress);

      if (!isMobile && !reducedMotion) {
        const total = CONFIG.totalFrames[theme];
        const frameIndex = Math.min(total - 1, Math.floor(progress * (total - 1)));

        if (frameIndex !== currentFrame) {
          setCurrentFrame(frameIndex);

          if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
          }
          rafIdRef.current = requestAnimationFrame(() => {
            renderFrame(frameIndex);
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [theme, isMobile, reducedMotion, currentFrame, renderFrame]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('maternal-care-theme', newTheme);
  };

  // Section visibility helpers
  const isSectionVisible = (section: { start: number, end: number }) => {
    return scrollProgress >= section.start && scrollProgress < section.end;
  };

  const getFeaturesProgress = () => {
    const { features } = CONFIG.sections;
    if (scrollProgress < features.start || scrollProgress >= features.end) return -1;
    return (scrollProgress - features.start) / (features.end - features.start);
  };

  const isFeatureVisible = (card: { start: number, end: number }) => {
    const featuresProgress = getFeaturesProgress();
    if (featuresProgress < 0) return false;
    return featuresProgress >= card.start && featuresProgress < card.end;
  };

  const introVisible = isSectionVisible(CONFIG.sections.intro) || reducedMotion || isMobile;
  const problemVisible = isSectionVisible(CONFIG.sections.problem);
  const ctaVisible = scrollProgress >= CONFIG.sections.cta.start || reducedMotion || isMobile;

  return (
    <div
      ref={containerRef}
      className={`about-landing ${theme === 'dark' ? 'dark' : ''}`}
      data-theme={theme}
    >
      <BackgroundEffect />
      {/* Inject styles */}
      <style>{`
        /* CSS Custom Properties */
        .about-landing {
          --color-bg: #f9f7f2;
          --color-bg-soft: #fffefb;
          --color-text-primary: #ffffff;
          --color-text-secondary: #4a4f56;
          --color-text-muted: #7d8b96;
          --color-accent: #2d6a4f;
          --color-accent-soft: #85c7a2;
          --color-accent-hover: #1b4332;
          --color-card-bg: rgba(255, 255, 255, 0.7);
          --color-card-border: rgba(255, 255, 255, 0.6);
          --color-card-border-inner: rgba(255, 255, 255, 0.3);
          --color-overlay-bg: rgba(249, 247, 242, 0.5);
          --color-shadow: rgba(45, 106, 79, 0.08);
          --color-shadow-strong: rgba(28, 64, 48, 0.15);
          --color-glow: rgba(45, 106, 79, 0.15);
          --gradient-primary: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%);
          --gradient-surface: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
          --font-family-display: 'Playfair Display', Georgia, serif;
          --radius-sm: 12px;
          --radius-md: 24px;
          --radius-lg: 40px;
          --ease-key: cubic-bezier(0.23, 1, 0.32, 1);
          --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
        }

        .about-landing.dark {
          --color-bg: #050505;
          --color-bg-soft: #0a0a0a;
          --color-text-primary: #ffffff;
          --color-text-secondary: #a0a0a0;
          --color-text-muted: #666;
          --color-accent: #52b788;
          --color-accent-soft: #2d6a4f;
          --color-accent-hover: #74c69d;
          --color-card-bg: rgba(20, 20, 20, 0.7);
          --color-card-border: rgba(255, 255, 255, 0.1);
          --color-card-border-inner: rgba(255, 255, 255, 0.05);
          --color-overlay-bg: rgba(0, 0, 0, 0.6);
          --color-shadow: rgba(0, 0, 0, 0.5);
          --color-shadow-strong: rgba(0, 0, 0, 0.8);
          --color-glow: rgba(82, 183, 136, 0.15);
          --gradient-primary: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%);
          --gradient-surface: linear-gradient(180deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.4) 100%);
        }

        .about-landing {
          min-height: 100vh;
          background-color: transparent;
          color: var(--color-text-primary);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          transition: background-color 0.6s ease;
          position: relative;
          overflow-x: hidden;
        }

        /* Noise Overlay */
        .noise-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9000;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }

        .about-landing.dark .noise-overlay {
          opacity: 0.05;
        }

        /* Theme Toggle */
        .theme-toggle {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 1000;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid var(--color-card-border);
          background: var(--color-card-bg);
          backdrop-filter: blur(10px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-primary);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 12px var(--color-shadow);
        }

        .theme-toggle:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 8px 16px var(--color-shadow-strong);
        }

        /* Canvas */
        .animation-canvas {
          position: fixed;
          top: 50%;
          left: 2%;
          transform: translateY(-50%);
          width: 46%;
          max-width: 900px;
          height: auto;
          aspect-ratio: 16/9;
          z-index: 0;
          pointer-events: none;
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 50px -10px var(--color-shadow-strong), 0 0 0 1px var(--color-card-border);
        }

        /* Mobile Fallback */
        .mobile-fallback {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          display: none;
        }

        .mobile-fallback img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Scroll Container */
        .scroll-container {
          position: relative;
          z-index: 10;
          min-height: 400vh;
        }

        .content-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          pointer-events: none;
        }

        /* Text Overlay Base */
        .text-overlay {
          position: fixed;
          top: 50%;
          right: 5%;
          transform: translateY(-50%);
          width: 40%;
          max-width: 600px;
          text-align: left;
          z-index: 20;
          pointer-events: none;
          opacity: 0;
          transition: opacity 400ms var(--ease-smooth);
        }

        .text-overlay.visible {
          opacity: 1;
          pointer-events: auto;
        }

        /* Hero Title */
        .hero-title {
          font-family: var(--font-family-display);
          font-size: clamp(3rem, 5vw, 4.5rem);
          font-weight: 400;
          color: var(--color-text-primary);
          text-shadow: 0 4px 12px var(--color-shadow);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .hero-title::after {
          content: '';
          display: block;
          width: 80px;
          height: 3px;
          background: var(--color-accent);
          margin: 1.5rem 0 0;
          border-radius: var(--radius-lg);
        }

        /* Problem Statement */
        .problem-statement {
          font-family: var(--font-family-display);
          font-size: 2.5rem;
          font-weight: 400;
          color: var(--color-text-primary);
          line-height: 1.4;
          padding: 4rem;
          background: var(--color-overlay-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--color-card-border);
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 60px -10px var(--color-shadow-strong);
        }

        /* Feature Cards */
        .feature-card {
          position: fixed;
          top: 50%;
          right: 5%;
          transform: translateY(-45%) scale(0.95);
          width: 40%;
          max-width: 500px;
          padding: 2rem;
          background: var(--gradient-surface);
          backdrop-filter: blur(24px);
          border: 1px solid var(--color-card-border);
          box-shadow: inset 0 0 0 1px var(--color-card-border-inner), 0 20px 40px -10px var(--color-shadow-strong);
          border-radius: var(--radius-md);
          z-index: 20;
          pointer-events: none;
          text-align: left;
          opacity: 0;
          filter: blur(8px);
          transition: opacity 600ms ease-out, transform 800ms var(--ease-key), filter 600ms ease-out;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 120%;
          background: radial-gradient(circle, var(--color-glow) 0%, transparent 70%);
          z-index: -1;
          opacity: 0.6;
          pointer-events: none;
        }

        .feature-card.visible {
          opacity: 1;
          transform: translateY(-50%) scale(1);
          filter: blur(0);
          pointer-events: auto;
        }

        .feature-card h2 {
          color: var(--color-text-primary);
          font-family: var(--font-family-display);
          font-size: 1.75rem;
          font-weight: 400;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          opacity: 0;
          transform: translateY(10px);
          transition: all 500ms var(--ease-smooth);
        }

        .feature-card h2::after {
          content: '';
          display: block;
          width: 60px;
          height: 2px;
          background: var(--color-accent);
          margin: 1rem 0 0;
          opacity: 0.6;
        }

        .feature-card p {
          font-size: 1rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          opacity: 0;
          transform: translateY(10px);
          transition: all 500ms var(--ease-smooth);
        }

        .feature-card.visible h2 {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 150ms;
        }

        .feature-card.visible p {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 250ms;
        }

        /* CTA Container */
        .cta-container {
          position: fixed;
          top: 50%;
          right: 5%;
          transform: translateY(-50%);
          width: auto;
          max-width: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          z-index: 100;
          pointer-events: none; /* Container doesn't block */
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .cta-container.visible {
          opacity: 1;
          pointer-events: auto; /* Only interactive when visible */
        }

        .btn-primary {
          background: var(--gradient-primary);
          color: white;
          font-weight: 500;
          font-size: 1.25rem;
          padding: 1rem 8rem;
          border-radius: 99px;
          border: none;
          text-decoration: none;
          box-shadow: 0 10px 20px -5px var(--color-glow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          pointer-events: auto; /* Force clickable */
        }

        .btn-primary::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: skewX(-20deg);
          transition: left 0.5s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px var(--color-glow);
        }

        .btn-primary:hover::after {
          left: 100%;
        }

        .btn-secondary {
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.3s ease;
          cursor: pointer;
          background: none;
          border: none;
        }

        .btn-secondary:hover {
          color: var(--color-accent);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .animation-canvas {
            top: 20%;
            left: 50%;
            width: 90%;
            transform: translate(-50%, -50%);
          }

          .text-overlay,
          .feature-card,
          .cta-container {
            position: fixed;
            top: auto;
            bottom: 10%;
            right: 50%;
            transform: translateX(50%);
            width: 90%;
            max-width: none;
            text-align: center;
          }

          .feature-card.visible {
            transform: translateX(50%) scale(1);
          }

          .feature-card h2::after {
            margin: 1rem auto 0;
          }

          .cta-container {
            align-items: center;
          }
        }

        @media (max-width: 768px) {
          .animation-canvas {
            display: none;
          }

          .mobile-fallback {
            display: block;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .problem-statement {
            font-size: 1.5rem;
            padding: 2rem;
          }

          .btn-primary {
            padding: 1rem 4rem;
          }
        }

        /* Screen reader only */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>

      {/* Noise Texture Overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Theme Toggle Button */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        type="button"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      {/* Canvas for animation */}
      {!isMobile && !reducedMotion && (
        <canvas
          ref={canvasRef}
          className="animation-canvas"
          aria-hidden="true"
        />
      )}

      {/* Mobile Fallback Image */}
      {(isMobile || reducedMotion) && (
        <div className="mobile-fallback" aria-hidden="true">
          <img
            src={`${CONFIG.path[theme]}${getFrameFilename(45, theme)}`}
            alt=""
            loading="eager"
          />
        </div>
      )}

      {/* Scroll Container */}
      <main className="scroll-container">
        {/* Section 1: Emotional Intro */}
        <section className="content-section" aria-label="Introduction">
          <div className={`text-overlay ${introVisible ? 'visible' : ''}`}>
            <h1 className="hero-title">Care shouldn't end after birth.</h1>
          </div>
        </section>

        {/* Section 2: Problem Statement */}
        <section className="content-section" aria-label="The Problem">
          <div className={`text-overlay ${problemVisible ? 'visible' : ''}`}>
            <p className="problem-statement">
              Most mothers are left unsupported when care matters most.
            </p>
          </div>
        </section>

        {/* Section 3: Feature Cards */}
        <section className="content-section" aria-label="What We Offer">
          {/* Feature Card 1 */}
          <article className={`feature-card ${isFeatureVisible(CONFIG.featureCards[0]) || (isMobile || reducedMotion) ? 'visible' : ''}`}>
            <h2>Before Pregnancy</h2>
            <p>Prepare your body and mind before conception using evidence-based guidance.</p>
          </article>

          {/* Feature Card 2 */}
          <article className={`feature-card ${isFeatureVisible(CONFIG.featureCards[1]) ? 'visible' : ''}`}>
            <h2>During Pregnancy</h2>
            <p>Clear nutrition, mental health support, and week-by-week guidance.</p>
          </article>

          {/* Feature Card 3 */}
          <article className={`feature-card ${isFeatureVisible(CONFIG.featureCards[2]) ? 'visible' : ''}`}>
            <h2>After Birth &amp; Baby Care</h2>
            <p>Protect mothers and infants from unsafe products, practices, and environments.</p>
          </article>

          {/* Feature Card 4 (USP) */}
          <article className={`feature-card ${isFeatureVisible(CONFIG.featureCards[3]) ? 'visible' : ''}`}>
            <h2>Truth Over Tradition</h2>
            <p>Compare Indian practices with global medical safety standards.</p>
          </article>
        </section>

        {/* Final CTA Section */}
        <section className="content-section" aria-label="Get Started">
          <div className={`cta-container ${ctaVisible ? 'visible' : ''}`}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onGetStarted();
              }}
              className="btn-primary"
            >
              Get Started
            </button>
            <button type="button" className="btn-secondary">
              How we protect your privacy
            </button>
          </div>
        </section>
      </main>

      {/* Reduced Motion Notice */}
      <div className="sr-only" aria-live="polite" />
    </div>
  );
};

export default AboutLanding;
