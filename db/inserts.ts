import * as schema from '@/db/schema';
import { NewRoutineExercise, NewRoutineExerciseSet, NewWorkoutExercise, NewWorkoutExerciseSet } from '@/helperFiles/helperTypes';
import { eq } from 'drizzle-orm';
import { db } from './dbConnection';
import { routine, routineExercise, routineExerciseSet, workout, workoutExercise, workoutExerciseSet } from './schema';

// --------------------------- Routines ---------------------------
export const dbUpdateRoutine = async (routineId: number, routineName: string): Promise<boolean> => {
    const existingRoutine = await db.select().from(routine).where(eq(routine.id, routineId)).limit(1)

    if (existingRoutine) {
        if (existingRoutine[0].name !== routineName) {
            console.log('Existing routine found')
            console.log(existingRoutine)
            await db.update(routine).set({ name: routineName }).where(eq(routine.id, routineId))
        }

        return true
    }

    return false
}

// Checks NewRoutineExercises with database. If there is a difference between them. Delete all records of routine exercises and their sets. Then insert NewRoutineExercises with sets into database.
// Otherwise check existing sets for changes. If there is differences delete all set data for that exercise and insert sets from NewRoutineExercise.
export const dbUpdateRoutineExercises = async (routineId: number, data: NewRoutineExercise[]) => {
    console.log('********************* updating existing routine *********************')
    await db.run('PRAGMA foreign_keys = ON;');

    // Get the db routine exercises
    let dbRoutineExercises: schema.RoutineExercise[] = await db.select().from(routineExercise).where(eq(routineExercise.routineId, routineId))

    const changedExercises = dbRoutineExercises.filter(exercise => !data.some((dataExercise) => dataExercise.positionIndex === exercise.positionIndex && dataExercise.exerciseId === exercise.exerciseId))

    if (changedExercises.length > 0 || dbRoutineExercises.length !== data.length) { // Exercises HAVE changed
        await db.delete(routineExercise).where(eq(routineExercise.id, routineId))

        dbInsertRoutineExercises(routineId, data)
    }
    else if (dbRoutineExercises.length === data.length) { // Exercises HAVE NOT changed
        // Get their exercise sets
        let dbRoutineExercisesWithSets = []

        dbRoutineExercisesWithSets = await Promise.all(
            dbRoutineExercises.map(async exercise => {
                return {
                    routineExerciseId: exercise.id,
                    exerciseId: exercise.exerciseId,
                    positionIndex: exercise.positionIndex,
                    exerciseSets: await db.select().from(routineExerciseSet).where(eq(routineExerciseSet.routineExerciseId, exercise.id))
                }
            })
        )

        // store position indexes of exercises where sets have changed
        const exercisesToChange = dbRoutineExercisesWithSets.filter(dbExercise => {
            const exerciseData = data.find(dataExercise => dataExercise.positionIndex === dbExercise.positionIndex)
            if (exerciseData) { // data has an exercise matching the database
                if (doExerciseSetArraysDiffer(dbExercise.exerciseSets, exerciseData.routineExerciseSets)) {
                    return dbExercise
                }
            }
            else { // data has no exercise so it must have changed
                return dbExercise
            }
        })

        // delete all dbExerciseSets if different from data
        await Promise.all(
            exercisesToChange.map(async exercise => {
                await db.delete(routineExerciseSet).where(eq(routineExerciseSet.routineExerciseId, exercise.routineExerciseId))
            })
        )

        // add dataSets to dbExercise
        // routine exercises in from 'data' doesnt have the id property. So add sets to corresponding exercise from db
        const dataWithREId = exercisesToChange.map(routineExercise => {
            const dataExercise = data.find(exercise => exercise.positionIndex === routineExercise.positionIndex)

            if (dataExercise) {
                return { ...routineExercise, exerciseSets: dataExercise.routineExerciseSets }
            }
        })

        // add sets from data to corresponding routine exercises in db
        await Promise.all(
            dataWithREId.map(async exercise => {
                exercise?.exerciseSets.forEach(async exerciseSet => {
                    try {
                        if (routineSetHasSomeValues(exerciseSet)) {
                            await db.insert(routineExerciseSet).values({
                                routineExerciseId: exercise.routineExerciseId,
                                exerciseSetTypeId: exerciseSet.exerciseSetTypeId,
                                reps: exerciseSet.reps > 0 ? exerciseSet.reps : 1,
                                weight: exerciseSet.weight ? exerciseSet.weight : null,
                                distance: exerciseSet.distance ? exerciseSet.distance : null,
                                time: exerciseSet.time ? exerciseSet.time : null,
                                cardioProgramId: exerciseSet.cardioProgramId ? exerciseSet.cardioProgramId : null
                            })
                        }
                    } catch (error) {
                        console.warn('Insert failed for', exerciseSet, error)
                    }
                });
            })
        )
    }

    console.log('********************* updating existing routine *********************')
}

export const dbInsertRoutine = async (data: string) => {
    return await db.insert(routine).values({ name: data }).returning({ insertedId: routine.id })
}

