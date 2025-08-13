import { EXERCISETYPE, ExerciseTypes } from '@/functions/helperTypes';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type RoutineExerciseSetHeaderProps = {
    exerciseTypeId: number
}

export default function RoutineExerciseSetHeader({ exerciseTypeId }: RoutineExerciseSetHeaderProps) {
    return (
        <View style={styles.routineExerciseSetHeaderContainer}>
            {
                ExerciseTypes[exerciseTypeId] === EXERCISETYPE.WEIGHT &&
                (
                    <>
                        <Text style={styles.routineExerciseSetTitleText}>SET</Text>
                        <Text style={styles.routineExerciseSetTitleText}>KG</Text>
                        <Text style={styles.routineExerciseSetTitleText}>REPS</Text>
                    </>
                )
            }
            {
                ExerciseTypes[exerciseTypeId] === EXERCISETYPE.BODYWEIGHT &&
                (
                    <>
                        <Text style={styles.routineExerciseSetTitleText}>SET</Text>
                        <Text style={styles.routineExerciseSetTitleText}>REPS</Text>
                    </>
                )
            }
            {
                ExerciseTypes[exerciseTypeId] === EXERCISETYPE.CARDIO &&
                (
                    <>
                        <Text style={styles.routineExerciseSetTitleText}>KM</Text>
                        <Text style={styles.routineExerciseSetTitleText}>TIME</Text>
                    </>
                )
            }
            {
                ExerciseTypes[exerciseTypeId] === EXERCISETYPE.STRETCH &&
                (
                    <>
                        <Text style={styles.routineExerciseSetTitleText}>TIME</Text>
                    </>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    routineExerciseSetHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    routineExerciseSetTitleText: {
        fontSize: 18,
        color: '#858585ff',
        width: 100,
        textAlign: 'center',
    },
});