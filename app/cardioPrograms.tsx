import CardioProgramList from '@/components/CardioProgramList';
import OptionsHeader from '@/components/OptionsHeader';
import { NewWorkoutExerciseSetKey, ROUTES } from '@/helperFiles/helperTypes';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DispatchContext as RoutineDispatchContext } from '../state/routine/routineExerciseContext';
import { DispatchContext as WorkoutDispatchContext } from '../state/workout/workoutExerciseContext';

export default function CardioPrograms() {
    const { returnRoute, existingCardioProgramId, exercisePositionIndex, exerciseSetIndex } = useLocalSearchParams()

    const getExistingCardioProgramId = (): number => {
        if (typeof existingCardioProgramId === 'string') {
            return parseInt(existingCardioProgramId)
        }
        else {
            return -1
        }
    }

    // State
    const routineDispatch = useContext(RoutineDispatchContext)
    const workoutDispatch = useContext(WorkoutDispatchContext)
    const [selectedCardioProgramId, setSelectedCardioProgramId] = useState<number>(getExistingCardioProgramId())
    const [searchTerm, setSearchTerm] = useState<string>('');

    const updateSelectedCardioProgram = (cardioProgramId: number) => {
        setSelectedCardioProgramId(cardioProgramId)
    }

    const setCardioProgram = () => {
        if (typeof exercisePositionIndex === 'string' && typeof exerciseSetIndex === 'string') {
            // if (selectedCardioProgramId < 0) {
            //     Alert.alert('Whoopsie doodle, you need to choose a cardio program')
            // }
            // else {
            if (returnRoute === ROUTES.WORKOUT) {
                workoutDispatch({
                    type: 'UPDATE_NEWWORKOUTEXERCISESET',
                    payload: {
                        newWorkoutExerciseIndex: parseInt(exercisePositionIndex as string),
                        setIndex: parseInt(exerciseSetIndex as string),
                        field: NewWorkoutExerciseSetKey.CARDIOPROGRAMID,
                        value: selectedCardioProgramId
                    }
                })
            }
            else if (returnRoute === ROUTES.ROUTINE) {
                routineDispatch({
                    type: 'UPDATE_NEWROUTINEEXERCISESET',
                    payload: {
                        newRoutineExerciseIndex: parseInt(exercisePositionIndex as string),
                        setIndex: parseInt(exerciseSetIndex as string),
                        field: NewWorkoutExerciseSetKey.CARDIOPROGRAMID,
                        value: selectedCardioProgramId
                    }
                })
            }

            //route back to return route
            router.replace({ pathname: returnRoute as ROUTES })
            // }
        }

        console.log("passed in exercise index or set index is not a string", returnRoute, exercisePositionIndex)

    }

    const editCardioProgram = (cardioProgramId: number) => {
        console.log("removing exercise")
        // setCardioPrograms(cardioPrograms.filter((cardioProgram) => cardioProgram.id !== cardioProgramId))
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.main}>
                <OptionsHeader title="Cardio Programs" cancelButtonRoute={returnRoute as ROUTES} save={setCardioProgram} />

                <View style={styles.body}>
                    <View style={styles.searchContainer}>
                        <AntDesign name="search1" size={24} color='#858585ff' />
                        <TextInput
                            style={styles.searchBoxText}
                            placeholder='Search cardio programs'
                            placeholderTextColor={'#858585ff'}
                            maxLength={33}
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                    </View>

                    <CardioProgramList
                        searchTerm={searchTerm}
                        selectedCardioProgramId={selectedCardioProgramId}
                        updateSelectedCardioProgram={updateSelectedCardioProgram}
                        editCardioProgram={editCardioProgram}
                    />

                    {/* <TouchableNativeFeedback
                        // onPress={() => addSet()}
                        background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                        <View style={styles.addExerciseSetButton}>
                            <Text style={styles.addExercisesButtonText}>Add Set</Text>
                        </View>
                    </TouchableNativeFeedback> */}

                    <TouchableNativeFeedback
                        onPress={() => setCardioProgram()}
                        background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                        <View style={styles.addExercisesButton}>
                            <Text style={styles.addExercisesButtonText}>Set Cardio Program</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        flex: 1,
    },
    body: {
        margin: 15,
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#353535ff',
        borderRadius: 10,
        paddingHorizontal: 8,
    },
    containerHeadingtext: {
        color: '#b6b6b6ff',
        fontSize: 20,
        paddingBottom: 7,
    },
    searchBoxText: {
        color: '#858585ff',
        fontSize: 18,
        width: '100%'
    },

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
    exerciseInfoButton: {
        fontSize: 18,
        color: '#858585ff',
        verticalAlign: 'middle'
    },

    addExerciseSetButton: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        backgroundColor: '#272727ff',
        padding: 8,
        marginTop: 10,
        borderRadius: 10,
    },

    addExercisesButton: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#0fb800ff',
        padding: 8,
        borderRadius: 10,
    },
    addExercisesButtonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#ffffffff'
    },

    topSectionContainer: {
        borderWidth: 1,
        borderColor: 'yellow',
        paddingBottom: 10,
    },
});