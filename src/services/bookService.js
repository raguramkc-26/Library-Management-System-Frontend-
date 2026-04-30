import api from "./api";

export const getBooks = () => api.get("/books");
export const getBookById = (id) => api.get(`/books/${id}`);
export const borrowBook = (id) => api.post(`/borrow/${id}`);
export const returnBook = (id) => api.put(`/borrow/${id}/return`);