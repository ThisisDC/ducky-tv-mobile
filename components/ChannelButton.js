import {TouchableOpacity, View, Image, StyleSheet, Text} from 'react-native';
import React from 'react';
import {DEFAULT_CHANNEL_IMAGE} from '../data/api';
import {useNavigation} from '@react-navigation/native';

export default function ChannelButton({channel, selected_country}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.channelButton}
      key={channel.p}
      onPress={() => navigation.navigate('Player', {channelId: channel.id})}>
      <View style={{gap: 8, flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={styles.channelButtonImage}
          source={{
            uri: DEFAULT_CHANNEL_IMAGE,
          }}
        />
        <Text style={styles.channelButtonTitle}>{channel.name}</Text>
      </View>

      {channel.country !== selected_country ? (
        <Text style={styles.channelButtonCountry}>{channel.country}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  channelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    width: '100%',
    height: '25%',
  },
  channelButtonImage: {
    aspectRatio: '1/1',
    width: 32,
    borderRadius: 50,
  },
  channelButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  channelButtonCountry: {
    fontWeight: '400',
    zIndex: 1,
    backgroundColor: '#bd0000d6',
    paddingVertical: 6,
    paddingHorizontal: 10,
    color: 'white',
    borderRadius: 20,
    position: 'absolute',
    right: 12,
  },
});
