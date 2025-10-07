import { formatTime } from '@/helperFiles/helperFunctions'
import { EXERCISESETTYPE, ExerciseSetTypes, EXERCISETYPE, ExerciseTypes, NewWorkoutExerciseSet, NewWorkoutExerciseSetKey, ROUTES } from '@/helperFiles/helperTypes'
import Checkbox from 'expo-checkbox'
import { router } from 'expo-router'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Alert, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableNativeFeedback, View } from 'react-native'
import { TimerPickerModal } from 'react-native-timer-picker'
import { Float } from 'react-native/Libraries/Types/CodegenTypes'
import PreviousSetText from '../PreviousSetText'

type WorkoutExerciseSetProps = {
    setIndex: number
    exerciseSet: NewWorkoutExerciseSet
    workoutExercisePositionIndex: number
    exerciseTypeId: number
    previousExerciseSet: NewWorkoutExerciseSet | null
    setSetToPrevious: (setIndex: number) => void
    updateSet: (setIndex: number, field: keyof NewWorkoutExerciseSet, value: number | Float | boolean) => void
    // removeSet: (setIndex: number) => void
    // scrollToInput: (index: number) => void
}

export default function WorkoutExerciseSet({ setIndex, exerciseSet, workoutExercisePositionIndex, exerciseTypeId, previousExerciseSet, setSetToPrevious, updateSet }: WorkoutExerciseSetProps) {
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
    // TODO: should the else statement be checking to set number, floats etc not setting everything to string??
    const initTempValues = (): Record<number, string> => {
        const updatedTempValues = inputCountMap[ExerciseTypes[exerciseTypeId]].exerciseTypeKeys.reduce((acc, key, index) => {
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

        return updatedTempValues
    }

    // State
    const [workoutExerciseSetElements, setWorkoutExerciseSetElements] = useState(inputCountMap[ExerciseTypes[exerciseTypeId]])
    const [tempValues, setTempValues] = useState<Record<number, string>>({})
    const [isChecked, setIsChecked] = useState<boolean>(exerciseSet.isCompleted)
    const [showPicker, setShowPicker] = useState<boolean>(false)
    // const [timeString, setTimeString] = useState<string | null>(null)

    // Refs
    const workoutExerciseSetElementIndexRef = useRef(-1)

    useEffect(() => {
        // only update tempValues if there is a difference between them and exerciseSet
        if (hasExerciseSetChanged()) {
            setTempValues(initTempValues())
        }
    }, [exerciseSet])

    const hasExerciseSetChanged = () => {
        return inputCountMap[ExerciseTypes[exerciseTypeId]].exerciseTypeKeys.some((element, index) => {
            return exerciseSet[element] && exerciseSet[element].toString() !== tempValues[index]
        });
    }

    const onHandleChange = (index: number, text: string) => {
        setTempValues((prev) => ({ ...prev, [index]: text }))
    }

    const onHandleCheckboxChange = (value: boolean) => {
        if (exerciseSet.reps > 0
            || exerciseSet.weight && exerciseSet.weight > 0
            || exerciseSet.distance && exerciseSet.distance > 0
            || exerciseSet.time && exerciseSet.time > 0
        ) {
            setIsChecked(value)
            updateSet(setIndex, NewWorkoutExerciseSetKey.ISCOMPLETED, value)
        }
        else {
            Alert.alert('Whoopsie doodle', 'There are no set values to complete')
        }
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

    const updateSetTime = ({ hours, minutes, seconds }: { hours?: number; minutes?: number; seconds?: number; }) => {
        let totalSeconds = 0;

        if (hours !== undefined) {
            totalSeconds = hours * 3600
        }
        if (minutes !== undefined) {
            totalSeconds += minutes * 60
        }
        if (seconds !== undefined) {
            totalSeconds += seconds
        }

        updateSet(setIndex, NewWorkoutExerciseSetKey.TIME, totalSeconds)
        setTempValues((prev) => ({ ...prev, [workoutExerciseSetElementIndexRef.current]: totalSeconds.toString() }))
    };

    const setWorkoutExerciseSetValuesToPrevious = () => {
        setSetToPrevious(setIndex)
    }

    const getSetElement = (exerciseSetTypeKey: keyof NewWorkoutExerciseSet, index: number): ReactNode => {

        switch (exerciseSetTypeKey) {
            case NewWorkoutExerciseSetKey.TIME:
                return <TouchableNativeFeedback
                    key={workoutExercisePositionIndex.toString() + 'res' + index.toString()}
                    onPress={() => {
                        workoutExerciseSetElementIndexRef.current = index
                        setShowPicker(true)
                    }}
                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                    <View>
                        <Text style={getStyleElement(parseInt(tempValues[index]))}>{tempValues[index] ? formatTime(parseInt(tempValues[index])) : '-'}</Text>
                    </View>
                </TouchableNativeFeedback>

            case NewWorkoutExerciseSetKey.CARDIOPROGRAMID:
                return <TouchableNativeFeedback
                    key={workoutExercisePositionIndex.toString() + 'res' + index.toString()}
                    onPress={() => {
                        router.navigate({
                            pathname: ROUTES.CARDIOPROGRAMS,
                            params: {
                                returnRoute: ROUTES.WORKOUT,
                                existingCardioProgramId: exerciseSet.cardioProgramId?.toString() ?? '-1',
                                exercisePositionIndex: workoutExercisePositionIndex.toString(),
                                exerciseSetIndex: setIndex.toString()
                            }
                        })
                    }}
                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                    <View style={styles.workoutExerciseSetDataText}>
                        <Text style={getStyleElement(exerciseSet.cardioProgramId)}>{exerciseSet.cardioProgramId ?? '-'}</Text>
                    </View>
                </TouchableNativeFeedback>

            default:
                return <TextInput
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
        }
    }

    // changes style to either white text or grey when no value found
    const getStyleElement = (exerciseSetValue: number | undefined): StyleProp<TextStyle> => {
        if (exerciseSetValue) {
            return styles.workoutExerciseSetDataText
        }

        return styles.workoutExerciseSetDataTextEmpty
    }

    const initDatePicker = (): { hours: number, minutes: number, seconds: number } => {
        let tempTimeValueIndex = 0
        let tempValueTime = 0

        inputCountMap[ExerciseTypes[exerciseTypeId]].exerciseTypeKeys.forEach((element, index) => {
            if (element === NewWorkoutExerciseSetKey.TIME) { tempTimeValueIndex = index }
        });

        tempValueTime = parseInt(tempValues[tempTimeValueIndex])

        const hrs = Math.floor(tempValueTime / 3600);
        const mins = Math.floor((tempValueTime % 3600) / 60);
        const secs = tempValueTime % 60;

        return { hours: hrs, minutes: mins, seconds: secs }
    }

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

                <PreviousSetText exerciseTypeId={exerciseTypeId} previousExerciseSet={previousExerciseSet} usePrevSetVales={setWorkoutExerciseSetValuesToPrevious} />

                {
                    Array.from(workoutExerciseSetElements.exerciseTypeKeys).map((exerciseSetTypeKey, index) => (

                        getSetElement(exerciseSetTypeKey, index)

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

            <TimerPickerModal
                visible={showPicker}
                setIsVisible={setShowPicker}
                initialValue={initDatePicker()}
                onConfirm={(pickedDuration) => {
                    updateSetTime(pickedDuration)
                    setShowPicker(false);
                }}
                modalTitle="Set Alarm"
                onCancel={() => setShowPicker(false)}
                closeOnOverlayPress
                // LinearGradient={LinearGradient}
                styles={{
                    theme: "dark",
                }}
                modalProps={{
                    overlayOpacity: 0.2,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    workoutExerciseSetRowContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    workoutExerciseSetDataRowContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 41,
    },

    shortCodeText: {
        fontSize: 18,
        width: 42,
        height: 40,
        paddingLeft: 6,
        verticalAlign: 'middle',
    },
    // prevWorkoutExerciseSetDataText: {
    //     width: 75,
    //     // height: 40,
    //     maxHeight: 60,
    //     fontSize: 18,
    //     color: '#ffffffff',
    //     paddingLeft: 6,
    //     verticalAlign: 'middle',
    //     padding: 0,
    //     margin: 0,
    // },
    workoutExerciseSetDataText: {
        width: 42,
        height: 40,
        fontSize: 15,
        color: '#ffffffff',
        textAlign: 'center',
        verticalAlign: 'middle',
        padding: 0,
        margin: 0,
    },
    workoutExerciseSetDataTextEmpty: {
        width: 42,
        height: 40,
        fontSize: 15,
        color: '#858585ff',
        textAlign: 'center',
        verticalAlign: 'middle',
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