import { formatTime, getExerciseSetTypeId, toTitleCase } from '@/functions/helperFunctions';
import { EXERCISESETTYPE, ExerciseSetTypes, EXERCISETYPE, ExerciseTypes, NewRoutineExercise, NewRoutineExerciseSet } from '@/functions/helperTypes';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useContext, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { DispatchContext, StateContext } from '../../state/routine/routineExerciseContext';
import RoutineExerciseSet from './RoutineExerciseSet';
import RoutineExerciseSetHeader from './RoutineExerciseSetHeader';

type RoutineExerciseProps = {
    routineExercise: NewRoutineExercise
}

export default function RoutineExercise({ routineExercise }: RoutineExerciseProps) {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)
    const [isActive, setIsActive] = useState(false)
    // const [tempIndex, setTempIndex] = useState<number>(routineExercise.routineExerciseSets.length - 1)

    // const getTempIndex = (): number => {
    //     const newTempIndex = tempIndex + 1
    //     setTempIndex(newTempIndex)

    //     return newTempIndex
    // }

    const addSet = () => {
        dispatch({
            type: 'ADD_NEWROUTINEEXERCISESET', payload: {
                newRoutineExerciseIndex: routineExercise.positionIndex,
                newExerciseSet: {
                    // tempIndex: getTempIndex(),
                    routineExerciseId: routineExercise.exerciseId,
                    exerciseSetTypeId: getExerciseSetTypeId(EXERCISESETTYPE.NORMAL),
                    reps: -1
                }
            }
        })
    }

    const updateSet = (setIndex: number, field: keyof NewRoutineExerciseSet, value: number | Float) => {
        dispatch({
            type: 'UPDATE_NEWROUTINEEXERCISESET', payload: {
                newRoutineExerciseIndex: routineExercise.positionIndex,
                setIndex: setIndex,
                field: field,
                value: value
            }
        })
    }

    const removeSet = (setIndex: number) => {
        console.log("@@@@@@@@@@@@@@@@@@@")
        console.log("removing set")
        console.log("setIndex = " + setIndex)
        // setExerciseSets((prev) => prev.filter((exerciseSet, index) => index !== setIndex))
    }

    const getSetTypeComponent = (exerciseSet: NewRoutineExerciseSet, setIndex: number) => {
        const exerciseSetTypeInfo = ExerciseSetTypes[exerciseSet.exerciseSetTypeId]
        let setText = getSetInfoText(exerciseSet)

        switch (exerciseSetTypeInfo.type) {
            case EXERCISESETTYPE.NORMAL:
                return <>
                    <Text style={[styles.shortCodeText, { color: exerciseSetTypeInfo.colorcode }]}>{setIndex + 1}</Text>
                    <Text style={[styles.setText, { color: exerciseSetTypeInfo.colorcode }]}>{setText}</Text>
                </>
            default:
                return <>
                    <Text style={[styles.shortCodeText, { color: exerciseSetTypeInfo.colorcode }]}>{exerciseSetTypeInfo.shortcode}</Text>
                    <Text style={[styles.setText, { color: exerciseSetTypeInfo.colorcode }]}>{setText}</Text>
                </>
        }
    }

    const getSetInfoText = (exerciseSet: NewRoutineExerciseSet): string => {
        let reps: string = '- reps';
        let time: string = '0min';

        if (exerciseSet.reps > 1) { reps = exerciseSet.reps + " reps" }
        else if (exerciseSet.reps === 0) { reps = exerciseSet.reps + "rep" }

        if (exerciseSet.time && exerciseSet.time > 0) { time = formatTime(exerciseSet.time) }

        switch (ExerciseTypes[routineExercise.exerciseInfo.exerciseTypeId]) {
            case EXERCISETYPE.BODYWEIGHT:
                return reps
            case EXERCISETYPE.WEIGHT:
                let weight: string = '';
                if (exerciseSet.weight && exerciseSet.weight > 0) { weight = exerciseSet.weight + "kgs x" }
                return weight + reps
            case EXERCISETYPE.CARDIO:
                let distance: string = '';
                if (exerciseSet.distance && exerciseSet.distance >= 0) { distance = exerciseSet.distance + "km x" }
                return distance + time
            case EXERCISETYPE.STRETCH:
                return time

            default:
                return 'No set info to display'
        }
    }


    if (isActive) { // Expanded View
        return (
            <View style={styles.routineExerciseContainer}>
                <View style={styles.routineExerciseTitleContainer}>
                    <Image source={require('@/assets/images/react-logo.png')} style={styles.exerciseImage} />
                    <TouchableNativeFeedback
                        onPress={() => { setIsActive(!isActive) }}
                        background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}
                    >
                        <View style={styles.routineExerciseTitleTouchContainer}>
                            <Text style={styles.routineExerciseTitle}>{toTitleCase(routineExercise.exerciseInfo.name)}</Text>
                        </View>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback
                        onPress={() => { Alert.alert('Edit exercise dots pressed') }}
                        background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                        <View style={styles.exerciseEditButtonContainer}>
                            <Entypo name="dots-three-vertical" size={24} color="white" />
                        </View>
                    </TouchableNativeFeedback>
                </View>

                <TextInput
                    style={styles.routineExerciseNotesText}
                    placeholder='Add exercise notes here'
                    placeholderTextColor={'#858585ff'}
                />
                <TouchableNativeFeedback
                    onPress={() => { Alert.alert('Edit exercise dots pressed') }}
                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                    <View style={styles.routineExerciseTimerContainer}>
                        <MaterialCommunityIcons name="timer-outline" size={20} color="white" />
                        <Text style={styles.routineExerciseTimerText}>Rest Timer: OFF</Text>
                    </View>
                </TouchableNativeFeedback>

                <View style={styles.routineExerciseSetContainer}>

                    <RoutineExerciseSetHeader exerciseTypeId={routineExercise.exerciseInfo.exerciseTypeId} />

                    {
                        routineExercise.routineExerciseSets.map((exerciseSet, index) => (
                            <RoutineExerciseSet
                                key={'re' + index.toString()}
                                setIndex={index}
                                exerciseSet={exerciseSet}
                                routineExercisePositionIndex={routineExercise.positionIndex}
                                exerciseTypeId={routineExercise.exerciseInfo.exerciseTypeId}
                                updateSet={updateSet}
                                removeSet={removeSet} />
                        ))
                    }

                    <TouchableNativeFeedback
                        onPress={() => addSet()}
                        background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                        <View style={styles.addExerciseSetButton}>
                            <Text style={styles.addExerciseSetButtonText}>Add Set</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }
    else { // Collapsed View
        return (
            <TouchableNativeFeedback
                onPress={() => { setIsActive(!isActive) }}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}
            >
                <View style={styles.routineExerciseContainer}>
                    <View style={styles.routineExerciseTitleContainer}>
                        <Image source={require('@/assets/images/react-logo.png')} style={styles.exerciseImage} />
                        <View style={{ flexDirection: 'column', flex: 1 }}>
                            <Text style={styles.routineExerciseTitle}>{toTitleCase(routineExercise.exerciseInfo.name)}</Text>
                            <View style={styles.routineExerciseSetInfoContainer}>
                                {
                                    routineExercise.routineExerciseSets.map((exerciseSet, index) => (
                                        <View key={'re' + index.toString()} style={{ flexDirection: 'row' }}>
                                            {
                                                getSetTypeComponent(exerciseSet, index)
                                            }
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                        <TouchableNativeFeedback
                            onPress={() => { Alert.alert('Edit exercise dots pressed') }}
                            background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                            <View style={styles.exerciseEditButtonContainer}>
                                <Entypo name="dots-three-vertical" size={24} color="white" />
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

const styles = StyleSheet.create({
    routineExerciseContainer: {
        flexDirection: 'column',
        gap: 5,
        marginBottom: 15,
    },
    routineExerciseTitleContainer: {
        flexDirection: 'row',
    },
    exerciseImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    routineExerciseTitleTouchContainer: {
        flex: 1,
    },
    routineExerciseTitle: {
        color: '#0160adff',
        fontSize: 20,
        verticalAlign: 'middle',
        flex: 1,
    },
    exerciseEditButtonContainer: {
        color: '#d6d6d6ff',
        padding: 10,
        // alignSelf: 'center',
        alignSelf: 'flex-start',
    },
    routineExerciseNotesText: {
        color: '#e4e4e4ff',
        fontSize: 18,
        paddingBottom: 5,
        // borderWidth: 1,
        // borderColor: '#585858ff',
    },
    routineExerciseTimerContainer: {
        flexDirection: 'row',
        gap: 5,
        paddingVertical: 10,
    },
    routineExerciseTimerText: {
        color: '#858585ff',
        fontSize: 16,
        verticalAlign: 'middle',
    },
    routineExerciseSetContainer: {
        flexDirection: 'column',
        gap: 5,
        paddingBottom: 10,
    },
    routineExerciseSetInfoContainer: {
        flexDirection: 'column',
        // gap: 5,
        // paddingBottom: 10,
    },
    addExerciseSetButton: {
        width: '100%',
        backgroundColor: '#272727ff',
        padding: 8,
        borderRadius: 10,
    },

    shortCodeText: {
        fontSize: 16,
        width: 25,
        // height: 40,
        // textAlign: 'center',
        // verticalAlign: 'middle',
        // borderWidth: 1,
        // borderColor: 'green'
    },
    setText: {
        fontSize: 16,
    },

    addExerciseSetButtonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#ffffffff'
    },
});