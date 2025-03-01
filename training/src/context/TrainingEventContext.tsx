import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useState,
} from "react";

export const TrainingEventContext = createContext<{
    currentTrainingEvent: string | null;
    setCurrentTrainingEvent: Dispatch<SetStateAction<string | null>>;
}>({
    currentTrainingEvent: null,
    setCurrentTrainingEvent: () => null,
});

const TrainingEventProvider = ({ children }: PropsWithChildren) => {
    const [currentTrainingEvent, setCurrentTrainingEvent] = useState<
        string | null
    >(null);

    return (
        <TrainingEventContext.Provider
            value={{ currentTrainingEvent, setCurrentTrainingEvent }}
        >
            {children}
        </TrainingEventContext.Provider>
    );
};

export default TrainingEventProvider;
