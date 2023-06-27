export type ReviewProps = {
  id: string; //id.label
  content: string; //content.label
  author: string; //author.name.label
  score: number; //im:rating.label
  timeSubmitted: Date; //updated.label
};

export function Review({
  id,
  content,
  author,
  score,
  timeSubmitted,
}: ReviewProps) {
  return <div>{id}</div>;
}