export const dbInsertRoutineExercises = async (routineId: number, data: NewRoutineExercise[]) => {
    data.forEach(async newRoutineExercise => {
        try {
            const exerciseId = await db.insert(routineExercise).values({
                positionIndex: newRoutineExercise.positionIndex,
                routineId: routineId,
                exerciseId: newRoutineExercise.exerciseId,
                restTimer: newRoutineExercise.restTimer,
                notes: newRoutineExercise.notes
            }).returning({ insertedId: routineExercise.id })

            console.log("inserted new routineExercise into database with routineId")
            console.log(exerciseId[0].insertedId)
            if (exerciseId[0].insertedId) {
                newRoutineExercise.routineExerciseSets.forEach(async exerciseSet => {
                    try {
                        await db.insert(routineExerciseSet).values({
                            routineExerciseId: exerciseId[0].insertedId,
                            exerciseSetTypeId: exerciseSet.exerciseSetTypeId,
                            reps: exerciseSet.reps,
                            weight: exerciseSet.weight,
                            distance: exerciseSet.distance,
                            time: exerciseSet.time

                        })
                    } catch (error) {
                        console.warn('Insert failed for', exerciseSet, error)
                    }
                });
            }
        } catch (error) {
            console.warn('Insert routineExercise failed for', newRoutineExercise, error)
        }
    });

    return
}

// --------------------------- Workouts ---------------------------
export const insertWorkout = async (routineId: number, datetime: string, duration: number, notes: string) => {
    return await db.insert(workout).values({
        routineId: routineId >= 0 ? routineId : null,
        datetime: datetime,
        duration: duration,
        notes: notes !== '' ? notes : null
    }).returning({ insertedId: workout.id })
}

export const insertWorkoutExercises = async (workoutId: number, data: NewWorkoutExercise[]) => {
    data.forEach(async newWorkoutExercise => {
        try {
            const exerciseId = await db.insert(workoutExercise).values({
                positionIndex: newWorkoutExercise.positionIndex,
                workoutId: workoutId,
                exerciseId: newWorkoutExercise.exerciseId,
                restTimer: newWorkoutExercise.restTimer,
                notes: newWorkoutExercise.notes !== '' ? newWorkoutExercise.notes : null
            }).returning({ insertedId: workoutExercise.id })

            console.log("inserted new workoutExercise into database with exerciseId")
            console.log(exerciseId[0].insertedId)
            if (exerciseId[0].insertedId) {
                newWorkoutExercise.workoutExerciseSets.forEach(async exerciseSet => {
                    try {
                        if (setHasSomeValues(exerciseSet)) {
                            await db.insert(workoutExerciseSet).values({
                                workoutExerciseId: exerciseId[0].insertedId,
                                exerciseSetTypeId: exerciseSet.exerciseSetTypeId,
                                reps: exerciseSet.reps > 0 ? exerciseSet.reps : 1,
                                weight: exerciseSet.weight ? exerciseSet.weight : null,
                                distance: exerciseSet.distance ? exerciseSet.distance : null,
                                time: exerciseSet.time ? exerciseSet.time : null,
                                averageHeartRate: exerciseSet.averageHeartRate ? exerciseSet.averageHeartRate : null,
                                maxHeartRate: exerciseSet.maxHeartRate ? exerciseSet.maxHeartRate : null,
                                cardioProgramId: exerciseSet.cardioProgramId ? exerciseSet.cardioProgramId : null
                            })
                        }
                    } catch (error) {
                        console.warn('Insert failed for', exerciseSet, error)
                    }
                });
            }
        } catch (error) {
            console.warn('Insert workoutExercise failed for', newWorkoutExercise, error)
        }
    });

    return
}

// const exerciseHasSomeValues = (NewWorkoutExercise: NewWorkoutExercise): boolean => {
//     return NewWorkoutExercise.workoutExerciseSets.some(exerciseSet => setHasSomeValues(exerciseSet))
// }

const routineSetHasSomeValues = (exerciseSet: NewRoutineExerciseSet): boolean => {
    if (
        exerciseSet.reps > 0
        || exerciseSet.weight && exerciseSet.weight > 0
        || exerciseSet.distance && exerciseSet.distance > 0
        || exerciseSet.time && exerciseSet.time > 0
    ) {
        return true
    }

    return false
}

const setHasSomeValues = (exerciseSet: NewWorkoutExerciseSet): boolean => {
    if (exerciseSet.isCompleted && (
        exerciseSet.reps > 0
        || exerciseSet.weight && exerciseSet.weight > 0
        || exerciseSet.distance && exerciseSet.distance > 0
        || exerciseSet.time && exerciseSet.time > 0
    )) {
        return true
    }

    return false
}

const doExerciseSetArraysDiffer = (existing: schema.RoutineExerciseSet[], incoming: NewRoutineExerciseSet[]): boolean => {

    for (let i = 0; i < existing.length; i++) {
        if (doesExerciseSetDiffer(existing[i], incoming[i])) {
            return true
        }
    }

    return existing.length !== incoming.length
}

const doesExerciseSetDiffer = (existing: schema.RoutineExerciseSet, incoming: NewRoutineExerciseSet): boolean => {
    return (
        existing.exerciseSetTypeId !== incoming.exerciseSetTypeId ||
        existing.reps !== incoming.reps ||
        (existing.weight ?? null) !== (incoming.weight ?? null) ||
        (existing.distance ?? null) !== (incoming.distance ?? null) ||
        (existing.time ?? null) !== (incoming.time ?? null) ||
        (existing.cardioProgramId ?? null) !== (incoming.cardioProgramId ?? null)
    );
}
