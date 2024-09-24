import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {DEFAULT_CHANNEL_IMAGE} from '../data/api';
import {getChannels} from '../data/storage';
import {useConfigStore} from '../data/store';
import {DrawerItem} from '@react-navigation/drawer';
import {APP_THEME} from '../utils/colors';

export const CustomDrawerContent = memo(props => {
  const favChannels = useConfigStore(state => state.favChannels);
  const setFavChannels = useConfigStore(state => state.setFavChannels);

  const {state, navigation} = props;
  const {routes, index} = state;
  const focusedRoute = routes[index].name;

  const isHomeFocused = useMemo(() => focusedRoute === 'Home', [focusedRoute]);

  useEffect(() => {
    const fetchChannels = async () => {
      const channels = await getChannels();
      if (channels) {
        setFavChannels(channels);
      }
    };

    fetchChannels();
  }, []);

  return (
    <ScrollView style={styles.drawer}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Image
            source={require('../assets/images/duck-image.png')}
            style={styles.image}
            width={40}
            height={40}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.homeButtonText}>Home</Text>
      </TouchableOpacity>
      <View style={styles.favoriteSection}>
        <View style={styles.divider}></View>
        <Text style={styles.favChannelsText}>Favorite channels</Text>
        {favChannels.length ? (
          favChannels.map(channel => (
            <View key={channel.id}>
              <DrawerButton channel={channel} navigation={navigation} />
            </View>
          ))
        ) : (
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white', alignSelf: 'center'}}>
              No channel added
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
});

export default CustomDrawerContent;

function DrawerButton({channel, navigation}) {
  return (
    <TouchableOpacity
      style={styles.drawerButton}
      onPress={() => navigation.navigate('Player', {channel: channel})}>
      <Image
        source={{uri: DEFAULT_CHANNEL_IMAGE}}
        style={styles.channelImage}
      />
      <View style={{flex: 1, gap: 2}}>
        <Text style={styles.channelName}>{channel.name}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: 5,
          }}>
          <Text style={styles.channelCountry}>{channel.country}</Text>
          <View style={styles.liveIcon}>
            <View style={styles.redDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  drawer: {backgroundColor: APP_THEME.background, paddingTop: 20},
  logo: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  homeButton: {
    marginTop: 10,
    paddingLeft: 20,
    paddingVertical: 10,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  image: {flex: 1, resizeMode: 'contain'},
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
  },
  drawerButton: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    paddingRight: 8,
    gap: 8,
    alignItems: 'center',
  },
  favoriteSection: {
    paddingHorizontal: 8,
    paddingBottom: 30,
  },
  favChannelsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: APP_THEME.tertiary,
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 10,
  },
  channelImage: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 50,
  },
  homeText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  liveIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  redDot: {
    aspectRatio: '1/1',
    width: 10,
    backgroundColor: 'red',
    borderRadius: 50,
    top: 1,
  },
  liveText: {
    color: 'white',
    fontWeight: 'bold',
  },
  channelCountry: {
    color: APP_THEME.secondary,
    backgroundColor: APP_THEME.tertiary,
    fontWeight: 'semibold',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
    fontSize: 12,
    left: -1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  favCountryButton: {
    backgroundColor: '#383838',
    padding: 8,
    borderRadius: 12,
  },
  favCountryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
