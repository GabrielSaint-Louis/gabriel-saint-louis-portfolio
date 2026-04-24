/* Portfolio - Gabriel Saint-Louis */
import { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import oneshotVideo from './assets/oneshot.mp4'
import P3Menu from './P3Menu'
import PageTransition from './PageTransition'
import { isSfxEnabled, setSfxEnabled } from './utils/audio.js'
import './App.css'

// Route-level code splitting — each page loads only when first visited
const ResumePage    = lazy(() => import('./ResumePage'))
const Socials       = lazy(() => import('./Socials'))
const AboutMe       = lazy(() => import('./AboutMe'))
const SideProjects  = lazy(() => import('./SideProjects'))

const BGM_STATE_KEY = 'p3-bgm-enabled'
const BGM_VOLUME_KEY = 'p3-bgm-volume'
const DEFAULT_VOLUME = 0.05
const FADE_MS = 450

function Loader({ visible }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#000',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 24,
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'all' : 'none',
      transition: 'opacity 0.6s ease',
    }}>
      <style>{`
        @keyframes p3-spin { to { transform: rotate(360deg); } }
        @keyframes p3-pulse { 0%,100% { opacity:0.2; transform:scaleX(0.7); } 50% { opacity:1; transform:scaleX(1); } }
        .p3-loader-ring {
          width: 72px; height: 72px;
          border: 3px solid rgba(219,52,0,0.18);
          border-top-color: #db3400;
          border-right-color: #f27638;
          border-radius: 50%;
          animation: p3-spin 0.9s linear infinite;
        }
        .p3-loader-text {
          font-family: 'Anton', sans-serif;
          font-size: 22px;
          letter-spacing: 6px;
          color: rgba(255,255,255,0.35);
        }
        .p3-loader-bar {
          width: 120px; height: 2px;
          background: rgba(219,52,0,0.18);
          clip-path: polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
          overflow: hidden;
          position: relative;
        }
        .p3-loader-bar::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, #db3400, #f27638);
          animation: p3-pulse 1.2s ease-in-out infinite;
          transform-origin: left;
        }
      `}</style>
      <div className="p3-loader-ring" />
      <div className="p3-loader-text">LOADING</div>
      <div className="p3-loader-bar" />
    </div>
  )
}

const TRACK_DEFAULT = '/audio/background.mp3'

function BackgroundMusic() {
  const audioRef = useRef(null)
  const fadeRafRef = useRef(null)
  const autoStartRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(() => {
    const saved = Number(localStorage.getItem(BGM_VOLUME_KEY))
    if (Number.isFinite(saved) && saved > 0) return Math.min(1, saved)
    return DEFAULT_VOLUME
  })

  const targetTrack = TRACK_DEFAULT
  const activeTrackRef = useRef(targetTrack)
  const isPlayingRef   = useRef(false)
  const volumeRef      = useRef(volume)

  useEffect(() => { isPlayingRef.current = isPlaying }, [isPlaying])
  useEffect(() => { volumeRef.current = volume }, [volume])

  const stopFade = () => {
    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }
  }

  const fadeTo = (target, done) => {
    const audio = audioRef.current
    if (!audio) return
    stopFade()
    const start = audio.volume
    const diff = target - start
    const begin = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - begin) / FADE_MS)
      audio.volume = start + diff * p
      if (p < 1) { fadeRafRef.current = requestAnimationFrame(tick); return }
      fadeRafRef.current = null
      if (done) done()
    }
    fadeRafRef.current = requestAnimationFrame(tick)
  }

  const startMusic = async () => {
    const audio = audioRef.current
    if (!audio) return
    stopFade()
    audio.volume = 0
    try {
      await audio.play()
      fadeTo(volume)
      setIsPlaying(true)
      autoStartRef.current = false
    } catch {
      setIsPlaying(false)
    }
  }

  const stopMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    fadeTo(0, () => { audio.pause(); audio.currentTime = 0; setIsPlaying(false) })
  }

  const toggleMusic = async () => {
    if (isPlaying) { stopMusic(); return }
    await startMusic()
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) audio.volume = volume
    localStorage.setItem(BGM_VOLUME_KEY, String(volume))
  }, [volume, isPlaying])

  useEffect(() => {
    localStorage.setItem(BGM_STATE_KEY, isPlaying ? '1' : '0')
  }, [isPlaying])

  useEffect(() => {
    const unlock = async () => { await startMusic() }
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  useEffect(() => () => stopFade(), [])

  // ── Track switch (crossfade) ─────────────────────────────────────────────
  useEffect(() => {
    if (targetTrack === activeTrackRef.current) return
    activeTrackRef.current = targetTrack

    const audio = audioRef.current
    if (!audio) return

    if (!isPlayingRef.current) {
      audio.src = targetTrack
      audio.load()
      return
    }

    fadeTo(0, () => {
      const a = audioRef.current
      if (!a) return
      a.src = targetTrack
      a.load()
      a.currentTime = 0
      a.play()
        .then(() => fadeTo(volumeRef.current))
        .catch(() => {})
    })
  }, [targetTrack]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bgm-panel">
      <audio ref={audioRef} loop preload="auto" src={targetTrack} />
      <button
        className={`bgm-toggle${isPlaying ? ' on' : ''}`}
        type="button"
        onClick={(e) => { toggleMusic(); e.currentTarget.blur() }}
        aria-label={isPlaying ? 'Disable background music' : 'Enable background music'}
      >
        {isPlaying ? 'BGM ON' : 'BGM OFF'}
      </button>
      <div className="bgm-slider-wrap" aria-label="Background music volume">
        <span className="bgm-slider-label">VOL</span>
        <input
          className="bgm-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          onKeyDown={(e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault()
          }}
        />
        <span className="bgm-slider-value">{Math.round(volume * 100)}</span>
      </div>
    </div>
  )
}

