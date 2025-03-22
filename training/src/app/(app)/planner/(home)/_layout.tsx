import TabBarIcon from "@/components/tab-bar-icon/TabBarIcon";
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
    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarIcon: ({ focused }) => {
                    switch (route.name) {
                        case "villages":
                            return (
                                <TabBarIcon
                                    IconComponent={MaterialCommunityIcons}
                                    iconName="home-group"
                                    focused={focused}
                                    title={"Villages"}
                                    lightColor={lightColor}
                                    darkColor={darkColor}
                                />
                            );

                        case "operations":
                            return (
                                <TabBarIcon
                                    IconComponent={FontAwesome}
                                    iconName="cog"
                                    focused={focused}
                                    title={"Operations"}
                                    lightColor={lightColor}
                                    darkColor={darkColor}
                                />
                            );

                        default:
                            return null;
                    }
                },
            })}
        >
            <Tabs.Screen
                name="villages"
                options={{
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="operations"
                options={{
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
