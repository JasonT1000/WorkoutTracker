import { NewWorkoutExercise, NewWorkoutExerciseSet } from "@/helperFiles/helperTypes";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type State = {
    routineId: number,
    datetime: string,
    duration: number,
    notes: string,
    workoutExercises: NewWorkoutExercise[]
}

export type Action =
    | { type: 'UPDATE_ROUTINEID'; payload: number }
    | { type: 'UPDATE_WORKOUTDATE'; }
    | { type: 'UPDATE_WORKOUTDURATION'; payload: number }
    | { type: 'UPDATE_WORKOUTNOTES'; payload: { notes: string } }
    | { type: 'ADD_NEWWORKOUTEXERCISE'; payload: NewWorkoutExercise[] }
    | { type: 'REPLACE_NEWWORKOUTEXERCISES'; payload: NewWorkoutExercise[] }
    | { type: 'REMOVE_NEWWORKOUTEXERCISE'; payload: number }
    | { type: 'ADD_NEWWORKOUTEXERCISESET'; payload: { newWorkoutExerciseIndex: number, newExerciseSet: NewWorkoutExerciseSet } }
    | { type: 'UPDATE_NEWWORKOUTEXERCISESET'; payload: { newWorkoutExerciseIndex: number, setIndex: number, field: keyof NewWorkoutExerciseSet, value: number | Float } }
    | { type: 'REMOVE_NEWWORKOUTEXERCISESET'; payload: { newWorkoutExerciseIndex: number, setIndex: number } }
    | { type: 'CLEAR_NEWWORKOUTEXERCISES' }
    | { type: 'RESET_NEWWORKOUT' };

export const initialState: State = {
    routineId: -1,
    datetime: new Date().toISOString(),
    duration: 0,
    notes: '',
    workoutExercises: [],
}

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "UPDATE_ROUTINEID":
            return { ...state, routineId: action.payload }
        case "UPDATE_WORKOUTDATE":
            return { ...state, datetime: new Date().toISOString() }
        case "UPDATE_WORKOUTDURATION":
            return { ...state, duration: action.payload }
        case "UPDATE_WORKOUTNOTES":
            return { ...state, notes: action.payload.notes }
        case "ADD_NEWWORKOUTEXERCISE":
            return { ...state, workoutExercises: [...state.workoutExercises, ...action.payload] }
        case "REPLACE_NEWWORKOUTEXERCISES":
            return { ...state, workoutExercises: [...action.payload] }
        case "REMOVE_NEWWORKOUTEXERCISE":
            // Add functionality
            return state
        case "ADD_NEWWORKOUTEXERCISESET":
            return { ...state, workoutExercises: addExerciseSet(state, action.payload.newWorkoutExerciseIndex, action.payload.newExerciseSet) }
        case "UPDATE_NEWWORKOUTEXERCISESET":
            return { ...state, workoutExercises: updateExerciseSet(state, action.payload.newWorkoutExerciseIndex, action.payload.setIndex, action.payload.field, action.payload.value) }
        case "REMOVE_NEWWORKOUTEXERCISESET":
            return { ...state, workoutExercises: removeExerciseSet(state, action.payload.newWorkoutExerciseIndex, action.payload.setIndex) }
        case "CLEAR_NEWWORKOUTEXERCISES":
            return { ...state, workoutExercises: [] }
        case "RESET_NEWWORKOUT":
            return { routineId: -1, datetime: '', duration: 0, notes: '', workoutExercises: [] }
        default:
            return state;
    }
}

const addExerciseSet = (state: State, newWorkoutExerciseIndex: number, newExerciseSet: NewWorkoutExerciseSet): NewWorkoutExercise[] => {
    const workoutExerciseIndex = state.workoutExercises.findIndex(re => re.positionIndex === newWorkoutExerciseIndex)

    if (workoutExerciseIndex >= 0) {
        let newStateWorkoutExercises = [...state.workoutExercises]
        newStateWorkoutExercises[workoutExerciseIndex].workoutExerciseSets.push(newExerciseSet)

        return newStateWorkoutExercises
    }

    return state.workoutExercises
}

const updateExerciseSet = (state: State, newWorkoutExerciseIndex: number, setIndex: number, field: keyof NewWorkoutExerciseSet, value: number | Float): NewWorkoutExercise[] => {
    const newWorkoutExercises = state.workoutExercises.map(workoutExercise => {
        if (workoutExercise.positionIndex === newWorkoutExerciseIndex) {
            const newExerciseSets = workoutExercise.workoutExerciseSets.map((exerciseSet, index) =>
                index === setIndex ? { ...exerciseSet, [field]: value } : exerciseSet
            );
            return { ...workoutExercise, workoutExerciseSets: newExerciseSets };
        }
        return workoutExercise;
    });

    return newWorkoutExercises;
}

const removeExerciseSet = (state: State, newWorkoutExerciseIndex: number, setIndex: number): NewWorkoutExercise[] => {
    const newWorkoutExercises = state.workoutExercises.map(workoutExercise => {
        if (workoutExercise.positionIndex === newWorkoutExerciseIndex) {
            const exerciseSets = workoutExercise.workoutExerciseSets.filter((set, index) => index !== setIndex)

            return { ...workoutExercise, workoutExerciseSets: exerciseSets }
        }
        return workoutExercise
    })
    return newWorkoutExercises;
}

