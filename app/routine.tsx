import OptionsHeader from '@/components/OptionsHeader';
import RoutineExercise from '@/components/Routines/RoutineExercise';
import { dbInsertRoutine, dbInsertRoutineExercises, dbUpdateRoutine, dbUpdateRoutineExercises } from '@/db/inserts';
import { getExerciseSetTypeId } from '@/helperFiles/helperFunctions';
import { Exercise, EXERCISESETTYPE, NewRoutineExercise, ROUTES } from '@/helperFiles/helperTypes';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DispatchContext, StateContext } from '../state/routine/routineExerciseContext';

export default function Routine() {
  const { newExercises } = useLocalSearchParams()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const [title, onChangeTitle] = useState(state.routineName)
  const [expandedId, setExpandedId] = useState<number>(-1)
  //refs
  const flatListRef = useRef<FlatList>(null)

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
          routineExerciseSets: [{
            routineExerciseId: exercise.id,
            exerciseSetTypeId: getExerciseSetTypeId(EXERCISESETTYPE.NORMAL),
            reps: -1
          }],
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


  const updateExpandedId = (newId: number) => {
    setExpandedId(newId)
  }

  // const scrollToInput = (yOffset: number) => {
  //   if (flatListRef) {
  //     // flatListRef.current?.scrollToIndex({ index: routineExercise.positionIndex, animated: true, viewOffset: -600 })
  //     flatListRef.current?.scrollToOffset({ offset: yOffset, animated: true })
  //   }
  // }

  const updateRoutineTitle = () => {
    dispatch({ type: 'UPDATE_ROUTINENAME', payload: title })
  }

  const saveRoutine = async () => {
    if (state.routineName !== '' && state.routineExercises.length > 0) {
      if (state.routineId > 0) {
        const isvalidRoutine = await dbUpdateRoutine(state.routineId, title)

        if (isvalidRoutine) {
          await dbUpdateRoutineExercises(state.routineId, state.routineExercises)
          dispatch({ type: 'RESET_NEWROUTINE' })
          router.replace(ROUTES.HOME)
        }
        else {
          Alert.alert('Something went wrong', 'Could not find existing routine to update')
        }
      }
      else {
        console.log("$$$$$$$$$ saving new routine to database")
        const routineId = await dbInsertRoutine(state.routineName)
        console.log("inserted new routine into database with routineId")
        console.log(routineId[0].insertedId)
        if (routineId[0].insertedId) {
          try {
            await dbInsertRoutineExercises(routineId[0].insertedId, state.routineExercises)
            dispatch({ type: 'RESET_NEWROUTINE' })
            router.replace(ROUTES.HOME)
          } catch (error) {
            console.warn('failled to save new routine', error)
          }
        }
      }
    }
    else {
      if (state.routineName === '' && state.routineExercises.length < 1) {
        Alert.alert('Whoopsie doodle, your routine needs a name and some exercises')
      }
      else if (state.routineName === '') {
        Alert.alert('Whoopsie doodle, your routine needs a name')
      }
      else {
        Alert.alert('Whoopsie doodle, your routine needs some exercises')
      }
    }
  }

  const onHandleDiscardRoutine = () => {
    Alert.alert('', 'Are you sure you want to discard this routine?', [
      {
        text: 'Discard Routine', style: 'cancel', onPress: () => {
          dispatch({ type: 'RESET_NEWROUTINE' })
          // isDiscardingWorkoutRef.current = true
          router.replace(ROUTES.HOME)
        }
      },
      { text: 'Cancel', style: 'default' }
    ])
  }

  const showRoutineExerciseMenu = (routineExerciseIndex: number, routineExerciseId: number) => {
    Alert.alert('', 'Are you sure you want to delete this exercise?', [
      {
        text: 'Delete Exercise', style: 'cancel', onPress: () => {
          dispatch({ type: 'REMOVE_NEWROUTINEEXERCISE', payload: { routineExerciseIndex, routineExerciseId } })
        }
      },
      { text: 'Cancel', style: 'default' }
    ])
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <SafeAreaView style={styles.main}>
          <OptionsHeader title='Create Routine' cancelButtonRoute={ROUTES.HOME} save={saveRoutine} />

          <View style={styles.body}>

            <View>
              <TextInput
                style={styles.routineTitleText}
                onChangeText={onChangeTitle}
                value={title}
                placeholder='Routine title'
                placeholderTextColor={'#858585ff'}
                onSubmitEditing={updateRoutineTitle}
                onBlur={updateRoutineTitle}
              />
            </View>

            <View style={{ flex: 1 }}>

              <View style={{ flexShrink: 1 }}>
                {/* <KeyboardAvoidingView behavior='position' enabled={true} style={{ flex: 1 }}> */}
                <FlatList
                  ref={flatListRef}
                  keyboardShouldPersistTaps='never'
                  data={state.routineExercises}
                  keyExtractor={(item) => item.positionIndex.toString()}
                  renderItem={({ item }) => <RoutineExercise routineExercise={item} flatListRef={flatListRef} expandedId={expandedId} updateExpandedId={updateExpandedId} showRoutineExerciseMenu={showRoutineExerciseMenu} />}
                />
                {/* </KeyboardAvoidingView> */}
              </View>

              <TouchableNativeFeedback
                onPress={() => router.navigate({ pathname: ROUTES.EXERCISE, params: { returnRoute: ROUTES.ROUTINE } })}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View style={styles.addExercisesButton}>
                  <Text style={styles.addExercisesButtonText}>Add exercises</Text>
                </View>
              </TouchableNativeFeedback>

              <TouchableNativeFeedback
                onPress={() => onHandleDiscardRoutine()}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View style={styles.discardRoutineButton}>
                  <Text style={styles.discardRoutineButtonText}>Discard Routine</Text>
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

  discardRoutineButton: {
    width: '100%',
    backgroundColor: '#272727ff',
    padding: 8,
    borderRadius: 10,
    marginTop: 15,
  },
  discardRoutineButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#da423cff'
  },
});