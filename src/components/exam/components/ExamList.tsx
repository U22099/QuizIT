import { JSX } from "react";
import { markdownToHtml } from "../../../utils/markdown-to-html";

interface ExamListProps {
  data: {
    question: string,
    action: (data: string) => void
  }
}
export function ExamList({ data }: ExamListProps): JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="font-extrabold text-text text-lg">Question</h1>
      <div className="flex justify-start items-center font-bold text-text" dangerouslySetInnerHTML={{_html: markdownToHtml(data.question)}} />
      <h1 className="font-extrabold text-text text-lg">Your Answer</h1>
      <textarea
        className="flex justify-center items-center border rounded-md p-2 text-sm w-64 h-40 focus-visible:outline-none border bg-transparent backdrop-blur-sm"
        placeholder="Input your solution"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => data.action(e.target.value || "")}
      />
    </section>
  )
}