import React from "react";
import Auth from "../auth";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "expo-router";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock("@/hooks/useSession");
jest.mock("expo-router");

type MockedUseSession = jest.MockedFunction<typeof useSession>;
type MockedUseRouter = jest.MockedFunction<typeof useRouter>;

const mockLogin = jest.fn();
const mockRouterReplace = jest.fn();

const realUseSession = useSession();
(useSession as MockedUseSession).mockReturnValue({
    ...realUseSession,
    login: mockLogin,
});

const realUseRouter = useRouter();
(useRouter as MockedUseRouter).mockReturnValue({
    ...realUseRouter,
    replace: mockRouterReplace,
});

describe("Auth", () => {
    beforeEach(() => {
        mockRouterReplace.mockClear();
    });
    it("render login component", () => {
        const { getByTestId } = render(<Auth />);

        expect(getByTestId("login-component")).toBeTruthy();
    });

    it("calls login with correct parameters", async () => {
        mockLogin.mockResolvedValue(true);

        const { getByTestId } = render(<Auth />);

        const usernameComponent = getByTestId("username-input");
        const passwordComponent = getByTestId("password-input");
        const loginButton = getByTestId("login-button");
        const usernameInput = "foo";
        const passwordInput = "bar";

        fireEvent.changeText(usernameComponent, usernameInput);
        fireEvent.changeText(passwordComponent, passwordInput);
        fireEvent.press(loginButton);

        expect(mockLogin).toHaveBeenCalledWith(usernameInput, passwordInput);
    });

    it("redirects to index route when session is not null", async () => {
        const session = JSON.stringify({ name: "foo" });

        (useSession as MockedUseSession).mockReturnValue({
            ...realUseSession,
            session: session,
        });

        render(<Auth />);

        await waitFor(() => {
            expect(mockRouterReplace).toHaveBeenCalledWith("/");
        });
    });

    it("doesn't redirects to index route when session is null", async () => {
        const session = null;

        (useSession as MockedUseSession).mockReturnValue({
            ...realUseSession,
            session: session,
        });

        render(<Auth />);

        await waitFor(() => {
            expect(mockRouterReplace).not.toHaveBeenCalled();
        });
    });
});
