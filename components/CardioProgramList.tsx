import * as schema from '@/db/schema';
import { CardioProgram, ROUTES } from '@/helperFiles/helperTypes';
import Ionicons from '@expo/vector-icons/Ionicons';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from 'react';
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

    // When navigating away from this page store current duration and set a start datetime when we navigate away from this page
    // Timestamp based so dont have to keep a timer going in the background when page loses focus
    useFocusEffect(
        useCallback(() => {
            // Invoked whenever the route is focused.
            getDbCardioPrograms()
        }, []),
    );

    const getDbCardioPrograms = async () => {
        const cPrograms = await drizzleDb.query.cardioProgram.findMany();
        if (cPrograms) {
            setCardioPrograms(cPrograms)
            setIsLoading(false)
        }
    }

    const getFilteredExercises = () => {
        return cardioPrograms.filter(cProgram => cProgram.name.includes(searchTerm.toLowerCase()))
        // add ability to search by exercise name and exercise bodyArea
    }

    if (isLoading) return <ActivityIndicator />

    return (
        <View style={{ flex: 1, marginBottom: 40 }}>
            <View style={styles.ListHeadingContainer}>
                <Text style={styles.containerHeadingtext}>Cardio Programs</Text>
                <TouchableNativeFeedback
                    onPress={() => router.navigate({
                        pathname: ROUTES.NEWCARDIOPROGRAM,
                        params: {}
                    })}
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