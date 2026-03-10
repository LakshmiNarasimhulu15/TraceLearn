import { useEffect, useState } from "react";
import { fetchSessionSummaries } from "../services/sessions";

const useFetchSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSessionSummaries();
      setSessions(data || []);
    } catch (err) {
      setError(err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return {
    sessions,
    loading,
    error,
    reloadSessions: loadSessions,
  };
};

export default useFetchSessions;