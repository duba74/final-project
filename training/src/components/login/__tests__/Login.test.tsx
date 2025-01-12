import React from "react";
// import { render } from "@/utils/test-utils";
import { render } from "@testing-library/react-native";
import Login from "../Login";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

describe("Login", () => {
    it("should render username input element", () => {
        const { getByTestId } = render(<Login />);

        expect(getByTestId("username-input")).toBeTruthy();
    });

    it("should render password input element", () => {
        const { getByTestId } = render(<Login />);

        expect(getByTestId("password-input")).toBeTruthy();
    });
});
