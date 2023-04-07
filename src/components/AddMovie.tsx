// src/components/AddMovie.tsx
import axios from "axios";
import React, { useState } from "react";

const AddMovie = () => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/movies", {
        name,
        author,
      });
      console.log(response.data);
      setName("");
      setAuthor("");
      setMessage("Movie successfully added to the database!");
    } catch (error: any) {
      console.error("Error while adding movie:", error.response.data);
      setMessage(`Error: ${error.response.data.message}`);
    }
  };

  return (
    <div>
      <h2>Add Movie</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add Movie</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddMovie;
