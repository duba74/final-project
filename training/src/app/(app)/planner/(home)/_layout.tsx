import TabBarIcon from "@/components/tab-bar-icon/TabBarIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

type PlannerTabLayoutProps = {
    lightColor: string;
    darkColor: string;
};

export default function PlannerTabLayout({
    lightColor,
    darkColor,
}: PlannerTabLayoutProps) {
    const { t } = useTranslation();

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
                                    title={t("homeLayout.villagesIconLabel")}
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
                                    title={t("homeLayout.operationsIconLabel")}
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
