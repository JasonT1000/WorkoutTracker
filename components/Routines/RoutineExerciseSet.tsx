import { EXERCISETYPE, ExerciseTypes } from '@/functions/helperTypes'
import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

type RoutineExerciseSetProps = {
    exerciseTypeId: number
}

export default function RoutineExerciseSet({ exerciseTypeId }: RoutineExerciseSetProps) {
    return (
        <View style={styles.routineExerciseSetRowContainer}>
            {
                ExerciseTypes[exerciseTypeId] === EXERCISETYPE.WEIGHT ||
                ExerciseTypes[exerciseTypeId] === EXERCISETYPE.BODYWEIGHT &&
                (
                    <>
                        <Text style={styles.routineExerciseSetDataText}>1</Text>
                    </>
                )
            }

            <TextInput
                style={styles.routineExerciseSetDataText}
                placeholder='-'
                placeholderTextColor={'#858585ff'}
                keyboardType='number-pad'
            />

            {
                ExerciseTypes[exerciseTypeId] === EXERCISETYPE.WEIGHT &&
                (
                    <TextInput
                        style={styles.routineExerciseSetDataText}
                        placeholder='-'
                        placeholderTextColor={'#858585ff'}
                        keyboardType='number-pad'
                    />
                )
            }

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

    // routineExerciseContainer: {
    //     flexDirection: 'column',
    //     gap: 5,
    //     borderWidth: 1,
    //     // borderColor: '#f50000ff',
    //     // paddingVertical: 10,
    // },
    // routineExerciseTitleContainer: {
    //     flexDirection: 'row',
    // },
    // exerciseImage: {
    //     width: 50,
    //     height: 50,
    //     marginRight: 10,
    //     // borderWidth: 1,
    //     // borderColor: '#001affff',
    // },
    // routineExerciseTitle: {
    //     color: '#ffffffff',
    //     fontSize: 20,
    //     verticalAlign: 'middle',
    //     flex: 1,
    // },
    // exerciseEditButtonContainer: {
    //     color: '#d6d6d6ff',
    //     padding: 10,
    //     alignSelf: 'center',
    //     // borderWidth: 1,
    //     // borderColor: '#001affff',
    // },
    // routineExerciseNotesText: {
    //     color: '#858585ff',
    //     fontSize: 18,
    //     paddingBottom: 15,
    //     borderWidth: 1,
    //     borderColor: '#585858ff',
    // },
    // routineExerciseTimerContainer: {
    //     flexDirection: 'row',
    //     paddingVertical: 10,
    // },
    // routineExerciseTimerText: {
    //     color: '#858585ff',
    //     fontSize: 18,
    //     verticalAlign: 'middle',
    // },
    // routineExerciseSetContainer: {
    //     flexDirection: 'column',
    //     gap: 5,
    //     paddingBottom: 10,
    //     borderBottomColor: '#353535ff',
    //     borderBottomWidth: 1,
    // },
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
    routineExerciseSetRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    // routineExerciseSetDataContainer: {
    //     flexDirection: 'row',
    // },
    routineExerciseSetDataText: {
        fontSize: 18,
        color: '#ffffffff',
        width: 100,
        textAlign: 'center',
        verticalAlign: 'middle',
    },
    // addExerciseSetButton: {
    //     width: '100%',
    //     backgroundColor: '#353535ff',
    //     padding: 8,
    //     borderRadius: 10,
    // },


    // addExercisesButton: {
    //     width: '100%',
    //     backgroundColor: '#0fb800ff',
    //     padding: 8,
    //     borderRadius: 10,
    // },
    // addExercisesButtonText: {
    //     fontSize: 18,
    //     textAlign: 'center',
    //     color: '#ffffffff'
    // },
});