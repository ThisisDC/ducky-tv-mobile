import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
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
import {APP_THEME} from '../utils/colors';
import WorldIcon from '../assets/icons/world.svg';
import CancelIcon from '../assets/icons/cancel.svg';
import SearchIcon from '../assets/icons/search.svg';
import ArrowTopIcon from '../assets/icons/arrow-top.svg';
import FloatingActionButton from '../components/FloatingActionButton';

export default function HomeScreen({route, navigation}) {
  const [firstRequest, setFirstRequest] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [listAtTop, setListAtTop] = useState(true);

  const flatlistRef = useRef(null);

  const channels = useConfigStore(state => state.channels);
  const setChannels = useConfigStore(state => state.setChannels);
  const favCountry = useConfigStore(state => state.favCountry);
  const setCountries = useConfigStore(state => state.setCountries);
  const setFavCountry = useConfigStore(state => state.setFavCountry);

  useLayoutEffect(() => {
    const startup = async () => {
      setLoading(true);
      const favouriteCountry = await getFavoriteCountry();
      if (!favouriteCountry) {
        await storeFavoriteCountry('Global');
        setFavCountry('Global');
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

  const fetchData = async () => {
    setLoading(true);
    const data = await initialFetch();
    setChannels(data.channels);
    setCountries(data.countries);
    setLoading(false);
  };

  const ListHeaderComponent = useMemo(() => {
    return (
      <View
        style={{
          paddingHorizontal: 10,
          paddingBottom: 10,
        }}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {favCountry !== 'Global'
              ? 'Popular in ' + favCountry
              : 'Trending now'}
          </Text>
          <TouchableOpacity
            style={styles.regionButton}
            onPress={() => navigation.navigate('ChangeCountry')}>
            <WorldIcon width={30} height={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchInput}>
          <TextInput
            style={{flex: 1, color: 'white', fontWeight: 'bold'}}
            value={inputValue}
            onChangeText={value => setInputValue(value)}
            placeholder="Search..."
            placeholderTextColor={'#ccc'}
          />
          {inputValue ? (
            <TouchableOpacity onPress={() => setInputValue('')}>
              <CancelIcon width={16} height={16} />
            </TouchableOpacity>
          ) : (
            <SearchIcon width={26} height={26} />
          )}
        </View>
      </View>
    );
  }, [inputValue, favCountry]);

  const ListEmptyComponent = useCallback(() => {
    return (
      <View style={styles.overlay}>
        {loading ? (
          <LoadingAlert animated />
        ) : error ? (
          <View>
            <Text style={styles.overlayText}>An error occurred</Text>
          </View>
        ) : (
          <Text style={styles.overlayText}>No channel found</Text>
        )}
      </View>
    );
  }, [channels, loading]);

  const data = useMemo(
    () =>
      channels.filter(
        ch =>
          (ch.country === favCountry &&
            ch.name.includes(inputValue.toUpperCase())) ||
          (favCountry === 'Global' &&
            ch.name.includes(inputValue.toUpperCase())),
      ),
    [channels, inputValue, favCountry],
  );

  return (
    <View style={styles.screen}>
      <OrientationLocker orientation={PORTRAIT} />
      <FlatList
        data={data}
        ref={flatlistRef}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ChannelPreview channel={item} />}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshing={loading}
        initialNumToRender={4}
        maxToRenderPerBatch={2}
        windowSize={4}
        showsVerticalScrollIndicator={false}
        onScroll={e => setListAtTop(e.nativeEvent.contentOffset.y < 50)}
      />
      {!listAtTop && (
        <FloatingActionButton
          side="right"
          onPress={() => {
            flatlistRef.current.scrollToOffset({offset: 0, animated: true});
          }}
          style={{
            width: 55,
            backgroundColor: '#000000',
            borderWidth: 1,
            borderColor: APP_THEME.tertiary,
          }}>
          <ArrowTopIcon width={20} height={20} />
        </FloatingActionButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: APP_THEME.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#323232',
    color: APP_THEME.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: APP_THEME.tertiary,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: APP_THEME.secondary,
  },
  regionButton: {
    borderWidth: 1,
    borderColor: APP_THEME.tertiary,
    padding: 6,
    borderRadius: 12,
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

  overlay: {
    marginTop: '55%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: APP_THEME.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
