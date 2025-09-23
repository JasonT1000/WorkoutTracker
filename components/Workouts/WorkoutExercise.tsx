import { formatTime, getExerciseSetTypeId, toTitleCase } from '@/helperFiles/helperFunctions';
import { EXERCISESETTYPE, ExerciseSetTypes, EXERCISETYPE, ExerciseTypes, NewWorkoutExercise, NewWorkoutExerciseSet } from '@/helperFiles/helperTypes';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { DispatchContext, StateContext } from '../../state/workout/workoutExerciseContext';
import WorkoutExerciseSet from './WorkoutExerciseSet';
import WorkoutExerciseSetHeader from './WorkoutExerciseSetHeader';


type WorkoutExerciseProps = {
    workoutExercise: NewWorkoutExercise
    flatListRef: React.RefObject<FlatList<any> | null>
    expandedId: number
    updateExpandedId: (workoutExerciseId: number) => void
    removeExercise: (exerciseIndex: number, exerciseName: string) => void
    // scrollToInput: (yOffset: number) => void
}

export default function WorkoutExercise({ workoutExercise, flatListRef, expandedId, updateExpandedId, removeExercise }: WorkoutExerciseProps) {
    const dispatch = useContext(DispatchContext)
    const state = useContext(StateContext)
    const [notes, setNotes] = useState<string>(workoutExercise.notes)
    // Refs
    const workoutExerciseRef = useRef<View>(null)
    // const [tempIndex, setTempIndex] = useState<number>(routineExercise.routineExerciseSets.length - 1)

    // const getTempIndex = (): number => {
    //     const newTempIndex = tempIndex + 1
    //     setTempIndex(newTempIndex)

    //     return newTempIndex
    // }

    useEffect(() => {
        // if (routineExerciseRef.current) {
        const getMeasurements = async () => {
            // Need measurements from ancestor
            // routineExerciseRef.current?.measureLayout(flatListRef.current?, (left: number, top: number, width: number, height: number) => {
            //     console.log(top)
            //     scrollToInput(top)
            // })
            // routineExerciseRef.current?.measure((x, y, width, height, pageX, pageY) => {
            //     console.log("absolute x and y position for current routine exercise")
            //     console.log(x)
            //     console.log(y)
            //     console.log(pageY)
            //     console.log(height)
            //     scrollToInput(pageY)
            // })
        }

        getMeasurements()
        // }
    }, [workoutExerciseRef.current])

    // const scrollToInput = (yOffset: number) => {
    //     if (flatListRef) {
    //         // flatListRef.current?.scrollToIndex({ index: routineExercise.positionIndex, animated: true, viewOffset: -600 })
    //         flatListRef.current?.scrollToOffset({ offset: yOffset, animated: true })
    //     }
    // }

    const addSet = () => {
        dispatch({
            type: 'ADD_NEWWORKOUTEXERCISESET', payload: {
                newWorkoutExerciseIndex: workoutExercise.positionIndex,
                newExerciseSet: {
                    workoutExerciseId: workoutExercise.exerciseId,
                    exerciseSetTypeId: getExerciseSetTypeId(EXERCISESETTYPE.NORMAL),
                    reps: -1,
                    isCompleted: false
                }
            }
        })
    }

    const updateSet = (setIndex: number, field: keyof NewWorkoutExerciseSet, value: number | Float | boolean) => {
        dispatch({
            type: 'UPDATE_NEWWORKOUTEXERCISESET', payload: {
                newWorkoutExerciseIndex: workoutExercise.positionIndex,
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

    const getSetTypeComponent = (exerciseSet: NewWorkoutExerciseSet, setIndex: number) => {
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

    const getSetInfoText = (exerciseSet: NewWorkoutExerciseSet): string => {
        let reps: string = '- reps';
        let time: string = '0min';

        if (exerciseSet.reps > 1) { reps = exerciseSet.reps + " reps" }
        else if (exerciseSet.reps === 0) { reps = exerciseSet.reps + "rep" }

        if (exerciseSet.time && exerciseSet.time > 0) { time = formatTime(exerciseSet.time) }

        switch (ExerciseTypes[workoutExercise.exerciseInfo.exerciseTypeId]) {
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

    const getSetsCompletedText = () => {
        const completed = workoutExercise.workoutExerciseSets.filter(exerciseSet => exerciseSet.isCompleted).length
        const total = workoutExercise.workoutExerciseSets.length

        return `${completed}/${total} done`
    }

    const updateExerciseNotes = () => {
        dispatch({
            type: 'UPDATE_WORKOUTNOTES', payload: {
                exerciseIndex: workoutExercise.positionIndex,
                notes: notes
            }
        })
    }

    // const handleLayout = (event: LayoutChangeEvent) => {
    //     const { y } = event.nativeEvent.layout
    //     console.log(y)
    //     scrollToInput(y)
    // }

    if (expandedId === workoutExercise.positionIndex) { // Expanded View
        return (
            <View style={styles.workoutExerciseContainer} ref={workoutExerciseRef}>
                <View style={styles.workoutExerciseTitleContainer}>
                    <Image source={require('@/assets/images/react-logo.png')} style={styles.exerciseImage} />
                    <TouchableNativeFeedback
                        onPress={() => { updateExpandedId(-1) }}
                        background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}
                    >
                        <View style={styles.workoutExerciseTitleTouchContainer}>
                            <Text style={styles.workoutExerciseTitle}>{toTitleCase(workoutExercise.exerciseInfo.name)}</Text>
                        </View>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback
                        onPress={() => { removeExercise(workoutExercise.positionIndex, workoutExercise.exerciseInfo.name) }}
                        background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                        <View style={styles.exerciseEditButtonContainer}>
                            <Entypo name="dots-three-vertical" size={24} color="white" />
                        </View>
                    </TouchableNativeFeedback>
                </View>

                <TextInput
                    style={styles.workoutExerciseNotesText}
                    value={notes}
                    onChangeText={(text) => { setNotes(text) }}
                    onSubmitEditing={(e) => { updateExerciseNotes() }}
                    onBlur={(e) => { updateExerciseNotes() }}
                    placeholder='Notes...'
                    placeholderTextColor={'#858585ff'}
                />
                <TouchableNativeFeedback
                    onPress={() => { Alert.alert('modify timer') }}
                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                    <View style={styles.workoutExerciseTimerContainer}>
                        <MaterialCommunityIcons name="timer-outline" size={20} color="white" />
                        <Text style={styles.workoutExerciseTimerText}>Rest Timer: OFF</Text>
                    </View>
                </TouchableNativeFeedback>

                <View style={styles.workoutExerciseSetContainer}>

                    <WorkoutExerciseSetHeader exerciseTypeId={workoutExercise.exerciseInfo.exerciseTypeId} />

                    {
                        workoutExercise.workoutExerciseSets.map((exerciseSet, index) => (
                            <WorkoutExerciseSet
                                key={'re' + index.toString()}
                                setIndex={index}
                                exerciseSet={exerciseSet}
                                workoutExercisePositionIndex={workoutExercise.positionIndex}
                                exerciseTypeId={workoutExercise.exerciseInfo.exerciseTypeId}
                                updateSet={updateSet}
                                removeSet={removeSet}
                            // scrollToInput={scrollToInput}
                            />
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
                onPress={() => { updateExpandedId(workoutExercise.positionIndex) }}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}
            >
                <View style={styles.workoutExerciseContainer}>
                    <View style={styles.workoutExerciseTitleContainer}>
                        <Image source={require('@/assets/images/react-logo.png')} style={styles.exerciseImage} />
                        <View style={{ flexDirection: 'column', flex: 1 }}>
                            <Text style={styles.workoutExerciseTitle}>{toTitleCase(workoutExercise.exerciseInfo.name)}</Text>
                            <Text style={styles.setsCompletedText}>{getSetsCompletedText()}</Text>

                            <View style={styles.workoutExerciseSetInfoContainer}>
                                {
                                    workoutExercise.workoutExerciseSets.map((exerciseSet, index) => (
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
                            onPress={() => { removeExercise(workoutExercise.positionIndex, workoutExercise.exerciseInfo.name) }}
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
    workoutExerciseContainer: {
        flexDirection: 'column',
        gap: 5,
        marginBottom: 15,
    },
    workoutExerciseTitleContainer: {
        flexDirection: 'row',
    },
    exerciseImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    workoutExerciseTitleTouchContainer: {
        flex: 1,
    },
    workoutExerciseTitle: {
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
    workoutExerciseNotesText: {
        color: '#e4e4e4ff',
        fontSize: 18,
        paddingBottom: 5,
        // borderWidth: 1,
        // borderColor: '#585858ff',
    },
    workoutExerciseTimerContainer: {
        flexDirection: 'row',
        gap: 5,
        paddingVertical: 10,
    },
    workoutExerciseTimerText: {
        color: '#858585ff',
        fontSize: 16,
        verticalAlign: 'middle',
    },
    workoutExerciseSetContainer: {
        flexDirection: 'column',
        gap: 5,
        paddingBottom: 10,
    },
    workoutExerciseSetInfoContainer: {
        flexDirection: 'column',
        // gap: 5,
        // paddingBottom: 10,
    },
    addExerciseSetButton: {
        width: '100%',
        backgroundColor: '#272727ff',
        padding: 8,
        marginTop: 10,
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

    setsCompletedText: {
        fontSize: 16,
        color: '#858585ff',
    },

    addExerciseSetButtonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#ffffffff'
    },
});