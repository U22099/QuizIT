import { JSX, useState } from "react";
import { TextInput } from "./components/TextInput";
import { FileInput } from "./components/FileInput";
import { InputNav } from "./components/InputNav.tsx"

export function Home(): JSX.Element{
  const [ _ , setData ] = useState<string>("");
  const [ nav, setNav ] = useState<string>("text");
  return(
    <main className="bg-theme flex flex-col gap-2 justify-start items-center mt-8">
      <section className="flex gap-2 w-fit mx-auto">
        {nav === "text" ? <TextInput setData={setData} /> : <FileInput setData={setData} />}
        <InputNav setNav={setNav} nav={nav} />
      </section>
    </main>
  )
}