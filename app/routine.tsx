import OptionsHeader from '@/components/OptionsHeader';
import RoutineExercise from '@/components/Routines/RoutineExercise';
import { ExerciseWithBodyAreas } from '@/functions/helperTypes';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Routine() {
  const { selectedExercises } = useLocalSearchParams()
  const [title, onChangeTitle] = useState('')
  const [routineExercises, setRoutineExercises] = useState<ExerciseWithBodyAreas[]>([])

  useEffect(() => {
    if (selectedExercises) {
      console.log("------------- selectedExercises passed to the routine page")
      console.log(selectedExercises)
      const parsedExercises = typeof selectedExercises === 'string'
        ? JSON.parse(selectedExercises) as ExerciseWithBodyAreas[]
        : []

      console.log("------------- parsedExercises passed to the routine page")
      console.log(parsedExercises)
      setRoutineExercises(parsedExercises)
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
          <FlatList
            data={routineExercises}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RoutineExercise routineExercise={item} />}
          />
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