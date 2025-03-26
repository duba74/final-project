import Client from "@/database/data-model/models/Client";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { useThemeColor } from "@/hooks/useThemeColor";
import { withObservables } from "@nozbe/watermelondb/react";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import ThemedTextInput from "../themed/ThemedTextInput";
import { Platform, StyleSheet, View } from "react-native";
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
    setSelectedParticipant: (id: string) => void;
};

const ParticipantPicker = ({
    lightColor,
    darkColor,
    potentialParticipants,
    setSelectedParticipant,
}: ParticipantPickerProps) => {
    const textColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "text"
    );
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "pickerBackground"
    );
    const borderColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "border"
    );

    const styles = createStyles(textColor, backgroundColor, borderColor);

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
            ? " " + potentialParticipant.lastName
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
        setSelectedParticipant(itemValue);
    };

    return (
        <View style={styles.container}>
            <View style={[Platform.OS !== "web" && styles.pickerContainer]}>
                <Picker
                    style={{
                        color: textColor,
                        backgroundColor: backgroundColor,
                        width: "100%",
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
            <ThemedTextInput
                style={styles.searchInput}
                placeholder="Search for something"
                value={searchText}
                onChangeText={setSearchText}
            />
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

const createStyles = (
    textColor: string,
    backgroundColor: string,
    borderColor: string
) =>
    StyleSheet.create({
        container: {
            gap: 10,
        },
        searchInput: {
            fontSize: 18,
            borderWidth: 1,
            borderRadius: 6,
            paddingVertical: 6,
            paddingHorizontal: 10,
        },
        pickerContainer: {
            borderColor: borderColor,
            borderWidth: 1,
            borderRadius: 8,
            overflow: "hidden",
            color: textColor,
            backgroundColor: backgroundColor,
        },
        pickerWeb: {
            backgroundColor: backgroundColor,
        },
        picker: {
            color: textColor,
        },
    });
