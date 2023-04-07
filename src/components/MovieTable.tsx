import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import AddMovie from "./AddMovie";

interface Movie {
  _id: string;
  name: string;
  author: string;
}

const MovieTable: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "author">("name");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (
    movieId: string,
    newname: string,
    newAuthor: string
  ) => {
    try {
      await axios.put(`http://localhost:3001/movies/${movieId}`, {
        name: newname,
        author: newAuthor,
      });

      setMovies(
        movies.map((movie) =>
          movie._id === movieId
            ? { ...movie, name: newname, author: newAuthor }
            : movie
        )
      );
      stopEditing();
    } catch (error) {
      // eslint-disable-next-line no-console
    }
  };

  const handleDelete = async (movieId: string) => {
    try {
      await axios.delete(`http://localhost:3001/movies/${movieId}`);
      setMovies(movies.filter((movie) => movie._id !== movieId));
    } catch (error) {
      // eslint-disable-next-line no-console
    }
  };

  const startEditing = (movieId: string) => {
    setEditingId(movieId);
  };

  const stopEditing = () => {
    setEditingId(null);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get("http://localhost:3001/movies");
      setMovies(response.data);
    };

    fetchMovies();
  }, []);

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else {
      return a.author.localeCompare(b.author);
    }
  });

  // const downloadTorrent = (movie: Movie) => {
  //   console.log(movie);
  //   const url = `torrent/download-torrent/${encodeURIComponent(
  //     movie.name
  //   )}/${encodeURIComponent(movie.author)}`;
  //   window.open(url, "_blank");
  // };

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <label>
        Sort by:
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "author")}
        >
          <option value="name">name</option>
          <option value="author">Author</option>
        </select>
      </label>
      <button onClick={handleOpenModal} data-testid="add-movie">
        +
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        appElement={document.getElementById("root")!}
      >
        <button onClick={handleCloseModal}>Close</button>
        <AddMovie onSubmit={handleCloseModal} />
      </Modal>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedMovies.map((movie) => (
            <tr key={movie._id}>
              <td>
                {editingId === movie._id ? (
                  <input id={`name-${movie._id}`} defaultValue={movie.name} />
                ) : (
                  movie.name
                )}
              </td>
              <td>
                {editingId === movie._id ? (
                  <input
                    id={`author-${movie._id}`}
                    defaultValue={movie.author}
                  />
                ) : (
                  movie.author
                )}
              </td>
              <td>
                {editingId === movie._id ? (
                  <>
                    <button onClick={stopEditing}>Cancel</button>
                    <button
                      onClick={() => {
                        const newnameInput = document.getElementById(
                          `name-${movie._id}`
                        ) as HTMLInputElement;
                        const newAuthorInput = document.getElementById(
                          `author-${movie._id}`
                        ) as HTMLInputElement;
                        handleSave(
                          movie._id,
                          newnameInput.value,
                          newAuthorInput.value
                        );
                      }}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(movie._id)}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(movie._id)}>
                      Delete
                    </button>
                    {/* <button
                      onClick={() => downloadTorrent(movie)}
                      className="btn btn-success"
                    >
                      Download Torrent
                    </button> */}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieTable;
