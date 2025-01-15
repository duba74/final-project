import React from "react";
// import { render } from "@/utils/test-utils";
import { fireEvent, render } from "@testing-library/react-native";
import Login from "../Login";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

describe("Login", () => {
    beforeEach;
    it("should render username input element", () => {
        const { getByTestId } = render(<Login onLogin={() => {}} />);

        expect(getByTestId("username-input")).toBeTruthy();
    });

    it("should render password input element", () => {
        const { getByTestId } = render(<Login onLogin={() => {}} />);

        expect(getByTestId("password-input")).toBeTruthy();
    });

    it("username input captures user input", () => {
        const { getByTestId } = render(<Login onLogin={() => {}} />);
        const inputComponent = getByTestId("username-input");
        const userInput = "foo";

        fireEvent.changeText(inputComponent, userInput);

        expect(inputComponent.props.value).toBe(userInput);
    });

    it("password input captures user input", () => {
        const { getByTestId } = render(<Login onLogin={() => {}} />);
        const inputComponent = getByTestId("password-input");
        const userInput = "foo";

        fireEvent.changeText(inputComponent, userInput);

        expect(inputComponent.props.value).toBe(userInput);
    });

    it("should render login button", () => {
        const { getByTestId } = render(<Login onLogin={() => {}} />);

        expect(getByTestId("login-button")).toBeTruthy();
    });

    it("calls the onLogin function with the right arguments", () => {
        const mockOnLogin = jest.fn();

        const { getByTestId } = render(<Login onLogin={mockOnLogin} />);

        const usernameComponent = getByTestId("username-input");
        const passwordComponent = getByTestId("password-input");
        const loginButton = getByTestId("login-button");
        const usernameInput = "foo";
        const passwordInput = "bar";

        fireEvent.changeText(usernameComponent, usernameInput);
        fireEvent.changeText(passwordComponent, passwordInput);
        fireEvent.press(loginButton);

        expect(mockOnLogin).toHaveBeenCalledWith(usernameInput, passwordInput);
    });
});
