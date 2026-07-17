import api from "./api";

export const getSubjects = async () => {
    const res = await api.get("/subjects/all");
    return res.data;
};

export const createSubject = async (data) => {
    const res = await api.post("/subjects/create", data);
    return res.data;
};

export const updateSubject = async (id, data) => {
    const res = await api.put(`/subjects/update/${id}`, data);
    return res.data;
};

export const deleteSubject = async (id) => {
    const res = await api.delete(`/subjects/delete/${id}`);
    return res.data;
};