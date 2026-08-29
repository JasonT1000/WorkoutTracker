import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="weight-lifter" size={24} color={color} />
        }}
      />
      <Tabs.Screen name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />
        }}
      />
    </Tabs>
  )
}
