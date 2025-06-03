import { JSX } from "react";
import markdownToHtml from "../../../utils/markdown-to-html";

interface AnswerListProps {
  data: {
    question: string,
    options: string[],
    ai_answer: string,
    user_answer: string
  }
}
export function AnswerList({ data }: AnswerListProps): JSX.Element {
  return (
    <section className="flex flex-col gap-2 text-text text-center justify-center items-center">
      <div className="mx-2 flex justify-center items-center font-bold text-text text-center w-[85%] md:w-3/4 select-text border p-2 rounded-md dark:border-gray-700" dangerouslySetInnerHTML={{__html: markdownToHtml(data.question)}} />
      <div className="w-full flex flex-col md:flex-wrap md:flex-row justify-center item-end gap-2 mt-10">
        {data.options.length > 0 && (
          <>
            {data.options.map((op, i) => (
              <div key={i} className={"flex justify-start items-start text-start gap-2 w-full md:w-[42%] cursor-pointer border-primary " + ((data.user_answer === data.ai_answer) && (data.user_answer === op) ? "bg-gradient-to-r from-fuchsia-400 to-violet-600 border-none" : (data.user_answer !== data.ai_answer) && (data.user_answer === op) ? "bg-gradient-to-r from-red-400 to-red-600 border-none" : (data.user_answer !== data.ai_answer) && (data.ai_answer === op) ? "bg-gradient-to-r from-fuchsia-400 to-violet-600 border-none" : "")}>
                <div className={"text-fuchsia-600" + ((data.user_answer === op || data.ai_answer === op) ? "text-black" : "")}>{String.fromCharCode(65 + i)}</div>
                <p
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
  )
}