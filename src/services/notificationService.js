import api from "./api";

export const getNotifications = () => api.get("/notifications");
export const sendNotification = (data) =>
  api.post("/admin/notify-all", data);