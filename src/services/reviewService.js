import api from "./api";

export const getReviews = (id) => api.get(`/reviews/${id}`);
export const getAverageRating = (id) =>
  api.get(`/reviews/${id}/average`);
export const addReview = (id, data) =>
  api.post(`/reviews/${id}`, data);