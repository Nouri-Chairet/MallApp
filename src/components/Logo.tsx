import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View ,Text} from 'react-native';

export const Logo = ({ width = 300, height = 300, color = "#1B0D5B" }: { width?: number, height?: number, color?: string }) => {
  return (
    <Text  style={{ transform: [{ rotate: '90deg' }] ,fontFamily: "KolkerBrush_400Regular",fontSize: 464, color }}> Of</Text>
  
  );
};
