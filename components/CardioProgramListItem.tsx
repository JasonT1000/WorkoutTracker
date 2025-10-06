import { toTitleCase } from '@/helperFiles/helperFunctions';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

type CardioProgramListItemProps = {
    cardioProgramId: number,
    programName: string,
    selectedCardioProgramId: number,
    updateSelectedCardioProgram: (cardioProgramId: number) => void,
    editCardioProgram: (exerciseId: number) => void
}

export default function CardioProgramListItem({ cardioProgramId, programName, selectedCardioProgramId, updateSelectedCardioProgram, editCardioProgram }: CardioProgramListItemProps) {

    const [isSelected, setIsSelected] = useState<boolean>(cardioProgramId === selectedCardioProgramId ? true : false)

    useEffect(() => {
        setIsSelected(cardioProgramId === selectedCardioProgramId ? true : false)
    }, [selectedCardioProgramId])

    const onCardioProgramButtonPressed = () => {
        if (isSelected === false) {
            updateSelectedCardioProgram(cardioProgramId)
        }
        else {
            updateSelectedCardioProgram(-1)
        }
    }

    return (
        <TouchableNativeFeedback
            onPress={() => { onCardioProgramButtonPressed() }}
            background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>

            <View style={styles.exerciseContainer}>
                <View style={isSelected ? styles.verticalLine : null}></View>
                <Image source={require('@/assets/images/react-logo.png')} style={styles.exerciseImage} />
                <View style={styles.exerciseTextContainer}>
                    <Text style={styles.exerciseNameText}>Id: {cardioProgramId}</Text>
                    <Text style={styles.exerciseNameText}>{toTitleCase(programName)}</Text>
                </View>

                <TouchableNativeFeedback
                    onPress={() => { Alert.alert('Touchable pressed') }}
                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                    <View style={styles.exerciseInfoButtonContainer}>
                        <AntDesign style={styles.exerciseInfoButton} name="infocirlceo" />
                    </View>
                </TouchableNativeFeedback>
            </View>

        </TouchableNativeFeedback>
    )
}

const styles = StyleSheet.create({
    exerciseContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#585858ff',
        paddingVertical: 10,
    },
    verticalLine: {
        borderLeftWidth: 5,
        borderLeftColor: '#038dceff',
        marginLeft: 10,
    },
    exerciseImage: {
        width: 70,
        height: 70,
        marginRight: 10,
    },
    exerciseTextContainer: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    exerciseNameText: {
        color: '#ffffffff',
        fontSize: 20,
    },
    exerciseTypeText: {
        fontSize: 18,
        color: '#858585ff',
    },
    exerciseInfoButtonContainer: {
        color: '#d6d6d6ff',
        padding: 10,
        alignSelf: 'center',
    },
    exerciseInfoButton: {
        fontSize: 24,
        color: '#d6d6d6ff',
    },
});