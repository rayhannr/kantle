export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => {
    if (!res.ok) {
      const error = new Error("An error occurred while fetching the data.");
      throw error;
    }
    return res.json();
  });
