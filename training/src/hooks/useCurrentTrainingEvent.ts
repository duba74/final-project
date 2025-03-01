import { TrainingEventContext } from "@/context/TrainingEventContext";
import { useContext } from "react";

export const useCurrentTrainingEvent = () => useContext(TrainingEventContext);
