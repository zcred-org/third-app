import type { ComponentProps } from 'react';
import { type UsePercentArgs, useApproximatePercent } from '@/compontents/ui/Spinner/useApproximatePercent.ts';
import { cn } from '@/utils/cn.ts';


export type ApproximateSpinProps = UsePercentArgs & ComponentProps<'svg'> & {
  isApproximate?: boolean,
};

export function Spinner({ isSlow, className, isApproximate, ...props }: ApproximateSpinProps) {
  const _percent = useApproximatePercent({ isSlow, isDisabled: !isApproximate });
  const percent = isApproximate ? _percent : 30;

  const circleRadius = 14;
  const circumference = 2 * Math.PI * circleRadius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      strokeWidth="3"
      className={cn('relative overflow-hidden w-6 h-6 animate-spin', className)}
      {...props}
    >
      <circle
        cx="16"
        cy="16"
        r={circleRadius}
        role="presentation"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 16 16)"
        strokeLinecap="round"
        className="h-full stroke-current transition-all duration-500"
      />
    </svg>
  );
}
