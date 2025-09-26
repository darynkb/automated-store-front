import React from 'react';
import { clsx } from 'clsx';

// Container component with responsive padding and max-width
export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'lg',
  padding = 'md',
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
  };

  return (
    <div
      className={clsx(
        'mx-auto w-full',
        sizeClasses[size],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

// Grid component with responsive columns
export interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
}) => {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const colClasses = Object.entries(cols)
    .map(([breakpoint, colCount]) => {
      if (breakpoint === 'xs') return `grid-cols-${colCount}`;
      return `${breakpoint}:grid-cols-${colCount}`;
    })
    .join(' ');

  return (
    <div className={clsx('grid', colClasses, gapClasses[gap], className)}>
      {children}
    </div>
  );
};

// Stack component for vertical layouts
export interface StackProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export const Stack: React.FC<StackProps> = ({
  children,
  className,
  spacing = 'md',
  align = 'stretch',
}) => {
  const spacingClasses = {
    none: 'space-y-0',
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <div
      className={clsx(
        'flex flex-col',
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
};

// Flex component for horizontal layouts
export interface FlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Flex: React.FC<FlexProps> = ({
  children,
  className,
  direction = 'row',
  wrap = false,
  justify = 'start',
  align = 'center',
  gap = 'none',
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const gapClasses = {
    none: '',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      className={clsx(
        'flex',
        directionClasses[direction],
        wrap && 'flex-wrap',
        justifyClasses[justify],
        alignClasses[align],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

// Show/Hide components based on breakpoints
export const ShowOn: React.FC<{
  children: React.ReactNode;
  breakpoint: 'mobile' | 'desktop' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ children, breakpoint, className }) => {
  const breakpointClasses = {
    mobile: 'block desktop:hidden',
    desktop: 'hidden desktop:block',
    sm: 'hidden sm:block',
    md: 'hidden md:block',
    lg: 'hidden lg:block',
    xl: 'hidden xl:block',
  };

  return (
    <div className={clsx(breakpointClasses[breakpoint], className)}>
      {children}
    </div>
  );
};

export const HideOn: React.FC<{
  children: React.ReactNode;
  breakpoint: 'mobile' | 'desktop' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ children, breakpoint, className }) => {
  const breakpointClasses = {
    mobile: 'hidden desktop:block',
    desktop: 'block desktop:hidden',
    sm: 'block sm:hidden',
    md: 'block md:hidden',
    lg: 'block lg:hidden',
    xl: 'block xl:hidden',
  };

  return (
    <div className={clsx(breakpointClasses[breakpoint], className)}>
      {children}
    </div>
  );
};

// Responsive text component
export const ResponsiveText: React.FC<{
  children: React.ReactNode;
  className?: string;
  size?: {
    mobile?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    desktop?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  };
}> = ({ children, className, size = { mobile: 'base', desktop: 'lg' } }) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
  };

  const mobileClass = size.mobile ? sizeClasses[size.mobile] : '';
  const desktopClass = size.desktop ? `desktop:${sizeClasses[size.desktop]}` : '';

  return (
    <div className={clsx(mobileClass, desktopClass, className)}>
      {children}
    </div>
  );
};