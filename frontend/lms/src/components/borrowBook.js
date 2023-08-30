import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/userContext";
import {
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import bookAPI from "../clientAPIs/bookAPI";
import { NotificationManager } from "react-notifications";

export const BorrowBook = () => {
  const { user } = useContext(UserContext);
  const { bookTitle } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    author: "",
    description: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    bookAPI.getBookByTitle(bookTitle).then((res) => {
      setBook({
        title: res.title,
        author: res.author,
        description: res.description,
        quantity: res.quantity,
        price: res.price,
      });
    });
  }, [bookTitle]);

  const handleCancel = () => {
    navigate("/books");
  };

  const handleBorrow = async () => {
    if (book.quantity > 0) {
      await bookAPI
        .borrowBookByTitle(bookTitle, user._id)
        .then(NotificationManager.success("Book Borrowed Successfully"))
        .catch((err) => {
          NotificationManager.error(err.message);
        });
    } else {
      NotificationManager.error("Book is Out of Stock");
    }
    navigate(-1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "Column",
        width: "70%",
        ml: "auto",
        mr: "auto",
        border: "1px",
      }}
    >
      <br />
      <br />
      <Typography variant="h6" component="h2" sx={{ fontSize: "x-larger" }}>
        Book Details
      </Typography>
      <br />
      <Table sx={{ width: "60%" }}>
        <TableBody>
          <TableRow>
            <TableCell>Title :</TableCell>
            <TableCell>{book.title}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Author :</TableCell>
            <TableCell>{book.author}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Description :</TableCell>
            <TableCell>{book.description}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Quantity :</TableCell>
            <TableCell>{book.quantity}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Price :</TableCell>
            <TableCell>{book.price}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <br />
      <div>
        <Button color="primary" variant="contained" onClick={handleBorrow}>
          Borrow Book
        </Button>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
      </div>
      <br />
    </Box>
  );
};
