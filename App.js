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
import CustomDrawerContent from './components/CustomDrawerContent';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar />
        <Drawer.Navigator
          screenOptions={{
            unmountOnBlur: true,
            drawerStyle: {
              borderTopRightRadius: 24,
              borderBottomRightRadius: 24,

              overflow: 'hidden',
            },
          }}
          drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen
            name="Player"
            component={PlayerScreen}
            options={{
              headerShown: false,
            }}
          />
        </Drawer.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default App;
