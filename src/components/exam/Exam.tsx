import { JSX, useState, useEffect, Dispatch, SetStateAction } from "react";
import { CiLogout } from "react-icons/ci";
import { ExamList } from "./components/ExamList";
import { AnswerList } from "./components/AnswerList";

interface ExamProps {
  setExam: Dispatch<SetStateAction<{
    started: boolean,
    data: {
      time: number,
      data: { question: string, answer: string }[] | []
    }
  }>>,
  exam: {
    started: boolean,
    data: {
      time: number,
      data: { question: string, answer: string }[] | []
    }
  }
}

export function Exam({ setExam, exam }: ExamProps): JSX.Element {
  const answers = [];
  const [ resultPage, setResultPage ] = useState<boolean>(false);
  const [ timer, setTimer ] = useState<string>("00:00:00");
  const [ time, setTime ] = useState<number>(exam.data.time * 60);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if(time > 0){
        setTime(time - 1);
      } else {
        setResultPage(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    }
  }, []);
  
  useEffect(() => {
    if(time > 0){
      setTimer(formatTime(time))
    }
  }, [time]);
  
  useEffect(() => {
    if(resultPage) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [resultPage]);
  return(
    <main className="flex flex-col gap-2 p-3 w-full h-full">
      <nav className="flex w-full justify-between">
        <CiLogout className="fill-black dark:fill-white w-8 h-8" onClick={() => setExam({
          started: false,
          data: {
            time: 0,
            data: []
          }
        })}/>
        <div className={(time/60 < 5 ? "bg-red-600 ": "bg-green-600 ") +"p-2 rounded-md flex justify-center items-center text-text"}>{timer}</div>
      </nav>
      {!resultPage ? exam.data.data.map((ques: { question: string, answer: string }, i: number) => <ExamList data={{
        question: ques.question,
        action: (data: string): void => {
          answers[i] = data;
        }
      }}/>) : exam.data.data.map((ques: { question: string, answer: string }, i: number) => <AnswerList data={{
        question: ques.question,
        user_answer: answers[i],
        ai_answer: ques.answer
      }} />)}
      {!resultPage&&<button onClick={() => setResultPage(true)} className="w-full button">Submit</button>}
    </main>
  )
}

function formatTime(seconds: number): string{
  const date = new Date(seconds * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(value: number): string {
  return (value < 10 ? '0' : '') + value;
}