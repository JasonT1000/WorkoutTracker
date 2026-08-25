import { db } from '@/db/dbConnection';
import * as schema from '@/db/schema';
import { bodyArea, exerciseBodyArea, routineExerciseSet, workout, workoutExercise, workoutExerciseSet } from '@/db/schema';
import { NewWorkoutExerciseSet, WeeklyExerciseData } from '@/helperFiles/helperTypes';
import { desc, eq, gt, sql } from 'drizzle-orm';

export const getRoutineExerciseSets = async (routineExerciseId: number): Promise<schema.RoutineExerciseSet[]> => {
    const routineExerciseSets = await db
        .select()
        .from(routineExerciseSet)
        .where(sql`${routineExerciseSet.routineExerciseId} = ${routineExerciseId}`)


    return routineExerciseSets
}

/**
 * Gets last 6 exercises with passed in id from database. Can have same exercise added multiple times to a single workout.
 * Then returns all sets for exercise based on the count. So if exercise is pullups, we first find all exercises added to latest workout that are pullups.
 * Will return the pullups sets information based on the count so if its for the second set of pullups we take the count which would be 2
 * and return the sets info from the lastWorkoutExercises at the second index.
 * @param exerciseId exercise id to search for
 * @param exerciseIdCount to find which exercise we want to get sets from when we have same exercise used multiple times in a single workout
 * @returns 
 */
export const getPreviousWorkoutSets = async (exerciseId: number, exerciseIdCount: number): Promise<NewWorkoutExerciseSet[]> => {
    console.log('exerciseId')
    console.log(exerciseId)
    console.log('exerciseIdCount')
    console.log(exerciseIdCount)
    const lastWorkoutExercises = await db
        .select({ workoutExerciseId: workoutExercise.id })
        .from(workoutExercise)
        .where(sql`${workoutExercise.exerciseId} = ${exerciseId}`)
        .orderBy(desc(workoutExercise.id))
        .limit(6)

    console.log('lastWorkoutExercises')
    console.log(lastWorkoutExercises)

    if (lastWorkoutExercises.length > 0 && lastWorkoutExercises[exerciseIdCount - 1]) {
        const sets = await db
            .select()
            .from(workoutExerciseSet)
            .where(eq(workoutExerciseSet.workoutExerciseId, lastWorkoutExercises[exerciseIdCount - 1].workoutExerciseId))

        return formatExerciseSetData(sets)
    }

    return []
}

const formatExerciseSetData = (setData: schema.WorkoutExerciseSet[]): NewWorkoutExerciseSet[] => {
    return setData.map((exerciseSet, index) => {
        const newExerciseSet = {
            workoutExerciseId: exerciseSet.id,
            exerciseSetTypeId: exerciseSet.exerciseSetTypeId,
            reps: exerciseSet.reps,
            ...(exerciseSet.weight !== null && { weight: exerciseSet.weight }),
            ...(exerciseSet.distance != null && { distance: exerciseSet.distance }),
            ...(exerciseSet.time != null && { time: exerciseSet.time }),
            ...(exerciseSet.averageHeartRate != null && { averageHeartRate: exerciseSet.averageHeartRate }),
            ...(exerciseSet.maxHeartRate != null && { maxHeartRate: exerciseSet.maxHeartRate }),
            ...(exerciseSet.cardioProgramId != null && { cardioProgramId: exerciseSet.cardioProgramId }),
            isCompleted: true
        }

        return newExerciseSet
    })
}

export const getWeeklyMuscleAreaIntenity = async (): Promise<WeeklyExerciseData[]> => {
    const workoutExercisesWithCount = await db
        .select({exerciseId: workoutExercise.exerciseId, count: sql<number>`COUNT(*)`})
        .from(workoutExercise)
        .innerJoin(workout, gt(workout.datetime, sql`strftime('%Y-%m-%dT00:00:00Z', 'now', 'utc', 'weekday 1', '-7 days')`))
        .where(eq(workout.id, workoutExercise.workoutId))
        .groupBy(workoutExercise.exerciseId)

    console.log('&&&&&&&&&&&&&&&&& Current week workout ids')
    console.log(workoutExercisesWithCount)

    const bodyareaData = await Promise.all(
        workoutExercisesWithCount.map(async exercise => {
            const bodyareas = await db
                .select({
                    exerciseId: exerciseBodyArea.exerciseId,
                    bodyArea: bodyArea.name,
                    muscleIntensity: exerciseBodyArea.muscleIntensity
                })
                .from(exerciseBodyArea)
                .innerJoin(bodyArea, eq(exerciseBodyArea.bodyareaId, bodyArea.id))
                .where(eq(exerciseBodyArea.exerciseId, exercise.exerciseId));

            return bodyareas;
        })
    );
    
    console.log("Body area data = ")
    console.log(bodyareaData)

    const weeklyMuscleIntensity = bodyareaData.map((bodyareaData, index) => {
        const match = workoutExercisesWithCount.find(c => c.exerciseId === bodyareaData[index].exerciseId);

        bodyareaData[index].muscleIntensity = bodyareaData[index].muscleIntensity * (match?.count ?? 1);

        return bodyareaData;
    });

    
    console.log("weeklyMuscleIntensity")
    console.log(weeklyMuscleIntensity)

    return weeklyMuscleIntensity.flat();
}