import { db } from '@/db/dbConnection';
import * as schema from '@/db/schema';
import { workoutExercise, workoutExerciseSet } from '@/db/schema';
import { NewWorkoutExerciseSet } from '@/helperFiles/helperTypes';
import { desc, eq, sql } from 'drizzle-orm';


export const getPreviousWorkoutSets = async (exerciseId: number, exerciseIdCount: number): Promise<NewWorkoutExerciseSet[]> => {
    console.log('exerciseId')
    console.log(exerciseId)
    console.log('exerciseIdCount')
    console.log(exerciseIdCount)

    const lastWorkoutExercise = await db
        .select({ workoutExerciseId: workoutExercise.id })
        .from(workoutExercise)
        .where(sql`${workoutExercise.exerciseId} = ${exerciseId}`)
        .orderBy(desc(workoutExercise.id))
        .limit(6)

    console.log('lastWorkoutExercise')
    console.log(lastWorkoutExercise)

    const sets = await db
        .select()
        .from(workoutExerciseSet)
        .where(eq(workoutExerciseSet.workoutExerciseId, lastWorkoutExercise[exerciseIdCount - 1].workoutExerciseId))

    console.log('sets')
    console.log(sets)

    return formatExerciseSetData(sets)
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