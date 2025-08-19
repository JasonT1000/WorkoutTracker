import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type SetTypeModalProps = {
    isModalVisible: boolean
    toggleModal: () => void
}

export default function SetTypeModal({ isModalVisible, toggleModal }: SetTypeModalProps) {
    // const [modalVisible, setModalVisible] = useState(false);
    const translateY = useSharedValue(0);

    const drag = Gesture.Pan().onChange(event => {
        translateY.value += event.changeY
        // translateY.value = withSpring(translateY.value + event.changeY)
        // console.log(translateY.value)
        if (translateY.value < 0) { translateY.value = 0 }
    }).onEnd(event => {
        if (translateY.value === 0) { return }

        if (event.velocityY > 2300) {
            translateY.value = withTiming(400)
            toggleModal()
        }
        else { translateY.value = withTiming(0) }



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

    if (!isModalVisible) return null

    return (
        <SafeAreaView style={styles.main}>
            <GestureDetector gesture={drag}>
                <Animated.View style={[draggableStyle, styles.container]}>
                    <Text style={styles.text}>modal</Text>
                    <Text style={styles.text}>modal</Text>
                    <Text style={styles.text}>modal</Text>
                    <Text style={styles.text}>modal</Text>
                    <Text style={styles.text}>modal</Text>
                    <Text style={styles.text}>modal</Text>
                </Animated.View>
            </GestureDetector>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        // flex: 1,
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: '#000000d5',
        zIndex: 9999,
    },
    container: {
        // position: 'absolute',
        top: 400,
        width: '100%',
        // height: '100%',
        backgroundColor: '#272727ff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 30,
    },
    text: {
        color: 'white',
        fontSize: 24,
    }
})