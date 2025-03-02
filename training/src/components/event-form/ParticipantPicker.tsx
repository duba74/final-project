import Client from "@/database/data-model/models/Client";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { useThemeColor } from "@/hooks/useThemeColor";
import { withObservables } from "@nozbe/watermelondb/react";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import ThemedTextInput from "../themed/ThemedTextInput";
import { View } from "react-native";
import Fuse from "fuse.js";

const searchOptions = {
    keys: ["id", "firstName", "lastName", "phone1", "phone2"],
    threshold: 0.3,
};

type ParticipantPickerProps = {
    lightColor?: string;
    darkColor?: string;
    trainingEvent: TrainingEvent;
    potentialParticipants: Client[];
};

const ParticipantPicker = ({
    lightColor,
    darkColor,
    potentialParticipants,
}: ParticipantPickerProps) => {
    const textColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "text"
    );
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background"
    );
    const [participantId, setParticipantId] = useState<string | null>();
    const [searchText, setSearchText] = useState("");
    const [filteredPotentialParticipants, setFilteredPotentialParticipants] =
        useState<Client[]>(potentialParticipants);
    const fuse = new Fuse(potentialParticipants, searchOptions);

    const makePhoneLabel = (phone1: string | null, phone2: string | null) => {
        if (!phone1 && !phone2) return "";
        if (phone1 && !phone2) return ` - ${phone1}`;
        if (!phone1 && phone2) return ` - ${phone2}`;
        return ` - ${phone1}/${phone2}`;
    };

    const makePickerLabel = (potentialParticipant: Client) => {
        let label = "";

        label += potentialParticipant.firstName
            ? potentialParticipant.firstName
            : "";
        label += potentialParticipant.lastName
            ? " " + potentialParticipant.firstName
            : "";
        label += " - " + potentialParticipant.id;
        label += makePhoneLabel(
            potentialParticipant.phone1,
            potentialParticipant.phone2
        );

        return label;
    };

    useEffect(() => {
        if (searchText !== "") {
            const searchResult = fuse.search(searchText);
            setFilteredPotentialParticipants(
                searchResult.map((res) => res.item)
            );
        } else {
            setFilteredPotentialParticipants(potentialParticipants);
        }
    }, [searchText]);

    const handleValueChange = (itemValue: string, itemIndex: number) => {
        setParticipantId(itemValue);
        console.log(itemValue);
    };

    return (
        <View>
            <ThemedTextInput
                placeholder="Search for something"
                value={searchText}
                onChangeText={setSearchText}
            />

            <Picker
                style={{
                    color: textColor,
                    backgroundColor: backgroundColor,
                    width: "50%",
                }}
                dropdownIconColor={textColor}
                selectedValue={participantId ? participantId : undefined}
                onValueChange={handleValueChange}
            >
                {filteredPotentialParticipants.map(
                    (potentialParticipant: Client) => (
                        <Picker.Item
                            key={potentialParticipant.id}
                            label={makePickerLabel(potentialParticipant)}
                            value={potentialParticipant.id}
                        />
                    )
                )}
            </Picker>
        </View>
    );
};

const enhance = withObservables(
    ["trainingEvent"],
    ({ trainingEvent }: ParticipantPickerProps) => ({
        potentialParticipants: trainingEvent.potentialParticipants,
    })
);

export default enhance(ParticipantPicker);
