import * as schema from '@/db/schema';
import { toTitleCase } from '@/functions/helperFunctions';
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import { Alert, Button, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

type RoutineListItemProps = {
    routine: schema.Routine,
    exercises: { exerciseName: string }[]
}

export default function RoutineListItem({ routine, exercises }: RoutineListItemProps) {
    const createExercisesString = (): string => {

        let exercisesString = ''

        exercises.forEach(exercise => {
            let capitalizedWord = toTitleCase(exercise.exerciseName)
            exercisesString += capitalizedWord + ', '
        });

        return exercisesString.slice(0, -2)
    }

    return (
        <View style={styles.routineContainer}>
            <View style={styles.routineHeadingContainer}>
                <Text style={styles.routineTextHeading}>{routine.name}</Text>
                <TouchableNativeFeedback
                    // onPress={() => { Alert.alert('Touchable pressed') }}
                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                    <View>
                        <Entypo name="dots-three-horizontal" size={24} color="white" />
                    </View>
                </TouchableNativeFeedback>
            </View>
            <Text style={styles.routineText}>{createExercisesString()}</Text>
            <Button
                title="Start Routine"
                onPress={() => Alert.alert('Simple Button pressed')}
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