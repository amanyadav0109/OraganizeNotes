import api from "./api";

export const getReminders = async () => {
    const res = await api.get("/notes/all");
    return res.data;
};