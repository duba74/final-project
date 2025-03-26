import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { withObservables } from "@nozbe/watermelondb/react";
import {
    clientCollection,
    participantCollection,
    staffCollection,
    trainingEventCollection,
} from "@/database/database";
import ParticipantPicker from "./ParticipantPicker";
import ThemedButton from "../themed/ThemedButton";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import Checkbox from "expo-checkbox";
import ThemedTextInput from "../themed/ThemedTextInput";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { AGE_GROUP_CHOICES, SEX_CHOICES } from "@/constants/Choices";
import Client from "@/database/data-model/models/Client";
import { useRouter } from "expo-router";
import { useSession } from "@/hooks/useSession";
import Participant from "@/database/data-model/models/Participant";
import { use } from "i18next";
import { useTranslation } from "react-i18next";

type ParticipantFormProps = {
    trainingEventId: string;
    trainingEvent: TrainingEvent;
    participantId?: string;
    participant?: Participant;
};

const ParticipantForm = ({
    trainingEventId,
    trainingEvent,
    participantId,
    participant,
}: ParticipantFormProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { session } = useSession();
    const [isEditing, setIsEditing] = useState(participantId ? true : false);
    const [selectedParticipant, setSelectedParticipant] = useState();
    const [selectedClient, setSelectedClient] = useState<Client | undefined>();
    const [isNewParticipant, setIsNewParticipant] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [isLeader, setIsLeader] = useState(false);
    const [sexIndex, setSexIndex] = useState<number | undefined>();
    const [ageGroupIndex, setAgeGroupIndex] = useState<number | undefined>();
    const [tombolaTickets, setTombolaTickets] = useState("");
    const [picsPurchased, setPicsPurchased] = useState("");
    const [picsReceived, setPicsReceived] = useState("");

    const toggleNewParticipant = () => {
        setIsNewParticipant(!isNewParticipant);
    };

    const toggleIsLeader = () => {
        setIsLeader(!isLeader);
    };

    useEffect(() => {
        if (isNewParticipant) {
            setSelectedParticipant(undefined);
            setSelectedClient(undefined);
        }
    }, [isNewParticipant]);

    const styles = createStyles();

    useEffect(() => {
        if (participant) {
            setFirstName(participant.firstName);
            setLastName(participant.lastName || "");
            setPhone1(participant.phone1 || "");
            setPhone2(participant.phone2 || "");
            setIsLeader(participant.isLeader);

            const sexIndex = participant.sex
                ? SEX_CHOICES.findIndex(
                      (item) => item.value === participant.sex
                  )
                : undefined;
            setSexIndex(sexIndex);

            const ageGroupIndex = participant.ageGroup
                ? AGE_GROUP_CHOICES.findIndex(
                      (item) => item.value === participant.ageGroup
                  )
                : 0;
            setAgeGroupIndex(ageGroupIndex);

            setTombolaTickets(
                participant.tombolaTickets
                    ? participant.tombolaTickets.toString()
                    : ""
            );
            setPicsPurchased(
                participant.picsPurchased
                    ? participant.picsPurchased.toString()
                    : ""
            );
            setPicsReceived(
                participant.picsReceived
                    ? participant.picsReceived.toString()
                    : ""
            );
        }
    }, [participant]);

    useEffect(() => {
        const fetchClient = async () => {
            if (selectedParticipant) {
                const client = await clientCollection.find(selectedParticipant);
                setSelectedClient(client);
            }
        };
        fetchClient();
    }, [selectedParticipant]);

    useEffect(() => {
        if (selectedClient) {
            setFirstName(selectedClient.firstName);
            setLastName(selectedClient.lastName || "");
            setPhone1(selectedClient.phone1 || "");
            setPhone2(selectedClient.phone2 || "");
            setIsLeader(
                selectedClient.isLeader !== null
                    ? selectedClient.isLeader
                    : false
            );

            const sexIndex = selectedClient.sex
                ? SEX_CHOICES.findIndex(
                      (item) => item.value === selectedClient.sex
                  )
                : undefined;
            setSexIndex(sexIndex);

            const ageGroupIndex = selectedClient.ageGroup
                ? AGE_GROUP_CHOICES.findIndex(
                      (item) => item.value === selectedClient.ageGroup
                  )
                : 0;
            setAgeGroupIndex(ageGroupIndex);
        }
    }, [selectedClient]);

    const handleDelete = async () => {
        if (!participant) {
            console.error("No participant");
            return;
        }

        try {
            await participant.deleteParticipant();
        } catch (error) {
            console.error(`Failed to delete participant ${error}`);
        }
        router.back();
    };

    const handleCancel = () => {
        router.back();
    };

    const handleSave = async () => {
        if (isEditing && participant) {
            try {
                const sex =
                    typeof sexIndex === "number"
                        ? SEX_CHOICES.at(sexIndex)?.value
                        : undefined;

                const ageGroup =
                    typeof ageGroupIndex === "number"
                        ? AGE_GROUP_CHOICES.at(ageGroupIndex)?.value
                        : undefined;

                const updatedParticipant = await participant.updateParticipant(
                    firstName,
                    lastName,
                    sex,
                    ageGroup,
                    phone1,
                    phone2,
                    isLeader,
                    tombolaTickets,
                    picsPurchased,
                    picsReceived
                );
            } catch (error) {
                console.error(`Failed to update participant ${error}`);
            }
        } else {
            if (!session) {
                console.log("No session");
                router.back();
                return;
            }

            try {
                const user = JSON.parse(session).user;

                const staff = await staffCollection.find(user.username);

                const sex =
                    typeof sexIndex === "number"
                        ? SEX_CHOICES.at(sexIndex)?.value
                        : undefined;

                const ageGroup =
                    typeof ageGroupIndex === "number"
                        ? AGE_GROUP_CHOICES.at(ageGroupIndex)?.value
                        : undefined;

                const newParticipant = await trainingEvent.addParticipant(
                    staff,
                    selectedClient,
                    firstName,
                    lastName,
                    sex,
                    ageGroup,
                    phone1,
                    phone2,
                    isLeader,
                    tombolaTickets,
                    picsPurchased,
                    picsReceived
                );
            } catch (error) {
                console.error(`Failed to create participant ${error}`);
            }
        }
        router.back();
    };

    return (
        <View style={styles.container}>
            {!isEditing && !isNewParticipant && (
                <View style={styles.participantFinderContainer}>
                    <ThemedText type="defaultSemiBold">
                        {t("participantForm.participantPickerLabel")}
                    </ThemedText>
                    <ParticipantPicker
                        trainingEvent={trainingEvent}
                        setSelectedParticipant={setSelectedParticipant}
                    />
                </View>
            )}
            {!isEditing && (
                <Pressable
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                    }}
                    onPress={toggleNewParticipant}
                >
                    <Checkbox value={isNewParticipant} />
                    <ThemedText type="defaultSemiBold">
                        {t("participantForm.newParticipantLabel")}
                    </ThemedText>
                </Pressable>
            )}
            {(isNewParticipant || selectedClient || participant) && (
                <View>
                    <View style={{ gap: 50 }}>
                        <View>
                            <ThemedText>
                                {t("participantForm.firstNameLabel")}
                            </ThemedText>
                            <ThemedTextInput
                                style={styles.textInput}
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>
                        <View>
                            <ThemedText>
                                {t("participantForm.lastNameLabel")}
                            </ThemedText>
                            <ThemedTextInput
                                style={styles.textInput}
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>
                        <View>
                            <ThemedText>
                                {t("participantForm.phone1Label")}
                            </ThemedText>
                            <ThemedTextInput
                                style={styles.textInput}
                                value={phone1}
                                onChangeText={setPhone1}
                                keyboardType="numeric"
                            />
                        </View>
                        <View>
                            <ThemedText>
                                {t("participantForm.phone2Label")}
                            </ThemedText>
                            <ThemedTextInput
                                style={styles.textInput}
                                value={phone2}
                                onChangeText={setPhone2}
                                keyboardType="numeric"
                            />
                        </View>
                        <Pressable
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                            }}
                            onPress={toggleIsLeader}
                        >
                            <Checkbox value={isLeader} />
                            <ThemedText>
                                {t("participantForm.isLeaderLabel")}
                            </ThemedText>
                        </Pressable>
                        <View>
                            <ThemedText>
                                {t("participantForm.sexLabel")}
                            </ThemedText>
                            <SegmentedControl
                                values={SEX_CHOICES.map((c) => c.label)}
                                selectedIndex={sexIndex}
                                onChange={(event) => {
                                    setSexIndex(
                                        event.nativeEvent.selectedSegmentIndex
                                    );
                                }}
                            />
                        </View>
                        <View>
                            <ThemedText>
                                {t("participantForm.ageGroupLabel")}
                            </ThemedText>
                            <SegmentedControl
                                values={AGE_GROUP_CHOICES.map((c) => c.label)}
                                selectedIndex={ageGroupIndex}
                                onChange={(event) => {
                                    setAgeGroupIndex(
                                        event.nativeEvent.selectedSegmentIndex
                                    );
                                }}
                            />
                        </View>
                        <View>
                            <ThemedText>
                                {t("participantForm.tombolaTicketsLabel")}
                            </ThemedText>
                            <ThemedTextInput
                                style={styles.textInput}
                                value={tombolaTickets}
                                onChangeText={setTombolaTickets}
                                keyboardType="numeric"
                            />
                        </View>
                        <View>
                            <ThemedText>
                                {t("participantForm.picsPurchasedLabel")}
                            </ThemedText>
                            <ThemedTextInput
                                style={styles.textInput}
                                value={picsPurchased}
                                onChangeText={setPicsPurchased}
                                keyboardType="numeric"
                            />
                        </View>
                        <View>
                            <ThemedText>
                                {t("participantForm.picsReceivedLabel")}
                            </ThemedText>
                            <ThemedTextInput
                                style={styles.textInput}
                                value={picsReceived}
                                onChangeText={setPicsReceived}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>
            )}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginBottom: 20,
                }}
            >
                {(isNewParticipant || selectedClient || participant) &&
                    isEditing && (
                        <ThemedButton
                            style={styles.button}
                            title={t("participantForm.deleteButtonTitle")}
                            type="danger"
                            onPress={handleDelete}
                        />
                    )}
                <ThemedButton
                    style={styles.button}
                    title={t("participantForm.cancelButtonTitle")}
                    type="cancel"
                    onPress={handleCancel}
                />
                {(isNewParticipant || selectedClient || participant) && (
                    <ThemedButton
                        style={styles.button}
                        title={t("participantForm.saveButtonTitle")}
                        onPress={handleSave}
                    />
                )}
            </View>
        </View>
    );
};

const enhance = withObservables(
    ["trainingEventId", "participantId"],
    ({ trainingEventId, participantId }: ParticipantFormProps) => {
        if (participantId) {
            return {
                trainingEvent:
                    trainingEventCollection.findAndObserve(trainingEventId),
                participant:
                    participantCollection.findAndObserve(participantId),
            };
        } else {
            return {
                trainingEvent:
                    trainingEventCollection.findAndObserve(trainingEventId),
            };
        }
    }
);

export default enhance(ParticipantForm);

const createStyles = () =>
    StyleSheet.create({
        container: {
            marginTop: 28,
            maxWidth: 500,
            marginHorizontal: 20,
            gap: 25,
        },
        participantFinderContainer: {
            gap: 10,
        },
        textInput: {
            fontSize: 18,
            borderWidth: 1,
            borderRadius: 6,
            paddingVertical: 6,
            paddingHorizontal: 10,
        },
        button: {
            width: 120,
        },
    });
