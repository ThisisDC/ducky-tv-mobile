import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ShieldIcon from '../assets/icons/shield.svg';
import React from 'react';
import {APP_THEME} from '../utils/colors';

export default function WelcomeModal({navigation}) {
  return (
    <View style={styles.screen}>
      <View style={styles.modal}>
        <ShieldIcon width={160} height={160} />
        <Text style={styles.hint}>
          It's recommended to use a VPN while using this application.
        </Text>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => navigation.navigate('Home', {confirmed: true})}>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    height: 400,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingTop: 40,
  },
  hint: {
    paddingHorizontal: 20,
    fontSize: 18,
    color: APP_THEME.secondary,
  },
  confirmButton: {
    backgroundColor: APP_THEME.primary,
    height: 50,
    marginHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 16,
    width: 300,
    alignItems: 'center',
  },
});
