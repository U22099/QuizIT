import { JSX, Dispatch, SetStateAction } from "react";

interface ExamProps {
  setExam: Dispatch <SetStateAction<{
    started: boolean,
    data: {
      time: number,
      data: { question: string, answer: string }[] | []
    }
  }>>
}

export function Exam({ setExam }: ExamProps): JSX.Element {
  setExam({
    started: true,
    data: {
      time: 0,
      data: []
    }
  })
  return <p>Exam</p>
}