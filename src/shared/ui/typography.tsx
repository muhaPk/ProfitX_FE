import * as React from 'react';
import type { Text as RNText } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Text, TextProps } from 'react-native';

// Base typography props
interface TypographyProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export const Title = React.forwardRef<RNText, TypographyProps>(
  ({ className, children, ...props }, ref) => (
    <Text
      ref={ref}
      className={twMerge(
        'text-[24px] font-oswald-500 text-titleColor',
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);

// Title components
export const H1 = React.forwardRef<RNText, TypographyProps>(
  ({ className, children, ...props }, ref) => (
    <Text
      ref={ref}
      className={twMerge(
        'text-3xl font-oswald-800 text-h1Color',
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);

export const H2 = React.forwardRef<RNText, TypographyProps>(
  ({ className, children, ...props }, ref) => (
    <Text
      ref={ref}
      className={twMerge('text-2xl font-oswald-800 text-h2Color', className)}
      {...props}
    >
      {children}
    </Text>
  )
);

export const H3 = React.forwardRef<RNText, TypographyProps>(
  ({ className, children, ...props }, ref) => (
    <Text
      ref={ref}
      className={twMerge('text-lg font-oswald-900 text-h3Color', className)}
      {...props}
    >
      {children}
    </Text>
  )
);

export const Label = React.forwardRef<RNText, TypographyProps>(
  ({ className, children, ...props }, ref) => (
    <Text
      ref={ref}
      className={twMerge(
        'text-md font-oswald-500 text-labelColor',
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);

export const Placeholder = React.forwardRef<RNText, TypographyProps>(
  ({ className, children, ...props }, ref) => (
    <Text
      ref={ref}
      className={twMerge(
        'text-md font-oswald-500 text-placeholderColor',
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);

export const Paragraph = React.forwardRef<RNText, TypographyProps>(
  ({ className, children, ...props }, ref) => (
    <Text
      ref={ref}
      className={twMerge(
        'text-sm font-oswald-500 text-paragraphColor',
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);


// Set display names for debugging
H1.displayName = 'H1';
H2.displayName = 'H2';
H3.displayName = 'H3';
Label.displayName = 'Label';
Paragraph.displayName = 'Paragraph';