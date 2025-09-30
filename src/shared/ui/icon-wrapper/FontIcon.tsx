import React, { FC } from 'react';
import { View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome5Brands from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome6Brands from '@expo/vector-icons/FontAwesome6';
import Fontisto from '@expo/vector-icons/Fontisto';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Zocial from '@expo/vector-icons/Zocial';

type IconFamily =
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'FontAwesome5Brands'
  | 'FontAwesome6'
  | 'FontAwesome6Brands'
  | 'Fontisto'
  | 'Foundation'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'MaterialIcons'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

type Props = {
  iconFamily: IconFamily;
  iconName: string;
  size?: number;
  color?: string;
  reverse?: boolean;
};

export const FontIcon: FC<Props> = ({
  iconFamily,
  iconName,
  size = 20,
  color = '#ccc',
}) => {
  let IconComponent: any = null;

  switch (iconFamily) {
    case 'AntDesign':
      IconComponent = AntDesign;
      break;
    case 'Entypo':
      IconComponent = Entypo;
      break;
    case 'EvilIcons':
      IconComponent = EvilIcons;
      break;
    case 'Feather':
      IconComponent = Feather;
      break;
    case 'FontAwesome':
      IconComponent = FontAwesome;
      break;
    case 'FontAwesome5':
      IconComponent = FontAwesome5;
      break;
    case 'FontAwesome5Brands':
      IconComponent = FontAwesome5Brands;
      break;
    case 'FontAwesome6':
      IconComponent = FontAwesome6;
      break;
    case 'FontAwesome6Brands':
      IconComponent = FontAwesome6Brands;
      break;
    case 'Fontisto':
      IconComponent = Fontisto;
      break;
    case 'Foundation':
      IconComponent = Foundation;
      break;
    case 'Ionicons':
      IconComponent = Ionicons;
      break;
    case 'MaterialCommunityIcons':
      IconComponent = MaterialCommunityIcons;
      break;
    case 'MaterialIcons':
      IconComponent = MaterialIcons;
      break;
    case 'Octicons':
      IconComponent = Octicons;
      break;
    case 'SimpleLineIcons':
      IconComponent = SimpleLineIcons;
      break;
    case 'Zocial':
      IconComponent = Zocial;
      break;
    default:
      return null;
  }

  return (
    <View className={`flex justify-center`}>
      <IconComponent name={iconName} size={size} color={color} />
    </View>
  );
};