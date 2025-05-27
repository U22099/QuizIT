import { JSX } from "react";
import markdownToHtml from "../../../utils/markdown-to-html";

interface ExamListProps {
  data: {
    question: string;
    options: string[];
    action: (data: string) => void;
  };
}
export function ExamList({ data }: ExamListProps): JSX.Element {
  return (
    <section className="flex flex-col gap-2 text-text">
      <h1 className="font-extrabold text-text text-lg">Question</h1>
      <div
        className="mx-2 flex justify-start items-center font-bold text-text"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(data.question) }}
      />
      {data.options.length > 0 && (
        <>
          <h1 className="font-extrabold text-text text-lg">Options</h1>
          {data.options.map((op, i) => (
            <p
              key={i}
              className="mx-2 flex justify-start items-center font-bold text-text"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(`${String.fromCharCode(65 + i)}. ${op}`),
              }}
            />
          ))}
        </>
      )}
      <h1 className="font-extrabold text-text text-lg">Your Answer</h1>
      <textarea
        className="mx-2 flex justify-center items-center border rounded-md p-2 text-sm h-32 focus-visible:outline-none border bg-transparent backdrop-blur-sm text-text"
        placeholder="Input your solution"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          data.action(e.target.value)
        }
      />
    </section>
  );
}
