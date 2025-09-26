import * as schema from '@/db/schema';
import { CardioProgram } from '@/helperFiles/helperTypes';
import Ionicons from '@expo/vector-icons/Ionicons';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import CardioProgramListItem from './CardioProgramListItem';

type CardioProgramListProps = {
    searchTerm: string,
    selectedCardioProgramId: number,
    updateSelectedCardioProgram: (cardioProgramId: number) => void,
    editCardioProgram: (cardioProgramId: number) => void,
}

export default function CardioProgramList({ searchTerm, selectedCardioProgramId, updateSelectedCardioProgram, editCardioProgram }: CardioProgramListProps) {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    // const [exercises, setExercises] = useState<schema.Exercise[]>([])
    // const [exercisesWithBodyAreas, setExercisesWithBodyAreas] = useState<ExerciseWithBodyAreas[]>([])
    const [cardioPrograms, setCardioPrograms] = useState<CardioProgram[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getDbCardioPrograms()
    }, []);

    const getDbCardioPrograms = async () => {
        const cPrograms = await drizzleDb.query.cardioProgram.findMany();
        if (cPrograms) {
            setCardioPrograms(cPrograms)
            setIsLoading(false)
        }
    }

    const addNewCardioProgramToDb = () => {
        //TODO: add functionality. Show input box for cardio program name
    }

    const getFilteredExercises = () => {
        return cardioPrograms.filter(cProgram => cProgram.name.includes(searchTerm.toLowerCase()))
        // add ability to search by exercise name and exercise bodyArea
    }

    if (isLoading) return <ActivityIndicator />

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.ListHeadingContainer}>
                <Text style={styles.containerHeadingtext}>Cardio Programs</Text>
                <TouchableNativeFeedback
                    onPress={() => { addNewCardioProgramToDb() }}
                    background={TouchableNativeFeedback.Ripple('#2c2c2cff', false)}>
                    <View style={styles.AddCardioProgramButtonContainer}>
                        <Ionicons name="add" size={28} color="rgba(204, 201, 34, 1)" />
                    </View>
                </TouchableNativeFeedback>
            </View>

            <FlatList
                data={getFilteredExercises()}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) =>
                    <CardioProgramListItem
                        cardioProgramId={item.id}
                        programName={item.name}
                        selectedCardioProgramId={selectedCardioProgramId}
                        updateSelectedCardioProgram={updateSelectedCardioProgram}
                        editCardioProgram={editCardioProgram}
                    />}
                automaticallyAdjustContentInsets
            />
        </View>
    )
}

const styles = StyleSheet.create({
    containerHeadingtext: {
        color: '#b6b6b6ff',
        fontSize: 20,
        // paddingBottom: 7,
        verticalAlign: 'middle'
    },

    ListHeadingContainer: {
        flexDirection: 'row',
        // borderBottomWidth: 1,
        // borderColor: '#585858ff',
        // paddingVertical: 10,
        justifyContent: 'space-between'
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

    AddCardioProgramButtonContainer: {
        color: '#d6d6d6ff',
        padding: 10,
        // alignSelf: 'center',
        // alignSelf: 'flex-start',
    },

    addExercisesButton: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#0fb800ff',
        padding: 8,
    },
    addExercisesButtonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#ffffffff'
    },
});