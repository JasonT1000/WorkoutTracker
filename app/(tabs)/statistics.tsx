import SvgComponent from '@/components/SvgImage';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Statistics() {
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topSectionContainer}>
        <View style={styles.days}>
          <Text style={styles.text}>Last 7 days body heat map</Text>
          <View style={styles.daysRowContainer}>
            <View style={styles.dayInfo}>
              <Text style={styles.dayInfoText}>M</Text>
              <Text style={[styles.dayInfoText, styles.dayNumber]}>18</Text>
            </View>
            <View style={styles.dayInfo}>
              <Text style={styles.dayInfoText}>T</Text>
              <Text style={[styles.dayInfoText, styles.dayNumber]}>19</Text>
            </View>
            <View style={styles.dayInfo}>
              <Text style={styles.dayInfoText}>W</Text>
              <Text style={[styles.dayInfoText, styles.dayNumber]}>20</Text>
            </View>
            <View style={styles.dayInfo}>
              <Text style={styles.dayInfoText}>T</Text>
              <Text style={[styles.dayInfoText, styles.dayNumber]}>20</Text>
            </View>
            <View style={styles.dayInfo}>
              <Text style={styles.dayInfoText}>F</Text>
              <Text style={[styles.dayInfoText, styles.dayNumber]}>20</Text>
            </View>
            <View style={styles.dayInfo}>
              <Text style={styles.dayInfoText}>S</Text>
              <Text style={[styles.dayInfoText, styles.dayNumber]}>20</Text>
            </View>
            <View style={styles.dayInfo}>
              <Text style={styles.dayInfoText}>S</Text>
              <Text style={[styles.dayInfoText, styles.dayNumber]}>20</Text>
            </View>
          </View>
        </View>

        <View style={styles.imagesContainer}>
          <Image
            style={styles.image}
            width={250}
            height={250}
            source={require('../../assets/images/Musculature_FrontBack_Foreground.png')}
          />

          <View style={styles.imageSvg}>
            <SvgComponent />
          </View>

          <Image
            style={styles.image}
            width={250}
            height={250}
            source={require('../../assets/images/Musculature_FrontBack_Background.png')}
          />
        </View>
      </View>
      <View style={styles.bottomSectionContainer}>
        <Text style={styles.text}>Other Statistics</Text>
        <TouchableNativeFeedback>
          <View style={styles.statisticItemContainer}>
            <Octicons style={{ flex: .2 }} name="graph" size={24} color="white" />
            <View style={{ flex: 1 }}>
              <Text style={styles.text}>Set count</Text>
              <Text style={styles.dayInfoText}>Number of sets logged for each muscle group</Text>
            </View>
            <AntDesign name="arrowright" size={20} color="white" />
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback>
          <View style={styles.statisticItemContainer}>
            <Octicons style={{ flex: .2 }} name="graph" size={24} color="white" />
            <View style={{ flex: 1 }}>
              <Text style={styles.text}>Weight change</Text>
              <Text style={styles.dayInfoText}>Weight change per exercise</Text>
            </View>
            <AntDesign name="arrowright" size={20} color="white" />
          </View>
        </TouchableNativeFeedback>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    margin: 15,
  },
  text: {
    color: 'white',
    fontSize: 24,
  },

  topSectionContainer: {
    borderWidth: 1,
    borderColor: 'yellow'
  },
  days: {

  },
  daysRowContainer: {
    flexDirection: 'row',
    columnGap: 7,
    marginTop: 10,
  },
  dayInfo: {
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 1,
    paddingVertical: 8,
    justifyContent: 'space-between',
    backgroundColor: '#5c5b5bff',
    flex: 1,
  },
  dayInfoText: {
    color: 'white',
    fontSize: 13
  },
  dayNumber: {
    borderRadius: 100,
    padding: 8,
    backgroundColor: '#2ca0ffff',
  },
  imagesContainer: {
    height: 250,
    borderWidth: 1,
    borderColor: 'red'
  },
  imageSvg: {
    alignSelf: 'center',
  },
  image: {
    position: 'absolute',
    alignSelf: 'center',
    resizeMode: 'contain',
  },

  bottomSectionContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'green',
    backgroundColor: '#999999',
    rowGap: 1,
  },
  statisticItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    backgroundColor: '#0c0c0cff'
  }
});