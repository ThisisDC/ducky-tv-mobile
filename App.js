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
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import CustomDrawerContent from './components/CustomDrawerContent';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  TransitionSpecs,
} from '@react-navigation/stack';
import ChangeCountryScreen from './screens/ChangeCountry';
import {APP_THEME} from './utils/colors';

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
              outputRange: [layouts.screen.height + 80, 0],
            }),
          },
          // {
          //   rotate: current.progress.interpolate({
          //     inputRange: [0, 1],
          //     outputRange: ["90deg", "0deg"],
          //   }),
          // },
          // {
          //   scale: next
          //     ? next.progress.interpolate({
          //         inputRange: [0, 1],
          //         outputRange: [1, 0.8],
          //       })
          //     : 1,
          // },
        ],
        // opacity: next.progress.interpolate({
        //   inputRange: [0, 1],
        //   outputRange: [0, 0.2],
        // }),
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

  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor={'black'} />
        <Drawer.Navigator
          screenOptions={{
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
          <Drawer.Screen
            name="Main"
            component={StackNavigator}
            options={({route}) => {
              const routeName = getFocusedRouteNameFromRoute(route);
              return {headerShown: routeName !== 'Player'};
            }}
          />
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
        name="ChangeCountry"
        component={ChangeCountryScreen}
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
