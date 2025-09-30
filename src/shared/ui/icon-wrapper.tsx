import React from 'react';
import { View } from 'react-native';
import colors from '@/constants/colors';

interface Props extends React.PropsWithChildren {
  className?: string;
  inactive?: boolean;
}

export const IconWrapper = ({ children, inactive, className }: Props) => {

  const color =
    inactive
      ? colors.iconColorInactive
      : colors.iconColorActive;

  return (
    <View className={`flex-row justify-center items-center p-2 ${inactive ? 'bg-iconBgInactive' : 'bg-iconBgActive'} rounded-full ${className ?? ''}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<any>, { color: color }) : child
      )}
    </View>
  );
};

