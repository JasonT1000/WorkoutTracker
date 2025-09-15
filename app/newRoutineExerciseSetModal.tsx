import { getExerciseSetTypeId, toTitleCase } from '@/helperFiles/helperFunctions';
import { EXERCISESETTYPE, ExerciseSetTypes, NewRoutineExerciseSetKey } from '@/helperFiles/helperTypes';
import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DispatchContext } from '../state/routine/routineExerciseContext';


export default function NewRoutineExerciseSetModal() {
    const { routineExercisePositionIndex, setIndex } = useLocalSearchParams()
    const dispatch = useContext(DispatchContext)
    const translateY = useSharedValue(0);
    const isClosing = useSharedValue(false)


    const pan = Gesture.Pan().onChange(event => {
        isClosing.value = false
        let newValue = translateY.value + event.changeY

        if (newValue < 0) {
            translateY.value = 0
        }
        else {
            translateY.value = newValue
        }

        if (event.velocityY > 2100) {
            isClosing.value = true
            translateY.value = withTiming(
                500,
                { duration: 100, easing: Easing.linear },
                (finished) => {
                    if (finished) {
                        runOnJS(router.dismiss)()
                    }
                }
            )
        }
    }).onTouchesUp(() =>
        isClosing.value === false ? translateY.value = withTiming(0) : null
    )

    const draggableStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: translateY.value,
                }
            ],
        }
    })

    const UpdateExerciseSetType = (exerciseType: EXERCISESETTYPE) => {
        dispatch({
            type: 'UPDATE_NEWROUTINEEXERCISESET', payload: {
                newRoutineExerciseIndex: parseInt(routineExercisePositionIndex as string),
                setIndex: parseInt(setIndex as string),
                field: NewRoutineExerciseSetKey.EXERCISESETTYPEID,
                value: getExerciseSetTypeId(exerciseType)
            }
        })

        router.dismiss()
    }

    const removeExerciseSet = () => {
        console.log("remove Exercise Set")
        dispatch({
            type: 'REMOVE_NEWROUTINEEXERCISESET', payload: {
                newRoutineExerciseIndex: parseInt(routineExercisePositionIndex as string),
                setIndex: parseInt(setIndex as string)
            }
        })

        router.dismiss()
    }

    return (
        <SafeAreaView style={styles.main}>
            <GestureHandlerRootView>
                <GestureDetector gesture={pan}>
                    <Animated.View style={[draggableStyle, styles.container]}>

                        <View style={styles.modalLine}></View>
                        <Text style={styles.containerHeading}>Select Set Type</Text>

                        {
                            Array.from(Object.entries(ExerciseSetTypes)).map((exerciseSetType, index) => (
                                <TouchableNativeFeedback
                                    key={index + 'est'}
                                    onPress={() => UpdateExerciseSetType(exerciseSetType[1].type)}
                                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}
                                >
                                    <View style={styles.setTypeRow}>
                                        <Text style={[styles.shortCodeText, { color: exerciseSetType[1].colorcode }]}>{exerciseSetType[1].shortcode}</Text>
                                        <Text style={styles.text}>{toTitleCase(exerciseSetType[1].type)}</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            ))
                        }
                        {
                            <TouchableNativeFeedback
                                onPress={() => removeExerciseSet()}
                                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}
                            >
                                <View style={[{ marginTop: 20 }, styles.setTypeRow]}>
                                    <Feather name="trash-2" size={24} color='#ff0000ff' style={styles.shortCodeText} />
                                    <Text style={styles.text}>Remove Set</Text>
                                </View>
                            </TouchableNativeFeedback>
                        }
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        width: '100%',
        backgroundColor: '#000000d5',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        top: 250,
        width: '100%',
        backgroundColor: '#1b1b1bff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 30,
        padding: 15,
    },
    modalLine: {
        width: 70,
        borderRadius: 25,
        borderTopWidth: 4,
        borderTopColor: '#bbbbbbff',
        alignSelf: 'center',
        marginBottom: 5,
    },
    containerHeading: {
        textAlign: 'center',
        color: '#ffffffff',
        fontSize: 20,
        paddingVertical: 10,
        marginBottom: 25,
    },

    setTypeRow: {
        flexDirection: 'row',
        columnGap: 30,
        paddingVertical: 10,
        backgroundColor: '#272727ff',
        borderWidth: 1,
        borderColor: '#363636ff',
        borderRadius: 15,
    },
    shortCodeText: {
        fontSize: 22,
        textAlign: 'center',
        width: 30,
        verticalAlign: 'middle',
        paddingLeft: 10,
    },
    text: {
        color: 'white',
        fontSize: 20,
        verticalAlign: 'middle',
    }
})