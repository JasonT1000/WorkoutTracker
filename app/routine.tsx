import OptionsHeader from '@/components/OptionsHeader';
import RoutineExercise from '@/components/Routines/RoutineExercise';
import { Exercise, ExerciseWithBodyAreas, NewRoutineExercise, ROUTES } from '@/functions/helperTypes';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DispatchContext, StateContext } from '../state/routine/routineExerciseContext';

export default function Routine() {
  const { existingExercisesWithBodyAreas, newExercises } = useLocalSearchParams()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const [title, onChangeTitle] = useState('')
  const [exercisesWithBodyAreas, setExercisesWithBodyAreas] = useState<ExerciseWithBodyAreas[]>([])

  useEffect(() => {
    if (newExercises) {
      console.log("useEffect running in routine.tsx")
      const parsedExercises = typeof newExercises === 'string'
        ? JSON.parse(newExercises) as Exercise[]
        : [];

      let exerciseStartingIndex = state.routineExercises.length

      const formattedRoutineExercises: NewRoutineExercise[] = parsedExercises.map((exercise, index) => {
        const newRoutineExercise = {
          positionIndex: exerciseStartingIndex,
          routineId: -1,
          exerciseId: exercise.id,
          restTimer: 0,
          notes: "",
          routineExerciseSets: [],
          exerciseInfo: {
            name: exercise.name,
            imageUrl: exercise.imageUrl,
            exerciseTypeId: exercise.exerciseTypeId
          }
        }
        exerciseStartingIndex++

        return newRoutineExercise
      })

      dispatch({ type: 'ADD_NEWROUTINEEXERCISE', payload: formattedRoutineExercises })
    }

  }, [newExercises])


  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <SafeAreaView style={styles.main}>
          <OptionsHeader title='Create Routine' routeString={ROUTES.HOME} />

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

            <View style={{ flex: 1 }}>

              <View style={{ flexShrink: 1 }}>
                <FlatList
                  data={state.routineExercises}
                  keyExtractor={(item) => item.positionIndex.toString()}
                  renderItem={({ item }) => <RoutineExercise routineExercise={item} />}
                />
              </View>

              <TouchableNativeFeedback
                onPress={() => router.navigate({ pathname: '/exercises', params: { existingExercisesWithBodyAreas: JSON.stringify(exercisesWithBodyAreas) } })}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View style={styles.addExercisesButton}>
                  <Text style={styles.addExercisesButtonText}>Add exercises</Text>
                </View>
              </TouchableNativeFeedback>
            </View>

          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
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