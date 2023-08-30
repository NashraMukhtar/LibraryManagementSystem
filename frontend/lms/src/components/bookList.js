import React from "react";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../Context/userContext";
import bookAPI from "../clientAPIs/bookAPI";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";

import { NotificationManager } from "react-notifications";

function createData(title, author, price, description, quantity) {
  return { title, author, price, description, quantity };
}

export const BookList = () => {
  const [books, setBooks] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { isUserAdmin, token } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    const books = await bookAPI.getAllBooks();
    setBooks(books);
  };

  useEffect(() => {
    fetchBooks().catch(console.error);
  }, []);

  const handleAddNewBook = async () => {
    navigate("/books/admin/add-new-book");
  };

  const rows = [];

  for (var i = 0; i < books.length; i++) {
    rows.push(
      createData(
        books[i].title,
        books[i].author,
        books[i].price,
        books[i].description,
        books[i].quantity
      )
    );
  }

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Search Books Here!"
        variant="outlined"
        type="search"
        placeholder="Enter Book Title Here"
        onChange={handleChange}
        value={searchInput}
        sx={{ ml: "60px", width: "30%" }}
      />
      {isUserAdmin ? (
        <Button
          color="primary"
          variant="contained"
          align="left"
          size="medium"
          sx={{ float: "right", mr: "4%" }}
          onClick={handleAddNewBook}
        >
          Add New Book
        </Button>
      ) : (
        <></>
      )}
      <TableContainer
        component={Paper}
        sx={{
          width: "90%",
          ml: "auto",
          mr: "auto",
          overflow: "scroll",
          maxHeight: 400,
          borderTop: 1,
          borderColor: "primary.main",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Title</b>
              </TableCell>
              <TableCell align="left">
                <b>Author</b>
              </TableCell>
              <TableCell align="left">
                <b>Price</b>
              </TableCell>
              <TableCell align="center">
                <b>Description</b>
              </TableCell>
              <TableCell align="left">
                <b>Quantity</b>
              </TableCell>
              <TableCell align="left">
                <b>Options</b>
              </TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .filter((row) => {
                return row.title
                  .toLowerCase()
                  .includes(searchInput.toLowerCase());
              })
              .map((row) => (
                <TableRow
                  key={row.title}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <b>{row.title}</b>
                  </TableCell>
                  <TableCell align="left">{row.author}</TableCell>
                  <TableCell align="left">{row.price}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="left">{row.quantity}</TableCell>
                  {isUserAdmin ? (
                    <>
                      <TableCell>
                        <Button
                          color="primary"
                          variant="contained"
                          align="left"
                          size="small"
                          onClick={() => {
                            navigate(`/books/admin/${row.title}/update-book`);
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          variant="contained"
                          align="left"
                          size="small"
                          onClick={() => {
                            navigate(`/books/${row.title}/delete-book`);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <TableCell>
                      <Button
                        color="primary"
                        variant="contained"
                        align="left"
                        size="small"
                        onClick={() => {
                          navigate(`/books/${row.title}/borrow-book`);
                        }}
                      >
                        Borrow
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
