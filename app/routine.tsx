import OptionsHeader from '@/components/OptionsHeader';
import RoutineExercise from '@/components/Routines/RoutineExercise';
import { ExerciseWithBodyAreas } from '@/functions/helperTypes';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaProvider>


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

          <View style={{ flex: 1, borderWidth: 1, borderColor: 'yellow' }}>

            <View style={{ flexShrink: 1 }}>
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

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
  },
  body: {
    flex: 1,
    margin: 15,
  },
  routineTitleText: {
    color: '#858585ff',
    fontSize: 24,
    paddingBottom: 15,
    marginBottom: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#585858ff',
  },

  addExerciseButtonContainer: {
    // flex: 1,
    // flexGrow: 3,
    // flexShrink: 1
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