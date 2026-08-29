import * as schema from '@/db/schema';
import { createTitleCaseString, toTitleCase } from '@/helperFiles/helperFunctions';
import Entypo from "@react-native-vector-icons/entypo";
import React from 'react';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

type RoutineListItemProps = {
    routine: schema.Routine,
    exercises: { routineExerciseId: number, positionIndex: number, routineId: number, exerciseId: number, restTimer: number, notes: string | null, exerciseName: string }[]
    startRoutine: (routineId: number) => void
    showListItemMenu: (routineId: number, routineName: string) => void
}

export default function RoutineListItem({ routine, exercises, startRoutine, showListItemMenu }: RoutineListItemProps) {

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
                    onPress={() => showListItemMenu(routine.id, routine.name)}
                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                    <View style={styles.threeDots}>
                        <Entypo name="dots-three-horizontal" size={24} color="white" />
                    </View>
                </TouchableNativeFeedback>
            </View>
            <Text style={styles.routineText}>{createExercisesString()}</Text>
            <TouchableNativeFeedback
                onPress={() => startRoutine(routine.id)}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View style={styles.addExercisesButton}>
                    <Text style={styles.addExercisesButtonText}>Start Routine</Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    routineTextHeading: {
        color: 'white',
        fontSize: 24,
    },
    routineText: {
        color: '#b6b6b6ff',
        fontSize: 18,
        marginBottom: 12,
    },
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
    },
    threeDots: {
        height: 30,
        width: 30,
        alignItems: 'center',
    },

    addExercisesButton: {
        width: '100%',
        backgroundColor: '#18a0fcff',
        padding: 8,
        borderRadius: 10,
    },
    addExercisesButtonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#ffffffff'
    },
});