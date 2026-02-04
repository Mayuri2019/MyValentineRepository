"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"

export default function ValentinePage() {
  const [showLoveScreen, setShowLoveScreen] = useState(false)
  const [hearts, setHearts] = useState<Array<{ id: number; left: string; size: string; delay: string; duration: string }>>([])
  const [noButtonPosition, setNoButtonPosition] = useState<{ x: number; y: number } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate floating hearts
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 16 + 12}px`,
        delay: `${Math.random() * 2}s`,
        duration: `${Math.random() * 4 + 6}s`,
      }
      setHearts((prev) => [...prev.slice(-15), newHeart])
    }, 800)

    return () => clearInterval(interval)
  }, [])

  const playBoingSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }
      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(600, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15)
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.25)
      oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.35)
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.35)
    } catch {
      // Silently fail if audio context not supported
    }
  }

  const moveNoButton = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    playBoingSound()
    const padding = 60
    const buttonWidth = 120
    const buttonHeight = 60
    const maxX = window.innerWidth - buttonWidth - padding
    const maxY = window.innerHeight - buttonHeight - padding
    const x = Math.max(padding, Math.min(maxX, Math.random() * maxX))
    const y = Math.max(padding, Math.min(maxY, Math.random() * maxY))
    setNoButtonPosition({ x, y })
  }

  const playMusic = async () => {
    console.log("[v0] playMusic called, audioRef:", audioRef.current)
    if (audioRef.current) {
      try {
        audioRef.current.volume = 0.5
        audioRef.current.currentTime = 0
        console.log("[v0] Attempting to play audio...")
        await audioRef.current.play()
        console.log("[v0] Audio playing successfully")
        setIsPlaying(true)
      } catch (error) {
        console.log("[v0] Audio play error:", error)
      }
    }
  }

  const toggleMusic = async () => {
    console.log("[v0] toggleMusic called, isPlaying:", isPlaying, "audioRef:", audioRef.current)
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        console.log("[v0] Audio paused")
      } else {
        try {
          audioRef.current.volume = 0.5
          console.log("[v0] Attempting to play audio from toggle...")
          await audioRef.current.play()
          console.log("[v0] Audio playing from toggle")
          setIsPlaying(true)
        } catch (error) {
          console.log("[v0] Toggle audio error:", error)
        }
      }
    }
  }

  const handleYes = async () => {
    setShowLoveScreen(true)
    await playMusic()
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-rose-200">
      {/* Ambient background layers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-br from-rose-200/40 to-transparent blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/4 h-3/4 w-3/4 rounded-full bg-gradient-to-tl from-pink-200/50 to-transparent blur-3xl" />
        <div className="absolute top-1/4 left-1/2 h-1/2 w-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b from-rose-100/30 to-transparent blur-2xl" />
      </div>

      {/* Floating hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="absolute animate-float-up text-rose-300/60"
            style={{
              left: heart.left,
              fontSize: heart.size,
              animationDelay: heart.delay,
              animationDuration: heart.duration,
              bottom: "-20px",
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        {/* Valentine Card */}
        <div
          ref={cardRef}
          className={`w-full max-w-sm transition-all duration-700 ease-out ${
            showLoveScreen ? "pointer-events-none scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <div className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-8 shadow-2xl shadow-rose-200/50 backdrop-blur-xl transition-all duration-500 hover:shadow-rose-300/60 md:p-10">
            {/* Card shimmer effect */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-rose-100/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            {/* Decorative corner accents */}
            <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-gradient-to-br from-rose-200/40 to-transparent blur-xl" />
            <div className="absolute -bottom-2 -left-2 h-16 w-16 rounded-full bg-gradient-to-tl from-pink-200/40 to-transparent blur-xl" />

            <div className="relative text-center">
              <div className="mb-2 text-4xl">💖</div>
              <h1 className="mb-6 bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-2xl font-semibold tracking-tight text-transparent md:text-3xl">
                Will you be my Valentine?
              </h1>

              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <button
                  onClick={handleYes}
                  className="group/btn relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 px-8 py-3.5 text-lg font-medium text-white shadow-lg shadow-rose-300/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-rose-400/50 active:scale-100 sm:w-auto"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Yes <span className="transition-transform duration-300 group-hover/btn:scale-125">😍</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                </button>

                {!noButtonPosition && (
                  <button
                    onMouseEnter={moveNoButton}
                    onTouchStart={moveNoButton}
                    className="w-full rounded-2xl border-2 border-rose-200 bg-white/80 px-8 py-3.5 text-lg font-medium text-rose-400 shadow-md transition-all duration-300 hover:border-rose-300 hover:bg-rose-50 sm:w-auto"
                  >
                    No <span>🙈</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Love Screen */}
        <div
          className={`absolute inset-0 overflow-y-auto transition-all duration-700 ${
            showLoveScreen ? "scale-100 opacity-100" : "pointer-events-none scale-110 opacity-0"
          }`}
        >
          {/* Desktop Layout - Side by side */}
          <div className="hidden min-h-screen items-center justify-center gap-8 p-6 lg:flex lg:gap-12 xl:gap-16">
            {/* Left side - Text content */}
            <div className="flex max-w-md flex-col items-center text-center lg:items-start lg:text-left">
              <div className="mb-4 animate-bounce text-5xl md:text-6xl">💕</div>
              <h1 className="mb-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-6xl">
                YAY!!!
              </h1>
              <p className="text-base leading-relaxed text-rose-700/80 md:text-lg lg:text-xl">
                From today, you&apos;re officially my Valentine
              </p>
              <p className="mt-4 text-base leading-relaxed text-rose-600/70 md:text-lg">
                Thank you for making my life brighter, happier, and full of love.
                I can&apos;t wait to create many more memories with you
              </p>
              
              {/* Music control button - Desktop */}
              <button
                onClick={toggleMusic}
                className="mt-8 flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-6 py-3 text-rose-500 shadow-lg transition-all duration-300 hover:bg-rose-50 hover:shadow-xl"
              >
                {isPlaying ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    <span className="font-medium">Pause Music</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span className="font-medium">Play Music</span>
                  </>
                )}
              </button>
            </div>

            {/* Right side - GIF */}
            <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-4 shadow-2xl shadow-rose-200/40 backdrop-blur-sm">
              <img 
                src="/images/hug.gif"
                alt="Cute couple hugging"
                className="h-80 w-auto rounded-2xl object-contain lg:h-96 xl:h-[28rem]"
              />
            </div>
          </div>

          {/* Mobile Layout - Stacked with scroll */}
          <div className="flex min-h-screen flex-col items-center justify-start px-4 py-8 lg:hidden">
            <div className="text-center">
              <div className="mb-3 animate-bounce text-4xl sm:text-5xl">💕</div>
              <h1 className="mb-3 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                YAY!!!
              </h1>
              <p className="mx-auto max-w-xs text-sm leading-relaxed text-rose-700/80 sm:max-w-sm sm:text-base">
                From today, you&apos;re officially my Valentine
              </p>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-rose-600/70 sm:max-w-sm sm:text-base">
                Thank you for making my life brighter, happier, and full of love.
                I can&apos;t wait to create many more memories with you
              </p>
            </div>

            {/* GIF - Mobile */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-2 shadow-2xl shadow-rose-200/40 backdrop-blur-sm sm:p-3">
              <img 
                src="/images/hug.gif"
                alt="Cute couple hugging"
                className="w-full max-w-[280px] rounded-xl object-contain sm:max-w-xs"
              />
            </div>

            {/* Music control button - Mobile */}
            <button
              onClick={toggleMusic}
              className="mt-5 mb-8 flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-5 py-2.5 text-sm text-rose-500 shadow-lg transition-all duration-300 hover:bg-rose-50 hover:shadow-xl sm:px-6 sm:py-3 sm:text-base"
            >
              {isPlaying ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span className="font-medium">Pause Music</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span className="font-medium">Play Music</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Floating No button that escapes */}
      {noButtonPosition && !showLoveScreen && (
        <button
          onMouseEnter={moveNoButton}
          onTouchStart={moveNoButton}
          onClick={moveNoButton}
          className="fixed rounded-2xl border-2 border-rose-200 bg-white/90 px-8 py-3.5 text-lg font-medium text-rose-400 shadow-lg transition-all duration-300 hover:border-rose-300 hover:bg-rose-50"
          style={{
            left: noButtonPosition.x,
            top: noButtonPosition.y,
            zIndex: 50,
          }}
        >
          No <span>🙈</span>
        </button>
      )}

      {/* Background music */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        onLoadedData={() => console.log("[v0] Audio loaded successfully")}
        onError={(e) => console.log("[v0] Audio error:", e)}
      >
        <source src="/images/romantic.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>



      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg) scale(0.5);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up linear forwards;
        }
        
        @keyframes hug-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }
        .animate-hug-pulse {
          animation: hug-pulse 2s ease-in-out infinite;
          display: flex;
          align-items: flex-end;
        }
        
        @keyframes lean-right {
          0%, 100% {
            transform: rotate(0deg) translateX(0);
          }
          50% {
            transform: rotate(3deg) translateX(3px);
          }
        }
        .animate-lean-right {
          animation: lean-right 2s ease-in-out infinite;
          transform-origin: bottom center;
        }
        
        @keyframes lean-left {
          0%, 100% {
            transform: rotate(0deg) translateX(0);
          }
          50% {
            transform: rotate(-3deg) translateX(-3px);
          }
        }
        .animate-lean-left {
          animation: lean-left 2s ease-in-out infinite;
          transform-origin: bottom center;
        }
        
        @keyframes float-heart {
          0%, 100% {
            transform: translateX(-50%) translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateX(-50%) translateY(-8px) scale(1.1);
            opacity: 0.8;
          }
        }
        .animate-float-heart {
          animation: float-heart 1.5s ease-in-out infinite;
        }
        
        @keyframes float-mini-heart {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-6px) scale(1.15);
            opacity: 1;
          }
        }
        .animate-float-mini-heart {
          animation: float-mini-heart 2s ease-in-out infinite;
        }
        .animate-float-mini-heart-delay {
          animation: float-mini-heart 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  )
}
