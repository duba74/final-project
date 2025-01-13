import React from "react";
// import { render } from "@/utils/test-utils";
import { fireEvent, render } from "@testing-library/react-native";
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

    it("username input captures user input", () => {
        const { getByTestId } = render(<Login />);
        const inputComponent = getByTestId("username-input");
        const userInput = "foo";

        fireEvent.changeText(inputComponent, userInput);

        expect(inputComponent.props.value).toBe(userInput);
    });

    it("password input captures user input", () => {
        const { getByTestId } = render(<Login />);
        const inputComponent = getByTestId("password-input");
        const userInput = "foo";

        fireEvent.changeText(inputComponent, userInput);

        expect(inputComponent.props.value).toBe(userInput);
    });

    it("should render login button", () => {
        const { getByTestId } = render(<Login />);

        expect(getByTestId("login-button")).toBeTruthy();
    });
});
