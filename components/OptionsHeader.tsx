import { router } from 'expo-router'
import React from 'react'
import { Alert, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'

type OptionsHeaderProps = {
    title: string
}

export default function OptionsHeader({ title }: OptionsHeaderProps) {
    return (
        <View style={styles.optionsHeader}>
            <TouchableNativeFeedback
                onPress={() => { router.dismiss() }}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </View>
            </TouchableNativeFeedback>

            <Text style={styles.optionsText}>{title}</Text>

            <TouchableNativeFeedback
                onPress={() => { Alert.alert('Touchable pressed') }}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View style={styles.saveButton}>
                    <Text style={styles.optionsText}>Save</Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    // main: {
    //     flexDirection: 'column',
    //     flex: 1,
    // },
    // body: {
    //     margin: 15,
    // },
    // routineExercisesContainer: {
    //     color: 'white',
    //     fontSize: 24,
    //     height: 200,
    //     alignContent: 'center',
    //     verticalAlign: 'middle',
    //     textAlign: 'center'
    // },
    optionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#353535ff',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
    },

    saveButton: {
        backgroundColor: '#afafafff',
        paddingVertical: 7,
        paddingHorizontal: 13,
        borderRadius: 10,
    },
    cancelButton: {
        paddingVertical: 7,
        paddingRight: 13,
        borderRadius: 10,
    },
    optionsText: {
        fontSize: 18,
        color: '#ffffffff',
    },
    cancelButtonText: {
        fontSize: 18,
        color: '#006ec9ff',
    },
    // routineTitleText: {
    //     color: '#858585ff',
    //     fontSize: 24,
    //     paddingBottom: 15,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#585858ff',
    // },
    // containerSubHeadingtext: {
    //   color: '#b6b6b6ff',
    //   fontSize: 20,
    //   paddingBottom: 7,
    // },
    // text: {
    //   color: 'white',
    //   fontSize: 24,
    // },
    // routineTextHeading: {
    //   color: 'white',
    //   fontSize: 24,
    // },
    // routineText: {
    //   color: '#b6b6b6ff',
    //   fontSize: 18,
    // },

    // topSectionContainer: {
    //     borderWidth: 1,
    //     borderColor: 'yellow',
    //     paddingBottom: 10,
    // },
    // days: {
    //   // flex: 1,
    // },
    // imagesContainer: {
    //   height: 250,
    //   borderWidth: 1,
    //   borderColor: 'red'
    // },
    // imageSvg: {
    //   alignSelf: 'center',
    // },
    // image: {
    //   position: 'absolute',
    //   alignSelf: 'center',
    //   resizeMode: 'contain',
    // },

    // bottomSectionContainer: {
    //   flex: 1,
    //   flexDirection: 'column',
    //   borderWidth: 1,
    //   borderColor: 'green'
    // },
    // routineContainer: {
    //   flexDirection: 'column',
    //   borderRadius: 12,
    //   padding: 18,
    //   backgroundColor: '#5c5b5bff',
    //   marginBottom: 10,
    // },
    // routineHeadingContainer: {
    //   // flex: 1,
    //   flexDirection: 'row',
    //   justifyContent: 'space-between',
    //   alignItems: 'flex-end',
    // }
});