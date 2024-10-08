import {create} from 'zustand';

export const useConfigStore = create(set => ({
  channels: [],
  favChannels: [],
  favCountry: '',
  countries: [],
  setChannels: channels => set(state => ({channels: channels})),
  setFavChannels: channels => set(state => ({favChannels: channels})),
  addFavChannel: channel =>
    set(state => ({favChannels: [...state.favChannels, channel]})),
  removeFavChannel: channelId =>
    set(state => {
      const updatedChannels = state.favChannels.filter(
        channel => channel.id !== channelId,
      );
      return {favChannels: updatedChannels};
    }),
  setFavCountry: country => set(state => ({favCountry: country})),
  setCountries: countries => set(state => ({countries: countries})),
}));
