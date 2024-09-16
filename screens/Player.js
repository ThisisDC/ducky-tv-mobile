import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import VideoComponent from '../components/VideoComponent';
import {getStreamUrl} from '../data/api';
import {
  OrientationLocker,
  PORTRAIT,
  LANDSCAPE,
} from 'react-native-orientation-locker';
import HeartIcon from '../assets/icons/heart.svg';
import HeartFilledIcon from '../assets/icons/heart-filled.svg';
import ShrinkablePressable from '../components/ShrinkablePressable';
import {useConfigStore} from '../data/store';
import {addChannel, removeChannel} from '../data/storage';

export const isOrientationLandscape = orientation =>
  orientation === 'LANDSCAPE-LEFT' ||
  orientation === 'LANDSCAPE' ||
  orientation === 'LANDSCAPE-RIGHT';

export default function PlayerScreen({route, navigation}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orientation, setOrientation] = useState(PORTRAIT);
  const [added, setAdded] = useState(false);

  const favChannels = useConfigStore(state => state.favChannels);

  const addFavChannel = useConfigStore(state => state.addFavChannel);
  const removeFavChannel = useConfigStore(state => state.removeFavChannel);

  const {channel} = route.params;
  const streamUrl = getStreamUrl(channel?.id);

  useEffect(() => {
    const isChannelFavorite = favChannels?.some(
      favChannel => favChannel.id === channel.id,
    );
    setAdded(isChannelFavorite);
  }, [channel]);

  // https://www.npmjs.com/package/react-native-system-navigation-bar -> sticky immersive

  const onOrientationChange = () => {
    setOrientation(currentOrientation =>
      currentOrientation === PORTRAIT ? LANDSCAPE : PORTRAIT,
    );
  };

  const setCorrectOrientation = or => {
    if (['LANDSCAPE', 'LANDSCAPE-LEFT', 'LANDSCAPE-RIGHT'].includes(or)) {
      setOrientation(LANDSCAPE);
    } else {
      setOrientation(PORTRAIT);
    }
  };

  return (
    <View>
      <OrientationLocker
        orientation={orientation}
        onChange={or => setCorrectOrientation(or)}
        onDeviceChange={or => setCorrectOrientation(or)}
      />
      <VideoComponent
        streamUrl={streamUrl}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
        onError={e => setError(e)}
        loading={loading}
        error={error}
        onDrawerButtonPress={() => navigation.openDrawer()}
        orientation={orientation}
        onOrientationChange={onOrientationChange}
      />
      {!isOrientationLandscape(orientation) && (
        <View>
          <View style={styles.channel}>
            <View style={styles.channelInfo}>
              <Image
                source={{
                  uri: 'https://www.salvatorepumo.it/wp-content/uploads/2022/08/logo-sky-oggi.png',
                }}
                alt="channel picture"
                style={styles.channelPicture}
              />
              <Text style={styles.channelName}>{channel.name}</Text>
            </View>
            <ShrinkablePressable
              onPress={() => {
                setAdded(state => {
                  if (!state) {
                    addFavChannel(channel);
                    addChannel(channel);
                  } else {
                    removeFavChannel(channel.id);
                    removeChannel(channel.id);
                  }
                  return !state;
                });
              }}>
              {added ? (
                <HeartFilledIcon width={30} height={30} fill="#f6c900" />
              ) : (
                <HeartIcon width={30} height={30} />
              )}
            </ShrinkablePressable>
          </View>
          <View style={styles.otherChannels}>
            <Text style={styles.otherChannelsTitle}>Other Channels</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  channel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
  },
  channelInfo: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelName: {
    fontSize: 16,
  },
  channelPicture: {
    width: 38,
    borderRadius: 50,
    aspectRatio: '1/1',
  },
  otherChannels: {
    padding: 12,
  },
  otherChannelsTitle: {
    fontSize: 20,
  },
});
