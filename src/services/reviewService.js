import api from "./api";

export const getReviews = (id) => api.get(`/reviews/${id}`);
export const addReview = (id, data) =>
  api.post(`/reviews/${id}`, data);
export const getAvgRating = (id) =>
  api.get(`/reviews/${id}/average`);