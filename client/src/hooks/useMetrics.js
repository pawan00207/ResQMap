import { useState, useEffect } from "react";

const useMetrics = (url, interval = 5000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch metrics");
      const result = await res.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(); // initial call

    const intervalId = setInterval(() => {
      fetchMetrics();
    }, interval);

    return () => clearInterval(intervalId);
  }, [url, interval]);

  return { data, loading, error };
};

export default useMetrics;
