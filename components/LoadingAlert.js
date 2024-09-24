import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import DuckLoadingIcon from '../assets/icons/duck-loading.svg';
import Animated, {
  useSharedValue,
  interpolate,
  withTiming,
  useAnimatedStyle,
  withRepeat,
} from 'react-native-reanimated';
import {APP_THEME} from '../utils/colors';
import DuckIcon from '../assets/icons/duck.svg';

export default function LoadingAlert({size = 80, animated = false}) {
  const svgRotation = useSharedValue(0);

  const svgStyles = useAnimatedStyle(() => ({
    transform: [{rotateZ: `${-svgRotation.value * 360}deg`}],
  }));

  useEffect(() => {
    if (animated) {
      svgRotation.value = withRepeat(withTiming(2, {duration: 1000}), 100);
    }
  }, []);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: 'white',
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
          borderColor: APP_THEME.secondary,
          aspectRatio: 1,
          width: animated ? size + 5 : size + 2,
        },
      ]}>
      <Animated.View style={svgStyles}>
        {animated ? (
          <DuckLoadingIcon width={size} height={size} />
        ) : (
          <DuckIcon width={size} height={size} />
        )}
      </Animated.View>
    </Animated.View>
  );
}
