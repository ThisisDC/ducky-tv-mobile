/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef} from 'react';
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
import {
  DarkTheme,
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import CustomDrawerContent from './components/CustomDrawerContent';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  TransitionSpecs,
} from '@react-navigation/stack';
import {APP_THEME} from './utils/colors';
import SplashScreen from 'react-native-splash-screen';
import ChangeCountryModal from './screens/ChangeCountry';
import WelcomeModal from './screens/Welcome';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const playerScreenTransition = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
  cardStyleInterpolator: ({current, next, layouts}) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0, 1],
        }),
      },
    };
  },
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer theme={DarkTheme}>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor={'black'} />
        <Drawer.Navigator
          screenOptions={{
            headerShown: false,
            headerTintColor: APP_THEME.secondary,
            title: 'Home',
            headerTitleStyle: {
              color: APP_THEME.secondary,
            },
            headerStyle: {
              backgroundColor: APP_THEME.background,
              borderBottomWidth: 1,
              borderColor: APP_THEME.tertiary,
            },
            drawerStyle: {
              borderTopRightRadius: 24,
              borderBottomRightRadius: 24,
              overflow: 'hidden',
            },
          }}
          drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Main" component={StackNavigator} />
        </Drawer.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Welcome"
        component={WelcomeModal}
        options={{presentation: 'transparentModal', unmountOnBlur: true}}
      />
      <Stack.Screen
        name="ChangeCountry"
        component={ChangeCountryModal}
        options={{presentation: 'transparentModal', unmountOnBlur: true}}
      />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{
          unmountOnBlur: true,
          headerShown: false,
          ...playerScreenTransition,
        }}
      />
    </Stack.Navigator>
  );
}

export default App;
