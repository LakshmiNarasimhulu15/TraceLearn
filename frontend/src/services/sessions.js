import api from "./api";

export const fetchSessionSummaries = async () => {
  const response = await api.get("/sessions/history/");
  return response.data;
};

export const fetchFullSessions = async () => {
  const response = await api.get("/sessions/full-history/");
  return response.data;
};

export const fetchSessionDetail = async (sessionId) => {
  const response = await api.get(`/sessions/full-history/${sessionId}/`);
  return response.data;
};