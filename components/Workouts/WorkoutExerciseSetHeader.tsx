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
                        <Text style={styles.workoutExerciseSetTitleText}>Avg HR</Text>
                        <Text style={styles.workoutExerciseSetTitleText}>Max HR</Text>
                        <Text style={styles.workoutExerciseSetTitleText}>C Prgm</Text>
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
        marginRight: 41,
        justifyContent: 'space-between'
    },
    titleTextSet: {
        fontSize: 14,
        color: '#858585ff',
        width: 42,
    },
    titleTextPrevious: {
        fontSize: 14,
        color: '#858585ff',
        width: 73,
        textAlign: 'center',
    },
    workoutExerciseSetTitleText: {
        fontSize: 14,
        color: '#858585ff',
        width: 40,
        textAlign: 'center',
    },
});