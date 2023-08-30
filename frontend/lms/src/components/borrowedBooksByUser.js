import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/userContext";
import bookAPI from "../clientAPIs/bookAPI";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Button,
  Paper,
} from "@mui/material";

export const BorrowedBooksByUser = () => {
  const { token } = useContext(UserContext);
  const [books, setBooks] = useState("");

  const navigate = useNavigate();

  const fetchBooks = async () => {
    const books = await bookAPI.getBorrowedBooksByUser(token);
    setBooks(books);
  };

  useEffect(() => {
    fetchBooks().catch(console.error);
  }, []);

  const rows = [];

  function createData(title, author, price, description, quantity) {
    return { title, author, price, description, quantity };
  }

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

  return (
    <>
      <TableContainer
      // component={Paper}
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
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="left">{row.author}</TableCell>
                <TableCell align="left">{row.price}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="left">{row.quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      navigate(`/books/${row.title}/return-book`);
                    }}
                  >
                    Return
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
