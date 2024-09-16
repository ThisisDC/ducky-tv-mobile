import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Video from 'react-native-video';
import {DEFAULT_CHANNEL_IMAGE, getStreamUrl, initialFetch} from '../data/api';
import {useConfigStore} from '../data/store';
import {getFavoriteCountry, storeFavoriteCountry} from '../data/storage';
import {useNavigation} from '@react-navigation/native';
import ChannelButton from '../components/ChannelButton';
import ChannelPreview from '../components/ChannelPreview';
import {FlatList} from 'react-native-gesture-handler';
import LoadingAlert from '../components/LoadingAlert';
import {OrientationLocker, PORTRAIT} from 'react-native-orientation-locker';

export default function HomeScreen({route, navigation}) {
  const [channels, setChannels] = useState([]);
  const [firstRequest, setFirstRequest] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const favCountry = useConfigStore(state => state.favCountry);
  const setCountries = useConfigStore(state => state.setCountries);
  const setFavCountry = useConfigStore(state => state.setFavCountry);

  useLayoutEffect(() => {
    const startup = async () => {
      setLoading(true);
      const favouriteCountry = await getFavoriteCountry();
      if (!favouriteCountry) {
        await storeFavoriteCountry('United Kingdom');
        setFavCountry('United Kingdom');
      } else {
        setFavCountry(favouriteCountry);
      }
      try {
        fetchData(favCountry, firstRequest);
      } catch (e) {
        setError(true);
      }
      setFirstRequest(false);
    };

    startup();
  }, []);

  const fetchData = async (favouriteCountry, getCountries) => {
    setLoading(true);
    const data = await initialFetch({
      country: favouriteCountry ? favouriteCountry : 'United Kingdom',
      getCountries: firstRequest,
    });
    setChannels(data.channels);
    if (getCountries) {
      setCountries(data.countries);
    }
    setLoading(false);
  };

  const ListHeaderComponent = useCallback(() => {
    return <Text style={styles.title}>Popular in {favCountry}</Text>;
  }, [favCountry]);

  const ListEmptyComponent = useCallback(() => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={40} color={'orange'} />
      </View>
    );
  }, []);

  return (
    <View style={styles.screen}>
      <OrientationLocker orientation={PORTRAIT} />
      <FlatList
        data={channels}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ChannelPreview channel={item} />}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshing={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    paddingVertical: 20,
    paddingLeft: 10,
  },
  section: {
    marginTop: 5,
    flexWrap: 'wrap',
    height: '27%',
  },

  text: {
    color: 'white',
  },
  othersChannelTitle: {
    fontSize: 24,
    marginVertical: 10,
    paddingLeft: 10,
  },
});
