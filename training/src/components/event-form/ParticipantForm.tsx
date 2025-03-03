import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { withObservables } from "@nozbe/watermelondb/react";
import { clientCollection, trainingEventCollection } from "@/database/database";
import ParticipantPicker from "./ParticipantPicker";
import ThemedButton from "../themed/ThemedButton";
import { Pressable, ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import Checkbox from "expo-checkbox";
import ThemedTextInput from "../themed/ThemedTextInput";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { AGE_GROUP_CHOICES, SEX_CHOICES } from "@/constants/Choices";
import Client from "@/database/data-model/models/Client";

type ParticipantFormProps = {
    trainingEventId: string;
    trainingEvent: TrainingEvent;
    // PARTICIPANT ID, if editing
};

const ParticipantForm = ({
    trainingEventId,
    trainingEvent,
}: // PARTICIPANT ID IF EDITING
ParticipantFormProps) => {
    // SET DEFAULTS IF THE PARTICIPANT IS ALREADY CREATED, SET UP WITHOBSERVABLES FOR THE PARTICIPANT?
    const [selectedParticipant, setSelectedParticipant] = useState();
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isNewParticipant, setIsNewParticipant] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [isLeader, setIsLeader] = useState(false);
    const [sexIndex, setSexIndex] = useState<number | undefined>(undefined);
    const [ageGroupIndex, setAgeGroupIndex] = useState(0);
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
        console.log("ParticipantForm: " + selectedParticipant);
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

    // Write the participant to the database

    return (
        <ThemedView style={{ marginTop: 20, gap: 25 }}>
            {!isNewParticipant && (
                <View>
                    <ThemedText>Select participant from the list</ThemedText>
                    <ParticipantPicker
                        trainingEvent={trainingEvent}
                        setSelectedParticipant={setSelectedParticipant}
                    />
                </View>
            )}
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
                        setSexIndex(event.nativeEvent.selectedSegmentIndex);
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
            {/* BUTTONS TO SAVE, CANCEL/GOBACK, DELETE */}
        </ThemedView>
    );
};

const enhance = withObservables(
    ["trainingEventId"],
    ({ trainingEventId }: ParticipantFormProps) => ({
        trainingEvent: trainingEventCollection.findAndObserve(trainingEventId),
    })
);

export default enhance(ParticipantForm);
