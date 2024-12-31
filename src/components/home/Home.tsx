import { JSX, useState } from "react";
import { TextInput } from "./components/TextInput";
import { FileInput } from "./components/FileInput";
import { InputNav } from "./components/InputNav.tsx";
import { CustomConfiguration } from "./components/CustomConfiguration";


export function Home(): JSX.Element{
  const [ _ , setData ] = useState<string>("");
  const [ _ , seConfigurations ] = useState<{
    time: number,
    questions: number
  }>({
    time: 0,
    questions: 0
  });
  const [ nav, setNav ] = useState<string>("text");
  return(
    <main className="bg-none flex flex-col gap-2 justify-start items-center mt-5 w-full h-full">
      <section className="flex gap-2 w-fit mx-auto">
        <h1 className="text-xl font-bold">Sample Question</h1>
        {nav === "text" ? <TextInput setData={setData} /> : <FileInput setData={setData} />}
        <InputNav setNav={setNav} nav={nav} />
      </section>
      <CustomConfiguration setConfigurations={setConfigurations} />
    </main>
  )
}