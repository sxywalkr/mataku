import React from 'react';
import {Image, SafeAreaView, StyleSheet, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
  height: number;
  colors: string[];
  image?: string;
  imageIcon?: string;
  style?: ViewStyle;
}

function Hero({image, imageIcon, colors, height, children, style}: Props) {
  return (
    <View style={[style, {height}]}>
      {!!image && (
        <Image
          style={[styles.absolute, styles.image]}
          source={{
            uri: image,
          }}
        />
      )}
      {!!imageIcon && (
        <Image
          style={[styles.icon]}
          source={{
            uri: imageIcon,
          }}
        />
      )}
      <LinearGradient colors={colors} style={styles.absolute} />
      <SafeAreaView style={styles.absolute}>{children}</SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  absolute: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  icon: {
    alignSelf: 'center',
    padding: 10,
    width: 120,
    height: 120,
  },
});

export default Hero;
