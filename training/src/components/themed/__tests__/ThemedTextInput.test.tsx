import React from "react";
// import { render } from "@/utils/test-utils";
import { render } from "@testing-library/react-native";
import ThemedTextInput from "../ThemedTextInput";

describe("ThemedTextInput", () => {
    it("renders ThemedTextInput", () => {
        const { getByTestId } = render(<ThemedTextInput testID="a" />);

        expect(getByTestId("a")).toBeTruthy();
    });
});
