import React from "react";
import TrainerVillages from "../(home)/villages";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "expo-router";
import { randomUUID } from "expo-crypto";

jest.mock(
    "@nozbe/watermelondb/adapters/sqlite/makeDispatcher/index.native.js",
    () => {
        return jest.requireActual(
            "@nozbe/watermelondb/adapters/sqlite/makeDispatcher/index.js"
        );
    }
);

jest.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("expo-crypto", () => ({
    randomUUID: jest.fn(() => "mock-uuid"),
}));

describe("TrainerVillages", () => {
    it("renders trainer villages component", () => {
        const { getByTestId } = render(<TrainerVillages />);

        expect(getByTestId("trainer-villages")).toBeTruthy();
    });
});
