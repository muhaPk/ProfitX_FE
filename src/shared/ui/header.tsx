import * as React from 'react';
import { View } from 'react-native';

type Props = {
  center?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  titleVariant?: 'h1' | 'h2';
  className?: string;
};

export function Header({ center, left, right, className }: Props): React.ReactElement {

  return (
    <View className={`flex-row items-center justify-between mb-4 ${className ?? ''}`}>
      
      {left ? left : <View className="w-10" />}

      {center}

      {right ? right : <View className="w-10" />}

    </View>
  );
}
