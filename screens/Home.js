import {View, Text, Pressable} from 'react-native';
import React from 'react';

export default function HomeScreen({route, navigation}) {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Pressable onPress={() => navigation.navigate('Player')}>
        <Text>Go to player</Text>
      </Pressable>
    </View>
  );
}
