import React from "react";
// import { render } from "@/utils/test-utils";
import { fireEvent, render } from "@testing-library/react-native";
import ThemedTextInput from "../ThemedTextInput";

describe("ThemedTextInput", () => {
    it("renders ThemedTextInput", () => {
        const { getByTestId } = render(<ThemedTextInput testID="a" />);

        expect(getByTestId("a")).toBeTruthy();
    });

    it("applies other custom styles", () => {
        const customStyle = { width: 50 };
        const { getByTestId } = render(
            <ThemedTextInput testID="a" style={customStyle} />
        );

        expect(getByTestId("a").props.style).toContainEqual(customStyle);
    });
});
