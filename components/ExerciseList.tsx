import * as schema from '@/db/schema';
import { ExerciseWithBodyAreas } from '@/functions/helperTypes';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import ExerciseListItem from './ExerciseListItem';

type ExerciseListProps = {
    addExercise: (exerciseInfo: ExerciseWithBodyAreas) => void,
    removeExercise: (exerciseId: number) => void
}

export default function ExerciseList({ addExercise, removeExercise }: ExerciseListProps) {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    // const [exercises, setExercises] = useState<schema.Exercise[]>([])
    const [exercisesWithBodyAreas, setExercisesWithBodyAreas] = useState<ExerciseWithBodyAreas[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const load = async () => {

            const exercises = await drizzleDb.query.exercise.findMany();
            if (exercises) {
                const exerciseBodyAreas = await drizzleDb.select({
                    exerciseId: schema.exercise.id,
                    bodyArea: schema.bodyArea.name
                })
                    .from(schema.exercise)
                    .leftJoin(schema.exerciseBodyArea, eq(schema.exercise.id, schema.exerciseBodyArea.exerciseId))
                    .where(sql`${schema.exerciseBodyArea.ismajorbodyarea} = '1'`)
                    .innerJoin(schema.bodyArea, eq(schema.exerciseBodyArea.bodyareaId, schema.bodyArea.id))

                if (exerciseBodyAreas) {
                    const exerciseBodyAreasGrouped = exercises.reduce((acc, exercise) => {
                        const bodyAreas = exerciseBodyAreas.filter(eba => eba.exerciseId === exercise.id)
                        acc.push({ ...exercise, bodyAreas })

                        return acc;
                    }, [] as ExerciseWithBodyAreas[])

                    setExercisesWithBodyAreas(exerciseBodyAreasGrouped)
                    setIsLoading(false)
                }
            }
        }

        load()

    }, []);

    if (isLoading) return <ActivityIndicator />

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.containerHeadingtext}>Exercise list</Text>
            <FlatList
                data={exercisesWithBodyAreas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ExerciseListItem exerciseInfo={item} addExercise={addExercise} removeExercise={removeExercise} />}
                automaticallyAdjustContentInsets
            />
        </View>
    )
}

const styles = StyleSheet.create({
    containerHeadingtext: {
        color: '#b6b6b6ff',
        fontSize: 20,
        paddingBottom: 7,
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
    },
    addExercisesButtonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#ffffffff'
    },
});