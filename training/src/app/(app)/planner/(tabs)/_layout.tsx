import { useThemeColor } from "@/hooks/useThemeColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
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
                name="home"
                options={{
                    title: "Planner Home",
                    // headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="operations"
                options={{
                    title: "Planner Operations",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="cog" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
