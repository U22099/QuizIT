import { JSX, useState, Dispatch, SetStateAction } from "react";
import { TextInput } from "./components/TextInput";
import { FileInput } from "./components/FileInput";
import { InputNav } from "./components/InputNav.tsx";
import { CustomConfiguration } from "./components/CustomConfiguration";
import { GenerateExamForText, GenerateExamForFile } from "../../utils/generate-exam";
import { FiLoader } from "react-icons/fi";

interface HomeProps{
  setExam: Dispatch<SetStateAction<{
    started: boolean,
    data: {
      time: number,
      data: { question: string, answer: string }[] | []
    }
  }>>
}

export function Home({ setExam }: HomeProps): JSX.Element{
  const [ data , setData ] = useState<{
    type: string,
    data: string
  }>({
    type: "text",
    data: ""
  });
  const [ configurations , setConfigurations ] = useState<{
    time: number,
    questions: number,
    disabled: boolean,
  }>({
    time: 0,
    questions: 0,
    disabled: true
  });
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ nav, setNav ] = useState<string>("text");
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = data.type === "text" ? await GenerateExamForText({
        input: data.data,
        configurations
      }) : await GenerateExamForFile({
        input: data.data,
        configurations
      }); 
      console.log(response);
      setExam({
        started: true,
        data: response
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }
  return(
    <main className="bg-none flex flex-col gap-2 justify-start items-center mt-5 w-full h-full p-4">
      <h1 className="text-xl font-bold text-text">Sample Question</h1>
      <section className="flex gap-2 w-fit mx-auto">
        {nav === "text" ? <TextInput setData={setData} /> : <FileInput setData={setData} />}
        <InputNav setNav={setNav} nav={nav} />
      </section>
      <CustomConfiguration setConfigurations={setConfigurations} />
      <button disabled={loading} onClick={handleSubmit} className="w-full button">{ loading ? <FiLoader className="animate-spin w-8 h-8 fill-white dark:fill-black"/> : "Generate Exam" }</button>
    </main>
  )
}