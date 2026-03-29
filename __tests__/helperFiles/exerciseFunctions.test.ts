import { getSetInfoText, getSetTypeComponent } from '@/helperFiles/exerciseFunctions';
import { formatTime } from '@/helperFiles/helperFunctions';
import { NewRoutineExerciseSet, NewWorkoutExerciseSet } from '@/helperFiles/helperTypes';

// Mock the formatTime function from helperFunctions
jest.mock('@/helperFiles/helperFunctions', () => ({
  formatTime: jest.fn((seconds: number) => `${seconds}s`),
}));

describe('exerciseFunctions', () => {
  describe('getSetInfoText', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should return formatted reps text for bodyweight exercises', () => {
      const exerciseSet: NewWorkoutExerciseSet = {
        workoutExerciseId: 1,
        exerciseSetTypeId: 1,
        reps: 10,
        weight: 0,
        distance: 0,
        time: 0,
        isCompleted: false,
      };

      const result = getSetInfoText(exerciseSet, 1); // 1 = BODYWEIGHT
      expect(result).toBe('10 reps');
    });

    test('should return weight and reps for weight exercises', () => {
      const exerciseSet: NewWorkoutExerciseSet = {
        workoutExerciseId: 1,
        exerciseSetTypeId: 1,
        reps: 8,
        weight: 50,
        distance: 0,
        time: 0,
        isCompleted: false,
      };

      const result = getSetInfoText(exerciseSet, 2); // 2 = WEIGHT
      expect(result).toBe('50kgs x8 reps');
    });

    test('should return distance and time for cardio exercises', () => {
      const exerciseSet: NewRoutineExerciseSet = {
        routineExerciseId: 1,
        exerciseSetTypeId: 1,
        reps: 0,
        distance: 5.5,
        time: 1800,
      };

      const result = getSetInfoText(exerciseSet, 3); // 3 = CARDIO
      expect(result).toBe('5.5km x1800s');
      expect(formatTime).toHaveBeenCalledWith(1800);
    });

    test('should return formatted time for stretch exercises', () => {
      const exerciseSet: NewWorkoutExerciseSet = {
        workoutExerciseId: 1,
        exerciseSetTypeId: 1,
        reps: 0,
        time: 60,
        isCompleted: false,
      };

      const result = getSetInfoText(exerciseSet, 4); // 4 = STRETCH
      expect(result).toBe('60s');
      expect(formatTime).toHaveBeenCalledWith(60);
    });

    test('should handle singular rep (1 rep) correctly', () => {
      const exerciseSet: NewWorkoutExerciseSet = {
        workoutExerciseId: 1,
        exerciseSetTypeId: 1,
        reps: 1,
        isCompleted: false,
      };

      const result = getSetInfoText(exerciseSet, 1); // BODYWEIGHT
      expect(result).toBe('1 rep');
    });

    test('should handle plural reps (multiple reps) correctly', () => {
      const exerciseSet: NewRoutineExerciseSet = {
        routineExerciseId: 1,
        exerciseSetTypeId: 1,
        reps: 15,
      };

      const result = getSetInfoText(exerciseSet, 1); // BODYWEIGHT
      expect(result).toBe('15 reps');
    });

    test('should handle negative or zero reps with default text', () => {
      const exerciseSet: NewWorkoutExerciseSet = {
        workoutExerciseId: 1,
        exerciseSetTypeId: 1,
        reps: -1,
        isCompleted: false,
      };

      const result = getSetInfoText(exerciseSet, 1); // BODYWEIGHT
      expect(result).toBe('- reps');
    });

    test('should handle missing optional fields (weight, distance, time)', () => {
      // Weight exercise without weight
      const weightExerciseSet: NewWorkoutExerciseSet = {
        workoutExerciseId: 1,
        exerciseSetTypeId: 1,
        reps: 10,
        weight: 0,
        isCompleted: false,
      };

      const weightResult = getSetInfoText(weightExerciseSet, 2); // WEIGHT
      expect(weightResult).toBe('10 reps');

      // Cardio exercise without distance
      const cardioExerciseSet: NewRoutineExerciseSet = {
        routineExerciseId: 1,
        exerciseSetTypeId: 1,
        reps: 0,
        distance: 0,
        time: 300,
      };

      const cardioResult = getSetInfoText(cardioExerciseSet, 3); // CARDIO
      expect(cardioResult).toBe('300s');
      expect(formatTime).toHaveBeenCalledWith(300);
    });

    test('should return default message for unknown exercise types', () => {
      const exerciseSet: NewWorkoutExerciseSet = {
        workoutExerciseId: 1,
        exerciseSetTypeId: 1,
        reps: 10,
        isCompleted: false,
      };

      const result = getSetInfoText(exerciseSet, 999); // Invalid exercise type
      expect(result).toBe('No set info to display');
    });

    test('should handle cardio exercise with distance of 0 correctly', () => {
      const exerciseSet: NewRoutineExerciseSet = {
        routineExerciseId: 1,
        exerciseSetTypeId: 1,
        reps: 0,
        distance: 0,
        time: 120,
      };

      const result = getSetInfoText(exerciseSet, 3); // CARDIO
      expect(result).toBe('0km x120s');
      expect(formatTime).toHaveBeenCalledWith(120);
    });
  });

  describe('getSetTypeComponent', () => {
    test('should return React component with set index for NORMAL set type', () => {
      const exerciseSet: NewWorkoutExerciseSet = {
        workoutExerciseId: 1,
        exerciseSetTypeId: 1, // NORMAL
        reps: 10,
        weight: 50,
        isCompleted: false,
      };

      const result = getSetTypeComponent(exerciseSet, 2, 0); // setIndex = 0

      // Verify it returns a React element
      expect(result).toBeDefined();
      expect(result.type).toBe(Symbol.for('react.fragment'));
      expect(result.props.children).toHaveLength(2);
    });

    test('should return React component with shortcode for WARMUP set type', () => {
      const exerciseSet: NewRoutineExerciseSet = {
        routineExerciseId: 1,
        exerciseSetTypeId: 2, // WARMUP
        reps: 5,
        weight: 20,
      };

      const result = getSetTypeComponent(exerciseSet, 2, 0);

      // Verify it returns a React element
      expect(result).toBeDefined();
      expect(result.type).toBe(Symbol.for('react.fragment'));
      expect(result.props.children).toHaveLength(2);
    });

    test('should return React component with shortcode for FAILURE set type', () => {
      const exerciseSet: NewWorkoutExerciseSet = {
        workoutExerciseId: 1,
        exerciseSetTypeId: 6, // FAILURE
        reps: 12,
        isCompleted: true,
      };

      const result = getSetTypeComponent(exerciseSet, 1, 2); // setIndex = 2

      // Verify it returns a React element
      expect(result).toBeDefined();
      expect(result.type).toBe(Symbol.for('react.fragment'));
    });
  });
});
