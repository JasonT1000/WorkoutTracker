import { formatTimerTime } from '@/helperFiles/helperFunctions';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from 'expo-sqlite/kv-store';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert, AppState, AppStateStatus, StyleSheet, Text, View } from 'react-native';
import { DispatchContext, StateContext } from '../state/workout/workoutExerciseContext';

type InfoContainerProps = {
  isDiscardingWorkoutRef: React.RefObject<boolean>
}
export default function InfoContainer({isDiscardingWorkoutRef} : InfoContainerProps) {
  //context
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  //refs
  const appState = useRef<AppStateStatus>(AppState.currentState)
  const latestDurationRef = useRef(0)

  //state
  const [duration, setDuration] = useState<number>(state.duration)
  
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

  // When navigating away from this page store current duration and set a start datetime when we navigate away from this page
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

    // Find elapsed time from when navigated away from workout page to when it was opened again
  const getElapsed = () => {
    const now = Date.now();
    const startTime = state.startDatetime;
    const elapsedMs = now - startTime;
    const seconds = Math.floor((elapsedMs % 60000) / 1000);

    return seconds
  };

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
  
  return (
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
  )
}

export const styles = StyleSheet.create({
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
  }
})