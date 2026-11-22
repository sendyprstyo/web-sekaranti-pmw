@import "tailwindcss";

/* ============================================
   SEKARANTI — Global Design System
   ============================================ */

@theme {
  /* Brand Color Palette */
  --color-primary: #311908;
  --color-on-primary: #ffffff;
  --color-primary-fixed: #ffdbc7;
  --color-primary-fixed-dim: #eabda3;
  --color-on-primary-fixed: #2d1605;
  --color-on-primary-fixed-variant: #5f402c;
  --color-primary-container: #4a2e1b;
  --color-on-primary-container: #bd957c;
  --color-inverse-primary: #eabda3;

  --color-secondary: #9a4152;
  --color-on-secondary: #ffffff;
  --color-secondary-fixed: #ffd9dd;
  --color-secondary-fixed-dim: #ffb2bc;
  --color-on-secondary-fixed: #400013;
  --color-on-secondary-fixed-variant: #7c2a3b;
  --color-secondary-container: #fd91a2;
  --color-on-secondary-container: #772738;

  --color-tertiary: #735c00;
  --color-on-tertiary: #ffffff;
  --color-tertiary-fixed: #ffe088;
  --color-tertiary-fixed-dim: #e9c349;
  --color-on-tertiary-fixed: #241a00;
  --color-on-tertiary-fixed-variant: #574500;
  --color-tertiary-container: #cca830;
  --color-on-tertiary-container: #4f3e00;

  --color-surface: #fcf9f4;
  --color-surface-bright: #fcf9f4;
  --color-surface-dim: #dcdad5;
  --color-surface-variant: #e5e2dd;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f6f3ee;
  --color-surface-container: #f0ede9;
  --color-surface-container-high: #ebe8e3;
  --color-surface-container-highest: #e5e2dd;
  --color-on-surface: #1c1c19;
  --color-on-surface-variant: #50443e;
  --color-inverse-surface: #31302d;
  --color-inverse-on-surface: #f3f0eb;

  --color-outline: #82746d;
  --color-outline-variant: #d4c3bb;

  --color-error: #ba1a1a;
  --color-on-error: #ffffff;
  --color-error-container: #ffdad6;
  --color-on-error-container: #93000a;
  --color-surface-tint: #795741;

  /* Brand Custom Colors */
  --color-wine-burgundy: #6B1D2F;
  --color-soga-bronze: #4A2E1B;
  --color-parchment-alabaster: #F2EDE4;
  --color-charcoal-noir: #1F1D1A;
  --color-silk-white: #FAF7F2;
  --color-champagne-gold: #D4AF37;
  --color-muted-taupe: #8C7D73;
  --color-samudera-blue: #244B6E;
  --color-petal-blush: #E8B4B8;
  --color-background: #fcf9f4;
  --color-on-background: #1c1c19;

  /* Typography Scales */
  --font-display: "Playfair Display", Georgia, serif;
  --font-sans: "Plus Jakarta Sans", system-ui, sans-serif;


  /* Border Radius */
  --radius-sm: 0.125rem;
  --radius-md: 0.25rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;
}

/* ============================================
   Base Reset & Body
   ============================================ */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-surface);
  color: var(--color-on-surface);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Hide scrollbar */
::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }

/* Selection color */
::selection {
  background-color: var(--color-secondary-fixed);
  color: var(--color-on-secondary-fixed);
}

/* ============================================
   Typography Classes
   ============================================ */
.font-display {
  font-family: var(--font-display);
}

.text-display-hero {
  font-family: var(--font-display);
  font-size: 56px;
  line-height: 68px;
  letter-spacing: -0.02em;
  font-weight: 400;
}

.text-display-hero-mobile {
  font-family: var(--font-display);
  font-size: 36px;
  line-height: 46px;
  letter-spacing: -0.01em;
  font-weight: 400;
}

.text-headline-lg {
  font-family: var(--font-display);
  font-size: 40px;
  line-height: 50px;
  letter-spacing: -0.01em;
  font-weight: 400;
}

.text-headline-md {
  font-family: var(--font-display);
  font-size: 28px;
  line-height: 36px;
  font-weight: 400;
}

.text-headline-sm {
  font-family: var(--font-display);
  font-size: 22px;
  line-height: 30px;
  font-weight: 500;
}

.text-headline-lg-mobile {
  font-family: var(--font-display);
  font-size: 28px;
  line-height: 36px;
  font-weight: 400;
}

.text-body-lg {
  font-family: var(--font-sans);
  font-size: 18px;
  line-height: 30px;
  font-weight: 300;
}

.text-body-md {
  font-family: var(--font-sans);
  font-size: 15px;
  line-height: 26px;
  font-weight: 400;
}

.text-body-sm {
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
}

.text-label-caps {
  font-family: var(--font-sans);
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.18em;
  font-weight: 600;
}

.text-accent-quote {
  font-family: var(--font-display);
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.01em;
  font-weight: 400;
}

/* ============================================
   Animations
   ============================================ */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-24px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(24px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.animate-fade-in-up { animation: fadeInUp 0.7s ease-out forwards; }
.animate-fade-in-left { animation: fadeInLeft 0.7s ease-out forwards; }
.animate-fade-in-right { animation: fadeInRight 0.7s ease-out forwards; }
.animate-pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
.animate-float { animation: float 4s ease-in-out infinite; }

@keyframes menuDrop {
  from { opacity: 0; transform: translateY(-6px) scale(0.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-menu-drop { animation: menuDrop 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
.delay-500 { animation-delay: 0.5s; }

/* ============================================
   Component Utilities
   ============================================ */
.section-padding {
  padding-top: 4rem;
  padding-bottom: 4rem;
}
@media (min-width: 1024px) {
  .section-padding {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }
}

.container-max {
  width: 100%;
  max-width: 1360px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

@media (min-width: 640px) {
  .container-max {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1024px) {
  .container-max {
    padding-left: 4rem;
    padding-right: 4rem;
  }
}

@media (min-width: 1280px) {
  .container-max {
    padding-left: 5rem;
    padding-right: 5rem;
  }
}

/* Gradient overlays */
.gradient-fade-bottom {
  background: linear-gradient(to bottom, transparent 60%, rgba(252,249,244,0.95) 100%);
}

/* Glass card */
.glass-card {
  background: rgba(252, 249, 244, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Gold shimmer text */
.text-shimmer {
  background: linear-gradient(90deg, #D4AF37, #f0d060, #D4AF37);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

/* Hover lift */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(49, 25, 8, 0.12);
}

/* Image zoom container */
.img-zoom-container {
  overflow: hidden;
}
.img-zoom-container img {
  transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.img-zoom-container:hover img {
  transform: scale(1.06);
}

/* Divider */
.divider-gold {
  height: 1px;
  background: linear-gradient(to right, transparent, var(--color-champagne-gold), transparent);
}
