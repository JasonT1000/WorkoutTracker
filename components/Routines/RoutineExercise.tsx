import { getSetTypeComponent } from '@/helperFiles/exerciseFunctions';
import { getExerciseSetTypeId, toTitleCase } from '@/helperFiles/helperFunctions';
import { EXERCISESETTYPE, NewRoutineExercise, NewRoutineExerciseSet } from '@/helperFiles/helperTypes';
import Entypo from "@react-native-vector-icons/entypo";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import React, { useContext, useEffect, useRef } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { DispatchContext } from '../../state/routine/routineExerciseContext';
import RoutineExerciseSet from './RoutineExerciseSet';
import RoutineExerciseSetHeader from './RoutineExerciseSetHeader';

type RoutineExerciseProps = {
    routineExercise: NewRoutineExercise
    flatListRef: React.RefObject<FlatList<any> | null>
    expandedId: number
    updateExpandedId: (routineExerciseId: number) => void
    showRoutineExerciseMenu: (routineExerciseIndex: number, routineExerciseId: number) => void
    // scrollToInput: (yOffset: number) => void
}

export default function RoutineExercise({ routineExercise, flatListRef, expandedId, updateExpandedId, showRoutineExerciseMenu }: RoutineExerciseProps) {
    const dispatch = useContext(DispatchContext)
    const routineExerciseRef = useRef<View>(null)
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
    }, [routineExerciseRef.current])

    // const scrollToInput = (yOffset: number) => {
    //     if (flatListRef) {
    //         // flatListRef.current?.scrollToIndex({ index: routineExercise.positionIndex, animated: true, viewOffset: -600 })
    //         flatListRef.current?.scrollToOffset({ offset: yOffset, animated: true })
    //     }
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


    if (expandedId === routineExercise.positionIndex) { // Expanded View
        return (
            <View style={styles.routineExerciseContainer} ref={routineExerciseRef}>
                <View style={styles.routineExerciseTitleContainer}>
                    <Image source={require('@/assets/images/react-logo.png')} style={styles.exerciseImage} />
                    <TouchableNativeFeedback
                        onPress={() => { updateExpandedId(-1) }}
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
                    placeholder='Notes...'
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
                onPress={() => { updateExpandedId(routineExercise.positionIndex) }}
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
                                                getSetTypeComponent(exerciseSet, routineExercise.exerciseInfo.exerciseTypeId, index)
                                            }
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                        <TouchableNativeFeedback
                            onPress={() => { showRoutineExerciseMenu(routineExercise.positionIndex, routineExercise.exerciseId) }}
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