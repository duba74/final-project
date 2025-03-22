import TabBarIcon from "@/components/tab-bar-icon/TabBarIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs, useSegments } from "expo-router";
import { useTranslation } from "react-i18next";

type TrainerEventTabLayoutProps = {
    lightColor: string;
    darkColor: string;
};

export default function TrainerEventTabLayout({
    lightColor,
    darkColor,
}: TrainerEventTabLayoutProps) {
    const { t } = useTranslation();
    const segments = useSegments();
    const hide = segments.includes("participant-modal" as never);

    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarStyle: {
                    display: hide ? "none" : "flex",
                },
                tabBarIcon: ({ focused }) => {
                    switch (route.name) {
                        case "home":
                            return (
                                <TabBarIcon
                                    IconComponent={MaterialCommunityIcons}
                                    iconName="home-group"
                                    focused={focused}
                                    title={t(
                                        "trainingEventLayout.villageIconLabel"
                                    )}
                                    lightColor={lightColor}
                                    darkColor={darkColor}
                                />
                            );

                        case "event-registration":
                            return (
                                <TabBarIcon
                                    IconComponent={FontAwesome}
                                    iconName="check-circle"
                                    focused={focused}
                                    title={t(
                                        "trainingEventLayout.registrationIconLabel"
                                    )}
                                    lightColor={lightColor}
                                    darkColor={darkColor}
                                />
                            );

                        case "event-participants":
                            return (
                                <TabBarIcon
                                    IconComponent={FontAwesome}
                                    iconName="group"
                                    iconSize={24}
                                    focused={focused}
                                    title={t(
                                        "trainingEventLayout.participantsIconLabel"
                                    )}
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
                name="home"
                options={{
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="event-registration"
                options={{
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="event-participants"
                options={{
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
