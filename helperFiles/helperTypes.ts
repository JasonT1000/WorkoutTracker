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
    exerciseSetTypeId: number,
    reps: number,
    weight?: Float,
    distance?: Float,
    time?: number
    cardioProgramId?: number,
}

export enum NewRoutineExerciseSetKey {
    ROUTINEEXERCISEID = 'routineExerciseId',
    EXERCISESETTYPEID = 'exerciseSetTypeId',
    REPS = 'reps',
    WEIGHT = 'weight',
    DISTANCE = 'distance',
    TIME = 'time',
    CARDIOPROGRAMID = 'cardioProgramId',
}

export type NewWorkoutExercise = {
    positionIndex: number
    workoutId: number
    exerciseId: number
    restTimer: number
    notes: string
    workoutExerciseSets: NewWorkoutExerciseSet[]
    previousExerciseSets: NewWorkoutExerciseSet[]
    exerciseInfo: ExerciseInfo
}

export type NewWorkoutExerciseSet = {
    workoutExerciseId: number,
    exerciseSetTypeId: number,
    reps: number,
    weight?: Float,
    distance?: Float,
    time?: number,
    averageHeartRate?: number,
    maxHeartRate?: number,
    cardioProgramId?: number,
    isCompleted: boolean
}

export enum NewWorkoutExerciseSetKey {
    WORKOUTEXERCISEID = 'workoutExerciseId',
    EXERCISESETTYPEID = 'exerciseSetTypeId',
    REPS = 'reps',
    WEIGHT = 'weight',
    DISTANCE = 'distance',
    TIME = 'time',
    AVERAGEHEARTRATE = 'averageHeartRate',
    MAXHEARTRATE = 'maxHeartRate',
    CARDIOPROGRAMID = 'cardioProgramId',
    ISCOMPLETED = 'isCompleted'
}

// export const ExerciseSetTypes: Record<number, string> = {
//     1: 'normal set',
//     2: 'warm up',
//     3: 'left',
//     4: 'right',
//     5: 'partial reps',
//     6: 'failure',
// }

export enum EXERCISESETTYPE {
    NORMAL = 'normal set',
    WARMUP = 'warm up',
    LEFT = 'left',
    RIGHT = 'right',
    PARTIALREPS = 'partial reps',
    FAILURE = 'failure',
}

export const ExerciseSetTypes: Record<number, {
    type: EXERCISESETTYPE;
    shortcode: string;
    colorcode: string;
}> = {
    1: { type: EXERCISESETTYPE.NORMAL, shortcode: '1', colorcode: '#ffffff' },
    2: { type: EXERCISESETTYPE.WARMUP, shortcode: 'W', colorcode: '#f0ad4e' },
    3: { type: EXERCISESETTYPE.LEFT, shortcode: 'L', colorcode: '#5bc0de' },
    4: { type: EXERCISESETTYPE.RIGHT, shortcode: 'R', colorcode: '#5cb85c' },
    5: { type: EXERCISESETTYPE.PARTIALREPS, shortcode: 'P', colorcode: '#d44fd9ff' },
    6: { type: EXERCISESETTYPE.FAILURE, shortcode: 'F', colorcode: '#d9534f' },
};

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

export type CardioProgram = {
    id: number,
    name: string
}

export enum ROUTES {
    HOME = '/(tabs)',
    STATISTICS = '/(tabs)/statistics',
    ROUTINE = '/routine',
    WORKOUT = '/workout',
    EXERCISE = '/exercises',
    CARDIOPROGRAMS = '/cardioPrograms',
    EXERCISESETMODAL = '/exerciseSetModal',
    NEWCARDIOPROGRAM = '/cardioProgramModal',
}