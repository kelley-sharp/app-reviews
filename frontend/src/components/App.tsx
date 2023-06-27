import React, { useEffect, useState } from "react";
import { Review, ReviewProps } from "./Review";
import { fetchReviews } from "../api";
import "./App.css";

export function App() {
  const [reviews, setReviews] = useState<ReviewProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadReviews() {
      const reviewsFromApi = await fetchReviews();
      setReviews(reviewsFromApi);
      setIsLoading(false);
    }

    loadReviews();
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      {reviews.map((review) => (
        <Review {...review} />
      ))}
    </div>
  );
}
