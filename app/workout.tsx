import OptionsHeader from '@/components/OptionsHeader';
import WorkoutExercise from '@/components/Workouts/WorkoutExercise';
import { insertWorkout, insertWorkoutExercises } from '@/db/inserts';
import { getPreviousWorkoutSets } from '@/db/queries/workouts';
import { formatTimerTime, getExerciseSetTypeId } from '@/helperFiles/helperFunctions';
import { Exercise, EXERCISESETTYPE, NewWorkoutExercise, ROUTES } from '@/helperFiles/helperTypes';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import AsyncStorage from 'expo-sqlite/kv-store';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert, AppState, AppStateStatus, FlatList, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DispatchContext, StateContext } from '../state/workout/workoutExerciseContext';

export default function Workout() {
  const { newExercises } = useLocalSearchParams()
  //state
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const [duration, setDuration] = useState<number>(state.duration)
  const [weightVolume, setWeightVolume] = useState<number>(0)
  const [expandedId, setExpandedId] = useState<number>(-1)
  const [exerciseIdCount, setExerciseIdCount] = useState<Record<number, number>>({})
  //refs
  const appState = useRef<AppStateStatus>(AppState.currentState)
  const flatListRef = useRef<FlatList>(null)
  const latestDurationRef = useRef(0)
  const isDiscardingWorkoutRef = useRef(false)
  const exerciseIdCountRef = useRef<Record<number, number>>({})


  // Add newly added exercises to global workout state
  useEffect(() => {
    if (newExercises) {
      setNewExercises()
    }

  }, [newExercises])

  // Start timer
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => prev + 1)
    }, 1000);

    return () => clearInterval(interval)
  }, [])

  // Update timer reference
  useEffect(() => {
    latestDurationRef.current = duration
  }, [duration])

  // When app loses focus, store the current datetime in async storage.
  // When app gains focus, calculate and update the workout duration with stored datetime in async storage 
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        recordCurrentTime()
      }
      else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        //App is active again
        updateDurationWithElapsedTime()
      }

      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [])

  // Store current duration and set a start datetime when we navigate away from this page
  // Timestamp based so dont have to keep a timer going in the background when page loses focus
  useFocusEffect(
    useCallback(() => {
      // Invoked whenever the route is focused.
      if (state.startDatetime > 0) {
        setDuration(state.duration + getElapsed())
      }
      if (state.datetime === '') {
        dispatch({ type: 'UPDATE_WORKOUTDATE' })
      }

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        if (isDiscardingWorkoutRef.current === true) {
          dispatch({ type: 'RESET_NEWWORKOUT' })
        }
        else {
          dispatch({ type: 'UPDATE_WORKOUTDURATION', payload: latestDurationRef.current })
          dispatch({ type: 'UPDATE_WORKOUTSTARTDATETIME' })
        }
      };
    }, []),
  );

  const setNewExercises = async () => {
    console.log("useEffect running in routine.tsx")
    const parsedExercises = typeof newExercises === 'string'
      ? JSON.parse(newExercises) as Exercise[]
      : [];

    let exerciseStartingIndex = state.workoutExercises.length

    let formattedWorkoutExercises: NewWorkoutExercise[] = parsedExercises.map((exercise, index) => {
      const newWorkoutExercise = {
        positionIndex: exerciseStartingIndex,
        workoutId: -1,
        exerciseId: exercise.id,
        restTimer: 0,
        notes: "",
        workoutExerciseSets: [{
          workoutExerciseId: exercise.id,
          exerciseSetTypeId: getExerciseSetTypeId(EXERCISESETTYPE.NORMAL),
          reps: -1,
          isCompleted: false
        }],
        previousExerciseSets: [],
        exerciseInfo: {
          name: exercise.name,
          imageUrl: exercise.imageUrl,
          exerciseTypeId: exercise.exerciseTypeId
        }
      }
      exerciseStartingIndex++

      return newWorkoutExercise
    })

    const updatedExercises = await setPrevSets(formattedWorkoutExercises)

    dispatch({ type: 'ADD_NEWWORKOUTEXERCISES', payload: updatedExercises })
  }

  const setPrevSets = async (newFormattedWorkoutExercises: NewWorkoutExercise[]): Promise<NewWorkoutExercise[]> => {
    let exerciseIdCount: Record<number, number> = {}
    const workoutExercises = [...state.workoutExercises, ...newFormattedWorkoutExercises]

    exerciseIdCount = workoutExercises.reduce((acc, workoutExercise) => {
      acc[workoutExercise.exerciseId] = (acc[workoutExercise.exerciseId] ?? 0) + 1
      return acc
    }, {} as Record<number, number>)

    // loop through and add previous sets to exercise from database
    await Promise.all(
      newFormattedWorkoutExercises.map(async exercise => {
        exercise.previousExerciseSets = await getPreviousWorkoutSets(exercise.exerciseId, exerciseIdCount[exercise.exerciseId])
      })
    )

    return newFormattedWorkoutExercises
  }

  // Store current datetime from async storage and store it for when app becomes active again
  const recordCurrentTime = async () => {
    try {
      const now = Date.now()
      await AsyncStorage.setItem("@start_time", now.toString())
    } catch (error) {
      console.warn(error)
      Alert.alert("Couldnt set current time", "before app went to background")
    }
  }

  // Read datetime stored in async storage and calculate the elapsed time and add it to the current duration
  const updateDurationWithElapsedTime = async () => {
    try {
      const startTime = await AsyncStorage.getItem("@start_time");
      if (startTime) {

        const now = Date.now();
        const elapsedMs = now - parseInt(startTime);
        const seconds = Math.floor((elapsedMs % 60000) / 1000);

        setDuration(latestDurationRef.current + seconds)
      }

    } catch (error) {
      console.warn(error)
      Alert.alert("Couldnt add elapsed time", "when app came back from background")
    }
  }

  // Find elapsed time from when navigated away from workout page to when it was opened again
  const getElapsed = () => {
    const now = Date.now();
    const startTime = state.startDatetime;
    const elapsedMs = now - startTime;
    const seconds = Math.floor((elapsedMs % 60000) / 1000);

    return seconds
  };

  // Change the currently expanded exercise
  const updateExpandedId = (newId: number) => {
    setExpandedId(newId)
  }

  // const scrollToInput = (yOffset: number) => {
  //   if (flatListRef) {
  //     // flatListRef.current?.scrollToIndex({ index: routineExercise.positionIndex, animated: true, viewOffset: -600 })
  //     flatListRef.current?.scrollToOffset({ offset: yOffset, animated: true })
  //   }
  // }

  const saveNewWorkout = () => {
    console.log('state.workoutExercises')
    console.log(state.workoutExercises)
    const { total, completed } = getSetsCompleted()
    let aErrorStrings = []

    if (latestDurationRef.current > 5 && state.workoutExercises.length > 0 && total === completed) {
      saveWorkout()
    }
    else if (latestDurationRef.current > 5 && state.workoutExercises.length > 0 && completed > 0 && total !== completed) {
      Alert.alert('Save Workout', 'Are you sure you want to save this workout?, there are some sets that are not completed yet. Incomplete sets will not be saved', [
        {
          text: 'Save Workout', style: 'default', onPress: () => {
            saveWorkout()
          }
        },
        { text: 'Cancel', style: 'default' }
      ])
    }
    else {
      if (latestDurationRef.current < 5) {
        aErrorStrings.push('minimum workout time is 5 seconds')
      }
      if (state.workoutExercises.length < 1) {
        aErrorStrings.push('your workout needs some exercises')
      }
      if (completed === 0) {
        aErrorStrings.push('you have no completed sets')
      }

      aErrorStrings[0] = aErrorStrings[0].charAt(0).toUpperCase() + aErrorStrings[0].slice(1);
      Alert.alert('Whoopsie doodle', aErrorStrings.join(' and '))
    }
  }

  const getSetsCompleted = (): { total: number, completed: number } => {
    let total = 0
    let completed = 0

    for (const workoutExercise of state.workoutExercises) {
      total += workoutExercise.workoutExerciseSets.length
      completed += workoutExercise.workoutExerciseSets.filter(workoutSet => workoutSet.isCompleted).length
    }

    return { total: total, completed: completed }
  }

  const saveWorkout = async () => {
    console.log('%%%%%%%%%%%%% saving workout to database')
    const workoutId = await insertWorkout(state.routineId, state.datetime, latestDurationRef.current, state.notes)
    console.log("inserted new routine into database with workoutId")
    console.log(workoutId[0].insertedId)
    if (workoutId[0].insertedId) {
      try {
        await insertWorkoutExercises(workoutId[0].insertedId, state.workoutExercises)
        dispatch({ type: 'RESET_NEWWORKOUT' })
        isDiscardingWorkoutRef.current = true
        router.replace(ROUTES.HOME)
      } catch (error) {
        console.warn('failled to save new routine', error)
      }
    }
  }

  const removeExercise = (exerciseIndex: number, exerciseName: string) => {
    // remove exercise from global state
    Alert.alert('Remove Exercise', `Are you sure you want to remove exercise ${exerciseName}?`, [
      {
        text: 'Remove Exercise', style: 'cancel', onPress: () => {
          dispatch({
            type: 'REMOVE_NEWWORKOUTEXERCISE', payload: {
              exerciseIndex: exerciseIndex,
            }
          })
        }
      },
      { text: 'Cancel', style: 'default' }
    ])
  }

  const onHandleDiscardWorkout = () => {
    Alert.alert('', 'Are you sure you want to discard this workout?', [
      {
        text: 'Discard Workout', style: 'cancel', onPress: () => {
          // dispatch({ type: 'RESET_NEWWORKOUT' })
          isDiscardingWorkoutRef.current = true
          router.replace(ROUTES.HOME)
        }
      },
      { text: 'Cancel', style: 'default' }
    ])
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <SafeAreaView style={styles.main}>
          <OptionsHeader title='New Workout' cancelButtonRoute={ROUTES.HOME} save={saveNewWorkout} />

          <View style={styles.body}>

            <View style={styles.workoutInfoContainer}>
              <View style={styles.workoutInfoColumn}>
                <Text style={styles.workoutInfoHeading}>Duration</Text>
                <Text style={styles.workoutInfoTextTime}>{formatTimerTime(duration)}</Text>

              </View>
              <View style={styles.workoutInfoColumn}>
                <Text style={styles.workoutInfoHeading}>Volume</Text>
                <Text style={styles.workoutInfoText}>0 kg</Text>
              </View>
            </View>

            <View style={{ flex: 1 }}>

              <View style={{ flexShrink: 1 }}>
                {/* <KeyboardAvoidingView behavior='position' enabled={true} style={{ flex: 1 }}> */}
                <FlatList
                  ref={flatListRef}
                  keyboardShouldPersistTaps='never'
                  data={state.workoutExercises}
                  keyExtractor={(item) => item.positionIndex.toString()}
                  renderItem={({ item }) => <WorkoutExercise workoutExercise={item} flatListRef={flatListRef} expandedId={expandedId} updateExpandedId={updateExpandedId} removeExercise={removeExercise} />}
                />
                {/* </KeyboardAvoidingView> */}
              </View>

              <TouchableNativeFeedback
                onPress={() => router.navigate({ pathname: ROUTES.EXERCISE, params: { returnRoute: ROUTES.WORKOUT } })}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View style={styles.addExercisesButton}>
                  <Text style={styles.addExercisesButtonText}>Add exercises</Text>
                </View>
              </TouchableNativeFeedback>

              <TouchableNativeFeedback
                onPress={() => onHandleDiscardWorkout()}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View style={styles.discardWorkoutButton}>
                  <Text style={styles.discardWorkoutButtonText}>Discard Workout</Text>
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

  workoutInfoContainer: {
    flexDirection: 'row',
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#585858ff',
    justifyContent: 'space-evenly'
  },
  workoutInfoColumn: {
    flexDirection: 'column',
    flex: 1,
  },
  workoutInfoHeading: {
    color: '#858585ff',
    fontSize: 14,
    textAlign: 'center'
  },
  workoutInfoTextTime: {
    color: '#0160adff',
    fontSize: 16,
    textAlign: 'center'
  },
  workoutInfoText: {
    color: '#ffffffff',
    fontSize: 16,
    textAlign: 'center'
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
  discardWorkoutButton: {
    width: '100%',
    backgroundColor: '#272727ff',
    padding: 8,
    borderRadius: 10,
    marginTop: 15,
  },
  discardWorkoutButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#da423cff'
  },
});