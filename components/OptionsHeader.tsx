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
        color: '#0160adff',
    },
});