import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs, useSegments } from "expo-router";
import TabBarIcon from "@/components/tab-bar-icon/TabBarIcon";
import { useTranslation } from "react-i18next";

type TrainerTabLayoutProps = {
    lightColor: string;
    darkColor: string;
};

export default function TrainerTabLayout({
    lightColor,
    darkColor,
}: TrainerTabLayoutProps) {
    const { t } = useTranslation();
    const segments = useSegments();
    const hide = segments.includes("[trainingEventId]" as never);

    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarStyle: {
                    display: hide ? "none" : "flex",
                },
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
            <Tabs.Screen
                name="[trainingEventId]"
                options={{
                    href: null,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
