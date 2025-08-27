# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a React + TypeScript personal website built with Vite. Use pnpm as the package manager.

### Core Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs TypeScript compilation + Vite build)
- `pnpm lint` - Run ESLint with TypeScript rules
- `pnpm preview` - Preview production build locally
- `pnpm deploy` - Deploy to GitHub Pages (runs build first)
- `pnpm convert-to-webp` - Convert images to WebP format using Sharp

### Code Quality
- Uses ESLint with `@rightcapital/eslint-config-typescript-react` configuration
- Prettier formatting with `@rightcapital/prettier-config`
- PostCSS with nesting support
- TypeScript strict mode enabled

## Architecture

This is a single-page personal website with a scroll-based storytelling design. The site renders multiple story sections in sequence, each with fixed positioning and scroll-triggered animations.

### Core Structure
- **Entry point**: `src/main.tsx` renders all sections in order
- **Sections**: Story components in `src/sections/` following a specific template pattern
- **Scroll system**: Custom `useScrollSection` hook manages section positioning and scroll progress
- **Progress indicator**: Timeline-style navigation component with clickable segments

### Section Architecture
Each story section follows a standardized structure defined in `src/sections/section.md`:

```
StorySectionExample/
├── story-section-example.component.tsx  # React component
└── story-section-example.module.css     # CSS modules
```

All sections use:
- `useScrollSection` hook for scroll-based positioning and animations
- Motion/react for animations and transitions
- Three-layer visual structure: typography, sprite, and background layers
- Fixed positioning during scroll with 400vh wrapper height
- CSS modules for styling

### Key Components
- **ProgressIndicator**: Timeline navigation with scroll progress tracking
- **Story Sections**: Individual sections (AI, Basic, Family, Hobbies, Hometown, Startups, TurboC, WorkExperience)
- **Tetris Component**: Interactive game component
- **Logo Component**: Site branding

### Scroll System
The `useScrollSection` hook provides:
- `scrollYProgress` - normalized scroll progress (0-1) within section wrapper
- `isSectionFixed` - boolean for fixed positioning state
- `isInView` - viewport visibility detection
- Dynamic positioning between fixed and absolute based on scroll position

### Styling Patterns
- CSS modules for component-specific styles
- PostCSS nesting for hierarchical CSS
- Global styles in `src/styles/`
- Asset optimization with WebP images
- Mobile-responsive design patterns

### Dependencies
- **React 18** with TypeScript
- **Motion** (motion/react) for animations
- **@uidotdev/usehooks** for utility hooks
- **react-hot-toast** for notifications
- **react-tooltip** for tooltips
- **sakana-widget-react** for interactive widgets

When creating new sections, follow the template in `src/sections/section.md` for consistent structure and behavior.