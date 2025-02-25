import { useThemeColor } from "@/hooks/useThemeColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

type TrainerTabLayoutProps = {
    lightColor: string;
    darkColor: string;
};

export default function TrainerTabLayout({
    lightColor,
    darkColor,
}: TrainerTabLayoutProps) {
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
                    title: "Trainer Home",
                    // headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="operations"
                options={{
                    title: "Trainer Operations",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="cog" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
