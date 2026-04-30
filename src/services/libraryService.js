import instance from "../instances/instance";
import { getBookById } from "./bookService";
//Public
export const getAllBooks = async (params) => {
    try {
        const res = await instance.get('/books', { params });
        return res.data;
    } catch (err) {
        console.error("getAllBooks error:", err);
        throw err;
    }
};
//Admin
export const createBook = async (bookData) => {
    try {
        const res = await instance.post('/books', bookData);
        return res.data;
    } catch (err) {
        console.error("createBook error:", err);
        throw err;
    }
};

export const updateSingleBook = async (id, bookData) => {
    try {
        const res = await instance.put(`/books/${id}`, bookData);
        return res.data;
    } catch (err) {
        console.error("updateSingleBook error:", err);
        throw err;
    }
};

export const deleteBook = async (id) => {
    try {
        const res = await instance.delete(`/books/${id}`);
        return res.data;
    } catch (err) {
        console.error("deleteBook error:", err);
        throw err;
    }
};

export const getSingleBook = async (id) => {
    try {
        const res = await getBookById(id);
        return res.data;
    } catch (err) {
        console.error("getSingleBook error:", err);
        throw err;
    }
};

export const handleBorrow = async (id) => {
  try {
    await instance.post(`/borrow/${id}`);
    alert("Book borrowed successfully");
    window.location.reload();
  } catch (err) {
    alert(err.response?.data?.message || "Error");
  }
};

export const getMyBorrowings = async () => {
    try {
        const res = await instance.get('/borrow/me');
        return res.data;
    } catch (err) {
        console.error("getMyBorrowings error:", err);
        throw err;
    }
};
