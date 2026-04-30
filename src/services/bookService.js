import api from "./api";

export const getAllBooks = (params) =>
  api.get("/books", { params });

export const getBookById = (id) =>
  api.get(`/books/${id}`);

export const createBook = (data) =>
  api.post("/books", data);

export const updateSingleBook = (id, data) =>
  api.put(`/books/${id}`, data);

export const getMyBorrowings = () =>
  api.get("/borrow/me");

export const borrowBook = (bookId) =>
  api.post(`/borrow/${bookId}`);

export const reserveBook = (bookId) =>
  api.post(`/reservation/${bookId}`);

export const returnBook = (borrowId) =>
  api.put(`/borrow/${borrowId}/return`);