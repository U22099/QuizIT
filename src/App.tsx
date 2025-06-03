import { JSX, useState, useEffect } from "react";
import { Home } from "./components/home/Home";
import { Exam } from "./components/exam/Exam";

function App(): JSX.Element {
  const [exam, setExam] = useState<{
    started: boolean;
    data: { time: number; data: { question: string; answer: string }[] | [] };
  }>({
    started: false,
    data: { time: 0, data: [] },
  });
  useEffect(() => {
    if (exam.started) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [exam.started]);
  return (
    <main className="flex justify-center items-center w-full h-full select-none">
      {exam.started ? (
        <Exam exam={exam} setExam={setExam} />
      ) : (
        <Home setExam={setExam} />
      )}
    </main>
  );
}

export default App;
