import { getExerciseSetTypeId, toTitleCase } from '@/functions/helperFunctions';
import { EXERCISESETTYPE, NewRoutineExercise, NewRoutineExerciseSet } from '@/functions/helperTypes';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import RoutineExerciseSet from './RoutineExerciseSet';
import RoutineExerciseSetHeader from './RoutineExerciseSetHeader';

type RoutineExerciseProps = {
    routineExercise: NewRoutineExercise
}

export default function RoutineExercise({ routineExercise }: RoutineExerciseProps) {
    const [exerciseSets, setExerciseSets] = useState<NewRoutineExerciseSet[]>([{
        routineExerciseId: routineExercise.exerciseId,
        exerciseSetTypeId: getExerciseSetTypeId(EXERCISESETTYPE.NORMAL),
        reps: null,
        weight: null,
        distance: null,
        time: null
    }])

    const addSet = () => {
        console.log("adding set")
        setExerciseSets([...exerciseSets, {
            routineExerciseId: routineExercise.exerciseId,
            exerciseSetTypeId: getExerciseSetTypeId(EXERCISESETTYPE.NORMAL),
            reps: null,
            weight: null,
            distance: null,
            time: null
        }])

    }

    const removeSet = () => {
        console.log("removing set")
    }

    return (
        <View style={styles.routineExerciseContainer}>
            <View style={styles.routineExerciseTitleContainer}>
                <Image source={require('@/assets/images/react-logo.png')} style={styles.exerciseImage} />
                <Text style={styles.routineExerciseTitle}>{toTitleCase(routineExercise.exerciseInfo.name)}</Text>

                <TouchableNativeFeedback
                    onPress={() => { Alert.alert('Edit exercise dots pressed') }}
                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                    <View style={styles.exerciseEditButtonContainer}>
                        <Entypo name="dots-three-vertical" size={24} color="white" />
                    </View>
                </TouchableNativeFeedback>
            </View>

            <TextInput
                style={styles.routineExerciseNotesText}
                placeholder='Add routine exercise notes here'
                placeholderTextColor={'#858585ff'}
            />
            <TouchableNativeFeedback
                onPress={() => { Alert.alert('Edit exercise dots pressed') }}
                background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                <View style={styles.routineExerciseTimerContainer}>
                    <MaterialCommunityIcons name="timer-outline" size={24} color="white" />
                    <Text style={styles.routineExerciseTimerText}>Rest Timer: OFF</Text>
                </View>
            </TouchableNativeFeedback>

            <View style={styles.routineExerciseSetContainer}>

                <RoutineExerciseSetHeader exerciseTypeId={routineExercise.exerciseInfo.exerciseTypeId} />

                {
                    [...Array(exerciseSets.length)].map((_, index) => (
                        <RoutineExerciseSet
                            key={routineExercise.positionIndex.toString() + 're' + index.toString()}
                            setIndex={index}
                            positionIndex={routineExercise.positionIndex}
                            exerciseTypeId={routineExercise.exerciseInfo.exerciseTypeId} />
                    ))
                }

                <TouchableNativeFeedback
                    onPress={() => addSet()}
                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                    <View style={styles.addExerciseSetButton}>
                        <Text style={styles.addExerciseSetButtonText}>Add Set</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    routineExerciseContainer: {
        flexDirection: 'column',
        gap: 5,
        marginBottom: 15,
    },
    routineExerciseTitleContainer: {
        flexDirection: 'row',
    },
    exerciseImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    routineExerciseTitle: {
        color: '#0160adff',
        fontSize: 20,
        verticalAlign: 'middle',
        flex: 1,
    },
    exerciseEditButtonContainer: {
        color: '#d6d6d6ff',
        padding: 10,
        alignSelf: 'center',
    },
    routineExerciseNotesText: {
        color: '#858585ff',
        fontSize: 18,
        paddingBottom: 15,
        // borderWidth: 1,
        // borderColor: '#585858ff',
    },
    routineExerciseTimerContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    routineExerciseTimerText: {
        color: '#858585ff',
        fontSize: 18,
        verticalAlign: 'middle',
    },
    routineExerciseSetContainer: {
        flexDirection: 'column',
        gap: 5,
        paddingBottom: 10,
    },
    addExerciseSetButton: {
        width: '100%',
        backgroundColor: '#353535ff',
        padding: 8,
        borderRadius: 10,
    },

    addExerciseSetButtonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#ffffffff'
    },
});