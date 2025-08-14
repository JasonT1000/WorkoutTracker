import { NewRoutineExercise } from "@/functions/helperTypes";

export type State = {
    routineExercises: NewRoutineExercise[]
}

export type Action =
    | { type: 'ADD_NEWROUTINEEXERCISE'; payload: NewRoutineExercise[] }
    | { type: 'REPLACE_NEWROUTINEEXERCISES'; payload: NewRoutineExercise[] }
    | { type: 'CLEAR_NEWROUTINEEXERCISES' };

export const initialState: State = {
    routineExercises: [],
}

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_NEWROUTINEEXERCISE":
            return { ...state, routineExercises: [...state.routineExercises, ...action.payload] }
        case "REPLACE_NEWROUTINEEXERCISES":
            return { routineExercises: [...action.payload] }
        case "CLEAR_NEWROUTINEEXERCISES":
            return { ...state, routineExercises: [] }
        default:
            return state;
    }
}