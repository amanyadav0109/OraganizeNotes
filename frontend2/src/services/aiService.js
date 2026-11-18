
import api from "./api";

export const generateAI = async (
  action,
  text,
  questionCount = 5,
  noteId = null
) => {
  const res = await api.post("/ai/generate", {
    action,
    text,
    questionCount,
    noteId,
  });

  return res.data;
};
