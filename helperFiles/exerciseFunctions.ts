import { formatTime } from "./helperFunctions";
import { EXERCISETYPE, ExerciseTypes, NewRoutineExerciseSet, NewWorkoutExerciseSet } from "./helperTypes";

/**
 * Takes a New workout exercise or new routine exercise set and returns a string with the set information
 * to be displayed. This is used when showing an exercises info when collapsed.
 * @param exerciseSet Workout or Routine exercise set
 * @param exerciseTypeId the type of the exercise eg 'Normal, Warmup, Left, Right' etc
 * @returns exercise set string
 */
export const getSetInfoText = (exerciseSet: NewWorkoutExerciseSet | NewRoutineExerciseSet, exerciseTypeId: number): string => {
    let reps: string = '- reps';
    let time: string = '0min';

    if (exerciseSet.reps >= 1) { reps = exerciseSet.reps + " reps" }
    else if (exerciseSet.reps === 0) { reps = exerciseSet.reps + "rep" }

    if (exerciseSet.time && exerciseSet.time > 0) { time = formatTime(exerciseSet.time) }

    switch (ExerciseTypes[exerciseTypeId]) {
        case EXERCISETYPE.BODYWEIGHT:
            return reps
        case EXERCISETYPE.WEIGHT:
            let weight: string = '';
            if (exerciseSet.weight && exerciseSet.weight > 0) { weight = exerciseSet.weight + "kgs x" }
            return weight + reps
        case EXERCISETYPE.CARDIO:
            let distance: string = '';
            if (exerciseSet.distance && exerciseSet.distance >= 0) { distance = exerciseSet.distance + "km x" }
            return distance + time
        case EXERCISETYPE.STRETCH:
            return time

        default:
            return 'No set info to display'
    }
}