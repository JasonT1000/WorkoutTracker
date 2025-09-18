import { EXERCISESETTYPE, ExerciseSetTypes, EXERCISETYPE, ExerciseTypes, NewWorkoutExerciseSet, NewWorkoutExerciseSetKey, ROUTES } from '@/helperFiles/helperTypes'
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
    updateSet: (setIndex: number, field: keyof NewWorkoutExerciseSet, value: number | Float | boolean) => void
    removeSet: (setIndex: number) => void
    // scrollToInput: (index: number) => void
}

export default function WorkoutExerciseSet({ setIndex, exerciseSet, workoutExercisePositionIndex, exerciseTypeId, updateSet, removeSet }: WorkoutExerciseSetProps) {
    // How many TextInput components to make for each exercise type
    const inputCountMap: Record<string, {
        exerciseTypeKeys: (keyof NewWorkoutExerciseSet)[]
    }> = {
        [EXERCISETYPE.BODYWEIGHT]: { exerciseTypeKeys: [NewWorkoutExerciseSetKey.REPS] },
        [EXERCISETYPE.WEIGHT]: { exerciseTypeKeys: [NewWorkoutExerciseSetKey.WEIGHT, NewWorkoutExerciseSetKey.REPS] },
        [EXERCISETYPE.CARDIO]: { exerciseTypeKeys: [NewWorkoutExerciseSetKey.DISTANCE, NewWorkoutExerciseSetKey.TIME, NewWorkoutExerciseSetKey.AVERAGEHEARTRATE, NewWorkoutExerciseSetKey.MAXHEARTRATE, NewWorkoutExerciseSetKey.CARDIOPROGRAMID] },
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
    const [isChecked, setIsChecked] = useState<boolean>(false)

    const onHandleChange = (index: number, text: string) => {
        setTempValues((prev) => ({ ...prev, [index]: text }))
    }

    const onHandleCheckboxChange = (value: boolean) => {
        setIsChecked(value)
        updateSet(setIndex, NewWorkoutExerciseSetKey.ISCOMPLETED, value)
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
            <View style={[styles.workoutExerciseSetDataRowContainer]}>



                <TouchableNativeFeedback
                    onPress={() => router.navigate({
                        pathname: ROUTES.EXERCISESETMODAL,
                        params: { exercisePositionIndex: workoutExercisePositionIndex, setIndex: setIndex, currentRoute: ROUTES.WORKOUT }
                    })}
                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                    <View>
                        {
                            getSetType()
                        }
                    </View>
                </TouchableNativeFeedback>

                <Text style={styles.prevWorkoutExerciseSetDataText}>Prev kg</Text>

                {
                    Array.from(workoutExerciseSetElements.exerciseTypeKeys).map((exerciseSetTypeKey, index) => (
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
                    ))
                }

            </View>

            <View style={styles.checkboxContainer}>
                <Checkbox
                    style={styles.workoutExerciseSetCheckbox}
                    value={isChecked}
                    onValueChange={(e) => onHandleCheckboxChange(e.valueOf())}
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
        // justifyContent: 'space-between',
        // marginRight: 45,
        // gap: 5,
    },
    workoutExerciseSetDataRowContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 45,
        // gap: 5,
    },

    shortCodeText: {
        fontSize: 18,
        width: 35,
        height: 40,
        // textAlign: 'center',
        paddingLeft: 6,
        verticalAlign: 'middle',
        // borderWidth: 1,
        // borderColor: 'green'
    },
    prevWorkoutExerciseSetDataText: {
        width: 75,
        height: 40,
        fontSize: 18,
        color: '#ffffffff',
        // textAlign: 'center',
        paddingLeft: 6,
        verticalAlign: 'middle',
        // borderWidth: 1,
        // borderColor: 'purple',
        padding: 0,
        margin: 0,
    },
    workoutExerciseSetDataText: {
        width: 40,
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