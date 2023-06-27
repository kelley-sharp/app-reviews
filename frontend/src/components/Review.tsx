export type ReviewProps = {
  id: string;
  content: string;
  author: string;
  score: number;
  timeSubmitted: string; // this is a Date inside of a string from the backend response
};

export function Review({
  id,
  content,
  author,
  score,
  timeSubmitted,
}: ReviewProps) {
  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <div className="mt-3">
        <div className="flex">
          <h3 className="font-bold">{author}</h3>
          <DateAndTime timeSubmitted={timeSubmitted} />
        </div>
        <Stars score={score} />
      </div>
      <p className="text-xs mt-5">{content}</p>
    </div>
  );
}

function Stars({ score }: Pick<ReviewProps, "score">) {
  const scoreArray = Array.from({ length: score });
  const fullStars = scoreArray.map((scorePoint, idx) => (
    <>
      <span key={idx} className="text-amber-400">
        ★
      </span>
    </>
  ));

  const emptyStars = Array.from({ length: 5 - score }).map(
    (scorePoint, idx) => (
      <span key={idx} className="text-neutral-300">
        ★
      </span>
    )
  );

  return <span className="text-lg">{fullStars.concat(emptyStars)}</span>;
}

function DateAndTime({ timeSubmitted }: Pick<ReviewProps, "timeSubmitted">) {
  const date = new Date(timeSubmitted);
  // display time without seconds https://stackoverflow.com/a/20430558/5920970
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="ml-auto">
      <span className="text-xs">{date.toDateString()}</span>
      <span className="text-xs ml-3">{time}</span>
    </div>
  );
}
