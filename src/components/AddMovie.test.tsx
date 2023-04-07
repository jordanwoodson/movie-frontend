import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import AddMovie from "./AddMovie";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
beforeEach(() => {
  window.alert = jest.fn();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("AddMovie", () => {
  it("renders the form", () => {
    const onSubmit = jest.fn();
    render(<AddMovie onSubmit={onSubmit} />);

    expect(
      screen.getByRole("heading", { name: "Add Movie To Tracker" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Author:")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add movie/i })
    ).toBeInTheDocument();
  });

  it("submits the form and calls onSubmit prop", async () => {
    const onSubmit = jest.fn();
    mockedAxios.post.mockResolvedValue({ status: 201 });

    render(<AddMovie onSubmit={onSubmit} />);

    userEvent.type(screen.getByLabelText("Name:"), "Test Movie");
    userEvent.type(screen.getByLabelText("Author:"), "Test Author");
    userEvent.click(screen.getByRole("button", { name: /add movie/i }));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/movies`,
      {
        name: "Test Movie",
        author: "Test Author",
      }
    );
    expect(onSubmit).toHaveBeenCalled();
  });

  it("shows an error message when the form submission fails", async () => {
    const onSubmit = jest.fn();
    mockedAxios.post.mockRejectedValue(new Error("Error while adding movie"));

    render(<AddMovie onSubmit={onSubmit} />);

    userEvent.type(screen.getByLabelText("Name:"), "Test Movie");
    userEvent.type(screen.getByLabelText("Author:"), "Test Author");
    userEvent.click(screen.getByRole("button", { name: /add movie/i }));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      "Error while adding movie. Please try again."
    );
  });
});
