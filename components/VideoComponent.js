import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import FullScreenIcon from '../assets/icons/fullscreen.svg';
import MenuIcon from '../assets/icons/menu.svg';
import FullScreenExitIcon from '../assets/icons/fullscreen-exit.svg';
import PauseIcon from '../assets/icons/pause.svg';
import PlayIcon from '../assets/icons/play.svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import {LANDSCAPE, PORTRAIT} from 'react-native-orientation-locker';
import {isOrientationLandscape} from '../screens/Player';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {APP_THEME} from '../utils/colors';
import {DEFAULT_CHANNEL_IMAGE} from '../data/api';

export default function VideoComponent({
  streamUrl,
  onLoad,
  onLoadStart,
  onError,
  loading,
  error,
  onDrawerButtonPress,
  orientation,
  onOrientationChange,
  channel,
}) {
  const videoRef = useRef(null);

  const isLandscape = isOrientationLandscape(orientation);

  const [paused, setPaused] = useState(false);
  const [currentTimeout, setCurrentTimeout] = useState(null);

  const [isLive, setIsLive] = useState(true);

  const overlayOpacity = useSharedValue(1);

  const setOverlayOpacity = useCallback(value => {
    overlayOpacity.value = withTiming(value, {
      duration: 200,
    });

    if (value) {
      const timeout = setTimeout(() => {
        setOverlayOpacity(0);
      }, 5000);

      setCurrentTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOverlayOpacity(0);
    }, 5000);
    return () => {
      clearTimeout(timer);
      setCurrentTimeout(null);
    };
  }, [setOverlayOpacity]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(overlayOpacity.value, [0, 1], [0, 1]),
    display: overlayOpacity.value === 0 ? 'none' : 'flex',
  }));

  const drawerButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: (1 - overlayOpacity.value) * -30}],
  }));

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const handleReloadStream = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.seek(0); // Seek to the start (live point)
    }
  }, []);

  return (
    <View style={isLandscape ? styles.fullscreenVideo : styles.video}>
      <Pressable
        style={{flex: 1}}
        onPress={() => {
          clearTimeout(currentTimeout);
          setOverlayOpacity(1);
        }}>
        <Video
          // Can be a URL or a local file.
          key={channel.id}
          source={{
            uri: streamUrl,
            type: 'm3u8',
          }}
          // Store reference
          ref={videoRef}
          // Callback when remote video is loading
          onLoad={onLoad}
          onLoadStart={onLoadStart}
          onPlaybackStateChanged={({isPlaying}) => {
            if (isPlaying) {
              onLoad();
            } else {
              if (!paused) {
                onLoadStart();
              }
            }
          }}
          paused={paused}
          // Callback when video cannot be loaded
          onError={onError}
          disableDisconnectError={true}
          style={[{flex: 1}, isLandscape && styles.landscapeVideo]}
          playWhenInactive
          resizeMode="contain"
          bufferConfig={{
            minBufferMs: 5000,
            maxBufferMs: 20000,
            bufferForPlaybackMs: 1500,
            bufferForPlaybackAfterRebufferMs: 3000,
            backBufferDurationMs: 120000,
            cacheSizeMB: 0,
            live: {
              targetOffsetMs: 500,
            },
          }}
        />
      </Pressable>
      {loading && (
        <ActivityIndicator
          color={'#ffffff'}
          style={styles.activityIndicator}
          size={55}
        />
      )}
      <AnimatedPressable
        style={[
          styles.overlay,
          overlayAnimatedStyle,
          isLandscape && styles.landscapeRotation,
        ]}
        onPress={() => {
          clearTimeout(currentTimeout);
          setOverlayOpacity(overlayOpacity.value < 0.25 ? 1 : 0);
        }}>
        {!isLandscape && (
          <AnimatedPressable
            onPress={onDrawerButtonPress}
            style={[styles.drawerButton, drawerButtonAnimatedStyle]}>
            <MenuIcon width="20" height="20" />
          </AnimatedPressable>
        )}
        {channel && isLandscape && (
          <View style={styles.channelInfo}>
            <Image
              style={styles.channelImage}
              source={{uri: DEFAULT_CHANNEL_IMAGE}}
            />
            <Text style={styles.channelName}>{channel.name}</Text>
          </View>
        )}
        <Pressable
          style={styles.playPauseButton}
          onPress={e => {
            setPaused(state => !state);
            setIsLive(false);
          }}>
          {!loading &&
            (!paused ? (
              <PauseIcon width={60} height={60} />
            ) : (
              <PlayIcon width={60} height={60} />
            ))}
        </Pressable>
        <View style={styles.controls}>
          <Pressable
            style={styles.liveButton}
            onPress={() => {
              handleReloadStream();
              setIsLive(true);
              setPaused(false);
            }}>
            <View
              style={[styles.redDot, !isLive && {backgroundColor: 'gray'}]}
            />
            <Text style={styles.liveText}>{isLive ? 'Live' : 'Go live'}</Text>
          </Pressable>
          <Pressable
            style={styles.fullScreenButton}
            onPress={onOrientationChange}>
            <FullScreenIcon width={18} height={18} />
          </Pressable>
        </View>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    aspectRatio: '16/9',
    justifyContent: 'center',
  },
  landscapeVideo: {
    //transform: [{rotateZ: '-90deg'}],
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    // transform: [{rotateZ: '90deg'}],
    backgroundColor: 'black',
  },
  drawerButton: {
    position: 'absolute',
    top: 15,
    left: 0,
    width: 20,
    height: 20,
    backgroundColor: APP_THEME.tertiary,
    padding: 20,
    paddingLeft: 35,
    paddingRight: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },

  fullscreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000057',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    flex: 1,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  liveButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#00000075',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
  redDot: {
    backgroundColor: 'red',
    borderRadius: 50,
    width: 10,
    aspectRatio: '1/1',
    top: 1,
  },

  liveText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fullScreenButton: {
    padding: 10,
    borderRadius: 8,
  },
  playPauseButton: {},
  channelInfo: {
    position: 'absolute',
    top: 15,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  channelImage: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 50,
  },
  channelName: {
    color: APP_THEME.secondary,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
