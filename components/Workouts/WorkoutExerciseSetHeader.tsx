import { EXERCISETYPE, ExerciseTypes } from '@/helperFiles/helperTypes';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type WorkoutExerciseSetHeaderProps = {
    exerciseTypeId: number
}

export default function WorkoutExerciseSetHeader({ exerciseTypeId }: WorkoutExerciseSetHeaderProps) {
    return (
        <View style={styles.workoutExerciseSetHeaderContainer}>

            <Text style={styles.titleTextSet}>SET</Text>
            <Text style={styles.titleTextPrevious}>PREVIOUS</Text>

            {
                ExerciseTypes[exerciseTypeId] === EXERCISETYPE.WEIGHT &&
                (
                    <>
                        <Text style={styles.workoutExerciseSetTitleText}>KG</Text>
                        <Text style={styles.workoutExerciseSetTitleText}>REPS</Text>
                    </>
                )
            }
            {
                ExerciseTypes[exerciseTypeId] === EXERCISETYPE.BODYWEIGHT &&
                (
                    <Text style={styles.workoutExerciseSetTitleText}>REPS</Text>
                )
            }
            {
                ExerciseTypes[exerciseTypeId] === EXERCISETYPE.CARDIO &&
                (
                    <>
                        <Text style={styles.workoutExerciseSetTitleText}>KM</Text>
                        <Text style={styles.workoutExerciseSetTitleText}>TIME</Text>
                    </>
                )
            }
            {
                ExerciseTypes[exerciseTypeId] === EXERCISETYPE.STRETCH &&
                (
                    <>
                        <Text style={styles.workoutExerciseSetTitleText}>TIME</Text>
                    </>
                )
            }

        </View>
    )
}

const styles = StyleSheet.create({
    workoutExerciseSetHeaderContainer: {
        flexDirection: 'row',
        flex: 1,
        gap: 5,
    },
    titleTextSet: {
        fontSize: 14,
        color: '#858585ff',
        width: 60,
        textAlign: 'center',
    },
    titleTextPrevious: {
        fontSize: 14,
        color: '#858585ff',
        width: 80,
        textAlign: 'center',
    },
    workoutExerciseSetTitleText: {
        fontSize: 14,
        color: '#858585ff',
        width: 80,
        textAlign: 'center',
    },
});