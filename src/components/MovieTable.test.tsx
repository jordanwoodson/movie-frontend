import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Modal from "react-modal";
import MovieTable from "./MovieTable";

jest.mock("axios");
Modal.setAppElement(document.createElement("div"));

const moviesMock = [
  {
    _id: "1",
    name: "Movie 1",
    author: "Author 1",
  },
  {
    _id: "2",
    name: "Movie 2",
    author: "Author 2",
  },
];

beforeEach(() => {
  (axios.get as jest.Mock).mockResolvedValue({ data: moviesMock });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("MovieTable", () => {
  it("renders movie table with movies", async () => {
    render(<MovieTable />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    expect(screen.getByText("Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Author 1")).toBeInTheDocument();
    expect(screen.getByText("Movie 2")).toBeInTheDocument();
    expect(screen.getByText("Author 2")).toBeInTheDocument();
  });

  it("search functionality works", async () => {
    render(<MovieTable />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "Movie 1" },
    });

    expect(screen.getByText("Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Author 1")).toBeInTheDocument();
    expect(screen.queryByText("Movie 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Author 2")).not.toBeInTheDocument();
  });

  it("sort functionality works", async () => {
    render(<MovieTable />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByLabelText("Sort by:"), {
      target: { value: "author" },
    });

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Author 1");
    expect(rows[2]).toHaveTextContent("Author 2");
  });

  it("edit, save, and cancel functionality works", async () => {
    (axios.put as jest.Mock).mockResolvedValue({});
    render(<MovieTable />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getAllByText("Edit")[0]);
    fireEvent.change(screen.getByDisplayValue("Movie 1"), {
      target: { value: "Updated Movie 1" },
    });
    fireEvent.change(screen.getByDisplayValue("Author 1"), {
      target: { value: "Updated Author 1" },
    });

    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.getByText("Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Author 1")).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("Edit")[0]);
    fireEvent.change(screen.getByDisplayValue("Movie 1"), {
      target: { value: "Updated Movie 1" },
    });
    fireEvent.change(screen.getByDisplayValue("Author 1"), {
      target: { value: "Updated Author 1" },
    });

    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));

    expect(screen.getByText("Updated Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Updated Author 1")).toBeInTheDocument();
  });

  it("delete functionality works", async () => {
    (axios.delete as jest.Mock).mockResolvedValue({});
    render(<MovieTable />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getAllByText("Delete")[0]);
    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));

    expect(screen.queryByText("Movie 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Author 1")).not.toBeInTheDocument();
    expect(screen.getByText("Movie 2")).toBeInTheDocument();
    expect(screen.getByText("Author 2")).toBeInTheDocument();
  });

  it("adds a movie using AddMovie component and Modal", async () => {
    (axios.post as jest.Mock).mockResolvedValue({});
    render(<MovieTable />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByTestId("add-movie"));
    await screen.findByText("Add Movie To Tracker");

    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "New Movie" },
    });
    fireEvent.change(screen.getByLabelText("Author:"), {
      target: { value: "New Author" },
    });
    fireEvent.click(screen.getByText("Add Movie"));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/movies`,
      {
        name: "New Movie",
        author: "New Author",
      }
    );
  });
});
