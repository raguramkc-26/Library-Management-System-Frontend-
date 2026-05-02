import api from "./api";

export const getMyBorrowings = () =>
  api.get("/borrow/me");

export const borrowBook = (bookId) =>
  api.post(`/borrow/${bookId}`);

export const reserveBook = (bookId) =>
  api.post(`/borrow/${bookId}/reserve`);

export const returnBook = (borrowId) =>
  api.put(`/borrow/${borrowId}/return`);