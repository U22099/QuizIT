import React, { JSX, Dispatch, SetStateAction } from "react";

interface TextInputProps {
  setData: Dispatch<
    SetStateAction<{
      type: string;
      data: string;
    }>
  >;
  type: string;
}

export function TextInput({ setData, type }: TextInputProps): JSX.Element {
  return (
    <textarea
      className="flex justify-center items-center border rounded-md p-2 text-sm w-full h-56 focus-visible:outline-none border border-black dark:border-gray-600 bg-transparent backdrop-blur-sm text-text"
      placeholder={"Paste/Type in a " + (type === "json" ? "JSON string of questions in the format of { question: string; answer: string; options: string[] }[]": "sample question set, topic, or related article")}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setData({
          type: "text",
          data: e.target.value || "",
        })
      }
    />
  );
}
