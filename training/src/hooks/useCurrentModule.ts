import { TrainingModuleContext } from "@/context/TrainingModuleContext";
import { useContext } from "react";

export const useCurrentModule = () => useContext(TrainingModuleContext);
