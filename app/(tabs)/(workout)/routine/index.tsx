import OptionsHeader from '@/components/OptionsHeader';
import { toTitleCase } from '@/functions/helperFunctions';
import { ExerciseWithBodyAreas } from '@/functions/helperTypes';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { selectedExercises } = useLocalSearchParams()
  const [title, onChangeTitle] = useState('')
  const [exerciseName, setExerciseName] = useState('Exercise Name')

  useEffect(() => {
    if (selectedExercises) {
      console.log("------------- selectedExercises passed to the routine page")
      const parsedExercises = typeof selectedExercises === 'string'
        ? JSON.parse(selectedExercises) as ExerciseWithBodyAreas[]
        : []

      console.log(parsedExercises)
      setExerciseName(parsedExercises[0].name)
    }

  }, [selectedExercises])

  return (
    <SafeAreaView style={styles.main}>

      <OptionsHeader title='Create Routine' />

      <View style={styles.body}>
        <View>
          <TextInput
            style={styles.routineTitleText}
            onChangeText={onChangeTitle}
            value={title}
            placeholder='Routine title'
            placeholderTextColor={'#858585ff'}
          />
        </View>
        <View>
          <View style={styles.routineExerciseContainer}>
            <View style={styles.routineExerciseTitleContainer}>
              <Image source={require('@/assets/images/react-logo.png')} style={styles.exerciseImage} />
              <Text style={styles.routineExerciseTitle}>{toTitleCase(exerciseName)}</Text>

              <TouchableNativeFeedback
                onPress={() => { Alert.alert('Edit exercise dots pressed') }}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View style={styles.exerciseEditButtonContainer}>
                  <Entypo name="dots-three-horizontal" size={24} color="white" />
                </View>
              </TouchableNativeFeedback>
            </View>

            <TextInput
              style={styles.routineExerciseNotesText}
              placeholder='Add routine exercise notes here'
              placeholderTextColor={'#858585ff'}
            />
            <TouchableNativeFeedback
              onPress={() => { Alert.alert('Edit exercise dots pressed') }}
              background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
              <View style={styles.routineExerciseTimerContainer}>
                <MaterialCommunityIcons name="timer-outline" size={24} color="white" />
                <Text style={styles.routineExerciseTimerText}>Rest Timer: OFF</Text>
              </View>
            </TouchableNativeFeedback>

            <View style={styles.routineExerciseSetContainer}>
              <View style={styles.routineExerciseSetTitleContainer}>
                <Text style={styles.routineExerciseSetTitleText}>SET</Text>
                <Text style={styles.routineExerciseSetTitleText}>KG</Text>
                <Text style={styles.routineExerciseSetTitleText}>REPS</Text>
                {/* <Text style={styles.routineExerciseSetTitleText}>KM</Text>
                <Text style={styles.routineExerciseSetTitleText}>TIME</Text> */}
              </View>
              <View style={styles.routineExerciseSetRowContainer}>
                <Text style={styles.routineExerciseSetDataText}>1</Text>
                <TextInput
                  style={styles.routineExerciseSetDataText}
                  placeholder='-'
                  placeholderTextColor={'#858585ff'}
                  keyboardType='number-pad'
                />
                <TextInput
                  style={styles.routineExerciseSetDataText}
                  placeholder='-'
                  placeholderTextColor={'#858585ff'}
                  keyboardType='number-pad'
                />
              </View>
              <View style={styles.routineExerciseSetTitleContainer}>
                <Text style={styles.routineExerciseSetDataText}>1</Text>
                <TextInput
                  style={styles.routineExerciseSetDataText}
                  placeholder='-'
                  placeholderTextColor={'#858585ff'}
                  keyboardType='number-pad'
                />
                <TextInput
                  style={styles.routineExerciseSetDataText}
                  placeholder='-'
                  placeholderTextColor={'#858585ff'}
                  keyboardType='number-pad'
                />
              </View>
              <TouchableNativeFeedback
                onPress={() => Alert.alert("Added set")}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View style={styles.addExerciseSetButton}>
                  <Text style={styles.addExercisesButtonText}>Add Set</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>

        <TouchableNativeFeedback
          onPress={() => router.navigate({ pathname: '/exercises' })}
          background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
          <View style={styles.addExercisesButton}>
            <Text style={styles.addExercisesButtonText}>Add exercises</Text>
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
    // margin: 15,
  },
  body: {
    // flex: 1,
    margin: 15,
  },
  routineExercisesContainer: {
    color: 'white',
    fontSize: 24,
    alignContent: 'center',
    verticalAlign: 'middle',
    textAlign: 'center'
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#353535ff',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },

  saveButton: {
    backgroundColor: '#afafafff',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 10,
  },
  cancelButton: {
    paddingVertical: 7,
    paddingRight: 13,
    borderRadius: 10,
  },
  optionsText: {
    fontSize: 18,
    color: '#ffffffff',
  },
  cancelButtonText: {
    fontSize: 18,
    color: '#006ec9ff',
  },
  routineTitleText: {
    color: '#858585ff',
    fontSize: 24,
    paddingBottom: 15,
    marginBottom: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#585858ff',
  },

  topSectionContainer: {
    borderWidth: 1,
    borderColor: 'yellow',
    paddingBottom: 10,
  },

  routineExerciseContainer: {
    flexDirection: 'column',
    gap: 5,
    borderWidth: 1,
    // borderColor: '#f50000ff',
    // paddingVertical: 10,
  },
  routineExerciseTitleContainer: {
    flexDirection: 'row',
  },
  exerciseImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    // borderWidth: 1,
    // borderColor: '#001affff',
  },
  routineExerciseTitle: {
    color: '#ffffffff',
    fontSize: 20,
    verticalAlign: 'middle',
    flex: 1,
  },
  exerciseEditButtonContainer: {
    color: '#d6d6d6ff',
    padding: 10,
    alignSelf: 'center',
    // borderWidth: 1,
    // borderColor: '#001affff',
  },
  routineExerciseNotesText: {
    color: '#858585ff',
    fontSize: 18,
    paddingBottom: 15,
    borderWidth: 1,
    borderColor: '#585858ff',
  },
  routineExerciseTimerContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  routineExerciseTimerText: {
    color: '#858585ff',
    fontSize: 18,
    verticalAlign: 'middle',
  },
  routineExerciseSetContainer: {
    flexDirection: 'column',
    gap: 5,
    paddingBottom: 10,
    borderBottomColor: '#353535ff',
    borderBottomWidth: 1,
  },
  routineExerciseSetTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  routineExerciseSetTitleText: {
    fontSize: 18,
    color: '#858585ff',
    width: 100,
    textAlign: 'center',
  },
  routineExerciseSetRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  routineExerciseSetDataContainer: {
    flexDirection: 'row',
  },
  routineExerciseSetDataText: {
    fontSize: 18,
    color: '#ffffffff',
    width: 100,
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  addExerciseSetButton: {
    width: '100%',
    backgroundColor: '#353535ff',
    padding: 8,
    borderRadius: 10,
  },


  addExercisesButton: {
    width: '100%',
    backgroundColor: '#0fb800ff',
    padding: 8,
    borderRadius: 10,
  },
  addExercisesButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ffffffff'
  },
});