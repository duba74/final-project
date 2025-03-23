import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { startOfToday } from "date-fns";

export const getNextEventDate = (trainingEvents: TrainingEvent[]) => {
    const today = startOfToday();

    const futureEvents = trainingEvents.filter(
        (e) => e.scheduledFor >= today && !e.isCanceled
    );
    const pastEvents = trainingEvents.filter(
        (e) => e.scheduledFor < today && !e.isCanceled
    );

    const nextEventTime = Math.min(
        ...futureEvents.map((e) => e.scheduledFor.getTime())
    );
    const mostRecentEventTime = Math.max(
        ...pastEvents.map((e) => e.scheduledFor.getTime())
    );

    const nextEventDate = isFinite(nextEventTime)
        ? new Date(nextEventTime)
        : null;
    const mostRecentEventDate = isFinite(mostRecentEventTime)
        ? new Date(mostRecentEventTime)
        : null;

    return nextEventDate || mostRecentEventDate;
};
