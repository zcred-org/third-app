import { type ComponentPropsWithoutRef, type ElementType, type ReactNode, forwardRef, type ForwardedRef } from 'react';
import { Spinner, type ApproximateSpinProps } from '@/compontents/ui/Spinner/Spinner';
import { cn } from '@/utils/cn';


type BaseButtonProps = {
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  isGlass?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isBlur?: boolean;
} & Pick<ApproximateSpinProps, 'isApproximate'>;

export type ButtonProps<Element extends ElementType = 'button'> = BaseButtonProps
  & Omit<ComponentPropsWithoutRef<Element>, keyof BaseButtonProps>
  & { as?: Element }

export const Button = forwardRef((props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  const {
    size,
    icon: _icon,
    isGlass, isBlur: _isBlur,
    isLoading, isApproximate, isDisabled,
    children, className, onClick,
    as: Component = 'button',
    ...buttonProps
  } = props;

  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const isMd = !isSm && !isLg;

  const isClickable = !isDisabled && !isLoading;
  const isBlur = isGlass && _isBlur !== false;

  const icon = isLoading
    ? <Spinner className={cn({
      'size-5': isSm || isMd,
      'size-6 mr-1': isLg,
    })} isApproximate={isApproximate} />
    : _icon;

  return (
    <Component
      ref={ref}
      className={cn(
        'relative flex gap-2 items-center justify-center cursor-pointer',
        'before:absolute before:invisible before:inset-0 before:bg-[url(/images/disabled_shading.png)] before:bg-repeat before:[background-size:7px_7px] before:opacity-15 before:invert',
        'after:absolute after:bg-transparent after:inset-0 after:transition-all after:duration-100 after:ease-in-out',
        isGlass
          ? 'bg-white/20 text-white border border-white/15'.concat(isBlur ? ' backdrop-blur-lg' : '')
          : 'bg-white text-black',
        {
          'hover:after:bg-white/10 active:after:bg-black/5': isClickable,
          'px-[8px] py-[3px] rounded-md after:rounded-md before:rounded-md': isSm,
          'px-[12px] py-[4px] rounded-md after:rounded-md before:rounded-md': isMd,
          'px-16 py-3 text-lg rounded-xl after:rounded-xl before:rounded-xl': isLg,
          'before:visible cursor-not-allowed text-gray-500': isDisabled,
          'animate-pulse cursor-progress': isLoading,
        },
        isDisabled && (isGlass ? 'before:invert-0 text-white/30' : 'before:opacity-5 bg-gray-200'),
        className,
      )}
      onClick={isClickable ? onClick : undefined}
      {...buttonProps}
    >
      {icon}
      {children}
    </Component>
  );
}) as <Component extends ElementType = 'button'>(props: ButtonProps<Component> & { ref?: unknown }) => ReactNode;
