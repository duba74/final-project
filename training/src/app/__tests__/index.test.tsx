import React from "react";
import { router } from "expo-router";
import { render } from "@testing-library/react-native";
import App from "../login";

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
