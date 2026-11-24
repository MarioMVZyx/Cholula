import { cn } from '@/lib/utils'

type CholliRobotProps = {
  size?: 'compact' | 'full'
  mood?: 'idle' | 'celebrate' | 'encourage'
  className?: string
}

export function CholliRobot({ size = 'full', mood = 'idle', className }: CholliRobotProps) {
  return (
    <div className={cn('cholli-character', `cholli-character--${size}`, `cholli-character--${mood}`, className)} aria-hidden="true">
      <span className="cholli-antenna"><span className="cholli-antenna-light" /></span>
      <span className="cholli-head">
        <span className="cholli-ear cholli-ear--left" />
        <span className="cholli-ear cholli-ear--right" />
        <span className="cholli-face">
          <span className="cholli-eye cholli-eye--left" />
          <span className="cholli-eye cholli-eye--right" />
          <span className="cholli-mouth" />
        </span>
      </span>
      <span className="cholli-neck" />
      <span className="cholli-arm cholli-arm--left"><span /></span>
      <span className="cholli-arm cholli-arm--right"><span /></span>
      <span className="cholli-torso">
        <span className="cholli-core"><i /><i /><i /></span>
        <span className="cholli-torso-line" />
      </span>
      <span className="cholli-leg cholli-leg--left"><span /></span>
      <span className="cholli-leg cholli-leg--right"><span /></span>
      <span className="cholli-hover-glow" />
    </div>
  )
}
