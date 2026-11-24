import { cn } from '@/lib/utils'

export type SlideProps = {
  isActive: boolean
  onQuizAnswer?: (correct: boolean) => void
}

export function SlideFrame({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('slide-content mx-auto flex min-h-full max-w-6xl flex-col justify-center px-5 pb-28 pt-20 md:px-10', className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
      <h2 className="mt-2 text-balance font-serif text-4xl font-semibold leading-tight text-terracotta-dark md:text-5xl">
        {title}
      </h2>
      <div className="mt-3 h-1 w-16 rounded-full bg-gold" aria-hidden />
      <div className="mt-8">{children}</div>
    </div>
  )
}
