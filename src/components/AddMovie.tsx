import axios from "axios";
import React, { useState } from "react";

interface AddMovieProps {
  onSubmit: () => void;
}

const initialMovieState = {
  name: "",
  author: "",
};

const AddMovie: React.FC<AddMovieProps> = ({ onSubmit }) => {
  const [movie, setMovie] = useState(initialMovieState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/movies`, movie);
      alert("Movie added successfully");
      setMovie(initialMovieState);
      onSubmit(); // Call the onSubmit prop when the movie is added successfully
    } catch (error) {
      console.error(`Error while adding movie: ${error}`);
      alert("Error while adding movie. Please try again.");
    }
  };

  return (
    <div>
      <h2>Add Movie To Tracker</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={movie.name}
            onChange={(e) => setMovie({ ...movie, name: e.target.value })}
            required
          />
        </label>
        <br />
        <label>
          Author:
          <input
            type="text"
            value={movie.author}
            onChange={(e) => setMovie({ ...movie, author: e.target.value })}
            required
          />
        </label>
        <br />
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
};

export default AddMovie;
