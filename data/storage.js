import AsyncStorage from '@react-native-async-storage/async-storage';

export const getChannels = async () => {
  const channels = await getFavoriteChannels();
  return channels;
};

export const addChannel = async channel => {
  const channels = await getFavoriteChannels();
  channels.push(channel);
  storeFavoriteChannels(channels);
};

export const removeChannel = async channel_id => {
  const channels = await getFavoriteChannels();
  const updatedChannels = channels.filter(channel => channel.id !== channel_id);
  storeFavoriteChannels(updatedChannels);
};

export const storeFavoriteCountry = async value => {
  try {
    await AsyncStorage.setItem('fav-country', value);
  } catch (e) {
    console.log(e);
  }
};

export const getFavoriteCountry = async value => {
  try {
    const value = await AsyncStorage.getItem('fav-country');
    return value;
  } catch (e) {
    console.log(e);
  }
};

const storeFavoriteChannels = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('fav-channels', jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const getFavoriteChannels = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('fav-channels');
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log(e);
  }
};
