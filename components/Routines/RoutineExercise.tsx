import { toTitleCase } from '@/functions/helperFunctions';
import { ExerciseWithBodyAreas } from '@/functions/helperTypes';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import RoutineExerciseSet from './RoutineExerciseSet';
import RoutineExerciseSetHeader from './RoutineExerciseSetHeader';

type RoutineExerciseProps = {
    routineExercise: ExerciseWithBodyAreas
}

type ExerciseSet = {
    reps: number | null,
    weight: Float | null,
    distance: Float | null,
    time: number | null
}


export default function RoutineExercise({ routineExercise }: RoutineExerciseProps) {
    const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([{ reps: null, weight: null, distance: null, time: null }])

    const addSet = () => {
        console.log("adding set")
        setExerciseSets([...exerciseSets, { reps: null, weight: null, distance: null, time: null }])
    }

    const removeSet = () => {
        console.log("removing set")
    }

    return (
        <View style={styles.routineExerciseContainer}>
            <View style={styles.routineExerciseTitleContainer}>
                <Image source={require('@/assets/images/react-logo.png')} style={styles.exerciseImage} />
                <Text style={styles.routineExerciseTitle}>{toTitleCase(routineExercise.name)}</Text>

                <TouchableNativeFeedback
                    onPress={() => { Alert.alert('Edit exercise dots pressed') }}
                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                    <View style={styles.exerciseEditButtonContainer}>
                        <Entypo name="dots-three-horizontal" size={24} color="white" />
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

                <RoutineExerciseSetHeader exerciseTypeId={routineExercise.exerciseTypeId} />

                {
                    [...Array(exerciseSets.length)].map((_, index) => (
                        <RoutineExerciseSet key={index} exerciseTypeId={routineExercise.exerciseTypeId} />
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
    // main: {
    //     flexDirection: 'column',
    //     flex: 1,
    //     // margin: 15,
    // },
    // body: {
    //     // flex: 1,
    //     margin: 15,
    // },
    // routineExercisesContainer: {
    //     color: 'white',
    //     fontSize: 24,
    //     alignContent: 'center',
    //     verticalAlign: 'middle',
    //     textAlign: 'center'
    // },
    // optionsHeader: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     backgroundColor: '#353535ff',
    //     alignItems: 'center',
    //     paddingHorizontal: 15,
    //     paddingVertical: 8,
    // },

    // saveButton: {
    //     backgroundColor: '#afafafff',
    //     paddingVertical: 7,
    //     paddingHorizontal: 13,
    //     borderRadius: 10,
    // },
    // cancelButton: {
    //     paddingVertical: 7,
    //     paddingRight: 13,
    //     borderRadius: 10,
    // },
    // optionsText: {
    //     fontSize: 18,
    //     color: '#ffffffff',
    // },
    // cancelButtonText: {
    //     fontSize: 18,
    //     color: '#006ec9ff',
    // },
    // routineTitleText: {
    //     color: '#858585ff',
    //     fontSize: 24,
    //     paddingBottom: 15,
    //     marginBottom: 35,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#585858ff',
    // },

    // topSectionContainer: {
    //     borderWidth: 1,
    //     borderColor: 'yellow',
    //     paddingBottom: 10,
    // },

    routineExerciseContainer: {
        // flex: 1,
        flexDirection: 'column',
        gap: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#f50000ff',
        // paddingVertical: 10,
    },
    routineExerciseTitleContainer: {
        flexDirection: 'row',
    },
    exerciseImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        // borderWidth: 1,
        // borderColor: '#001affff',
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
        // borderWidth: 1,
        // borderColor: '#001affff',
    },
    routineExerciseNotesText: {
        color: '#858585ff',
        fontSize: 18,
        paddingBottom: 15,
        borderWidth: 1,
        borderColor: '#585858ff',
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
        // borderBottomColor: '#353535ff',
        // borderBottomWidth: 1,
    },
    // routineExerciseSetTitleContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-evenly',
    // },
    // routineExerciseSetTitleText: {
    //     fontSize: 18,
    //     color: '#858585ff',
    //     width: 100,
    //     textAlign: 'center',
    // },
    // routineExerciseSetRowContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-evenly',
    // },
    // routineExerciseSetDataContainer: {
    //     flexDirection: 'row',
    // },
    // routineExerciseSetDataText: {
    //     fontSize: 18,
    //     color: '#ffffffff',
    //     width: 100,
    //     textAlign: 'center',
    //     verticalAlign: 'middle',
    // },
    addExerciseSetButton: {
        width: '100%',
        backgroundColor: '#353535ff',
        padding: 8,
        borderRadius: 10,
    },


    // addExercisesButton: {
    //     width: '100%',
    //     backgroundColor: '#0fb800ff',
    //     padding: 8,
    //     borderRadius: 10,
    // },
    addExerciseSetButtonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#ffffffff'
    },
});