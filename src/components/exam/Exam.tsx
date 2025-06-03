import { JSX, useState, useEffect, Dispatch, SetStateAction } from "react";
import { CiLogout } from "react-icons/ci";
import { ExamList } from "./components/ExamList";
import { AnswerList } from "./components/AnswerList";
import { AnalyseAnswer } from "../../utils/generate-exam";
import { FiLoader } from "react-icons/fi";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

interface ExamProps {
  setExam: Dispatch<
    SetStateAction<{
      started: boolean;
      data: {
        time: number;
        data: { question: string; answer: string; options?: string[] }[] | [];
      };
    }>
  >;
  exam: {
    started: boolean;
    data: {
      time: number;
      data: { question: string; answer: string; options?: string[] }[] | [];
    };
  };
}

export function Exam({ setExam, exam }: ExamProps): JSX.Element {
  const [result, setResult] = useState<{ correctAnswers: number, percentageScore: number }>();
  const [answers, setAnswers] = useState<string[]>(
    new Array(exam.data.data.length).fill("")
  );
  const [resultPage, setResultPage] = useState(false);
  const [timer, setTimer] = useState("00:00:00");
  const [time, setTime] = useState(exam.data.time * 60);
  const [analysis, setAnalysis] = useState<
    { answer: string; topicExp: string }[]
  >([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyse = async () => {
    try {
      setLoading(true);
      setError("");
      const data = exam.data.data.map((x, i) => ({
        question: x.question,
        questionOptions: x.options || [],
        studentsAnswer: answers[i],
      }));
      const response = await AnalyseAnswer(data);
      setAnalysis(response);
    } catch (err: any) {
      console.log("Error occured", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (time > 0 && !resultPage) {
        setTime((prevTime) => prevTime - 1);
      } else {
        setResultPage(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (time >= 0 && !resultPage) {
      setTimer(formatTime(time));
    } else {
      setResultPage(true);
    }
  }, [time]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [resultPage, page]);
  useEffect(() => {
    if (resultPage) setResult(calculateScore(exam.data.data.map((x) => x.answer), answers));
  }, [resultPage]);
  return (
    <main className="flex flex-col gap-2 w-full md:w-[50%] h-full overflow-y-auto mt-10 text-text">
      <header className="flex w-full justify-between fixed top-0 left-0 z-10 backdrop-blur-sm p-2">
        <CiLogout
          className="fill-fuchsia-600 w-8 h-8 cursor-pointer"
          onClick={() =>
            setExam({
              started: false,
              data: {
                time: 0,
                data: [],
              },
            })
          }
        />
        <div
          className={
            (time / 60 < 5 ? "bg-red-600 " : "bg-gradient-to-r from-fuchsia-400 to-violet-600 ") +
            "p-2 rounded-md flex justify-center items-center text-text cursor-pointer"
          }
        >
          {timer}
        </div>
      </header>
      <section className="flex justify-between w-full px-3 py-2 mt-2 gap-8">
        <div className="button font-bold w-full md:w-[20%]" onClick={() => {
          if (page > 0) setPage(prev => prev - 1);
          else setPage(exam.data.data.length - 1);
        }}>
          <BsArrowLeft className="stroke-black dark:stroke-white"/>
        </div>
        <div className="font-bold text-fuchsia-600">{page + 1}/{exam.data.data.length}</div>
        <div className="button font-bold w-full md:w-[20%]" onClick={() => {
          if (page < (exam.data.data.length - 1)) setPage(prev => prev + 1);
          else setPage(0);
        }}>
          <BsArrowRight className="stroke-black dark:stroke-white"/>
        </div>
      </section>
      {result?.correctAnswers && result?.percentageScore && (
        <section className="flex mx-auto gap-2 p-2 w-fit justify-start items-center rounded-md border">
          <p className="text-fuchsia-600 font-extrabold">Score: {result.correctAnswers}/{exam.data.data.length}</p>
          <p className="text-fuchsia-600 font-extrabold">Percentage: {result.percentageScore.toFixed(2)}%</p>
        </section>)}
      <section className="flex flex-col gap-2 p-2 w-full h-full overflow-y-auto mb-5">
        {!resultPage
          ? <ExamList
            data={{
              question: exam.data.data[page].question,
              options: exam.data.data[page].options || [],
              user_answer: answers[page],
              action: (data: string): void => {
                setAnswers((prevAns) =>
                  prevAns.map((x, index) => (index === page ? data : x))
                );
                setTimeout(() => {
                  if (page < exam.data.data.length - 1) setPage(prev => prev + 1);
                }, 600);
              },
            }}
          />
          :
          <AnswerList
            data={{
              question: exam.data.data[page].question,
              options: exam.data.data[page].options || [],
              user_answer: answers[page],
              ai_answer: exam.data.data[page].answer,
            }}
          />
        }
        {(resultPage && analysis.length > 0) && (
          <h1 className="font-bold text-lg mb-2 mt-10">Analysis</h1>
        )}
        {(resultPage && analysis.length > 0) &&
          <div
            className="flex flex-col gap-2 border p-2 rounded-md"
          >
            <div className="flex flex-col gap-2">
              <p className="font-bold text-lg">
                Question's Answer Description
              </p>
              <p className="text-green-500">{analysis[page].answer}</p>
            </div>
            <div>
              <p className="font-bold text-lg">Brief Topic Intro</p>
              <p className="text-fuchsia-600">{analysis[page].topicExp}</p>
            </div>
          </div>}
        {error && <p className="font-bold text-red-600 font-xs">{error}</p>}
        {!resultPage && (page === exam.data.data.length - 1) && (
          <button onClick={() => { setPage(0); setResultPage(true); }} className="w-full button mt-10">
            Submit
          </button>
        )}
        {resultPage && !analysis.length && (
          <button
            onClick={analyse}
            className="w-full button disabled:opacity-50 flex gap-1 items-center justify-center mt-10"
          >
            {loading ? (
              <FiLoader className="animate-spin w-6 h-6 stroke-black" />
            ) : (
              ""
            )}{" "}
            Analyse With AI
          </button>
        )}
      </section>
    </main >
  );
}

function formatTime(seconds: number): string {
  const date = new Date(seconds * 1000);
  const hrs = date.getUTCHours();
  const mins = date.getUTCMinutes();
  const secs = date.getUTCSeconds();

  return `${padZero(hrs)}:${padZero(mins)}:${padZero(secs)}`;
}

function padZero(value: number): string {
  return (value < 10 ? "0" : "") + value;
}

function calculateScore(ai_answer: string[], user_answer: string[]) {
  if (ai_answer.length !== user_answer.length) {
    throw new Error("The AI answer array and user answer array must have the same length.");
  }

  let correctCount = 0;
  for (let i = 0; i < ai_answer.length; i++) {
    if (ai_answer[i] === user_answer[i]) {
      correctCount++;
    }
  }

  const percentageScore = (correctCount / ai_answer.length) * 100;

  return {
    correctAnswers: correctCount,
    percentageScore: percentageScore
  };
}