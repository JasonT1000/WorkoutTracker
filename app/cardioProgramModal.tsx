import { dbInsertCardioProgram } from '@/db/inserts';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function CardioProgramModal() {
    // const { exercisePositionIndex, setIndex, currentRoute } = useLocalSearchParams()
    // State
    const [cardioProgramName, setCardioProgramName] = useState<string>('')
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

    const saveCardioProgram = () => {
        if (cardioProgramName !== '') {
            dbInsertCardioProgram(cardioProgramName)
            router.dismiss()
        }
        else {
            Alert.alert('Oi cuzzy, the cardio program needs a name!')
        }
    }

    return (
        <SafeAreaView style={styles.main}>
            <GestureHandlerRootView>
                <GestureDetector gesture={pan}>
                    <Animated.View style={[draggableStyle, styles.container]}>

                        <View style={styles.modalLine}></View>
                        <Text style={styles.containerHeading}>Create Cardio Program</Text>

                        <View style={styles.bodyColumn}>
                            <Text style={styles.nameHeading}>Cardio Program</Text>
                            <TextInput
                                style={styles.nameInput}
                                onChangeText={setCardioProgramName}
                                value={cardioProgramName}
                                placeholder='Program Name'
                                placeholderTextColor={'#858585ff'}
                            // onSubmitEditing={setCardioProgramName}
                            // onBlur={setCardioProgramName}
                            />
                        </View>

                        <View style={styles.buttonContainerRow}>

                            {/* <TouchableNativeFeedback
                                onPress={() => router.dismiss()}
                                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}
                            >
                                <View style={styles.buttonRow}>
                                    <Feather name="trash-2" size={24} color='#d9534f' style={styles.buttonIcon} />
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </View>
                            </TouchableNativeFeedback> */}
                            <TouchableNativeFeedback
                                onPress={() => saveCardioProgram()}
                                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}
                            >
                                <View style={styles.buttonRow}>
                                    <FontAwesome5 name="save" size={24} color='#5cb85c' style={styles.buttonIcon} />
                                    <Text style={styles.buttonText}>Save</Text>
                                </View>
                            </TouchableNativeFeedback>

                        </View>
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
        color: '#b6b6b6ff',
        fontSize: 20,
        paddingVertical: 10,
        marginBottom: 25,
    },

    bodyColumn: {
        flexDirection: 'column',
        paddingVertical: 10,
        backgroundColor: '#272727ff',
        borderWidth: 1,
        borderColor: '#363636ff',
        borderRadius: 15,
    },

    nameHeading: {
        color: 'white',
        fontSize: 20,
        verticalAlign: 'middle',
        marginHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#585858ff',
    },
    nameInput: {
        color: '#858585ff',
        fontSize: 20,
        paddingBottom: 15,
        paddingLeft: 5,
    },

    buttonContainerRow: {
        width: '50%',
        flexDirection: 'row',
        alignSelf: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        marginTop: 50,
        columnGap: 30,
        paddingVertical: 10,
        backgroundColor: '#272727ff',
        borderWidth: 1,
        borderColor: '#363636ff',
        borderRadius: 15,
    },
    buttonIcon: {
        fontSize: 22,
        textAlign: 'center',
        width: 30,
        verticalAlign: 'middle',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        verticalAlign: 'middle',
    },
})