import Participant from "@/database/data-model/models/Participant";
import ThemedText from "../themed/ThemedText";
import { withObservables } from "@nozbe/watermelondb/react";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import Client from "@/database/data-model/models/Client";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRef } from "react";

type ParticipantListItemProps = {
    participant: Participant;
    trainingEvent: TrainingEvent;
    clients: Client[];
    lightColor: string;
    darkColor: string;
};

const ParticipantListItem = ({
    participant,
    trainingEvent,
    clients,
    lightColor,
    darkColor,
}: ParticipantListItemProps) => {
    const { t } = useTranslation();
    const client = clients.length > 0 ? clients[0] : null;
    const router = useRouter();
    const backgroundAnimationValue = useRef(new Animated.Value(0)).current;

    const participantListItemBackground = useThemeColor(
        { light: lightColor, dark: darkColor },
        "participantListItemBackground"
    );
    const participantListItemBackgroundPressed = useThemeColor(
        { light: lightColor, dark: darkColor },
        "participantListItemBackgroundPressed"
    );
    const shadowColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "shadowColor"
    );

    const onPressIn = () => {
        Animated.timing(backgroundAnimationValue, {
            toValue: 1,
            duration: 80,
            useNativeDriver: false,
        }).start();
    };

    const onPressOut = () => {
        Animated.timing(backgroundAnimationValue, {
            toValue: 0,
            duration: 80,
            useNativeDriver: false,
        }).start();
    };

    const backgroundColor = backgroundAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [
            participantListItemBackground,
            participantListItemBackgroundPressed,
        ],
    });

    const styles = createStyles(participantListItemBackground, shadowColor);

    const handleEditParticipant = () => {
        router.navigate({
            pathname:
                "/(app)/trainer/(home)/[trainingEventId]/participant-modal",
            params: {
                trainingEventId: trainingEvent.id,
                participantId: participant.id,
            },
        });
    };

    const makePhoneLabel = (phone1: string | null, phone2: string | null) => {
        if (!phone1 && !phone2) return "";
        if (phone1 && !phone2) return phone1;
        if (!phone1 && phone2) return phone2;
        return `${phone1} / ${phone2}`;
    };

    return (
        <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={handleEditParticipant}
        >
            <Animated.View
                style={[styles.participantContainer, { backgroundColor }]}
            >
                <View style={styles.participantNameIdContainer}>
                    <ThemedText type="defaultSemiBold">{`${participant.firstName} ${participant.lastName}`}</ThemedText>
                    {client && <ThemedText>ID: {client.id}</ThemedText>}
                </View>
                <View style={styles.participantSexPhoneContainer}>
                    <ThemedText>
                        {participant.sex === "F"
                            ? t("participantList.femaleLabel")
                            : participant.sex === "M"
                            ? t("participantList.maleLabel")
                            : "---"}
                    </ThemedText>
                    <ThemedText>
                        {makePhoneLabel(participant.phone1, participant.phone2)}
                    </ThemedText>
                </View>
            </Animated.View>
        </Pressable>
    );
};

const enhance = withObservables(
    ["participant"],
    ({ participant }: ParticipantListItemProps) => ({
        participant,
        clients: participant.clients.observe(),
    })
);

export default enhance(ParticipantListItem);

const createStyles = (
    participantListItemBackground: string,
    shadowColor: string
) =>
    StyleSheet.create({
        participantContainer: {
            alignSelf: "center",
            width: "85%",
            marginTop: 8,
            paddingHorizontal: 8,
            paddingVertical: 10,
            backgroundColor: participantListItemBackground,
            borderRadius: 10,
            shadowColor: shadowColor,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
        },
        participantNameIdContainer: {
            flexDirection: "row",
            gap: 8,
            justifyContent: "space-between",
        },
        participantSexPhoneContainer: {
            flexDirection: "row",
            gap: 8,
            justifyContent: "space-between",
        },
    });
