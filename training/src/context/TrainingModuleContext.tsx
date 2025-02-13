import { useStorageState } from "@/hooks/useStorageState";
import { children } from "@nozbe/watermelondb/decorators";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
    type PropsWithChildren,
} from "react";

export const TrainingModuleContext = createContext<{
    currentModule: string | null;
    setCurrentModule: Dispatch<SetStateAction<string | null>>;
}>({
    currentModule: null,
    setCurrentModule: () => null,
});

const TrainingModuleProvider = ({ children }: PropsWithChildren) => {
    const [[isLoading, savedModule], setSavedModule] =
        useStorageState("savedModule");
    const [currentModule, setCurrentModule] = useState<string | null>(null);

    useEffect(() => {
        if (savedModule) setCurrentModule(savedModule);
    }, [savedModule]);

    useEffect(() => {
        if (currentModule) setSavedModule(currentModule);
    }, [currentModule]);

    return (
        <TrainingModuleContext.Provider
            value={{ currentModule, setCurrentModule }}
        >
            {children}
        </TrainingModuleContext.Provider>
    );
};

export default TrainingModuleProvider;
