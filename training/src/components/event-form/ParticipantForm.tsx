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
import { Pressable, ScrollView, View } from "react-native";
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
    const router = useRouter();
    const { session } = useSession();
    // SET DEFAULTS IF THE PARTICIPANT IS ALREADY CREATED, SET UP WITHOBSERVABLES FOR THE PARTICIPANT?
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
        <ThemedView style={{ marginTop: 20, gap: 25 }}>
            {!isEditing && !isNewParticipant && (
                <View>
                    <ThemedText>Select participant from the list</ThemedText>
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
                    <ThemedText>New Participant</ThemedText>
                </Pressable>
            )}
            {(isNewParticipant || selectedClient || participant) && (
                <View>
                    <View style={{ gap: 50 }}>
                        <View>
                            <ThemedText>First Name</ThemedText>
                            <ThemedTextInput
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>
                        <View>
                            <ThemedText>Last Name</ThemedText>
                            <ThemedTextInput
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>
                        <View>
                            <ThemedText>Phone 1</ThemedText>
                            <ThemedTextInput
                                value={phone1}
                                onChangeText={setPhone1}
                                keyboardType="numeric"
                            />
                        </View>
                        <View>
                            <ThemedText>Phone 2</ThemedText>
                            <ThemedTextInput
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
                            <ThemedText>Is Leader</ThemedText>
                        </Pressable>
                        <SegmentedControl
                            values={SEX_CHOICES.map((c) => c.label)}
                            selectedIndex={sexIndex}
                            onChange={(event) => {
                                setSexIndex(
                                    event.nativeEvent.selectedSegmentIndex
                                );
                            }}
                        />
                        <SegmentedControl
                            values={AGE_GROUP_CHOICES.map((c) => c.label)}
                            selectedIndex={ageGroupIndex}
                            onChange={(event) => {
                                setAgeGroupIndex(
                                    event.nativeEvent.selectedSegmentIndex
                                );
                            }}
                        />
                        <View>
                            <ThemedText>Tombola Tickets Purchased</ThemedText>
                            <ThemedTextInput
                                value={tombolaTickets}
                                onChangeText={setTombolaTickets}
                                keyboardType="numeric"
                            />
                        </View>
                        <View>
                            <ThemedText>PICS Bags Purchased</ThemedText>
                            <ThemedTextInput
                                value={picsPurchased}
                                onChangeText={setPicsPurchased}
                                keyboardType="numeric"
                            />
                        </View>
                        <View>
                            <ThemedText>PICS Bags Received</ThemedText>
                            <ThemedTextInput
                                value={picsReceived}
                                onChangeText={setPicsReceived}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            marginBottom: 20,
                        }}
                    >
                        {isEditing && (
                            <ThemedButton
                                title="Delete"
                                type="danger"
                                onPress={handleDelete}
                            />
                        )}
                        <ThemedButton
                            title="Cancel"
                            type="cancel"
                            onPress={handleCancel}
                        />
                        <ThemedButton title="Save" onPress={handleSave} />
                    </View>
                </View>
            )}
        </ThemedView>
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
