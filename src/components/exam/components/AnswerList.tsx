import { JSX } from "react";
import markdownToHtml from "../../../utils/markdown-to-html";

interface AnswerListProps {
  data: {
    question: string,
    ai_answer: string,
    user_answer: string
  }
}
export function AnswerList({ data }: AnswerListProps): JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="font-extrabold text-text text-lg">Question</h1>
      <div className="mx-2 flex justify-start items-center font-bold text-text" dangerouslySetInnerHTML={{__html: markdownToHtml(data.question)}} />
      <h1 className="font-extrabold text-text text-lg">Your Answer</h1>
      <div className="mx-2 flex justify-start items-center font-bold text-text" dangerouslySetInnerHTML={{__html: markdownToHtml(data.user_answer)}} />
      <h1 className="font-extrabold text-text text-lg">AI's Answer</h1>
      <div className="mx-2 flex justify-start items-center font-bold text-green-600" dangerouslySetInnerHTML={{__html: markdownToHtml(data.ai_answer)}} />
    </section>
  )
}