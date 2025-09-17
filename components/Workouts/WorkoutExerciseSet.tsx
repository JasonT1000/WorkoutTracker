import { EXERCISESETTYPE, ExerciseSetTypes, EXERCISETYPE, ExerciseTypes, NewWorkoutExerciseSet, NewWorkoutExerciseSetKey } from '@/helperFiles/helperTypes'
import Checkbox from 'expo-checkbox'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native'
import { Float } from 'react-native/Libraries/Types/CodegenTypes'

type WorkoutExerciseSetProps = {
    setIndex: number
    exerciseSet: NewWorkoutExerciseSet
    workoutExercisePositionIndex: number
    exerciseTypeId: number
    updateSet: (setIndex: number, field: keyof NewWorkoutExerciseSet, value: number | Float) => void
    removeSet: (setIndex: number) => void
    // scrollToInput: (index: number) => void
}

export default function WorkoutExerciseSet({ setIndex, exerciseSet, workoutExercisePositionIndex, exerciseTypeId, updateSet, removeSet }: WorkoutExerciseSetProps) {
    const [isChecked, setIsChecked] = useState(false)

    // How many TextInput components to make for each exercise type
    const inputCountMap: Record<string, {
        exerciseTypeKeys: (keyof NewWorkoutExerciseSet)[]
    }> = {
        [EXERCISETYPE.BODYWEIGHT]: { exerciseTypeKeys: [NewWorkoutExerciseSetKey.REPS] },
        [EXERCISETYPE.WEIGHT]: { exerciseTypeKeys: [NewWorkoutExerciseSetKey.WEIGHT, NewWorkoutExerciseSetKey.REPS] },
        [EXERCISETYPE.CARDIO]: { exerciseTypeKeys: [NewWorkoutExerciseSetKey.DISTANCE, NewWorkoutExerciseSetKey.TIME] },
        [EXERCISETYPE.STRETCH]: { exerciseTypeKeys: [NewWorkoutExerciseSetKey.TIME] },
    }

    // set default values when populating text inputs
    const initTempValues = (): Record<number, string> => {
        const updateTempValues = inputCountMap[ExerciseTypes[exerciseTypeId]].exerciseTypeKeys.reduce((acc, key, index) => {
            if (key === NewWorkoutExerciseSetKey.ISCOMPLETED) {
                acc[index] = exerciseSet[key]?.toString() ?? false
            }
            else if (exerciseSet[key] && exerciseSet[key] < 0) {
                acc[index] = ''
            }
            else {
                acc[index] = exerciseSet[key]?.toString() ?? ''
            }

            return acc;

        }, {} as Record<number, string>);

        return updateTempValues
    }

    const [workoutExerciseSetElements] = useState(inputCountMap[ExerciseTypes[exerciseTypeId]])
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

    const highlightStyle = { backgroundColor: isChecked ? '#0fb80065' : undefined }

    return (
        <View style={[styles.workoutExerciseSetRowContainer, highlightStyle]}>

            <TouchableNativeFeedback
                onPress={() => router.navigate({
                    pathname: '/newRoutineExerciseSetModal',
                    params: { workoutExercisePositionIndex: workoutExercisePositionIndex, setIndex: setIndex }
                })}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View>
                    {
                        getSetType()
                    }
                </View>
            </TouchableNativeFeedback>

            <Text style={styles.workoutExerciseSetDataText}>Prev kg</Text>

            {
                Array.from(workoutExerciseSetElements.exerciseTypeKeys).map((exerciseSetTypeKey, index) => (
                    index > workoutExerciseSetElements.exerciseTypeKeys.length - 1 ?
                        <TextInput
                            key={workoutExercisePositionIndex.toString() + 'res' + index.toString()}
                            style={styles.workoutExerciseSetDataText}
                            value={tempValues[index]}
                            onChangeText={(text) => { onHandleChange(index, text) }}
                            onSubmitEditing={(e) => { updateSet(setIndex, exerciseSetTypeKey, parseFloat(e.nativeEvent.text)) }}
                            onBlur={(e) => { updateSet(setIndex, exerciseSetTypeKey, parseFloat(tempValues[index])) }}
                            placeholder='-'
                            placeholderTextColor={'#858585ff'}
                            keyboardType='number-pad'
                        />
                        : null
                ))
            }

            <View style={styles.checkboxContainer}>
                <Checkbox
                    style={styles.workoutExerciseSetCheckbox}
                    value={isChecked}
                    onValueChange={setIsChecked}
                    color={isChecked ? '#0fb800ff' : undefined}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    workoutExerciseSetRowContainer: {
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
    workoutExerciseSetDataText: {
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

    checkboxContainer: {
        position: 'absolute',
        color: '#ffffffff',
        justifyContent: 'center',
        top: 7,
        right: 10,
    },
    workoutExerciseSetCheckbox: {
        width: 25,
        height: 25,
        fontSize: 18,
        color: '#ffffffff',
        textAlign: 'center',
        verticalAlign: 'middle',
        padding: 0,
        margin: 0,
    },
});