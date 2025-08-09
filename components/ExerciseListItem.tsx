import { createTitleCaseString, toTitleCase } from '@/functions/helperFunctions';
import { ExerciseWithBodyAreas } from '@/functions/helperTypes';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

type ExerciseListItemProps = {
    exerciseInfo: ExerciseWithBodyAreas
}

export default function ExerciseListItem({ exerciseInfo }: ExerciseListItemProps) {

    /**
     * Generates a comma-separated string of bodeareas with each name in title case.
     *
     * Iterates over the `bodyareas` array, capitalizes each bodyarea name using `toTitleCase`,
     * and concatenates them into a single string separated by commas.
     * The trailing comma and space are removed from the final string.
     *
     * @returns {string} A comma-separated list of exercise names in title case.
     */
    const createBodyAreaString = (): string => {

        return createTitleCaseString(exerciseInfo.bodyAreas, b => b.bodyArea)
    }

    return (
        <View style={styles.exerciseContainer}>
            <Image source={require('@/assets/images/react-logo.png')} style={styles.exerciseImage} />
            <View style={styles.exerciseTextContainer}>
                <Text style={styles.exerciseNameText}>{toTitleCase(exerciseInfo.name)}</Text>
                <Text style={styles.exerciseTypeText}>{createBodyAreaString()}</Text>
            </View>

            <TouchableNativeFeedback
                onPress={() => { Alert.alert('Touchable pressed') }}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View style={styles.exerciseInfoButtonContainer}>
                    <AntDesign style={styles.exerciseInfoButton} name="infocirlceo" />
                </View>
            </TouchableNativeFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    exerciseContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#585858ff',
        paddingVertical: 10,
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