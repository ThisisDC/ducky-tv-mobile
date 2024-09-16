import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {DEFAULT_CHANNEL_IMAGE} from '../data/api';
import {getChannels} from '../data/storage';
import {useConfigStore} from '../data/store';
import {DrawerItem} from '@react-navigation/drawer';

export const CustomDrawerContent = memo(({navigation, route}) => {
  //const isHomeScreen = route?.name === 'Home';
  const favChannels = useConfigStore(state => state.favChannels);
  const setFavChannels = useConfigStore(state => state.setFavChannels);

  useEffect(() => {
    const fetchChannels = async () => {
      const channels = await getChannels();
      if (channels) {
        setFavChannels(channels);
      }
    };

    fetchChannels();
  }, []);

  console.log(favChannels);

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
      <DrawerItem
        label="Home"
        style={{backgroundColor: '#ff3c0064', borderRadius: 12}}
        labelStyle={{color: 'white'}}
        onPress={() => navigation.navigate('Home')}
      />
      <View style={styles.favoriteSection}>
        <View style={styles.divider}></View>
        <Text style={styles.favChannelsText}>Favorite channels</Text>
        {favChannels.map(channel => (
          <View key={channel.id}>
            <DrawerButton channel={channel} navigation={navigation} />
          </View>
        ))}
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
  drawer: {backgroundColor: '#181818', paddingTop: 20},
  logo: {
    width: 65,
    aspectRatio: 1,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {flex: 1, resizeMode: 'contain'},
  header: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
  },
  drawerButton: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 8,
    alignItems: 'center',
  },
  favoriteSection: {
    paddingHorizontal: 8,
  },
  favChannelsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#454545',
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 12,
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
    color: 'black',
    backgroundColor: '#e8e8e8',
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
});
