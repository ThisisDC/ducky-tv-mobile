import {View, Text, Pressable} from 'react-native';
import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  ReduceMotion,
  withSpring,
} from 'react-native-reanimated';

export default function ShrinkablePressable(props) {
  const shrinkAnim = useSharedValue(1);

  function onTouchStart() {
    shrinkAnim.value = withTiming(0.9, {
      duration: 100,
      easing: Easing.out(Easing.circle),
      reduceMotion: ReduceMotion.System,
    });
  }

  function onTouchEnd() {
    shrinkAnim.value = withSpring(1);
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: shrinkAnim.value}],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...props}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onPressOut={onTouchEnd}>
        {props.children}
      </Pressable>
    </Animated.View>
  );
}
