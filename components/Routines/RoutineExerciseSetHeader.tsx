import { EXERCISETYPE, ExerciseTypes } from '@/functions/helperTypes';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type RoutineExerciseSetHeaderProps = {
    exerciseTypeId: number
}

export default function RoutineExerciseSetHeader({ exerciseTypeId }: RoutineExerciseSetHeaderProps) {
    return (
        <View style={styles.routineExerciseSetHeaderContainer}>

            <Text style={styles.titleTextSet}>SET</Text>

            {
                ExerciseTypes[exerciseTypeId] === EXERCISETYPE.WEIGHT &&
                (
                    <>
                        <Text style={styles.routineExerciseSetTitleText}>KG</Text>
                        <Text style={styles.routineExerciseSetTitleText}>REPS</Text>
                    </>
                )
            }
            {
                ExerciseTypes[exerciseTypeId] === EXERCISETYPE.BODYWEIGHT &&
                (
                    <Text style={styles.routineExerciseSetTitleText}>REPS</Text>
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
        flex: 1,
        gap: 5,
    },
    titleTextSet: {
        fontSize: 14,
        color: '#858585ff',
        width: 60,
        textAlign: 'center',
    },
    routineExerciseSetTitleText: {
        fontSize: 14,
        color: '#858585ff',
        width: 80,
        textAlign: 'center',
    },
});