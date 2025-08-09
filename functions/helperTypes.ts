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
    bodyAreas: { exerciseType: string, bodyArea: string }[]
}