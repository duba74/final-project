import { useThemeColor } from "@/hooks/useThemeColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

type PlannerTabLayoutProps = {
    lightColor: string;
    darkColor: string;
};

export default function PlannerTabLayout({
    lightColor,
    darkColor,
}: PlannerTabLayoutProps) {
    const tabIconColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "tabIconDefault"
    );
    const tabIconSelectedColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "tabIconSelected"
    );

    return (
        <Tabs
            screenOptions={{
                tabBarInactiveTintColor: tabIconColor,
                tabBarActiveTintColor: tabIconSelectedColor,
            }}
        >
            <Tabs.Screen
                name="villages"
                options={{
                    title: "Villages",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            size={28}
                            name="home-group"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="operations"
                options={{
                    title: "Planner Operations",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="cog" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
