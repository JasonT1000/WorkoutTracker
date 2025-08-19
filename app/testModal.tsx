import { toTitleCase } from '@/functions/helperFunctions';
import { ExerciseSetTypes } from '@/functions/helperTypes';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TestModal() {
    const translateY = useSharedValue(0);

    const drag = Gesture.Pan().onChange(event => {
        console.log("+++++++translateY before adding changeY")
        console.log(translateY.value)
        translateY.value += event.changeY
        console.log("+++++++translateY after adding changeY")
        console.log(translateY.value)
        // translateY.value = withSpring(translateY.value + event.changeY)
        // console.log(translateY.value)
        if (translateY.value < 0) { console.log("setting translateY to 0"); translateY.value = 0 }
    }).onEnd(event => {
        console.log("&&&&&&&&&&translateY.value")
        console.log(translateY.value)
        // console.log("-------translateY.value")
        if (translateY.value > 0) {

            if (event.velocityY > 2300) {
                translateY.value = withTiming(400)
                router.dismiss()
                //    toggleModal()
            }
            else { translateY.value = withTiming(0) }
        }



        // console.log("event.velocityY")
        // console.log(event.velocityY)
    }).runOnJS(true)


    const draggableStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: translateY.value,
                }
            ],
        }
    })

    //    if (!isModalVisible) return null

    return (
        <SafeAreaView style={styles.main}>
            <GestureHandlerRootView>
                <GestureDetector gesture={drag}>
                    <Animated.View style={[draggableStyle, styles.container]}>

                        <View style={styles.modalLine}></View>
                        <Text style={styles.containerHeading}>Select Set Type</Text>

                        {
                            Array.from(Object.entries(ExerciseSetTypes)).map((exerciseSetType, index) => (
                                <TouchableNativeFeedback
                                    key={index + 'est'}
                                    onPress={() => router.navigate('/testModal')}
                                    // onPress={() => toggleModal()}
                                    // onPress={() => removeSet(setIndex)}
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
                                onPress={() => router.navigate('/testModal')}
                                // onPress={() => toggleModal()}
                                // onPress={() => removeSet(setIndex)}
                                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}
                            >
                                <View style={styles.setTypeRow}>
                                    <Text style={[styles.shortCodeText, { color: '#ff0000ff' }]}>X</Text>
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
        // position: 'absolute',
        // top: 0,
        width: '100%',
        backgroundColor: '#000000d5',
        // zIndex: 999999,
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
        columnGap: 20,
        paddingVertical: 10,
        backgroundColor: '#272727ff',
        borderBottomWidth: 1,
        borderBottomColor: '#363636ff',
    },
    shortCodeText: {
        fontSize: 22,
        textAlign: 'center',
        width: 30,
        verticalAlign: 'middle',
    },
    text: {
        color: 'white',
        fontSize: 20,
        verticalAlign: 'middle',
    }
})