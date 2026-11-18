
import api from "./api";

// GET DASHBOARD STATS
export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/stats");
  return res.data;
};

// GET RECENT PRACTICE ACTIVITY
export const getRecentActivity = async () => {
  const res = await api.get("/practice/recent-activity");
  return res.data;
};
