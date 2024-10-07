import {Pressable, View, Image, Text, StyleSheet} from 'react-native';
import React, {useRef, useState} from 'react';
import Video from 'react-native-video';
import {getStreamUrl} from '../data/api';
import {useNavigation} from '@react-navigation/native';
import {DEFAULT_CHANNEL_IMAGE} from '../data/api';
import LoadingAlert from './LoadingAlert';
import {APP_THEME} from '../utils/colors';

const IS_DISABLED = true;

export default function ChannelPreview({channel}) {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigation = useNavigation();

  const onLoad = () => {
    setLoading(false);
    // videoRef.current.seek(0);
  };

  return (
    <View style={styles.channelPreview}>
      <View>
        <Pressable
          onPress={() =>
            navigation.navigate('Player', {
              channel: channel,
            })
          }
          android_ripple={{color: APP_THEME.primary}}
          style={[styles.overlay, {zIndex: 2}]}
        />
        {loading && (
          <Pressable
            onPress={() =>
              navigation.navigate('Player', {
                channelId: channel.id,
              })
            }
            android_ripple={{color: APP_THEME.primary}}
            style={[
              styles.overlay,
              {
                backgroundColor: '#252525',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <LoadingAlert size={70} />
          </Pressable>
        )}
        <View
          style={{
            aspectRatio: '16/9',
            width: '100%',
            backgroundColor: '#565656',
          }}>
          {!IS_DISABLED && !error && (
            <Video
              source={{
                uri: getStreamUrl(channel?.id),
                type: 'm3u8',
              }}
              key={channel.id}
              ref={videoRef}
              onLoad={onLoad}
              paused
              muted={true}
              disableDisconnectError={true}
              // Callback when video cannot be loaded
              onError={e => {
                setError(true);
              }}
              style={styles.video}
              removeClippedSubviews={false}
            />
          )}
        </View>
        <View style={styles.liveIcon}>
          <View style={styles.redDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      <View style={styles.channelPreviewInfo}>
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            alignItems: 'flex-start',
          }}>
          <Image
            source={{
              uri: DEFAULT_CHANNEL_IMAGE,
            }}
            style={styles.channelPreviewPicture}
          />
          <View style={{alignItems: 'flex-start', gap: 4}}>
            <Text style={styles.channelPreviewTitle}>{channel.name}</Text>
            <Text style={styles.channelCountry}>{channel.country}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  liveIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    right: 20,
    bottom: 10,
  },
  redDot: {
    aspectRatio: '1/1',
    width: 10,
    backgroundColor: 'red',
    borderRadius: 50,
    top: 1,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  liveText: {
    color: 'white',
    fontWeight: 'bold',
  },
  channelPreview: {
    borderRadius: 14,
  },
  channelCountry: {
    color: APP_THEME.secondary,
    backgroundColor: APP_THEME.tertiary,
    fontWeight: 'semibold',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    left: -1,
  },
  channelPreviewInfo: {
    backgroundColor: APP_THEME.background,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingRight: 10,
    paddingBottom: 25,
    justifyContent: 'space-between',
  },
  channelPreviewPicture: {
    aspectRatio: '1/1',
    width: 35,
    borderRadius: 50,
    top: 3,
  },
  channelPreviewTitle: {
    fontSize: 17,
    fontWeight: 'semibold',
    color: APP_THEME.secondary,
  },
  video: {
    aspectRatio: '16/9',
    flex: 1,
    backgroundColor: 'black',
  },
  text: {color: 'white'},
});
