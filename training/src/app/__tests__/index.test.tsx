import React from "react";
import { render } from "@testing-library/react-native";
import Home from "../index";

describe("Home", () => {
    it("should render home component if not authenticated", () => {
        const authenticated = false;

        const { getByTestId } = render(<Home />);

        expect(getByTestId("home-component")).toBeTruthy();
    });

    // It should redirect if authemticated

    // It should redirect to trainer home if role is trainer

    // It should redirect to planner home if role is planner
});
