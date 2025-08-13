import * as schema from '@/db/schema';
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import RoutineListItem from './RoutineListItem';


export default function RoutineList() {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const [routines, setRoutines] = useState<schema.Routine[]>([])
    const [routineExercises, setRoutineExercises] = useState<Record<number, { routineId: number, exerciseName: string }[]>>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            const routines = await drizzleDb.query.routine.findMany();
            if (routines) {
                // console.log(routines)

                const routineExercises = await drizzleDb
                    .select({
                        routineId: schema.routineExercise.routineId,
                        exerciseName: schema.exercise.name,
                    })
                    .from(schema.routineExercise)
                    .innerJoin(schema.exercise, eq(schema.routineExercise.exerciseId, schema.exercise.id));

                const exercisesByRoutine = routines.reduce((acc, routine) => {
                    acc[routine.id] = routineExercises.filter(re => re.routineId === routine.id);
                    return acc;
                }, {} as Record<number, { routineId: number, exerciseName: string }[]>);

                // console.log(exercisesByRoutine)
                setRoutineExercises(exercisesByRoutine)

                setRoutines(routines)
                setIsLoading(false)
            }
        }

        load()

    }, []);

    if (isLoading) return <ActivityIndicator />

    return (
        <View style={styles.bottomSectionContainer}>
            <Text style={styles.containerSubHeadingtext}>My Routines</Text>

            <FlatList
                data={routines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <RoutineListItem routine={item} exercises={routineExercises[item.id]} />}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    bottomSectionContainer: {
        flex: 1,
        flexDirection: 'column',
        // borderWidth: 1,
        // borderColor: 'green'
    },
    containerSubHeadingtext: {
        color: '#b6b6b6ff',
        fontSize: 20,
        paddingBottom: 7,
    },
});