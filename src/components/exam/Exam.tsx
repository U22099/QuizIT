import { JSX, Dispatch, SetStateAction } from "react";
import { CiLogout } from "react-icons/ci";
import { ExamList } from "./components/ExamList";

interface ExamProps {
  setExam: Dispatch<SetStateAction<{
    started: boolean,
    data: {
      time: number,
      data: { question: string, answer: string }[]
    }
  }>>,
  exam: {
    started: boolean,
    data: {
      time: number,
      data: { question: string, answer: string }[]
    }
  }
}

export function Exam({ setExam, exam }: ExamProps): JSX.Element {
  const answers = [];
  return(
    <main className="flex flex-col gap-2 p-2 w-full h-full">
      <nav className="flex w-full justify-between">
        <CiLogout className="fill-black dark:fill-white w-8 h-8" onClick={() => setExam({
          started: false,
          data: [{ question: "", answer: ""}]
        })}/>
        <div className="p-2 rounded-md flex justify-center items-center bg-green-700 text-text">2:00:00</div>
      </nav>
      {exam.data.data.map((ques: { question: string, answer: string }, i: number) => <ExamList data={{
        question: ques.question,
        action: (data: string): void => {
          answers[i] = data;
        }
      }}/>)}
    </main>
  )
}