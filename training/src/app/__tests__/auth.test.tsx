import React from "react";
import Auth from "../auth";
// import { render } from "@/utils/test-utils";
import { fireEvent, render } from "@testing-library/react-native";
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

    it("redirects to index route on successful login", async () => {
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

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(mockRouterReplace).toHaveBeenCalledWith("/");
    });

    // it("doesn't redirect on unsuccessful login", async () => {
    //     mockLogin.mockResolvedValue(true);
    //     mockLogin.mockReturnValue(false);

    //     const { getByTestId } = render(<Auth />);

    //     const usernameComponent = getByTestId("username-input");
    //     const passwordComponent = getByTestId("password-input");
    //     const loginButton = getByTestId("login-button");
    //     const usernameInput = "foo";
    //     const passwordInput = "bar";

    //     fireEvent.changeText(usernameComponent, usernameInput);
    //     fireEvent.changeText(passwordComponent, passwordInput);
    //     fireEvent.press(loginButton);

    //     expect(mockLogin).toHaveBeenCalledWith(usernameInput, passwordInput);

    //     await new Promise((resolve) => setTimeout(resolve, 0));

    //     expect(mockRouterReplace).not.toHaveBeenCalled();
    // });
});

// jest.mock("expo-router", () => {
//     return { router: { replace: jest.fn() } };
// });

// describe("App", () => {
//     it("should render login component if not authenticated", () => {
//         const AppContext = React.createContext<{
//             session: string | null;
//         } | null>(null);

//         const context = { session: null };

//         const { getByTestId } = render(
//             <AppContext.Provider value={context}>
//                 <App />
//             </AppContext.Provider>
//         );

//         expect(getByTestId("login-component")).toBeTruthy();
//     });

//     it("should not render home component if authenticated", () => {
//         const AppContext = React.createContext<{
//             session: string | null;
//         } | null>(null);

//         const context = { session: JSON.stringify({ foo: "bar" }) };

//         const { getByTestId } = render(
//             <AppContext.Provider value={context}>
//                 <App />
//             </AppContext.Provider>
//         );

//         expect(getByTestId("login-component")).toBeTruthy();
//     });
//     // it("should redirect if authemticated", () => {
//     //     //
//     // });

//     // It should redirect to trainer home if role is trainer

//     // It should redirect to planner home if role is planner
// });
