import { JSX, Dispatch, SetStateAction } from "react";
import { BsBraces } from "react-icons/bs";
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
    <nav className="bg-primary flex flex-col gap-2 p-2 rounded-md h-fit border border-black dark:border-gray-600 my-auto text-text">
      <FaPencil
        onClick={() => setNav("text")}
        className={
          nav === "text"
            ? "bg-gradient-to-r from-fuchsia-400 to-violet-600 fill-white dark:fill-black" + custom_style
            : "fill-black dark:fill-white" + custom_style
        }
      />
      <FaFilePdf
        onClick={() => setNav("file")}
        className={
          nav === "file"
            ? "bg-gradient-to-r from-fuchsia-400 to-violet-600 fill-white dark:fill-black" + custom_style
            : "fill-black dark:fill-white" + custom_style
        }
      />
      <BsBraces
        onClick={() => setNav("json")}
        className={
          nav === "json"
            ? "bg-gradient-to-r from-fuchsia-400 to-violet-600 fill-white dark:fill-black" + custom_style
            : "fill-black dark:fill-white" + custom_style
        }
      />
    </nav>
  );
}
