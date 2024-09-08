/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import HomeScreen from './screens/Home';
import PlayerScreen from './screens/Player';
import {NavigationContainer} from '@react-navigation/native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={Colors.darker}
        />
        <Drawer.Navigator>
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Player" component={PlayerScreen} />
        </Drawer.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default App;
