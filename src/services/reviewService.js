import api from "./api";

export const getReviews = (bookId) =>
  api.get(`/reviews/${bookId}`);

export const getAverageRating = (bookId) =>
  api.get(`/reviews/${bookId}/average`);

export const addReview = (bookId, data) =>
  api.post(`/reviews/${bookId}`, data);

export const approveReview = (reviewId) =>
  api.patch(`/reviews/${reviewId}/approve`);

export const rejectReview = (reviewId) =>
  api.patch(`/reviews/${reviewId}/reject`);

export const getPendingReviews = () => 
  api.get("/reviews/pending");