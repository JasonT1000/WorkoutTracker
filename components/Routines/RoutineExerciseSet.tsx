import { EXERCISETYPE, ExerciseTypes, NewRoutineExerciseSet, NewRoutineExerciseSetKey } from '@/functions/helperTypes'
import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native'
import { Float } from 'react-native/Libraries/Types/CodegenTypes'

type RoutineExerciseSetProps = {
    setIndex: number
    exerciseSet: NewRoutineExerciseSet
    positionIndex: number
    exerciseTypeId: number
    updateSet: (setIndex: number, field: keyof NewRoutineExerciseSet, value: number | Float) => void
    removeSet: (setIndex: number) => void
}

export default function RoutineExerciseSet({ setIndex, exerciseSet, positionIndex, exerciseTypeId, updateSet, removeSet }: RoutineExerciseSetProps) {

    // How many TextInput components to make for each exercise type
    const inputCountMap: Record<string, {
        exerciseTypeKeys: (keyof NewRoutineExerciseSet)[]
    }> = {
        [EXERCISETYPE.BODYWEIGHT]: { exerciseTypeKeys: [NewRoutineExerciseSetKey.REPS] },
        [EXERCISETYPE.WEIGHT]: { exerciseTypeKeys: [NewRoutineExerciseSetKey.WEIGHT, NewRoutineExerciseSetKey.REPS] },
        [EXERCISETYPE.CARDIO]: { exerciseTypeKeys: [NewRoutineExerciseSetKey.DISTANCE, NewRoutineExerciseSetKey.TIME] },
        [EXERCISETYPE.STRETCH]: { exerciseTypeKeys: [NewRoutineExerciseSetKey.TIME] },
    }

    // const inputCountMap: Record<string, number> = {
    //     [EXERCISETYPE.BODYWEIGHT]: 1,
    //     [EXERCISETYPE.WEIGHT]: 2,
    //     [EXERCISETYPE.CARDIO]: 2,
    //     [EXERCISETYPE.STRETCH]: 1,
    // }

    // const textInputCount = inputCountMap[ExerciseTypes[exerciseTypeId]].elementCount ?? 0
    const initTempValues = (): Record<number, string> => {

        // let updateTempValues: Record<number, string> = {}

        // for (let index = 0; index < inputCountMap[ExerciseTypes[exerciseTypeId]].exerciseTypeKeys.length; index++) {
        //     const key = inputCountMap[ExerciseTypes[exerciseTypeId]].exerciseTypeKeys[index];
        //     if (exerciseSet[key] === -1) {
        //         updateTempValues[index] = '';
        //     }
        //     else {
        //         updateTempValues[index] = exerciseSet[key] !== undefined ? exerciseSet[key]!.toString() : '';
        //     }
        // }

        const updateTempValues = inputCountMap[ExerciseTypes[exerciseTypeId]].exerciseTypeKeys.reduce((acc, key, index) => {
            if (exerciseSet[key] && exerciseSet[key] < 0) {
                acc[index] = ''
            }
            else {
                acc[index] = exerciseSet[key]?.toString() ?? ''
            }

            return acc;

        }, {} as Record<number, string>);

        console.log("updateTempValues")
        console.log(updateTempValues)

        return updateTempValues
    }

    const [routineExerciseSetElements, setRoutineExerciseSetElements] = useState(inputCountMap[ExerciseTypes[exerciseTypeId]])
    const [tempValues, setTempValues] = useState<Record<number, string>>(initTempValues())



    const onHandleChange = (index: number, text: string) => {
        setTempValues((prev) => ({ ...prev, [index]: text }))
    }

    return (
        <View style={styles.routineExerciseSetRowContainer}>

            <TouchableNativeFeedback
                onPress={() => removeSet(setIndex)}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View>
                    <Text style={styles.routineExerciseSetDataText}>{setIndex + 1}</Text>
                </View>
            </TouchableNativeFeedback>

            {
                Array.from(routineExerciseSetElements.exerciseTypeKeys).map((exerciseSetTypeKey, index) => (
                    <TextInput
                        key={positionIndex.toString() + 'res' + index.toString()}
                        style={styles.routineExerciseSetDataText}
                        value={tempValues[index]}
                        onChangeText={(text) => onHandleChange(index, text)}
                        onSubmitEditing={(e) => updateSet(setIndex, exerciseSetTypeKey, parseFloat(e.nativeEvent.text))}
                        placeholder='-'
                        placeholderTextColor={'#858585ff'}
                        keyboardType='number-pad'
                    />
                ))
                // Array.from({ length: textInputCount }).map((_, index) => (
                //     <TextInput
                //         key={positionIndex.toString() + 'res' + index.toString()}
                //         style={styles.routineExerciseSetDataText}
                //         value={exerciseSet.reps >= 0 ? exerciseSet.reps.toString() : ''}
                //         placeholder='-'
                //         placeholderTextColor={'#858585ff'}
                //         keyboardType='number-pad'
                //     />
                // ))
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