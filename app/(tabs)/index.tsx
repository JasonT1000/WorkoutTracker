import { Image, StyleSheet, View } from 'react-native';

import SvgComponent from '@/components/SvgImage';

export default function HomeScreen() {
  return (
    <View style={styles.imagesContainer}>
      <Image
        style={styles.imageTestTwo}
        width={250}
        height={250}
        source={require('../../assets/images/Musculature_FrontBack_Foreground.png')}
      />

      <View style={styles.imageTestOne}>
        <SvgComponent />
      </View>

      <Image
        style={styles.imageTestTwo}
        width={250}
        height={250}
        source={require('../../assets/images/Musculature_FrontBack_Background.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imagesContainer: {

  },
  // titleContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 8,
  // },
  // stepContainer: {
  //   gap: 8,
  //   marginBottom: 8,
  // },
  // reactLogo: {
  //   height: 178,
  //   width: 290,
  //   bottom: 0,
  //   left: 0,
  //   position: 'absolute',
  // },
  imageTestOne: {
    position: 'absolute',
    left: 50,
    top: 30,
  },
  imageTestTwo: {
    position: 'absolute',
    left: 50,
    top: 30,
    resizeMode: 'contain',
  }
});
