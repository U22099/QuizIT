import { JSX, Dispatch, SetStateAction } from "react";
import { FaFilePdf } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

interface InputNavProps {
  nav: string;
  setNav: Dispatch<SetStateAction<string>>;
}

export function InputNav({ nav, setNav }: InputNavProps): JSX.Element {
  const custom_style =
    " flex justify-center items-center p-2 rounded-md w-9 h-9";
  return (
    <nav className="bg-primary flex flex-col gap-2 p-2 rounded-md h-fit border my-auto text-text">
      <FaPencil
        onClick={() => setNav("text")}
        className={
          nav === "text"
            ? "bg-black dark:bg-white fill-white dark:fill-black" + custom_style
            : "fill-black dark:fill-white" + custom_style
        }
      />
      <FaFilePdf
        onClick={() => setNav("file")}
        className={
          nav === "file"
            ? "bg-black dark:bg-white fill-white dark:fill-black" + custom_style
            : "fill-black dark:fill-white" + custom_style
        }
      />
    </nav>
  );
}
