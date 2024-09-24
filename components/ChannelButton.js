import {TouchableOpacity, View, Image, StyleSheet, Text} from 'react-native';
import React from 'react';
import {DEFAULT_CHANNEL_IMAGE} from '../data/api';
import {useNavigation} from '@react-navigation/native';
import {APP_THEME} from '../utils/colors';

export default function ChannelButton({channel, display_country}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.channelButton}
      key={channel.p}
      onPress={() => navigation.navigate('Player', {channel: channel})}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        <Image
          style={styles.channelButtonImage}
          source={{
            uri: DEFAULT_CHANNEL_IMAGE,
          }}
        />
        <Text style={styles.channelButtonTitle}>{channel.name}</Text>
      </View>

      {display_country ? (
        <Text style={styles.channelButtonCountry}>{channel.country}</Text>
      ) : (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
          <View style={styles.liveDot}></View>
          <Text style={styles.liveText}>Live</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  channelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    paddingRight: 24,
    width: '100%',
    justifyContent: 'space-between',
  },
  channelButtonImage: {
    aspectRatio: '1/1',
    width: 40,
    borderRadius: 50,
  },
  channelButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: APP_THEME.secondary,
  },
  channelButtonCountry: {
    zIndex: 1,
    backgroundColor: '#313131',
    paddingVertical: 6,
    paddingHorizontal: 10,
    color: 'white',
    borderRadius: 20,
    position: 'absolute',
    right: 12,
  },
  liveDot: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: 'red',
    top: 1,
  },
  liveText: {
    fontWeight: 'bold',
    color: 'white',
  },
});
