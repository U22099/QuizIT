import { JSX, useState, Dispatch, SetStateAction } from "react";
import { TextInput } from "./components/TextInput";
import { FileInput } from "./components/FileInput";
import { InputNav } from "./components/InputNav.tsx";
import { CustomConfiguration } from "./components/CustomConfiguration";
import {
  GenerateExamForText,
  GenerateExamForFile,
} from "../../utils/generate-exam";
import { FiLoader } from "react-icons/fi";

interface HomeProps {
  setExam: Dispatch<
    SetStateAction<{
      started: boolean;
      data: {
        time: number;
        data: { question: string; answer: string }[] | [];
      };
    }>
  >;
}

export function Home({ setExam }: HomeProps): JSX.Element {
  const [data, setData] = useState<{
    type: string;
    data: string;
  }>({
    type: "text",
    data: "",
  });
  const [configurations, setConfigurations] = useState<{
    time: number;
    questions: number;
    type: "exact" | "partial" | "custom";
    typeconfig: "exact" | "harder" | "easier";
  }>({
    time: 0,
    questions: 0,
    type: "exact",
    typeconfig: "exact",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [nav, setNav] = useState<string>("text");
  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log(data.data);
      const response =
        nav !== "json"
          ? data.type === "text"
            ? await GenerateExamForText({
                input: data.data,
                configurations,
              })
            : await GenerateExamForFile({
                input: data.data,
                configurations,
              })
          : { time: configurations.time, data: JSON.parse(data.data) };
      console.log(response);
      setExam({
        started: true,
        data: response,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="bg-none flex flex-col gap-2 justify-start items-center mt-5 w-full md:w-[50%] h-full p-4 text-text">
      <h1 className="text-xl font-bold">Sample Question</h1>
      <section className="flex gap-2 w-fit mx-auto">
        {["text", "json"].includes(nav) ? (
          <TextInput setData={setData} />
        ) : nav !== "json" ? (
          <FileInput setData={setData} />
        ) : null}
        <InputNav setNav={setNav} nav={nav} />
      </section>
      <CustomConfiguration
        inputType={nav}
        setConfigurations={setConfigurations}
      />
      <button
        disabled={
          loading ||
          !configurations.type ||
          (configurations.type === "custom" &&
            (!configurations.time ||
              !configurations.questions ||
              !configurations.typeconfig)) ||
          !data.data
        }
        onClick={handleSubmit}
        className="w-full button disabled:opacity-50 flex gap-1 items-center justify-center"
      >
        {loading ? (
          <FiLoader className="animate-spin w-8 h-8 fill-white dark:fill-black" />
        ) : (
          ""
        )}{" "}
        Generate Exam
      </button>
    </main>
  );
}
