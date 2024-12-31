import React, { JSX, Dispatch, SetStateAction } from "react";

interface TextInputProps {
  setData: Dispatch<SetStateAction<string>> ;
}

export function TextInput({ setData }: TextInputProps ): JSX.Element{
  return(
    <textarea
      className="flex justify-center items-center border rounded-md p-2 text-sm w-64 h-56 focus-visible:outline-none border bg-transparent backdrop-blur-sm"
      placeholder="Paste/Type in a sample question set"
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData(e.target.value || "")}
    />
  )
}