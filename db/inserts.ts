import { NewRoutineExercise, NewWorkoutExercise } from '@/helperFiles/helperTypes';
import { db } from './dbConnection';
import { routine, routineExercise, routineExerciseSet, workout, workoutExercise, workoutExerciseSet } from './schema';

// --------------------------- Routines ---------------------------
export const insertRoutine = async (data: string) => {
    return await db.insert(routine).values({ name: data }).returning({ insertedId: routine.id })
}

export const insertRoutineExercises = async (routineId: number, data: NewRoutineExercise[]) => {
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
        routineId: routineId,
        datetime: datetime,
        duration: duration,
        notes: notes
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
                notes: newWorkoutExercise.notes
            }).returning({ insertedId: workoutExercise.id })

            console.log("inserted new workoutExercise into database with routineId")
            console.log(exerciseId[0].insertedId)
            if (exerciseId[0].insertedId) {
                newWorkoutExercise.workoutExerciseSets.forEach(async exerciseSet => {
                    try {
                        await db.insert(workoutExerciseSet).values({
                            workoutExerciseId: exerciseId[0].insertedId,
                            exerciseSetTypeId: exerciseSet.exerciseSetTypeId,
                            reps: exerciseSet.reps,
                            weight: exerciseSet.weight,
                            distance: exerciseSet.distance,
                            time: exerciseSet.time,
                            averageHeartRate: exerciseSet.averageHeartRate,
                            maxHeartRate: exerciseSet.maxHeartRate,
                            cardioProgramId: exerciseSet.cardioProgramId
                        })
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