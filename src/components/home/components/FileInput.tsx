import React, { JSX, useState, Dispatch, SetStateAction } from "react";

interface FileInputProps {
  setData: Dispatch<SetStateAction<string>> ;
}

export function FileInput({ setData }: FileInputProps ): JSX.Element {
  const [ output, setOutput ] = useState<{
    error: boolean | null,
    data: string
  }>({
    error: false,
    data: "Add File or Image"
  });
  const MAX_FILE_SIZE = 7 * 1024 * 1024; //7mb
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      setOutput({
        error: true,
        data: "No files selected"
      });
    } else if(e.target.files[0].size > MAX_FILE_SIZE){
      setOutput({
        error: true,
        data: "File size too large"
      });
    } else {
      try {
        const result = await convertToBase64(e.target.files[0]);
        setData(result);
        setOutput({
          error: false,
          data: result
        });
      } catch (e) {
        setOutput({
          error: true,
          data: e.message
        });
        console.log(e);
      }
    }
  }
  return (
    <section>
      <label className="flex justify-center items-center border rounded-md p-2 text-md w-40 h-48" htmlFor="input">
        {output.error ? <p className="font-bold text-red-600">{output.data}</p> 
        : output.data.includes("image") ?
          <img src={output.data} className="w-full h-full object-cover" /> 
        : output.data.includes("pdf") ? <embed src={output.data} className="w-full h-full object-cover" /> : <p className="fold-bold text-theme">{output.data}</p>}
        <input
          type="file"
          accepts=".pdf,.jpeg,.png,.jpg"
          onChange={handleFile}
          hidden
        />
      </label>
    </section>
  )
}

function convertToBase64(file: File): Promise<string>{
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    }
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    }
    reader.readAsDataURL(file);
  })
}