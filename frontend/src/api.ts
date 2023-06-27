import { ReviewProps } from "./components/Review";
import { API_URL, APP_ID } from "./config";

export async function fetchReviews(): Promise<ReviewProps[]> {
  const response = await window.fetch(`${API_URL}/reviews/${APP_ID}`);

  const jsonResponse = await response.json();

  return jsonResponse.data as ReviewProps[];
}
