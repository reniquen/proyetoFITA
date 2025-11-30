
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAvatar } from './AvatarContext';
import { LOTTIE_ASSETS } from './AvatarAssets';
import LottieView from 'lottie-react-native'; 

export default function AvatarCoach() {
  const { avatar, isLoading } = useAvatar(); 
  const [consejo, setConsejo] = useState('');



  if (isLoading || !avatar) {
    return null;
  }

  return (
    <View style={styles.container}>
      {}
      <View style={styles.avatarPreview}>
        <LottieView
          source={LOTTIE_ASSETS[avatar]} 
          autoPlay
          loop
          style={styles.lottieAvatar}
        />
      </View>
      <Text style={styles.consejo}>{consejo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fad7a0',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarPreview: {
    width: 150, 
    height: 150,
    marginBottom: 10,
  },
  lottieAvatar: {
    width: '100%',
    height: '100%',
  },
  consejo: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});