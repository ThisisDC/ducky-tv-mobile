import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import VideoComponent from '../components/VideoComponent';
import {DEFAULT_CHANNEL_IMAGE, getStreamUrl} from '../data/api';
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
import {APP_THEME} from '../utils/colors';
import ChannelButton from '../components/ChannelButton';
import SystemNavigationBar from 'react-native-system-navigation-bar';

export const isOrientationLandscape = orientation =>
  orientation === 'LANDSCAPE-LEFT' ||
  orientation === 'LANDSCAPE' ||
  orientation === 'LANDSCAPE-RIGHT';

export default function PlayerScreen({route, navigation}) {
  const [loading, setLoading] = useState(true);
  const [orientation, setOrientation] = useState(PORTRAIT);
  const [added, setAdded] = useState(false);

  const channels = useConfigStore(state => state.channels);
  const favChannels = useConfigStore(state => state.favChannels);
  const favCountry = useConfigStore(state => state.favCountry);

  const addFavChannel = useConfigStore(state => state.addFavChannel);
  const removeFavChannel = useConfigStore(state => state.removeFavChannel);
  const isLandscape = isOrientationLandscape(orientation);

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

  useEffect(() => {
    SystemNavigationBar.stickyImmersive(isLandscape);
  }, [isLandscape]);

  return (
    <>
      <OrientationLocker
        orientation={orientation}
        onDeviceChange={or => setCorrectOrientation(or)}
      />
      <VideoComponent
        streamUrl={streamUrl}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
        loading={loading}
        onDrawerButtonPress={() => {
          navigation.openDrawer();
        }}
        orientation={orientation}
        onOrientationChange={onOrientationChange}
        channel={channel}
      />
      {!isOrientationLandscape(orientation) && (
        <View
          style={{
            backgroundColor: APP_THEME.background,
            flex: 1,
          }}>
          <View style={styles.channel}>
            <View style={styles.channelInfo}>
              <Image
                source={{
                  uri: DEFAULT_CHANNEL_IMAGE,
                }}
                alt="channel picture"
                style={styles.channelPicture}
              />
              <View>
                <Text style={styles.channelName}>{channel.name}</Text>
                <Text style={styles.channelCountry}>{channel.country}</Text>
              </View>
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
                <HeartFilledIcon
                  width={30}
                  height={30}
                  fill={APP_THEME.primary}
                />
              ) : (
                <HeartIcon width={30} height={30} />
              )}
            </ShrinkablePressable>
          </View>
          <View style={styles.otherChannels}>
            <Text style={styles.otherChannelsTitle}>
              {favCountry !== 'Global'
                ? 'Other channels in ' + favCountry
                : 'Other popular channels'}
            </Text>
            <View style={styles.channelList}>
              {channels
                .filter(
                  ch =>
                    (ch.country === favCountry && ch.id !== channel.id) ||
                    favCountry === 'Global',
                )
                .slice(0, 8)
                .map(ch => (
                  <ChannelButton
                    channel={ch}
                    key={ch.id}
                    display_country={favCountry === 'Global'}
                  />
                ))}
            </View>
          </View>
        </View>
      )}
    </>
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
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: APP_THEME.secondary,
  },
  channelCountry: {
    color: APP_THEME.secondary,
    backgroundColor: APP_THEME.tertiary,
    fontWeight: 'semibold',
    fontSize: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
    left: -2,
    alignSelf: 'flex-start',
  },
  channelPicture: {
    width: 42,
    borderRadius: 50,
    aspectRatio: '1/1',
  },
  otherChannels: {
    backgroundColor: APP_THEME.tertiary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderRadius: 24,
    marginTop: 5,
    paddingTop: 10,
    flex: 1,
  },
  otherChannelsTitle: {
    color: APP_THEME.secondary,
    fontSize: 24,
    paddingLeft: 15,
  },
  channelList: {
    flexWrap: 'wrap',
    paddingVertical: 8,
    gap: 12,
  },
});
