import instance from "../instances/instance";

// public
export const getReviews = async (bookId) => {
  const res = await instance.get(`/reviews/${bookId}`);
  return res.data.data || [];
};

export const getAverageRating = async (bookId) => {
  const res = await instance.get(`/reviews/${bookId}/average`);
  return res.data;
};

// protected
export const addReview = async (bookId, data) => {
  const res = await instance.post(`/reviews/${bookId}`, data);
  return res.data;
};