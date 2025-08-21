import { EXERCISESETTYPE, ExerciseSetTypes, EXERCISETYPE, ExerciseTypes, NewRoutineExerciseSet, NewRoutineExerciseSetKey } from '@/functions/helperTypes'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native'
import { Float } from 'react-native/Libraries/Types/CodegenTypes'

type RoutineExerciseSetProps = {
    setIndex: number
    exerciseSet: NewRoutineExerciseSet
    routineExercisePositionIndex: number
    exerciseTypeId: number
    updateSet: (setIndex: number, field: keyof NewRoutineExerciseSet, value: number | Float) => void
    removeSet: (setIndex: number) => void
}

export default function RoutineExerciseSet({ setIndex, exerciseSet, routineExercisePositionIndex, exerciseTypeId, updateSet, removeSet }: RoutineExerciseSetProps) {

    // How many TextInput components to make for each exercise type
    const inputCountMap: Record<string, {
        exerciseTypeKeys: (keyof NewRoutineExerciseSet)[]
    }> = {
        [EXERCISETYPE.BODYWEIGHT]: { exerciseTypeKeys: [NewRoutineExerciseSetKey.REPS] },
        [EXERCISETYPE.WEIGHT]: { exerciseTypeKeys: [NewRoutineExerciseSetKey.WEIGHT, NewRoutineExerciseSetKey.REPS] },
        [EXERCISETYPE.CARDIO]: { exerciseTypeKeys: [NewRoutineExerciseSetKey.DISTANCE, NewRoutineExerciseSetKey.TIME] },
        [EXERCISETYPE.STRETCH]: { exerciseTypeKeys: [NewRoutineExerciseSetKey.TIME] },
    }

    // set default values when populating text inputs
    const initTempValues = (): Record<number, string> => {
        const updateTempValues = inputCountMap[ExerciseTypes[exerciseTypeId]].exerciseTypeKeys.reduce((acc, key, index) => {
            if (exerciseSet[key] && exerciseSet[key] < 0) {
                acc[index] = ''
            }
            else {
                acc[index] = exerciseSet[key]?.toString() ?? ''
            }

            return acc;

        }, {} as Record<number, string>);

        return updateTempValues
    }

    const [routineExerciseSetElements] = useState(inputCountMap[ExerciseTypes[exerciseTypeId]])
    const [tempValues, setTempValues] = useState<Record<number, string>>(initTempValues())

    const onHandleChange = (index: number, text: string) => {
        setTempValues((prev) => ({ ...prev, [index]: text }))
    }

    const getSetType = () => {
        const exerciseSetTypeInfo = ExerciseSetTypes[exerciseSet.exerciseSetTypeId]

        switch (exerciseSetTypeInfo.type) {
            case EXERCISESETTYPE.NORMAL:
                return <Text style={[styles.shortCodeText, { color: exerciseSetTypeInfo.colorcode }]}>{setIndex + 1}</Text>
            default:
                return <Text style={[styles.shortCodeText, { color: exerciseSetTypeInfo.colorcode }]}>{exerciseSetTypeInfo.shortcode}</Text>
        }
    }

    return (
        <View style={styles.routineExerciseSetRowContainer}>

            <TouchableNativeFeedback
                onPress={() => router.navigate({
                    pathname: '/newRoutineExerciseSetModal',
                    params: { routineExercisePositionIndex: routineExercisePositionIndex, setIndex: setIndex }
                })}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View>
                    {
                        getSetType()
                    }
                </View>
            </TouchableNativeFeedback>

            {
                Array.from(routineExerciseSetElements.exerciseTypeKeys).map((exerciseSetTypeKey, index) => (
                    <TextInput
                        key={routineExercisePositionIndex.toString() + 'res' + index.toString()}
                        style={styles.routineExerciseSetDataText}
                        value={tempValues[index]}
                        onChangeText={(text) => { onHandleChange(index, text) }}
                        onSubmitEditing={(e) => { updateSet(setIndex, exerciseSetTypeKey, parseFloat(e.nativeEvent.text)) }}
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
        flex: 1,
        flexDirection: 'row',
        gap: 5,
    },

    shortCodeText: {
        fontSize: 18,
        width: 60,
        height: 40,
        textAlign: 'center',
        verticalAlign: 'middle',
        // borderWidth: 1,
        // borderColor: 'green'
    },
    routineExerciseSetDataText: {
        width: 80,
        height: 40,
        fontSize: 18,
        color: '#ffffffff',
        textAlign: 'center',
        verticalAlign: 'middle',
        // borderWidth: 1,
        // borderColor: 'purple',
        padding: 0,
        margin: 0,
    },
});