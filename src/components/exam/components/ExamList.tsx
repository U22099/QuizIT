import { JSX } from "react";
import markdownToHtml from "../../../utils/markdown-to-html";

interface ExamListProps {
  data: {
    question: string;
    options: string[];
    user_answer: string;
    action: (data: string) => void;
  };
}
export function ExamList({ data }: ExamListProps): JSX.Element {
  return (
    <section className="flex flex-col gap-2 text-text items-center justify-center">
      <div
        className="mx-2 flex justify-center items-start font-bold text-text mt-3 mb-5 h-fit text-center w-[85%] md:w-3/4 select-text border p-2 rounded-md dark:border-gray-700"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(data.question) }}
      />
      <div className="w-full flex flex-col md:flex-wrap md:flex-row justify-center item-end gap-2 mt-10">
        {data.options.length > 0 && (
          <>
            {data.options.map((op, i) => (
              <div key={i} onClick={() => data.action(op)} className={"flex justify-start items-start gap-2 w-full md:w-[42%] cursor-pointer border-primary " + (data.user_answer === op ? "bg-gradient-to-r from-fuchsia-400 to-violet-600 border-none" : "")}>
                <div className={"text-fuchsia-600" + (data.user_answer === op ? "text-black" : "")}>{String.fromCharCode(65 + i)}</div>
                <p
                className="text-wrap break-words"
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(`${op}`),
                  }}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
