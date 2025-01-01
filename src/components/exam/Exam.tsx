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
  const [ answers, setAnswers ] = useState<string[]>(new Array(exam.data.data.length).fill(""));
  const [ resultPage, setResultPage ] = useState<boolean>(false);
  const [ timer, setTimer ] = useState<string>("00:00:00");
  const [ time, setTime ] = useState<number>(exam.data.time * 60);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if(time > 0 && !resultPage){
        setTime(prevTime => prevTime - 1);
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
    if(time > 0 && !resultPage){
      setTimer(formatTime(time))
    }
  }, [time]);
  
  useEffect(() => {
    if(resultPage) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [resultPage]);
  return(
    <main className="flex flex-col gap-2 p-2 w-full h-full overflow-y-auto mb-5">
      <header className="flex w-full justify-between sticky top-0 left-0 z-10 backdrop-blur-sm">
        <CiLogout className="fill-black dark:fill-white w-8 h-8" onClick={() => setExam({
          started: false,
          data: {
            time: 0,
            data: []
          }
        })}/>
        <div className={(time/60 < 5 ? "bg-red-600 ": "bg-green-600 ") +"p-2 rounded-md flex justify-center items-center text-text"}>{timer}</div>
      </header>
      {!resultPage ? exam.data.data.map((ques: { question: string, answer: string }, i: number) => <ExamList data={{
          question: ques.question,
          action: (data: string): void => {
            setAnswers(
              prevAns => prevAns.map((x, index) => index === i ? data : x)
            )
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
  const hrs = date.getUTCHours();
  const mins = date.getUTCMinutes();
  const secs = date.getUTCSeconds();

  return `${padZero(hrs)}:${padZero(mins)}:${padZero(secs)}`;
}

function padZero(value: number): string {
  return (value < 10 ? '0' : '') + value;
}