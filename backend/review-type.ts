/**
 * The backend is just plain JS due to time constraints,
 * but I am making this type to declare the shape of how I want
 * to store reviews for reference.
 */

type Review = {
  id: string; //id.label
  content: string; //content.label
  author: string; //author.name.label
  score: number; //im:rating.label
  timeSubmitted: Date; //updated.label
};
