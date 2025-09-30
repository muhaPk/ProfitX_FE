import React, { ComponentProps, type PropsWithChildren } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { type TouchableProps } from 'react-native-svg';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FontIcon } from '@/shared/ui/icon-wrapper/FontIcon';
import Colors from '@/constants/colors';


const button = tv({
  slots: {
    container: 'flex-row items-center justify-center gap-2 rounded-2xl',
    label: 'font-gilroy-600 text-lg',
  },

  variants: {
    variant: {
      default: {
        container: 'bg-buttonDefaultBg',
        label: 'text-buttonDefaultColor',
      },
      active: {
        container: 'bg-buttonActiveBg',
        label: 'text-buttonActiveColor',
      },
      inactive: {
        container: 'bg-buttonInactiveBg',
        label: 'text-buttonInactiveColor',
      },
      tag: {
        container: 'bg-buttonTagBg',
        label: 'text-buttonTagColor',
      },
      privacy: {
        container: 'bg-buttonPrivacyBg',
        label: 'text-buttonPrivacyColor',
      },
      contact: {
        container: 'bg-buttonContactBg',
        label: 'text-buttonContactColor',
      },
      icon: {
        container: 'bg-transparent gap-0',
        label: '',
      },
    },
    size: {
      default: {
        container: 'px-4 py-3',
      },
      lg: {
        container: 'px-4 py-4',
      },
      sm: {
        container: 'px-3 py-2',
        label: 'text-md',
      },
    },
    disabled: {
      true: {
        container: 'bg-neutral-300',
        label: 'text-neutral-600',
      },
    },
    fullWidth: {
      true: {
        container: 'flex-1',
      },
      false: {
        container: '',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
    fullWidth: false,
  },
});

type ButtonVariants = VariantProps<typeof button>;
interface Props extends ButtonVariants, Omit<PropsWithChildren<TouchableProps>, 'disabled'> {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
  testID?: string;
  iconFamily?: string;
  iconName?: string;
  iconFontAwesomeName? : ComponentProps<typeof FontAwesome>['name'];
  reverse?: boolean;
}



export const Button = React.forwardRef<View, Props>(
  (
    {
      label,
      loading = false,
      className = '',
      textClassName = '',
      icon,
      testID,
      iconFamily,
      iconName,
      reverse = false,
      variant = 'default',
      disabled = false,
      size = 'default',
      fullWidth,
      ...props
    },
    ref
  ) => {
    const styles = React.useMemo(
      () => button({ variant, disabled, size, fullWidth }),
      [variant, disabled, size, fullWidth]
    );

    const renderIconElement = () => {
        const labelClass = button.variants.variant[variant]?.label;
        const colorKey = labelClass?.replace('text-', '');
        const iconColor = Colors[colorKey];

        return <>
            { icon && icon }
            { iconFamily && iconName && <FontIcon iconFamily={iconFamily} iconName={iconName} size={24} color={iconColor} /> }
        </>
    };

    const renderButton = ({label, testID, styles, textClassName}: {label: string; testID?: string; styles: typeof button; textClassName?: string}) => {
        return label ? (
          <Text
            testID={testID ? `${testID}-label` : undefined}
            className={styles.label({ className: textClassName })}
          >
            {label}
          </Text>
        ) : null;
    }



    return (
      <TouchableOpacity
        disabled={disabled || loading}
        className={styles.container({ className })}
        {...props}
        ref={ref}
        testID={testID}
      >
        {props.children ? (
          props.children
        ) : (
          reverse ? 
            <>
              {renderButton({ label, testID, styles, textClassName })}
              {renderIconElement()}
            </>
           : 
            <>
              {renderIconElement()}
              {renderButton({ label, testID, styles, textClassName })}
            </>
        )}
      </TouchableOpacity>
    );
  }
);
