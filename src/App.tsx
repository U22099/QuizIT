import { JSX, useState } from 'react';
import { Home } from "./components/home/Home";
import { Exam } from "./components/exam/Exam";

function App(): JSX.Element {
  const [ exam, setExam ] = useState<{
    started: boolean, data: { time: number, data: { question: string, answer: string }[] | [] };
  }>({
    started: false,
    data: { time: 0, data: [] }
  });
  return (
    <main className="bg-none flex justify-center items-center w-full h-full">
      {exam.started ? <Exam exam={exam}setExam={setExam}/> : <Home setExam={setExam}/>}
    </main>
  );
}

export default App;