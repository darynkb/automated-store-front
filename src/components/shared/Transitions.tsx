import React from 'react';
import { clsx } from 'clsx';

// Fade transition component
export interface FadeProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  duration?: 'fast' | 'normal' | 'slow';
  appear?: boolean;
}

export const Fade: React.FC<FadeProps> = ({
  show,
  children,
  className,
  duration = 'normal',
  appear = true,
}) => {
  const [shouldRender, setShouldRender] = React.useState(show);
  const [isVisible, setIsVisible] = React.useState(show && appear);

  React.useEffect(() => {
    if (show) {
      setShouldRender(true);
      // Small delay to ensure the element is rendered before animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!shouldRender) return null;

  const durationClasses = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
  };

  return (
    <div
      className={clsx(
        'transition-opacity',
        durationClasses[duration],
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
};

// Slide transition component
export interface SlideProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: 'fast' | 'normal' | 'slow';
}

export const Slide: React.FC<SlideProps> = ({
  show,
  children,
  className,
  direction = 'up',
  duration = 'normal',
}) => {
  const [shouldRender, setShouldRender] = React.useState(show);
  const [isVisible, setIsVisible] = React.useState(show);

  React.useEffect(() => {
    if (show) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!shouldRender) return null;

  const durationClasses = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
  };

  const transformClasses = {
    up: isVisible ? 'translate-y-0' : 'translate-y-full',
    down: isVisible ? 'translate-y-0' : '-translate-y-full',
    left: isVisible ? 'translate-x-0' : 'translate-x-full',
    right: isVisible ? 'translate-x-0' : '-translate-x-full',
  };

  return (
    <div
      className={clsx(
        'transition-all',
        durationClasses[duration],
        transformClasses[direction],
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
};

// Scale transition component
export interface ScaleProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  duration?: 'fast' | 'normal' | 'slow';
}

export const Scale: React.FC<ScaleProps> = ({
  show,
  children,
  className,
  duration = 'normal',
}) => {
  const [shouldRender, setShouldRender] = React.useState(show);
  const [isVisible, setIsVisible] = React.useState(show);

  React.useEffect(() => {
    if (show) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!shouldRender) return null;

  const durationClasses = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
  };

  return (
    <div
      className={clsx(
        'transition-all',
        durationClasses[duration],
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
};

// Stagger animation for lists
export interface StaggerProps {
  children: React.ReactNode[];
  className?: string;
  delay?: number;
  show?: boolean;
}

export const Stagger: React.FC<StaggerProps> = ({
  children,
  className,
  delay = 100,
  show = true,
}) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className="animate-fade-in"
          style={{
            animationDelay: show ? `${index * delay}ms` : '0ms',
            animationFillMode: 'both',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Pulse animation component
export const Pulse: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'normal' | 'strong';
}> = ({ children, className, intensity = 'normal' }) => {
  const intensityClasses = {
    light: 'animate-pulse opacity-75',
    normal: 'animate-pulse-slow',
    strong: 'animate-pulse',
  };

  return (
    <div className={clsx(intensityClasses[intensity], className)}>
      {children}
    </div>
  );
};

// Bounce animation component
export const Bounce: React.FC<{
  children: React.ReactNode;
  className?: string;
  trigger?: boolean;
}> = ({ children, className, trigger = true }) => {
  return (
    <div className={clsx(trigger && 'animate-bounce', className)}>
      {children}
    </div>
  );
};