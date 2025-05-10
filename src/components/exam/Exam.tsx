import { JSX, useState, useEffect, Dispatch, SetStateAction } from "react";
import { CiLogout } from "react-icons/ci";
import { ExamList } from "./components/ExamList";
import { AnswerList } from "./components/AnswerList";
import { AnalyseAnswer } from "../../utils/generate-exam";
import { FiLoader } from "react-icons/fi";

interface ExamProps {
  setExam: Dispatch<
    SetStateAction<{
      started: boolean;
      data: {
        time: number;
        data: { question: string; answer: string }[] | [];
      };
    }>
  >;
  exam: {
    started: boolean;
    data: {
      time: number;
      data: { question: string; answer: string }[] | [];
    };
  };
}

export function Exam({ setExam, exam }: ExamProps): JSX.Element {
  const [answers, setAnswers] = useState<string[]>(
    new Array(exam.data.data.length).fill("")
  );
  const [resultPage, setResultPage] = useState(false);
  const [timer, setTimer] = useState("00:00:00");
  const [time, setTime] = useState(exam.data.time * 60);
  const [analysis, setAnalysis] = useState<
    { answer: string; topicExp: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyse = async () => {
    try {
      setLoading(true);
      setError("");
      const data = exam.data.data.map((x, i) => ({
        question: x.question,
        studentsAnswer: answers[i],
      }));
      const response = await AnalyseAnswer(data);
      console.log(response);
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
    if (resultPage && !analysis.length)
      window.scrollTo({ top: 0, behavior: "smooth" });
  }, [resultPage]);
  return (
    <main className="flex flex-col gap-2 w-full md:w-[50%] h-full overflow-y-auto mt-10 text-text">
      <header className="flex w-full justify-between fixed top-0 left-0 z-10 backdrop-blur-sm p-2">
        <CiLogout
          className="fill-black dark:fill-white w-8 h-8"
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
            (time / 60 < 5 ? "bg-red-600 " : "bg-green-600 ") +
            "p-2 rounded-md flex justify-center items-center text-text"
          }
        >
          {timer}
        </div>
      </header>
      <section className="flex flex-col gap-2 p-2 w-full h-full overflow-y-auto mb-5">
        {!resultPage
          ? exam.data.data.map(
              (ques: { question: string; answer: string }, i: number) => (
                <ExamList
                  data={{
                    question: ques.question,
                    action: (data: string): void => {
                      setAnswers((prevAns) =>
                        prevAns.map((x, index) => (index === i ? data : x))
                      );
                    },
                  }}
                />
              )
            )
          : exam.data.data.map(
              (ques: { question: string; answer: string }, i: number) => (
                <AnswerList
                  data={{
                    question: ques.question,
                    user_answer: answers[i],
                    ai_answer: ques.answer,
                  }}
                />
              )
            )}
        {!resultPage && (
          <button onClick={() => setResultPage(true)} className="w-full button">
            Submit
          </button>
        )}
        {resultPage && !analysis.length && (
          <button
            onClick={analyse}
            className="w-full button disabled:opacity-50 flex gap-1 items-center justify-center"
          >
            {loading ? (
              <FiLoader className="animate-spin w-8 h-8 fill-white dark:fill-black" />
            ) : (
              ""
            )}{" "}
            Analyse With AI
          </button>
        )}
        {error && <p className="font-bold text-red-600 font-xs">{error}</p>}
        {(resultPage && analysis.length > 0) && (
          <h1 className="font-bold text-lg mb-2 mt-10">Analysis</h1>
        )}
        {resultPage &&
          analysis.map((x, i) => {
            return (
              <div
                key={i}
                className="flex flex-col gap-2 border p-2 rounded-md"
              >
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-lg">
                    Question's Answer Description
                  </p>
                  <p className="text-green-500">{x.answer}</p>
                </div>
                <div>
                  <p className="font-bold text-lg">Brief Topic Intro</p>
                  <p className="text-blue-500">{x.topicExp}</p>
                </div>
              </div>
            );
          })}
      </section>
    </main>
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
