<div align="center">

# Gabriel Saint-Louis — Portfolio

**Interactive portfolio website inspired by the visual identity of Persona 3**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Live Demo](#) · [Contact](mailto:gabriel.saintlouis99@gmail.com) · [LinkedIn](https://www.linkedin.com/in/gabriel-saint-louis-68555b325) · [GitHub](https://github.com/MrMblock)

</div>

---

## Overview

A fully custom, game-inspired personal portfolio built from scratch with **React 19** and **Vite**. No UI component library was used — every interaction, animation, and layout element was designed and implemented by hand.

The visual identity draws from the **Persona 3** JRPG game series: dark tones, sharp geometric shapes with clip-path polygons, keyboard-first navigation, and orchestrated page transitions. The portfolio is itself a demonstration of its own technical depth — animation engineering, audio system design, performance optimization, and UI/UX craft all in one project.

---

## Features

### Navigation & UX
- Full **keyboard navigation** across all pages — arrow keys, Enter, Escape
- **Staggered mount animations** on page load with delay cascades
- **Clip-path polygon UI** for angled, game-inspired layout elements
- **Desktop-only** experience with graceful mobile block overlay

### Page Transitions
- Per-route **custom transition animations** — each section has its own motion signature
- Orchestrated with **Framer Motion** `AnimatePresence` and multi-panel staggering
- Transition styles: sliding panels, diagonal sweeps, vertical curtains, horizontal slabs

### Audio System
- **Background music** with smooth fade-in on first interaction (Web Audio API autoplay policy compliant)
- **Sound effects** (click, select, navigation) synthesized via Web Audio API — no external SFX library
- **Volume control** with hover-reveal slider
- **BGM / SFX toggle** buttons with state persisted to `localStorage`
- Fade-in / fade-out transitions on music play/stop

### Video Background
- Full-screen **looping video background**
- Each route uses a **distinct time range** of the same video file — visual variety at zero extra network cost
- Instant clip switch on navigation with no stutter or reload

### Pages

| Route | Description |
|---|---|
| `/` | Main menu — Persona 3-style animated navigation with name tag |
| `/about` | About me — three reveal panels with portrait images and personal intro |
| `/resume` | Interactive CV — Education, Skills, Projects, Experience in card layout |
| `/projects` | Featured projects with tech stacks and live links |
| `/socials` | Social links page with animated avatar display |

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19 |
| Build tool | Vite | 8 |
| Routing | React Router DOM | 7 |
| Animations | Framer Motion | 12 |
| Audio | Web Audio API | native |
| Styling | Vanilla CSS | — |
| Fonts | Anton, Bebas Neue, Montserrat | Google Fonts |
| Linting | ESLint | 9 |
| Deployment | Vercel | — |

---

## Architecture & Key Decisions

### Performance
- **Route-level code splitting** via `React.lazy()` — each page is its own JS chunk, loaded on first visit only
- **Manual chunk splitting** in Vite config for vendor libraries (framer-motion, react-router, react/react-dom)
- **Single persistent video element** at app root — no re-mount on navigation, just a `currentTime` seek
- Single `<audio>` element for BGM reused across all routes with fade logic

### Why no CSS framework?
The design language — polygon clip-paths, precise skew transforms, animated glow effects — requires pixel-level control over geometry. Utility-class frameworks would add overhead with no benefit here. Raw CSS is more expressive for this use case.

### Why a single video element at app root?
Mounting a `<video>` inside a route component would cause it to unmount and remount on every navigation, triggering a network reload. By keeping it at root and only seeking `currentTime`, we get instant visual transitions with zero extra network cost.

---

## Project Structure

```
portfolio/
├── public/
│   └── audio/              # BGM and SFX files
├── src/
│   ├── assets/             # Images and video
│   ├── utils/
│   │   ├── audio.js        # Web Audio API engine
│   │   └── supabase.js     # Supabase client
│   ├── App.jsx             # Root: routing, global video, BGM, SFX
│   ├── App.css             # Global styles
│   ├── P3Menu.jsx          # Main menu with keyboard navigation
│   ├── AboutMe.jsx         # About page
│   ├── ResumePage.jsx      # CV / Resume
│   ├── SideProjects.jsx    # Projects showcase
│   ├── Socials.jsx         # Social links
│   ├── PageTransition.jsx  # Per-route transition variants
│   └── main.jsx            # React entry point
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Assets

Video and audio assets are not versioned in this repository due to file size.
Download them from the shared drive and place them in the correct directories:

> [Download assets (Google Drive)](https://drive.google.com/drive/folders/1_dVxHVTJO_YtMAo9ia7wnja1XY0nImr5?usp=drive_link)

| Asset | Destination |
|---|---|
| `oneshot.mp4` (video background) | `src/assets/` |
| `background.mp3` (BGM) | `public/audio/` |
| `select.mp3`, `clic/` (SFX) | `public/audio/` |

### Installation

```bash
git clone https://github.com/MrMblock/portfolio.git
cd portfolio
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

### Environment Variables

Create a `.env` file at the root (optional — required only if Supabase features are used):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Featured Projects

| Project | Stack | Description |
|---|---|---|
| **LespagesAfroCarib** | Next.js, Node.js | Online directory platform for Afro-Caribbean businesses |
| **HAIKEN** | React Native, Symfony | Mobile app for tracking and organizing job applications |
| **David Abitbol** | React, React Native, Node.js | Website & mobile app with online reservation system for a tea salon |
| **Black Beauty** | Vite, GSAP | E-commerce website for a clothing brand with scroll-driven animations |

---

## About

**Gabriel Saint-Louis** — Frontend developer, 20 years old, based in France.

Currently in work-study at **Axone Conseils** (payroll management software) and freelancing at **Ambriel**, a mobile & web development studio. Pursuing a Master's in Computer Science & Project Management.

**Core skills:** React / Vite · JavaScript / TypeScript · CSS & Animation · Python · UI/UX Design

| Platform | Link |
|---|---|
| GitHub | [github.com/MrMblock](https://github.com/MrMblock) |
| LinkedIn | [gabriel-saint-louis-68555b325](https://www.linkedin.com/in/gabriel-saint-louis-68555b325) |
| Email | gabriel.saintlouis99@gmail.com |

---

## License

MIT — see [LICENSE](LICENSE) for details.
