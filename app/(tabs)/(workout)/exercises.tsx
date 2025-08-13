import ExerciseList from '@/components/ExerciseList';
import OptionsHeader from '@/components/OptionsHeader';
import { ExerciseWithBodyAreas } from '@/functions/helperTypes';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Exercises() {
    const [exercises, setExercises] = useState<ExerciseWithBodyAreas[]>([])

    const addExercise = (exerciseInfo: ExerciseWithBodyAreas) => {
        console.log("exercise clicked on")
        console.log(exerciseInfo)
        console.log([...exercises, exerciseInfo])
        setExercises([...exercises, exerciseInfo])
    }

    const returnExercises = () => {
        router.navigate({
            pathname: '/routine',
            params: { selectedExercises: JSON.stringify(exercises) }
        })
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.main}>
                <OptionsHeader title="Exercises" />

                <View style={styles.body}>
                    <View style={styles.searchContainer}>
                        <AntDesign name="search1" size={24} color='#858585ff' />
                        <TextInput
                            style={styles.searchBoxText}
                            placeholder='Search exercises'
                            placeholderTextColor={'#858585ff'}
                            maxLength={33}
                        />
                    </View>
                    <View>
                        <Text style={styles.containerHeadingtext}>Search buttons</Text>
                    </View>

                    <ExerciseList addExercise={addExercise} />

                    <TouchableNativeFeedback
                        onPress={() => returnExercises()}
                        background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                        <View style={styles.addExercisesButton}>
                            <Text style={styles.addExercisesButtonText}>Add exercises</Text>
                        </View>
                    </TouchableNativeFeedback>

                    {/* <Button
                        title="Add # exercise"
                        color={'#0fb800ff'}
                        onPress={() => returnExercises()}
                    /> */}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        flex: 1,
        // margin: 15,
    },
    body: {
        margin: 15,
        flex: 1,
        borderWidth: 1,
        borderColor: 'green'
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