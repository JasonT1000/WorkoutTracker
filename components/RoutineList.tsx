import { getRoutineExerciseSets } from '@/db/queries/workouts';
import * as schema from '@/db/schema';
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import RoutineListItem from './RoutineListItem';

type RoutineExerciseInfo =
    Record<number, {
        routineExerciseId: number, positionIndex: number, routineId: number, exerciseId: number, restTimer: number, notes: string | null, exerciseName: string, imageUri: string | null, exerciseTypeId: number
    }[]>

type RoutineExerciseExtra = {
    routineExerciseId: number,
    positionIndex: number,
    routineId: number,
    exerciseId: number,
    restTimer: number,
    notes: string | null,
    exerciseInfo: {
        name: string,
        imageUrl: string | null,
        exerciseTypeId: number
    }
}

export default function RoutineList() {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const [routines, setRoutines] = useState<schema.Routine[]>([])
    const [routineExercises, setRoutineExercises] = useState<RoutineExerciseInfo>({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        initRoutineList()

    }, []);

    const initRoutineList = async () => {
        const routines = await drizzleDb.query.routine.findMany();
        if (routines) {
            // console.log(routines)

            const routineExercises = await drizzleDb
                .select({
                    routineExerciseId: schema.routineExercise.id,
                    positionIndex: schema.routineExercise.positionIndex,
                    routineId: schema.routineExercise.routineId,
                    exerciseId: schema.routineExercise.exerciseId,
                    restTimer: schema.routineExercise.restTimer,
                    notes: schema.routineExercise.notes,
                    exerciseName: schema.exercise.name,
                    imageUri: schema.exercise.imageUrl,
                    exerciseTypeId: schema.exercise.exerciseTypeId
                })
                .from(schema.routineExercise)
                .innerJoin(schema.exercise, eq(schema.routineExercise.exerciseId, schema.exercise.id));

            const exercisesByRoutine = routines.reduce((acc, routine) => {
                acc[routine.id] = routineExercises.filter(re => re.routineId === routine.id);
                return acc;
            }, {} as RoutineExerciseInfo);

            // console.log(exercisesByRoutine)
            setRoutineExercises(exercisesByRoutine)

            setRoutines(routines)
            setIsLoading(false)
        }
    }

    const startRoutine = async (routineId: number) => {
        // Check if a workout is currently in progress
        // Check workoutexerciseReducer state
        // Get all routine exercise sets for each routine exercise
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$")
        const formattedExercises = getFormatRoutineExercises()
        const formattedExerciseSets = await getFormattedRoutineExerciseSets(routineId, formattedExercises)
        console.log("########################")
        // Convert routine exercises and sets to workout versions and set state
        // Reset workout state
        // set workout state routine id to passed in routineId
        // Set workout exercises with exerciseSets
        // Navigate to the workout page
    }

    const getFormatRoutineExercises = (): RoutineExerciseExtra[] => {
        const workoutExercises: RoutineExerciseExtra[] = Object.values(routineExercises)
            .flat()
            .map(exercise => {
                return {
                    routineExerciseId: exercise.routineExerciseId,
                    positionIndex: exercise.positionIndex,
                    routineId: exercise.routineId,
                    exerciseId: exercise.exerciseId,
                    restTimer: exercise.restTimer,
                    notes: exercise.notes,
                    exerciseInfo: {
                        name: exercise.exerciseName,
                        imageUrl: exercise.imageUri,
                        exerciseTypeId: exercise.exerciseTypeId
                    }
                }
            })

        return workoutExercises
    }

    const getFormattedRoutineExerciseSets = async (routineId: number, formattedRoutineExercises: RoutineExerciseExtra[]): Promise<schema.RoutineExerciseSet[][]> => {

        const routineExerciseSets = await Promise.all(
            formattedRoutineExercises.map(exercise =>
                getRoutineExerciseSets(exercise.routineExerciseId)
            )
        )

        console.log('routineExerciseSets')
        console.log(routineExerciseSets)

        return routineExerciseSets
    }


    if (isLoading) return <ActivityIndicator />

    return (
        <View style={styles.bottomSectionContainer}>
            <Text style={styles.containerSubHeadingtext}>My Routines</Text>

            <FlatList
                data={routines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <RoutineListItem routine={item} exercises={routineExercises[item.id]} startRoutine={startRoutine} />}
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