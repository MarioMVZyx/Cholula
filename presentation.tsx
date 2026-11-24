'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react'
import { CholliRobot } from './cholli-robot'
import { cn } from '@/lib/utils'
import { CoverSlide } from './slides/cover-slide'
import { IntroSlide } from './slides/intro-slide'
import { ZoneSlide } from './slides/zone-slide'
import { CholliSlide } from './slides/cholli-slide'
import { QuizSlide } from './slides/quiz-slide'
import { EthicsSlide } from './slides/ethics-slide'
import { ConclusionSlide } from './slides/conclusion-slide'

const slides = [
  { title: 'Portada', Component: CoverSlide },
  { title: 'Conociendo Cholula', Component: IntroSlide },
  { title: 'Zona Arqueológica', Component: ZoneSlide },
  { title: 'Cholli · Asistente de visita', Component: CholliSlide },
  { title: 'Reto de conocimiento', Component: QuizSlide },
  { title: 'Ética e IA', Component: EthicsSlide },
  { title: 'Conclusión', Component: ConclusionSlide },
]

type QuizFeedback = {
  mood: 'celebrate' | 'encourage'
  message: string
  revision: number
}

export function Presentation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [quizFeedback, setQuizFeedback] = useState<QuizFeedback | null>(null)

  const handleQuizAnswer = useCallback((correct: boolean) => {
    setQuizFeedback((previous) => ({
      mood: correct ? 'celebrate' : 'encourage',
      message: correct ? '¡Muy bien! Sabía que podías.' : '¡Casi, inténtalo de nuevo!',
      revision: (previous?.revision ?? 0) + 1,
    }))
  }, [])

  useEffect(() => {
    if (!quizFeedback) return
    const timeout = window.setTimeout(() => setQuizFeedback(null), 2800)
    return () => window.clearTimeout(timeout)
  }, [quizFeedback?.revision])

  const goTo = useCallback((index: number) => {
    setCurrent(Math.min(Math.max(index, 0), slides.length - 1))
  }, [])
  const next = useCallback(() => setCurrent((i) => Math.min(i + 1, slides.length - 1)), [])
  const prev = useCallback(() => setCurrent((i) => Math.max(i - 1, 0)), [])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await containerRef.current?.requestFullscreen()
      }
    } catch (error) {
      console.error('No se pudo cambiar el modo de pantalla completa:', error)
    }
  }, [])

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, video, [contenteditable="true"]')) return

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        next()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        prev()
      } else if (event.key === 'f' || event.key === 'F') {
        toggleFullscreen()
      } else if (event.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [next, prev, toggleFullscreen])

  return (
    <div
      ref={containerRef}
      className="presentation-shell relative h-dvh w-full overflow-hidden bg-sand-light text-ink"
    >
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-5">
        <p className="pointer-events-auto font-serif text-lg font-semibold tracking-wide text-terracotta-dark">
          Puebla - Cholula
        </p>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-white/80 px-4 py-2 text-sm font-medium text-terracotta-dark shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? <Minimize className="size-4" aria-hidden /> : <Maximize className="size-4" aria-hidden />}
          <span className="hidden sm:inline">{isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}</span>
          <span className="sr-only sm:hidden">{isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}</span>
        </button>
      </header>

      <main
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ transform: `translateX(-${current * 100}%)` }}
        aria-live="polite"
      >
        {slides.map(({ title, Component }, index) => (
          <section
            key={title}
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${slides.length}: ${title}`}
            aria-hidden={index !== current}
            inert={index !== current}
            className="h-full w-full shrink-0 overflow-y-auto"
          >
            <Component isActive={index === current} onQuizAnswer={handleQuizAnswer} />
          </section>
        ))}
      </main>

      <aside className="cholli-guide pointer-events-none absolute bottom-20 right-3 z-20 flex flex-col items-center gap-2 md:bottom-24 md:right-8" aria-label="Cholli, tu guía del recorrido">
        {quizFeedback && (
          <p key={quizFeedback.revision} role="status" className="cholli-guide-message max-w-48 rounded-2xl border border-cyan-200/25 bg-[#101b2a]/95 px-3 py-2 text-center text-xs font-medium text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-md">
            {quizFeedback.message}
          </p>
        )}
        <div key={`${current}-${quizFeedback?.revision ?? 0}`} className="cholli-guide-step">
          <CholliRobot mood={quizFeedback?.mood ?? 'idle'} />
        </div>
        <span className="rounded-full border border-cyan-200/20 bg-[#101b2a]/85 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-100 shadow-lg backdrop-blur-md">Cholli · tu guía</span>
      </aside>

      <nav
        aria-label="Navegación de diapositivas"
        className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-3 px-4 pb-4 md:pb-6"
      >
        <button
          type="button"
          onClick={prev}
          disabled={current === 0}
          aria-label="Diapositiva anterior"
          className="grid size-11 place-items-center rounded-full bg-terracotta text-white shadow-lg transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>

        <div className="flex items-center gap-2 rounded-full bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
          {slides.map(({ title }, index) => (
            <button
              key={title}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ir a la diapositiva ${index + 1}: ${title}`}
              aria-current={index === current ? 'step' : undefined}
              className={cn(
                'h-2 rounded-full transition-all',
                index === current ? 'w-8 bg-terracotta' : 'w-2 bg-terracotta/25 hover:bg-terracotta/50',
              )}
            />
          ))}
          <span className="ml-2 text-xs font-medium tabular-nums text-ink/70">
            {current + 1} / {slides.length}
          </span>
        </div>

        <button
          type="button"
          onClick={next}
          disabled={current === slides.length - 1}
          aria-label="Diapositiva siguiente"
          className="grid size-11 place-items-center rounded-full bg-terracotta text-white shadow-lg transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </nav>
    </div>
  )
}
