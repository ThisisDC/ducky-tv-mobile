import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

export default function FloatingActionButton({
  style,
  children,
  side = 'right',
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        side === 'left' ? {left: 20} : side === 'right' ? {right: 20} : null,
        style,
      ]}>
      {children}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    width: 30,
    aspectRatio: '1/1',
    backgroundColor: '#007bff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
