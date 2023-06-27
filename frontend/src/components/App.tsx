import React, { useEffect, useState } from "react";
import { Review, ReviewProps } from "./Review";
import { fetchReviews } from "../api";

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
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <h1 className="text-4xl">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-12">
      <AppHeading />
      <ReviewsGrid reviews={reviews} />
    </div>
  );
}

function AppHeading() {
  return (
    <header className="text-center mb-12">
      <h1 className="text-4xl tracking-widest text-emerald-800 mb-6 uppercase">
        App Store Reviews
      </h1>
      <h2 className="text-xs text-emerald-700 italic">
        {`*from the past 2 days`}
      </h2>
    </header>
  );
}

function ReviewsGrid({ reviews }: { reviews: ReviewProps[] }) {
  return (
    <main className="grid grid-cols-2 gap-x-10 gap-y-14">
      {reviews.map((review) => (
        <Review {...review} />
      ))}
    </main>
  );
}
