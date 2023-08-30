import Axios from "axios";

const bookAPI = {
  getAllBooks: async () => {
    const res = await Axios.get("http://localhost:8000/book/all-books");
    return res.data;
  },
  getBookByTitle: async (title) => {
    const res = await Axios.get(`http://localhost:8000/book/by-title/${title}`);
    return res.data;
  },
  deleteBookByTitle: async (title, token) => {
    const res = await Axios.delete(`http://localhost:8000/book/delete-book`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: title },
    });
    return res.data;
  },

  addBook: async (book, token) => {
    try {
      const res = await Axios.post(
        `http://localhost:8000/book/add-book`,
        book,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { book },
        }
      );
      return res.data;
    } catch (err) {
      console.log("fromBookAPI:", err);
    }
  },
  patchBookByTitle: async (book, token) => {
    try {
      console.log("from BookAPI patchBook... Token: ", token);
      const res = await Axios.patch(
        `http://localhost:8000/book/update-book`,
        book,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { book },
        }
      );
      return res.data;
    } catch (err) {
      console.log(err.message);
    }
  },
  borrowBookByTitle: async (bookTitle, id) => {
    try {
      const res = await Axios.post(`http://localhost:8000/user/borrow`, {
        bookTitle,
        id,
      });
      return res.data;
    } catch (err) {
      return err;
    }
  },
  returnBookByTitle: async (bookTitle, id) => {
    try {
      const res = await Axios.post(`http://localhost:8000/user/return`, {
        bookTitle,
        id,
      });
      return res.data;
    } catch (err) {
      console.log(err.message);
    }
  },
  getBorrowedBooksByUser: async (token) => {
    try {
      const res = await Axios.get(`http://localhost:8000/user/borrowed-books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.Console.log(err.message);
    }
  },
};
export default bookAPI;
