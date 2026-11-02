import api from "./api";

export const generateAI = async (
  action,
  text,
  questionCount = 5
) => {
  const res = await api.post("/ai/generate", {
    action,
    text,
    questionCount,
  });

  return res.data;
};