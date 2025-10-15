import { dbDeleteRoutine } from '@/db/queries/routines';
import { getRoutineExerciseSets } from '@/db/queries/workouts';
import * as schema from '@/db/schema';
import { toTitleCase } from '@/helperFiles/helperFunctions';
import { NewRoutineExercise, NewRoutineExerciseSet, NewWorkoutExercise, NewWorkoutExerciseSet, ROUTES } from '@/helperFiles/helperTypes';
import { DispatchContext as RoutineDispatchContext, StateContext as RoutineStateContext } from '@/state/routine/routineExerciseContext';
import { DispatchContext as WorkoutDispatchContext, StateContext as WorkoutStateContext } from '@/state/workout/workoutExerciseContext';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

type RoutineExerciseInfo =
    Record<number, {
        routineExerciseId: number,
        positionIndex: number,
        routineId: number,
        exerciseId: number,
        restTimer: number,
        notes: string | null,
        exerciseName: string,
        imageUri: string | null,
        exerciseTypeId: number
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

export default function useRoutines() {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db, { schema });

    const workoutState = useContext(WorkoutStateContext);
    const workoutDispatch = useContext(WorkoutDispatchContext)
    const routineState = useContext(RoutineStateContext);
    const routineDispatch = useContext(RoutineDispatchContext)

    const [routines, setRoutines] = useState<schema.Routine[]>([]);
    const [routineExercises, setRoutineExercises] = useState<RoutineExerciseInfo>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        initRoutineList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initRoutineList = async () => {
        const routines = await drizzleDb.query.routine.findMany();
        if (routines) {
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

            setRoutineExercises(exercisesByRoutine);
            setRoutines(routines);
            setIsLoading(false);
        }
    };

    const convertToWorkoutSets = (sets: schema.RoutineExerciseSet[] | undefined): NewWorkoutExerciseSet[] => {
        if (!sets) return [];
        return sets.map(set => {
            const newExerciseSet: NewWorkoutExerciseSet = {
                workoutExerciseId: set.id,
                exerciseSetTypeId: set.exerciseSetTypeId,
                reps: set.reps,
                ...(set.weight !== null && { weight: set.weight }),
                ...(set.distance != null && { distance: set.distance }),
                ...(set.time != null && { time: set.time }),
                ...(set.cardioProgramId != null && { cardioProgramId: set.cardioProgramId }),
                isCompleted: false
            };

            return newExerciseSet;
        });
    };

    const convertToWorkoutExercises = (routineExercisesArr: RoutineExerciseExtra[], routineExerciseSets: Record<number, schema.RoutineExerciseSet[]>): NewWorkoutExercise[] => {
        const workoutExercises = routineExercisesArr.map(exercise => ({
            positionIndex: exercise.positionIndex,
            workoutId: -1,
            exerciseId: exercise.exerciseId,
            restTimer: exercise.restTimer ?? 0,
            notes: exercise.notes ?? '',
            workoutExerciseSets: convertToWorkoutSets(routineExerciseSets[exercise.routineExerciseId]),
            previousExerciseSets: [],
            exerciseInfo: {
                name: exercise.exerciseInfo.name,
                imageUrl: exercise.exerciseInfo.imageUrl,
                exerciseTypeId: exercise.exerciseInfo.exerciseTypeId
            }
        }));

        return workoutExercises;
    };

    const getFormattedRoutineExercises = (routineId: number): RoutineExerciseExtra[] => {
        const entries = routineExercises[routineId] ?? [];
        const workoutExercises: RoutineExerciseExtra[] = entries
            .map(exercise => ({
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
            }));

        return workoutExercises;
    };

    const getFormattedRoutineExerciseSets = async (routineId: number, formattedRoutineExercises: RoutineExerciseExtra[]): Promise<Record<number, schema.RoutineExerciseSet[]>> => {
        const routineExerciseSets = await Promise.all(
            formattedRoutineExercises.map(exercise =>
                getRoutineExerciseSets(exercise.routineExerciseId)
            )
        );

        const exerciseSetRecord = routineExerciseSets.reduce((acc, sets) => {
            if (sets && sets.length > 0) {
                acc[sets[0].routineExerciseId] = sets;
            }
            return acc;
        }, {} as Record<number, schema.RoutineExerciseSet[]>);

        return exerciseSetRecord;
    };


    const startRoutine = async (routineId: number) => {
        if (workoutState?.duration && workoutState.duration !== 0) {
            console.log('A workout is already in progress');
        }

        const formattedExercises = getFormattedRoutineExercises(routineId);
        const formattedExerciseSets = await getFormattedRoutineExerciseSets(routineId, formattedExercises);
        const newWorkoutExercises = convertToWorkoutExercises(formattedExercises, formattedExerciseSets);

        workoutDispatch?.({
            type: 'SET_NEWWORKOUTEXERCISESFROMROUTINE',
            payload: {
                routineId,
                workoutExercises: newWorkoutExercises
            }
        });

        router.replace({ pathname: ROUTES.WORKOUT, params: { isFromRoutine: 1 } });
    };

    const convertToRoutineSets = (sets: schema.RoutineExerciseSet[] | undefined): NewRoutineExerciseSet[] => {
        if (!sets) return [];
        return sets.map(set => {
            const newExerciseSet: NewRoutineExerciseSet = {
                routineExerciseId: set.id,
                exerciseSetTypeId: set.exerciseSetTypeId,
                reps: set.reps,
                ...(set.weight !== null && { weight: set.weight }),
                ...(set.distance != null && { distance: set.distance }),
                ...(set.time != null && { time: set.time }),
                ...(set.cardioProgramId != null && { cardioProgramId: set.cardioProgramId }),
            };

            return newExerciseSet;
        });
    };

    const convertToRoutineExercises = (routineId: number, routineExercisesArr: RoutineExerciseExtra[], routineExerciseSets: Record<number, schema.RoutineExerciseSet[]>): NewRoutineExercise[] => {
        const routineExercises = routineExercisesArr.map(exercise => ({
            positionIndex: exercise.positionIndex,
            routineId: routineId,
            exerciseId: exercise.exerciseId,
            restTimer: exercise.restTimer ?? 0,
            notes: exercise.notes ?? '',
            routineExerciseSets: convertToRoutineSets(routineExerciseSets[exercise.routineExerciseId]),
            exerciseInfo: {
                name: exercise.exerciseInfo.name,
                imageUrl: exercise.exerciseInfo.imageUrl,
                exerciseTypeId: exercise.exerciseInfo.exerciseTypeId
            }
        }));

        return routineExercises;
    };

    const editExistingRoutine = async (routineId: number, routineName: string) => {
        if (routineState?.routineExercises && routineState.routineExercises.length > 0) {
            console.log('A routine is still open for editing');
        }

        //TODO: create equivalent functions for the following
        const formattedExercises = getFormattedRoutineExercises(routineId);
        const formattedExerciseSets = await getFormattedRoutineExerciseSets(routineId, formattedExercises);
        const newRoutineExercises = convertToRoutineExercises(routineId, formattedExercises, formattedExerciseSets);

        routineDispatch?.({
            type: 'SET_NEWROUTINE',
            payload: {
                id: routineId,
                name: routineName,
                exercises: newRoutineExercises
            }
        });

        router.replace({ pathname: ROUTES.ROUTINE });
    };

    const deleteRoutine = async (routineId: number, routineName: string) => {
        Alert.alert(toTitleCase(routineName), 'Are you sure you want to delete this routine', [
            { text: 'Cancel', style: 'default' },
            {
                text: 'Delete', style: 'default', onPress: async () => {
                    await dbDeleteRoutine(routineId);
                    initRoutineList();
                }
            }
        ]);
    };

    const editRoutine = (routineId: number, routineName: string) => {
        console.log('edit routine', routineId);
        editExistingRoutine(routineId, routineName)
    };

    const showListItemMenu = (routineId: number, routineName: string) => {
        Alert.alert(toTitleCase(routineName), '', [
            { text: 'Cancel', style: 'default' },
            {
                text: 'Delete', style: 'default', onPress: () => {
                    deleteRoutine(routineId, routineName);
                }
            },
            {
                text: 'Edit', style: 'default', onPress: () => {
                    editRoutine(routineId, routineName);
                }
            }
        ]);
    };

    return {
        routines,
        routineExercises,
        isLoading,
        startRoutine,
        showListItemMenu,
        refresh: initRoutineList
    };
}