function SfxToggle() {
  const [enabled, setEnabled] = useState(() => isSfxEnabled())

  const toggle = useCallback(() => {
    setEnabled(prev => {
      const next = !prev
      setSfxEnabled(next)
      return next
    })
  }, [])

  return (
    <div className="sfx-panel">
      <button
        className={`bgm-toggle${enabled ? ' on' : ''}`}
        type="button"
        onClick={(e) => { toggle(); e.currentTarget.blur() }}
        aria-label={enabled ? 'Disable sound effects' : 'Enable sound effects'}
      >
        {enabled ? 'SFX ON' : 'SFX OFF'}
      </button>
    </div>
  )
}

function MenuScreen() {
  const navigate = useNavigate()
  return (
    <div id="menu-screen">
      <P3Menu onNavigate={(page) => {
        if (page === 'github') { window.open('https://github.com/GabrielSaint-Louis', '_blank'); return; }
        navigate(`/${page}`);
      }} />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageTransition><MenuScreen /></PageTransition>
          } />
          <Route path="/about" element={
            <PageTransition variant="about"><AboutMe /></PageTransition>
          } />
          <Route path="/resume" element={
            <PageTransition><ResumePage /></PageTransition>
          } />
          <Route path="/socials" element={
            <PageTransition variant="socials"><Socials /></PageTransition>
          } />
          <Route path="/sideproj" element={
            <PageTransition variant="sideproj"><SideProjects /></PageTransition>
          } />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

const ROUTE_CLIPS = {
  '/':         [67, 84],
  '/about':    [10, 19],
  '/resume':   [20, 29],
  '/socials':  [40, 54],
  '/sideproj': [55, 67],
}

function GlobalVideo({ onReady }) {
  const videoRef = useRef(null)
  const location = useLocation()
  const clipRef = useRef(ROUTE_CLIPS[location.pathname] ?? ROUTE_CLIPS['/'])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const onCanPlay = () => {
      v.currentTime = clipRef.current[0]
      onReady?.()
    }
    v.addEventListener('canplay', onCanPlay, { once: true })

    const onTimeUpdate = () => {
      const [start, end] = clipRef.current
      if (v.currentTime >= end) v.currentTime = start
    }
    v.addEventListener('timeupdate', onTimeUpdate)

    return () => {
      v.removeEventListener('canplay', onCanPlay)
      v.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [])

  useEffect(() => {
    const clip = ROUTE_CLIPS[location.pathname] ?? ROUTE_CLIPS['/']
    clipRef.current = clip
    const v = videoRef.current
    if (!v) return
    v.currentTime = clip[0]
    v.play().catch(() => {})
  }, [location.pathname])

  return (
    <video
      ref={videoRef}
      src={oneshotVideo}
      autoPlay
      muted
      playsInline
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const markReady = useCallback(() => setReady(true), [])

  // Fallback: show UI after 3s even if video hasn't fired canplay yet
  useEffect(() => {
    const t = setTimeout(markReady, 3000)
    return () => clearTimeout(t)
  }, [markReady])

  return (
    <>
      <div className="mobile-block">
        <div className="mobile-block-bar" />
        <div className="mobile-block-title">DESKTOP ONLY</div>
        <div className="mobile-block-sub">PLEASE VISIT ON A LARGER SCREEN</div>
        <div className="mobile-block-bar" />
      </div>
      <Loader visible={!ready} />
      <GlobalVideo onReady={markReady} />
      <AnimatedRoutes />
      <div className="bottom-panels">
        <BackgroundMusic />
        <SfxToggle />
      </div>
    </>
  )
}
