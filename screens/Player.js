import {View, Text, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import VideoComponent from '../components/VideoComponent';
import {getStreamUrl} from '../api/api';

const LANDSCAPE = 'LANDSCAPE';
const PORTRAIT = 'PORTRAIT';

export default function PlayerScreen() {
  const [isBuffering, setIsBuffering] = useState('');
  const [error, setError] = useState(null);
  const [orientation, setOrientation] = useState(LANDSCAPE);

  const streamUrl = getStreamUrl(1534161807);

  return (
    <View>
      <VideoComponent
        streamUrl={streamUrl}
        onBuffer={() => setIsBuffering(true)}
        onLoad={() => setIsBuffering(false)}
        onError={e => setError(e)}
        buffering={isBuffering}
        error={error}
        fullscreen={orientation === LANDSCAPE}
      />
    </View>
  );
}
