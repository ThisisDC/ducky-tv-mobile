import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {useConfigStore} from '../data/store';
import CancelIcon from '../assets/icons/cancel.svg';
import {storeFavoriteCountry} from '../data/storage';
import {APP_THEME} from '../utils/colors';

export default function ChangeCountryModal({navigation}) {
  const countries = useConfigStore(state => state.countries);
  const favCountry = useConfigStore(state => state.favCountry);
  const setFavCountry = useConfigStore(state => state.setFavCountry);

  return (
    <View style={styles.screen}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose a favorite region</Text>
        </View>
        <ScrollView style={styles.countriesList}>
          {countries.map(country => (
            <CountryButton
              key={country}
              country={country}
              favCountry={favCountry}
              onPress={() => {
                setFavCountry(country);
                storeFavoriteCountry(country);
                navigation.goBack();
              }}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const CountryButton = ({country, onPress, favCountry}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: 'center',
        }}
        onPress={onPress}>
        <Text
          style={[
            styles.country,
            {
              color:
                favCountry === country
                  ? APP_THEME.primary
                  : APP_THEME.secondary,
              fontWeight: favCountry === country ? 'bold' : '400',
            },
          ]}>
          {country}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000078',
  },
  modal: {
    alignSelf: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 25,
    borderRadius: 24,
    height: 600,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50,
    paddingRight: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  countriesList: {
    paddingHorizontal: 4,
    flex: 1,
  },
  country: {
    fontSize: 20,
    marginBottom: 10,
    color: 'white',
  },
});
