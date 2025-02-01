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

    it("redirects when session is not null", async () => {
        const session = JSON.stringify({ user: "foo" });

        (useSession as MockedUseSession).mockReturnValue({
            ...realUseSession,
            session: session,
        });

        render(<Auth />);

        await waitFor(() => {
            expect(mockRouterReplace).toHaveBeenCalledTimes(1);
        });
    });

    it("doesn't redirect route when session is null", async () => {
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

    it("redirects to trainer home when role is trainer", async () => {
        const session = JSON.stringify({ user: { role: "trainer" } });

        (useSession as MockedUseSession).mockReturnValue({
            ...realUseSession,
            session: session,
        });

        render(<Auth />);

        await waitFor(() => {
            expect(mockRouterReplace).toHaveBeenCalledWith(
                "/(app)/trainer/home"
            );
        });
    });

    it("redirects to planner home when role is planner", async () => {
        const session = JSON.stringify({ user: { role: "planner" } });

        (useSession as MockedUseSession).mockReturnValue({
            ...realUseSession,
            session: session,
        });

        render(<Auth />);

        await waitFor(() => {
            expect(mockRouterReplace).toHaveBeenCalledWith(
                "/(app)/planner/home"
            );
        });
    });

    it("redirects to admin home when role is admin", async () => {
        const session = JSON.stringify({ user: { role: "admin" } });

        (useSession as MockedUseSession).mockReturnValue({
            ...realUseSession,
            session: session,
        });

        render(<Auth />);

        await waitFor(() => {
            expect(mockRouterReplace).toHaveBeenCalledWith("/(app)/admin/home");
        });
    });

    it("redirects to index when user has no role", async () => {
        const session = JSON.stringify({ user: "foo" });

        (useSession as MockedUseSession).mockReturnValue({
            ...realUseSession,
            session: session,
        });

        render(<Auth />);

        await waitFor(() => {
            expect(mockRouterReplace).toHaveBeenCalledWith("/");
        });
    });
});
