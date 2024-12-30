import React, { JSX, Dispatch, SetStateAction } from "react";

interface TextInputProps {
  setData: Dispatch<SetStateAction<string>> ;
}

export function TextInput({ setData }: TextInputProps ): JSX.Element{
  return(
    <textarea
      className="flex justify-center items-center border rounded-md p-2 text-md w-40 h-48"
      placeholder="Paste/Type in a sample question set in the format below\n1\tquestion...\n2\tquestion..."
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData(e.target.value || "")}
    />
  )
}