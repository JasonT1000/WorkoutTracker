import { NewRoutineExercise, NewRoutineExerciseSet } from "@/helperFiles/helperTypes";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type State = {
    routineId: number,
    routineName: string,
    routineExercises: NewRoutineExercise[]
}

export type Action =
    | { type: 'UPDATE_ROUTINENAME'; payload: string }
    | { type: 'ADD_NEWROUTINEEXERCISE'; payload: NewRoutineExercise[] }
    | { type: 'REPLACE_NEWROUTINEEXERCISES'; payload: NewRoutineExercise[] }
    | { type: 'SET_NEWROUTINE'; payload: { id: number, name: string, exercises: NewRoutineExercise[] } }
    | { type: 'REMOVE_NEWROUTINEEXERCISE'; payload: { routineExerciseIndex: number, routineExerciseId: number } }
    | { type: 'ADD_NEWROUTINEEXERCISESET'; payload: { newRoutineExerciseIndex: number, newExerciseSet: NewRoutineExerciseSet } }
    | { type: 'UPDATE_NEWROUTINEEXERCISESET'; payload: { newRoutineExerciseIndex: number, setIndex: number, field: keyof NewRoutineExerciseSet, value: number | Float } }
    | { type: 'REMOVE_NEWROUTINEEXERCISESET'; payload: { newRoutineExerciseIndex: number, setIndex: number } }
    | { type: 'CLEAR_NEWROUTINEEXERCISES' }
    | { type: 'RESET_NEWROUTINE' };

export const initialState: State = {
    routineId: -1,
    routineName: '',
    routineExercises: [],
}

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "UPDATE_ROUTINENAME":
            return { ...state, routineName: action.payload }
        case "ADD_NEWROUTINEEXERCISE":
            return { ...state, routineExercises: [...state.routineExercises, ...action.payload] }
        case "REPLACE_NEWROUTINEEXERCISES":
            return { ...state, routineExercises: [...action.payload] }
        case "SET_NEWROUTINE":
            return { routineId: action.payload.id, routineName: action.payload.name, routineExercises: [...action.payload.exercises] }
        case "REMOVE_NEWROUTINEEXERCISE":
            return { ...state, routineExercises: deleteExercise(state, action.payload.routineExerciseIndex, action.payload.routineExerciseId) }
        case "ADD_NEWROUTINEEXERCISESET":
            return { ...state, routineExercises: addExerciseSet(state, action.payload.newRoutineExerciseIndex, action.payload.newExerciseSet) }
        case "UPDATE_NEWROUTINEEXERCISESET":
            return { ...state, routineExercises: updateExerciseSet(state, action.payload.newRoutineExerciseIndex, action.payload.setIndex, action.payload.field, action.payload.value) }
        case "REMOVE_NEWROUTINEEXERCISESET":
            return { ...state, routineExercises: removeExerciseSet(state, action.payload.newRoutineExerciseIndex, action.payload.setIndex) }
        case "CLEAR_NEWROUTINEEXERCISES":
            return { ...state, routineExercises: [] }
        case "RESET_NEWROUTINE":
            return { routineId: -1, routineName: '', routineExercises: [] }
        default:
            return state;
    }
}

const deleteExercise = (state: State, routineExerciseIndex: number, routineExerciseId: number) => {
    const routineExercises = [...state.routineExercises]
    const newRoutineExercises = routineExercises.filter(exercise => exercise.positionIndex !== routineExerciseIndex)

    return newRoutineExercises
}

const addExerciseSet = (state: State, newRoutineExerciseIndex: number, newExerciseSet: NewRoutineExerciseSet): NewRoutineExercise[] => {
    const routineExerciseIndex = state.routineExercises.findIndex(re => re.positionIndex === newRoutineExerciseIndex)

    if (routineExerciseIndex >= 0) {
        let newStateRoutineExercises = [...state.routineExercises]
        newStateRoutineExercises[routineExerciseIndex].routineExerciseSets.push(newExerciseSet)

        return newStateRoutineExercises
    }

    return state.routineExercises
}

const updateExerciseSet = (state: State, newRoutineExerciseIndex: number, setIndex: number, field: keyof NewRoutineExerciseSet, value: number | Float): NewRoutineExercise[] => {
    const newRoutineExercises = state.routineExercises.map(routineExercise => {
        if (routineExercise.positionIndex === newRoutineExerciseIndex) {
            const newExerciseSets = routineExercise.routineExerciseSets.map((exerciseSet, index) =>
                index === setIndex ? { ...exerciseSet, [field]: value } : exerciseSet
            );
            return { ...routineExercise, routineExerciseSets: newExerciseSets };
        }
        return routineExercise;
    });

    return newRoutineExercises;
}

const removeExerciseSet = (state: State, newRoutineExerciseIndex: number, setIndex: number): NewRoutineExercise[] => {
    const newRoutineExercises = state.routineExercises.map(routineExercise => {
        if (routineExercise.positionIndex === newRoutineExerciseIndex) {
            const exerciseSets = routineExercise.routineExerciseSets.filter((set, index) => index !== setIndex)

            return { ...routineExercise, routineExerciseSets: exerciseSets }
        }
        return routineExercise
    })
    return newRoutineExercises;
}

