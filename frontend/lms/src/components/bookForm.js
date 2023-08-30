import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/userContext";
import { TextField, Button, FormControl, Typography, Box } from "@mui/material";
import bookAPI from "../clientAPIs/bookAPI";
import { NotificationManager } from "react-notifications";

export const BookForm = () => {
  const { token } = useContext(UserContext);
  const { bookTitle } = useParams();
  const navigate = useNavigate();

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (bookTitle) {
      bookAPI.getBookByTitle(bookTitle).then((res) => {
        setNewBook({
          title: res.title,
          author: res.author,
          description: res.description,
          quantity: res.quantity,
          price: res.price,
        });
      });
    }
  }, [bookTitle]);

  const isValid = (book) => {
    if (
      book.title.length === 0 ||
      book.author.length === 0 ||
      book.description.length === 0 ||
      book.quantity <= 0 ||
      book.price.length === 0
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleCancel = () => {
    navigate("/books");
  };

  const handleChange = (e) => {
    setNewBook({
      ...newBook,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNewBook = async (e) => {
    e.preventDefault();
    if (isValid(newBook)) {
      await bookAPI
        .addBook(newBook, token)
        .then(NotificationManager.success("Book Added Successfully!"))
        .catch((err) => console.log(err.message));
    } else {
      NotificationManager.error("Please Use Correct Format");
    }
    navigate("/books");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isValid(newBook)) {
      console.log("accessToken: ", token);
      await bookAPI
        .patchBookByTitle(newBook, token)
        .then(NotificationManager.success("Book Updated Successfully!"))
        .catch((err) => console.log(err.message));
    } else {
      NotificationManager.error("Please Use Correct Format");
    }
    navigate("/books");
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <FormControl
        sx={{
          alignItems: "center",
          width: "35%",
        }}
      >
        <br />
        <br />
        <br />
        <Typography variant="h6" component="h2">
          {bookTitle ? "Edit Book" : "Add New Book"}
        </Typography>
        {bookTitle ? (
          <TextField
            sx={{ width: 270 }}
            margin="dense"
            id="title"
            label="Title"
            name="title"
            type="string"
            variant="standard"
            autoComplete="off"
            value={newBook.title}
          />
        ) : (
          <TextField
            sx={{ width: 270 }}
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            name="title"
            type="string"
            variant="standard"
            autoComplete="off"
            value={newBook.title}
            onChange={handleChange}
          />
        )}
        <TextField
          sx={{ width: 270 }}
          margin="dense"
          id="author"
          label="Author"
          name="author"
          type="string"
          fullWidth
          variant="standard"
          autoComplete="off"
          value={newBook.author}
          onChange={handleChange}
        />
        <TextField
          sx={{ width: 270 }}
          margin="dense"
          id="description"
          label="Description"
          name="description"
          type="string"
          fullWidth
          variant="standard"
          autoComplete="off"
          value={newBook.description}
          onChange={handleChange}
        />
        <TextField
          sx={{ width: 270 }}
          margin="dense"
          id="quantity"
          label="Quantity"
          name="quantity"
          type="number"
          fullWidth
          variant="standard"
          autoComplete="off"
          value={newBook.quantity}
          onChange={handleChange}
        />
        <TextField
          sx={{ width: 270 }}
          margin="dense"
          id="price"
          label="Price"
          name="price"
          type="string"
          fullWidth
          variant="standard"
          autoComplete="off"
          value={newBook.price}
          onChange={handleChange}
        />
        <br />
        <div>
          {bookTitle ? (
            <Button color="primary" variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          ) : (
            <Button
              color="primary"
              variant="contained"
              onClick={handleAddNewBook}
            >
              Add Book
            </Button>
          )}
          <Button onClick={handleCancel} variant="outlined">
            Cancel
          </Button>
        </div>
        <br />
      </FormControl>
    </Box>
  );
};
