import { FC } from "react";

interface IMatchHighlightProps {
  text: string;
  query: string;
}

const MatchHighlight: FC<IMatchHighlightProps> = ({ text, query }) => {
  if (!query || !query.trim()) return text;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className={`mark mark--match`}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export default MatchHighlight;
