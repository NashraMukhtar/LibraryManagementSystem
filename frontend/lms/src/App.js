import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ErrorPage } from "./components/ErrorPage";
import { BookForm } from "./components/bookForm";
import { BorrowRequests } from "./components/borrowRequests";
import { RequestedBooksByUser } from "./components/requestedBooksByUser";
import { BorrowedBooksByUser } from "./components/borrowedBooksByUser";
import { BorrowBook } from "./components/borrowBook";
import { LoginProtection } from "./access-permission/loginProtection";
import { AdminProtection } from "./access-permission/adminProtection";
import { ReturnBook } from "./components/returnBook";
import { DeleteBook } from "./components/deleteBook";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}></Route>

        <Route
          path="/books"
          element={<LoginProtection Component={Layout} />}
        ></Route>

        <Route
          path="/books/borrowed-books"
          element={<LoginProtection Component={BorrowedBooksByUser} />}
        ></Route>

        <Route
          path="/books/:bookTitle/borrow-book"
          element={<LoginProtection Component={BorrowBook} />}
        ></Route>

        <Route
          path="/books/:bookTitle/return-book"
          element={<LoginProtection Component={ReturnBook} />}
        ></Route>

        <Route
          path="/books/:bookTitle/delete-book"
          element={<LoginProtection Component={DeleteBook} />}
        ></Route>

        <Route
          path="/books/requested-books"
          element={<LoginProtection Component={RequestedBooksByUser} />}
        ></Route>

        <Route
          path="/books/admin/add-new-book"
          element={<AdminProtection Component={BookForm} />}
        ></Route>

        <Route
          path="/books/admin/:bookTitle/update-book"
          element={<AdminProtection Component={BookForm} />}
        ></Route>

        <Route
          path="/books/admin/borrow-requests"
          element={<AdminProtection Component={BorrowRequests} />}
        ></Route>

        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
