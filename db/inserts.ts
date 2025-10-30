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

export const dbUpdateRoutineExercises = async (routineId: number, data: NewRoutineExercise[]) => {
    console.log('********************* updating existing routine *********************')
    await db.run('PRAGMA foreign_keys = ON;');

    // Get the db routine exercises
    let dbRoutineExercises: schema.RoutineExercise[] = await db.select().from(routineExercise).where(eq(routineExercise.routineId, routineId))
    console.log('dbRoutineExercises')
    console.log(dbRoutineExercises)

    const changedExercises = dbRoutineExercises.filter(exercise => !data.some((dataExercise) => dataExercise.positionIndex === exercise.positionIndex && dataExercise.exerciseId === exercise.exerciseId))

    console.log('changedExercises')
    console.log(changedExercises)
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

        console.log('dbRoutineExerciseSets')
        console.log(dbRoutineExercisesWithSets)

        // compare dbSets with dataSets
        // dbRoutineExercisesWithSets.forEach(exercise => {

        // });

        // store position indexes of exercises where sets have changed
        const exercisePositionsToChange = dbRoutineExercisesWithSets.filter(exercise => {
            const exerciseData = data.find(dataExercise => dataExercise.positionIndex === exercise.positionIndex)
            if (exerciseData) {
                if (isSetChanged(exercise.exerciseSets, exerciseData?.routineExerciseSets)) {
                    console.log("found set difference")
                    return exercise.positionIndex
                }

            }
            else {
                return exercise.positionIndex
            }

        })

        console.log('exercisePositionsToChange')
        console.log(exercisePositionsToChange)

        // delete all dbExerciseSets with different sets

        // add dataSets to dbExercise
    }


    // delete excess routine exercises if have removed some
    // if (data.length < dbRoutineExercises.length) {
    //     const excess = dbRoutineExercises.filter(exercise => !data.some((dataExercise) => dataExercise.exerciseId === exercise.exerciseId))
    //     // delete from database the excess exercises. Should cascade and delete corresponding exercise sets
    //     console.log('deleting excess exercises')
    //     console.log(excess)

    //     await Promise.all(
    //         excess.map(async excessExercise => {
    //             await db.delete(routineExercise).where(eq(routineExercise.positionIndex, excessExercise.positionIndex))
    //             console.log('33333333333333')
    //         })
    //     )

    //     console.log('4444444444444444444444')
    // }

    // // Get their exercise sets
    // let dbRoutineExerciseSets: schema.RoutineExerciseSet[][] = []

    // dbRoutineExerciseSets = await Promise.all(
    //     dbRoutineExercises.map(async exercise => {
    //         return await db.select().from(routineExerciseSet).where(eq(routineExerciseSet.routineExerciseId, exercise.id))
    //     })
    // )

    // console.log('dbRoutineExerciseSets')
    // console.log(dbRoutineExerciseSets)

    // // loop through each db routine exercise
    // //TODO: how to handle when db exercises are longer than newRoutineExercises eg have delete some
    // await Promise.all(
    //     data.map(async (exercise, index) => {
    //         if (dbRoutineExercises.length > index) { // updating existing exercise
    //             let updatedExercise = {
    //                 ...dbRoutineExercises[index],
    //                 exerciseId: exercise.exerciseId,
    //                 restTimer: exercise.restTimer,
    //                 notes: exercise.notes
    //             }
    //             // Check if objects are equivalent first before updating db??

    //             dbRoutineExercises[index] = updatedExercise

    //             await db.update(routineExercise)
    //                 .set({
    //                     exerciseId: exercise.exerciseId,
    //                     restTimer: exercise.restTimer,
    //                     notes: exercise.notes
    //                 })
    //                 .where(eq(routineExercise.id, dbRoutineExercises[index].id))

    //             // update sets in database with new exerciseId
    //             const sets = dbRoutineExerciseSets.filter((setArray, index) =>
    //                 setArray[index].routineExerciseId === exercise.exerciseId
    //             )

    //             // promise.all on data sets
    //             // if sets.length is greater than index update existing set
    //             // else insert new set for exercise
    //         }
    //         else { // adding new exercises to routine
    //             const newExercise = await db.insert(routineExercise).values({
    //                 positionIndex: index,
    //                 routineId: routineId,
    //                 exerciseId: exercise.exerciseId,
    //                 restTimer: exercise.restTimer,
    //                 notes: exercise.notes
    //             }).returning()

    //             if (newExercise.length > 0) { dbRoutineExercises.push(newExercise[0]) }

    //             // add exercise sets for this exercise into database
    //         }
    //     })
    // )

    //  find newRoutineExercise with matching positionIndex
    //  update exerciseId, restTime, notes if needed
    // loop through db exerciseSets
    // update with data from newRoutineExerciseSet

    // delete/add remaining db exercise sets left over
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

const isSetChanged = (existing: schema.RoutineExerciseSet[], incoming: NewRoutineExerciseSet[]): boolean => {

    for (let i = 0; i < existing.length; i++) {
        if (hasSetChanged(existing[i], incoming[i])) {
            return true
        }
    }
    // existing.forEach((exerciseInfo, index) => {
    //     if(hasSetChanged(exerciseInfo, incoming[index])){
    //         return true
    //     }
    // });

    return existing.length !== incoming.length
}

const hasSetChanged = (existing: schema.RoutineExerciseSet, incoming: NewRoutineExerciseSet): boolean => {
    return (
        existing.routineExerciseId !== incoming.routineExerciseId &&
        existing.exerciseSetTypeId !== incoming.exerciseSetTypeId &&
        existing.reps !== incoming.reps &&
        (existing.weight ?? null) !== (incoming.weight ?? null) &&
        (existing.distance ?? null) !== (incoming.distance ?? null) &&
        (existing.time ?? null) !== (incoming.time ?? null) &&
        (existing.cardioProgramId ?? null) !== (incoming.cardioProgramId ?? null)
    );
}
