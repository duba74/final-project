import TrainingModule from "@/database/data-model/models/TrainingModule";
import { trainingModuleCollection } from "@/database/database";
import { useCurrentModule } from "@/hooks/useCurrentModule";
import { useThemeColor } from "@/hooks/useThemeColor";
import { withObservables } from "@nozbe/watermelondb/react";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";

type TrainingModulePickerProps = {
    lightColor?: string;
    darkColor?: string;
    currentModule: string | null;
    trainingModules: TrainingModule[];
};

const TrainingModulePicker = ({
    lightColor,
    darkColor,
    currentModule,
    trainingModules,
}: TrainingModulePickerProps) => {
    const { setCurrentModule } = useCurrentModule();
    const textColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "text"
    );
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background"
    );
    const [module, setModule] = useState<string | null>(currentModule);

    useEffect(() => {
        setModule(currentModule);
    }, [currentModule]);

    const handleValueChange = (itemValue: string, itemIndex: number) => {
        setModule(itemValue);
        setCurrentModule(itemValue);
    };

    return (
        <Picker
            style={{
                color: textColor,
                backgroundColor: backgroundColor,
                width: "100%",
            }}
            dropdownIconColor={textColor}
            selectedValue={module ? module : undefined}
            onValueChange={handleValueChange}
        >
            {trainingModules.map((module: TrainingModule) => (
                <Picker.Item
                    key={module.id}
                    label={module.name}
                    value={module.id}
                />
            ))}
        </Picker>
    );
};

const enhance = withObservables(
    ["trainingModules"],
    ({ trainingModules }: TrainingModulePickerProps) => ({
        trainingModules: trainingModuleCollection.query(),
    })
);

export default enhance(TrainingModulePicker);
