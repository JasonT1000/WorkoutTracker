import OptionsHeader from '@/components/OptionsHeader';
import WorkoutExercise from '@/components/Workouts/WorkoutExercise';
import { formatTimerTime, getExerciseSetTypeId } from '@/helperFiles/helperFunctions';
import { Exercise, EXERCISESETTYPE, ExerciseWithBodyAreas, NewWorkoutExercise, ROUTES } from '@/helperFiles/helperTypes';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DispatchContext, StateContext } from '../state/workout/workoutExerciseContext';

export default function Workout() {
  const { existingExercisesWithBodyAreas, newExercises } = useLocalSearchParams()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const [duration, setDuration] = useState<number>(state.duration)
  const [weightVolume, setWeightVolume] = useState<number>(0)
  const [exercisesWithBodyAreas, setExercisesWithBodyAreas] = useState<ExerciseWithBodyAreas[]>([])
  const [expandedId, setExpandedId] = useState<number>(-1)
  //refs
  const flatListRef = useRef<FlatList>(null)
  const latestDurationRef = useRef(0)
  const isDiscardingWorkoutRef = useRef(false)

  useEffect(() => {
    if (newExercises) {
      console.log("useEffect running in routine.tsx")
      const parsedExercises = typeof newExercises === 'string'
        ? JSON.parse(newExercises) as Exercise[]
        : [];

      let exerciseStartingIndex = state.workoutExercises.length

      console.log('parsedExercises: ', parsedExercises)

      const formattedWorkoutExercises: NewWorkoutExercise[] = parsedExercises.map((exercise, index) => {
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
          exerciseInfo: {
            name: exercise.name,
            imageUrl: exercise.imageUrl,
            exerciseTypeId: exercise.exerciseTypeId
          }
        }
        exerciseStartingIndex++

        return newWorkoutExercise
      })

      dispatch({ type: 'ADD_NEWWORKOUTEXERCISE', payload: formattedWorkoutExercises })
    }

  }, [newExercises])

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => prev + 1)
    }, 1000);

    // return () => clearInterval(interval)

    return () => {
      clearInterval(interval)
    }

    // // Timestamp based so dont have to keep a timer going in the background
    // const startTime = Date.now();

    // const getElapsed = () => {
    //   const now = Date.now();
    //   const elapsedMs = now - startTime;
    //   const minutes = Math.floor(elapsedMs / 60000);
    //   const seconds = Math.floor((elapsedMs % 60000) / 1000);
    //   return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    // };
  }, [])

  useEffect(() => {
    latestDurationRef.current = duration
  }, [duration])

  useFocusEffect(
    useCallback(() => {
      // Invoked whenever the route is focused.
      // Timestamp based so dont have to keep a timer going in the background when page loses focus
      if (state.startDatetime > 0) {
        const startTime = state.startDatetime;

        const getElapsed = () => {
          const now = Date.now();
          const elapsedMs = now - startTime;
          const seconds = Math.floor((elapsedMs % 60000) / 1000);

          return seconds
        };

        setDuration(state.duration + getElapsed())
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


  const updateExpandedId = (newId: number) => {
    setExpandedId(newId)
  }

  // const scrollToInput = (yOffset: number) => {
  //   if (flatListRef) {
  //     // flatListRef.current?.scrollToIndex({ index: routineExercise.positionIndex, animated: true, viewOffset: -600 })
  //     flatListRef.current?.scrollToOffset({ offset: yOffset, animated: true })
  //   }
  // }

  const updateWorkoutDuration = () => {
    dispatch({ type: 'UPDATE_WORKOUTDURATION', payload: duration })
  }

  const saveNewWorkout = async () => {
    if (state.duration > 5 && state.workoutExercises.length > 0) {
      console.log('%%%%%%%%%%%%% saving workout to database')
      // console.log("$$$$$$$$$ saving new routine to database")
      // const workoutId = await insertWorkout(state.routineId, state.datetime, duration, state.notes)
      // console.log("inserted new routine into database with workoutId")
      // console.log(workoutId[0].insertedId)
      // if (workoutId[0].insertedId) {
      //   try {
      //     await insertWorkoutExercises(workoutId[0].insertedId, state.workoutExercises)
      //     dispatch({ type: 'RESET_NEWWORKOUT' })
      //     router.replace(ROUTES.HOME)
      //   } catch (error) {
      //     console.warn('failled to save new routine', error)
      //   }
      // }
    }
    else {
      if (duration < 5 && state.workoutExercises.length < 1) {
        Alert.alert('Whoopsie doodle', 'Minimum workout time is 5 seconds and your workout needs some exercises')
      }
      else if (duration < 5) {
        Alert.alert('Whoopsie doodle', 'Minimum workout time is 5 seconds')
      }
      else {
        Alert.alert('Whoopsie doodle', 'Your workout needs some exercises')
      }
    }
  }

  const onHandleDiscardWorkout = () => {
    Alert.alert('Discard Workout', 'Are you sure you want to discard this workout?', [
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
                  renderItem={({ item }) => <WorkoutExercise workoutExercise={item} flatListRef={flatListRef} expandedId={expandedId} updateExpandedId={updateExpandedId} />}
                />
                {/* </KeyboardAvoidingView> */}
              </View>

              <TouchableNativeFeedback
                onPress={() => router.navigate({ pathname: ROUTES.EXERCISE, params: { returnRoute: ROUTES.WORKOUT, existingExercisesWithBodyAreas: JSON.stringify(exercisesWithBodyAreas) } })}
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
    color: '#f02e2eff'
  },
});