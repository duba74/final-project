import i18n from "i18n";
import { enUS, fr } from "date-fns/locale";
import { format } from "date-fns";

export const getLocalizedDateString = (
    date: Date | number,
    dateFormat: string
) => {
    let locale;
    switch (i18n.language) {
        case "en":
            locale = enUS;
            break;

        case "fr":
            locale = fr;
            break;

        default:
            locale = enUS;
            break;
    }

    return format(date, dateFormat, { locale });
};

export const replaceIsoDate = (textString: string, dateFormat: string) => {
    const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}/g;

    const isoDatesReplaced = textString.replace(isoDateRegex, (match) => {
        const matchedDate = new Date(match);

        return getLocalizedDateString(matchedDate, dateFormat);
    });

    return isoDatesReplaced;
};
