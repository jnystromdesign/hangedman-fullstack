import { API_KEY, API_URL } from "./config";

const apiClient = async (url: string) => {
  const data = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
      "Content-Type": "application/json",
    },
  }); // Handle error higher up
  return data.json();
};

export const getRandomWord = async (): Promise<string> => {
  const { word } = await apiClient(API_URL); // Handle error higher up
  return (word as string).toLowerCase();
};
