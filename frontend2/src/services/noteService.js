import api from "./api";

export const createNote = async (data) => {
    const res = await api.post("/notes/create", data);
    return res.data;
};

export const getNotesBySubject = async (subjectId) => {
    const res = await api.get(`/notes/subject/${subjectId}`);
    return res.data;
};

export const updateNote = async (id, data) => {
    const res = await api.put(`/notes/update/${id}`, data);
    return res.data;
};

export const deleteNote = async (id) => {
    const res = await api.delete(`/notes/delete/${id}`);
    return res.data;
};

export const pinNote = async (id) => {
    const res = await api.put(`/notes/pin/${id}`);
    return res.data;
};
export const getAllNotes = async () => {
    const res = await api.get("/notes/all");
    return res.data;
};
export const getPinnedNotes = async () => {
    const res = await api.get("/notes/pinned");
    return res.data;
};
export const searchNotes = async (query) => {

    const res = await api.get(`/notes/search?query=${query}`);

    return res.data;

};
export const searchSubjects = async (query) => {
  const res = await api.get(`/subjects/search?query=${query}`);
  return res.data;
};
export const getSingleNote = async (id) => {

    const res = await api.get(`/notes/${id}`);

    return res.data;

};
export const completeTask = async (id) => {
    const res = await api.put(`/notes/complete/${id}`);
    return res.data;
};