import React, { JSX, Dispatch, SetStateAction } from "react";

interface TextInputProps {
  setData: Dispatch<SetStateAction<string>> ;
}

export function TextInput({ setData }: TextInputProps ): JSX.Element{
  return(
    <textarea
      className="flex justify-center items-center border rounded-md p-2 text-sm w-60 h-48"
      placeholder="Paste/Type in a sample question set"
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData(e.target.value || "")}
    />
  )
}