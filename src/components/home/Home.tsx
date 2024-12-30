import { JSX, useState } from "react";
import { TextInput } from "./components/TextInput";
import { FileInput } from "./components/FileInput";

export function Home(): JSX.Element{
  const [ _ , setData ] = useState<string>("");
  return(
    <main>
      <TextInput setData={setData} />
      <FileInput setData={setData} />
    </main>
  )
}