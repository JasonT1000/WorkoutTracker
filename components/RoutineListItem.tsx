import * as schema from '@/db/schema';
import { createTitleCaseString, toTitleCase } from '@/functions/helperFunctions';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Button, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

type RoutineListItemProps = {
    routine: schema.Routine,
    exercises: { exerciseName: string }[]
}

export default function RoutineListItem({ routine, exercises }: RoutineListItemProps) {

    /**
     * Generates a comma-separated string of exercise names with each name in title case.
     *
     * Iterates over the `exercises` array, capitalizes each exercise name using `toTitleCase`,
     * and concatenates them into a single string separated by commas.
     * The trailing comma and space are removed from the final string.
     *
     * @returns {string} A comma-separated list of exercise names in title case.
     */
    const createExercisesString = (): string => {

        return createTitleCaseString(exercises, e => e.exerciseName)
    }

    return (
        <View style={styles.routineContainer}>
            <View style={styles.routineHeadingContainer}>
                <Text style={styles.routineTextHeading}>{toTitleCase(routine.name)}</Text>
                <TouchableNativeFeedback
                    onPress={() => { Alert.alert('Touchable pressed') }}
                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                    <View>
                        <Entypo name="dots-three-horizontal" size={24} color="white" />
                    </View>
                </TouchableNativeFeedback>
            </View>
            <Text style={styles.routineText}>{createExercisesString()}</Text>
            <Button
                title="Start Routine"
                onPress={() => {
                    router.navigate({
                        pathname: '/routine',
                        params: {}
                    })
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    // main: {
    //     flexDirection: 'column',
    //     flex: 1,
    //     margin: 15,
    // },
    // containerHeadingtext: {
    //     color: 'white',
    //     fontSize: 24,
    //     paddingBottom: 7,
    // },
    // containerSubHeadingtext: {
    //     color: '#b6b6b6ff',
    //     fontSize: 20,
    //     paddingBottom: 7,
    // },
    // text: {
    //     color: 'white',
    //     fontSize: 24,
    // },
    routineTextHeading: {
        color: 'white',
        fontSize: 24,
    },
    routineText: {
        color: '#b6b6b6ff',
        fontSize: 18,
        marginBottom: 12,
    },

    // topSectionContainer: {
    //     borderWidth: 1,
    //     borderColor: 'yellow',
    //     paddingBottom: 10,
    // },
    // days: {
    //     // flex: 1,
    // },
    // imagesContainer: {
    //     height: 250,
    //     borderWidth: 1,
    //     borderColor: 'red'
    // },
    // imageSvg: {
    //     alignSelf: 'center',
    // },
    // image: {
    //     position: 'absolute',
    //     alignSelf: 'center',
    //     resizeMode: 'contain',
    // },

    // bottomSectionContainer: {
    //     flex: 1,
    //     flexDirection: 'column',
    //     borderWidth: 1,
    //     borderColor: 'green'
    // },
    routineContainer: {
        flexDirection: 'column',
        borderRadius: 12,
        padding: 18,
        backgroundColor: '#5c5b5bff',
        marginBottom: 10,
    },
    routineHeadingContainer: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    }
});