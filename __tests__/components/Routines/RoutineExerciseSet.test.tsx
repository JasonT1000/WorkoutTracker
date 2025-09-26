import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RoutineExerciseSet from '@/components/Routines/RoutineExerciseSet';
import { TextInput, TouchableNativeFeedback } from 'react-native';
import { ROUTES } from '@/helperFiles/helperTypes';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    navigate: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock React Native's TouchableNativeFeedback to ensure Ripple exists in test env
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  const Touchable: any = ({ onPress, children }: any) => (
    <RN.TouchableOpacity onPress={onPress}>{children}</RN.TouchableOpacity>
  );
  Touchable.Ripple = () => ({}) as any;
  return {
    ...RN,
    TouchableNativeFeedback: Touchable,
  };
});

const makeProps = (overrides: Partial<any> = {}) => {
  const props = {
    setIndex: 0,
    exerciseSet: {
      routineExerciseId: 1,
      exerciseSetTypeId: 1, // NORMAL
      reps: 10,
      weight: 100,
      distance: 0,
      time: 0,
    },
    routineExercisePositionIndex: 2,
    exerciseTypeId: 2, // WEIGHT
    updateSet: jest.fn(),
    removeSet: jest.fn(),
    ...overrides,
  };
  return props;
};

describe('RoutineExerciseSet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correct number of inputs for WEIGHT exercise type (weight, reps)', () => {
    const { getAllByPlaceholderText } = render(<RoutineExerciseSet {...makeProps({ exerciseTypeId: 2 })} />);
    const inputs = getAllByPlaceholderText('-');
    expect(inputs).toHaveLength(2);
  });

  test('renders correct number of inputs for BODYWEIGHT (reps only)', () => {
    const { getAllByPlaceholderText } = render(
      <RoutineExerciseSet {...makeProps({ exerciseTypeId: 1 })} />
    );
    const inputs = getAllByPlaceholderText('-');
    expect(inputs).toHaveLength(1);
  });

  test('shows set index when type is NORMAL and shortcode when type is WARMUP', () => {
    const { getByText, rerender, queryByText } = render(
      <RoutineExerciseSet {...makeProps({ setIndex: 0, exerciseSet: { ...makeProps().exerciseSet, exerciseSetTypeId: 1 } })} />
    );

    // NORMAL -> shows set index (setIndex + 1)
    expect(getByText('1')).toBeTruthy();

    // WARMUP -> shows shortcode 'W'
    rerender(
      <RoutineExerciseSet {...makeProps({ setIndex: 0, exerciseSet: { ...makeProps().exerciseSet, exerciseSetTypeId: 2 } })} />
    );
    expect(getByText('W')).toBeTruthy();
    expect(queryByText('1')).toBeNull();
  });

  test('navigates to ExerciseSetModal with correct params on press', () => {
    const props = makeProps({
      setIndex: 3,
      routineExercisePositionIndex: 7,
    });
    const { UNSAFE_getByType } = render(<RoutineExerciseSet {...props} />);

    const touchable = UNSAFE_getByType(TouchableNativeFeedback);
    fireEvent.press(touchable);

    expect(router.navigate).toHaveBeenCalledWith({
      pathname: ROUTES.EXERCISESETMODAL,
      params: { exercisePositionIndex: props.routineExercisePositionIndex, setIndex: props.setIndex, currentRoute: ROUTES.ROUTINE },
    });
  });

  test('initializes negative values as empty strings in inputs', () => {
    const props = makeProps({
      exerciseTypeId: 2, // WEIGHT -> [weight, reps]
      exerciseSet: {
        routineExerciseId: 1,
        exerciseSetTypeId: 1,
        reps: -1, // should become '' in the second input
        weight: 10,
        distance: 0,
        time: 0,
      },
    });
    const { UNSAFE_getAllByType } = render(<RoutineExerciseSet {...props} />);
    const inputs = UNSAFE_getAllByType(TextInput);
    expect(inputs).toHaveLength(2);
    // index 0 -> weight
    expect(inputs[0].props.value).toBe('10');
    // index 1 -> reps (negative -> empty)
    expect(inputs[1].props.value).toBe('');
  });

  test('onSubmitEditing and onBlur call updateSet with parsed values and correct field keys', () => {
    const updateSet = jest.fn();
    const props = makeProps({ exerciseTypeId: 2, updateSet }); // WEIGHT -> [weight, reps]

    const { UNSAFE_getAllByType } = render(<RoutineExerciseSet {...props} />);
    const inputs = UNSAFE_getAllByType(TextInput);

    // Change first input (weight) and submit
    fireEvent.changeText(inputs[0], '45.5');
    fireEvent(inputs[0], 'submitEditing', { nativeEvent: { text: '45.5' } });

    // Change second input (reps) and blur
    fireEvent.changeText(inputs[1], '12');
    fireEvent.blur(inputs[1]);

    expect(updateSet).toHaveBeenCalledWith(props.setIndex, 'weight', 45.5);
    expect(updateSet).toHaveBeenCalledWith(props.setIndex, 'reps', 12);
  });
});
