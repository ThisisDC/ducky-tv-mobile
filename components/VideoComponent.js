import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import FullScreenIcon from '../assets/icons/fullscreen.svg';
import FullScreenExitIcon from '../assets/icons/fullscreen-exit.svg';
import PauseIcon from '../assets/icons/pause.svg';
import PlayIcon from '../assets/icons/play.svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated';

export default function VideoComponent({
  streamUrl,
  onLoad,
  onBuffer,
  onError,
  buffering,
  error,
}) {
  const videoRef = useRef(null);

  const [paused, setPaused] = useState(false);

  const [currentTimeout, setCurrentTimeout] = useState();
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
    };
  }, [setOverlayOpacity]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(overlayOpacity.value, [0, 1], [0, 1]),
  }));

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <View style={styles.video}>
      <Video
        // Can be a URL or a local file.
        source={{
          uri: streamUrl,
          type: 'm3u8',
        }}
        // Store reference
        ref={videoRef}
        // Callback when remote video is buffering
        onLoad={onLoad}
        onBuffer={onBuffer}
        paused={paused}
        fullscreen={true}
        controls={false}
        // Callback when video cannot be loaded
        onError={onError}
        style={{flex: 1}}
        playWhenInactive
      />
      {buffering && (
        <ActivityIndicator
          color={'#ffffff'}
          style={styles.activityIndicator}
          size={55}
        />
      )}
      <AnimatedPressable
        style={[styles.overlay, overlayAnimatedStyle]}
        onPress={() => {
          clearTimeout(currentTimeout);
          setOverlayOpacity(overlayOpacity.value < 0.25 ? 1 : 0);
        }}>
        <Pressable
          style={styles.playPauseButton}
          onPress={() => setPaused(state => !state)}>
          {!buffering &&
            (!paused ? (
              <PauseIcon width={60} height={60} />
            ) : (
              <PlayIcon width={60} height={60} />
            ))}
        </Pressable>
        <View style={styles.controls}>
          <Pressable style={styles.liveButton}>
            <View style={styles.redDot} />
            <Text style={styles.liveText}>live</Text>
          </Pressable>
          <Pressable style={styles.fullScreenButton}>
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
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  liveButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
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
  fullScreenButton: {},
  playPauseButton: {},
});
