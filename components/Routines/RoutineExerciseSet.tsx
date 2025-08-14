import { EXERCISETYPE, ExerciseTypes } from '@/functions/helperTypes'
import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

type RoutineExerciseSetProps = {
    setIndex: number
    positionIndex: number
    exerciseTypeId: number
}

export default function RoutineExerciseSet({ setIndex, positionIndex, exerciseTypeId, }: RoutineExerciseSetProps) {

    const inputCountMap: Record<string, number> = {
        [EXERCISETYPE.BODYWEIGHT]: 1,
        [EXERCISETYPE.WEIGHT]: 2,
        [EXERCISETYPE.CARDIO]: 2,
        [EXERCISETYPE.STRETCH]: 1,
    }

    const textInputCount = inputCountMap[ExerciseTypes[exerciseTypeId]] ?? 0

    return (
        <View style={styles.routineExerciseSetRowContainer}>
            {
                (ExerciseTypes[exerciseTypeId] === EXERCISETYPE.BODYWEIGHT ||
                    ExerciseTypes[exerciseTypeId] === EXERCISETYPE.WEIGHT) &&
                (
                    <Text style={styles.routineExerciseSetDataText}>{setIndex + 1}</Text>
                )
            }
            {
                Array.from({ length: textInputCount }).map((_, index) => (
                    <TextInput
                        key={positionIndex.toString() + 'res' + index.toString()}
                        style={styles.routineExerciseSetDataText}
                        placeholder='-'
                        placeholderTextColor={'#858585ff'}
                        keyboardType='number-pad'
                    />
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    routineExerciseSetRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },

    routineExerciseSetDataText: {
        fontSize: 18,
        color: '#ffffffff',
        width: 100,
        textAlign: 'center',
        verticalAlign: 'middle',
    },
});