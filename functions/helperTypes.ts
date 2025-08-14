import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type WorkoutExerciseSetSummary = {
    id: number;
    workout_id: number;
    exercise_name: string;
    exercise_type: string;
    summary: string;
};
// const result = await db.all<WorkoutExerciseSetSummary>(sql`
//   SELECT * FROM workout_exercise_set_summary WHERE workout_id = ${workoutId}
// `);


export type ExerciseWithBodyAreas = {
    id: number,
    name: string,
    imageUrl: string | null,
    exerciseTypeId: number
    bodyAreas: { exerciseId: number, bodyArea: string }[]
}

export type Exercise = {
    id: number,
    name: string,
    imageUrl: string | null,
    exerciseTypeId: number
}
export type ExerciseInfo = {
    name: string,
    imageUrl: string | null,
    exerciseTypeId: number
}

export type NewRoutineExercise = {
    positionIndex: number
    routineId: number
    exerciseId: number
    restTimer: number
    notes: string
    routineExerciseSets: NewRoutineExerciseSet[]
    exerciseInfo: ExerciseInfo
}

export type NewRoutineExerciseSet = {
    routineExerciseId: number,
    reps: number | null,
    weight: Float | null,
    distance: Float | null,
    time: number | null
}

export const ExerciseTypes: Record<number, string> = {
    1: 'bodyweight',
    2: 'weight',
    3: 'cardio',
    4: 'stretch'
}
export enum EXERCISETYPE {
    BODYWEIGHT = 'bodyweight',
    WEIGHT = 'weight',
    CARDIO = 'cardio',
    STRETCH = 'stretch'
}

// Object.freeze(exerciseTypes)

export enum ROUTES {
    HOME = '/(tabs)',
    STATISTICS = '/(tabs)/statistics',
    ROUTINE = '/routine'
}