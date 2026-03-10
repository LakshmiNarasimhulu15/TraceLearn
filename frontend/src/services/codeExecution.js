import api from "./api";

export const executeCode = async ({ code, inputs = [] }) => {
  const response = await api.post("/execution/run/", {
    code,
    inputs,
  });

  return response.data;
};

export const fetchExplanation = async (sessionId) => {
  const response = await api.get(`/execution/explanation/${sessionId}/`);
  return response.data;
};