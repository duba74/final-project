import {
    AuthenticationError,
    NetworkError,
    ServerError,
    TimeoutError,
} from "@/errors/errors";
import { login } from "@/services/AuthService";

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

describe("AuthService login", () => {
    beforeEach(() => {
        mockFetch.mockClear();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.resetAllMocks();
    });

    it("returns correct data on successful login", async () => {
        const username = "foo";
        const password = "bar";
        const responseJson = {
            token: "abc123",
            name: "foo",
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => responseJson,
        });

        const result = await login(username, password);

        expect(result).toEqual(responseJson);
    });

    it("handles timeout error correctly", async () => {
        const username = "foo";
        const password = "bar";
        const responseJson = {
            token: "abc123",
            name: "foo",
        };

        jest.useFakeTimers();

        mockFetch.mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                ok: true,
                                json: responseJson,
                            }),
                        15000
                    )
                )
        );

        const loginPromise = login(username, password);

        jest.runAllTimers();

        await expect(loginPromise).rejects.toThrow(TimeoutError);
    });

    it("handles network error correctly", () => {
        const username = "foo";
        const password = "bar";

        mockFetch.mockImplementation(() => {
            throw new NetworkError("foo");
        });

        expect(login(username, password)).rejects.toThrow(NetworkError);
    });

    it("handles server error correctly", () => {
        const username = "foo";
        const password = "bar";

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        expect(login(username, password)).rejects.toThrow(ServerError);
    });

    it("handles authentication error correctly", () => {
        const username = "foo";
        const password = "bar";

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        expect(login(username, password)).rejects.toThrow(AuthenticationError);
    });
});
