import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import RoutineListItem from './RoutineListItem';
import useRoutines from '@/hooks/useRoutines';

export default function RoutineList() {
    const { routines, routineExercises, isLoading, startRoutine, showListItemMenu } = useRoutines();

    if (isLoading) return <ActivityIndicator />;

    return (
        <View style={styles.bottomSectionContainer}>
            <Text style={styles.containerSubHeadingtext}>My Routines</Text>

            <FlatList
                data={routines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <RoutineListItem
                        routine={item}
                        exercises={routineExercises[item.id] ?? []}
                        startRoutine={startRoutine}
                        showListItemMenu={showListItemMenu}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    bottomSectionContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    containerSubHeadingtext: {
        color: '#b6b6b6ff',
        fontSize: 20,
        paddingBottom: 7,
    },
});