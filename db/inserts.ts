import * as schema from '@/db/schema';
import { NewRoutineExercise, NewWorkoutExercise, NewWorkoutExerciseSet } from '@/helperFiles/helperTypes';
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
    // Get the db routine exercises
    let dbRoutineExercises: schema.RoutineExercise[] = await db.select().from(routineExercise).where(eq(routineExercise.routineId, routineId))
    console.log('dbRoutineExercises')
    console.log(dbRoutineExercises)

    // Get their exercise sets
    let dbRoutineExerciseSets: schema.RoutineExerciseSet[][] = []

    dbRoutineExerciseSets = await Promise.all(
        dbRoutineExercises.map(async exercise => {
            return await db.select().from(routineExerciseSet).where(eq(routineExerciseSet.routineExerciseId, exercise.id))
        })
    )

    console.log('dbRoutineExerciseSets')
    console.log(dbRoutineExerciseSets)

    // loop through each db routine exercise
    //TODO: how to handle when db exercises are longer than newRoutineExercises eg have delete some
    await Promise.all(
        data.map(async (exercise, index) => {
            if (dbRoutineExercises.length > index) { // updating existing exercise
                let updatedExercise = {
                    ...dbRoutineExercises[index],
                    exerciseId: exercise.exerciseId,
                    restTimer: exercise.restTimer,
                    notes: exercise.notes
                }
                // Check if objects are equivalent first before updateing db??

                dbRoutineExercises[index] = updatedExercise

                await db.update(routineExercise)
                    .set({
                        exerciseId: exercise.exerciseId,
                        restTimer: exercise.restTimer,
                        notes: exercise.notes
                    })
                    .where(eq(routineExercise.id, dbRoutineExercises[index].id))
            }
            else { // adding new exercises to routine
                const newExercise = await db.insert(routineExercise).values({
                    positionIndex: index,
                    routineId: routineId,
                    exerciseId: exercise.exerciseId,
                    restTimer: exercise.restTimer,
                    notes: exercise.notes
                }).returning()

                if (newExercise.length > 0) { dbRoutineExercises.push(newExercise[0]) }
            }
        })
    )

    //  find newRoutineExercise with matching positionIndex
    //  update exerciseId, restTime, notes if needed
    // loop through db exerciseSets
    // update with data from newRoutineExerciseSet

    // delete/add remaining db exercise sets left over

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