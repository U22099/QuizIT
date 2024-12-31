import { JSX, useState, useEffect } from "react";
import { TextInput } from "./components/TextInput";
import { FileInput } from "./components/FileInput";
import { InputNav } from "./components/InputNav.tsx";
import { CustomConfiguration } from "./components/CustomConfiguration";


export function Home(): JSX.Element{
  const [ _ , setData ] = useState<string>("");
  const [ configurations , setConfigurations ] = useState<{
    time: number,
    questions: number
  }>({
    time: 0,
    questions: 0
  });
  const [ nav, setNav ] = useState<string>("text");
  
  useEffect(() => {
    console.log(configurations);
  }, [configurations])
  return(
    <main className="bg-none flex flex-col gap-2 justify-start items-center mt-5 w-full h-full">
      <h1 className="text-xl font-bold text-text">Sample Question</h1>
      <section className="flex gap-2 w-fit mx-auto">
        {nav === "text" ? <TextInput setData={setData} /> : <FileInput setData={setData} />}
        <InputNav setNav={setNav} nav={nav} />
      </section>
      <CustomConfiguration setConfigurations={setConfigurations} />
    </main>
  )
}