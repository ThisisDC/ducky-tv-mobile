import {View, Text} from 'react-native';
import React from 'react';
import DuckIcon from '../assets/icons/duck.svg';
import {useSharedValue, interpolate, withTiming} from 'react-native-reanimated';

export default function LoadingAlert({size = 80, animated = false}) {
  const svgRotation = useSharedValue(0);

  return (
    <View
      style={{
        backgroundColor: 'white',
        aspectRatio: '1/1',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        zIndex: 1,
      }}>
      <DuckIcon width={size} height={size} />
    </View>
  );
}
