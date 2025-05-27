import React, {
  useState,
  JSX,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

interface CustomConfigurationProps {
  setConfigurations: Dispatch<
    SetStateAction<{
      time: number;
      questions: number;
      type: "exact" | "partial" | "custom";
      typeconfig: "exact" | "harder" | "easier";
    }>
  >;
  inputType: string;
}
export function CustomConfiguration({
  setConfigurations,
  inputType,
}: CustomConfigurationProps): JSX.Element {
  const [type, setType] = useState<"exact" | "partial" | "custom">(
    inputType === "json" ? "custom" : "exact"
  );
  const [error, setError] = useState<string>("");

  const handleExamType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!e.target.value) return;

    setConfigurations((prevValue) => {
      return {
        ...prevValue,
        type: (e.target.value as typeof type) || "exact",
      };
    });
    setType(e.target.value as typeof type);
  };

  const handleExamTypeConfig = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setError("");
    if (!e.target.value) return;
    setConfigurations((prevValue) => {
      return {
        ...prevValue,
        typeconfig:
          (e.target.value as unknown as "exact" | "harder" | "easier") ||
          "exact",
      };
    });
  };

  const handleQuestionNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;

    setConfigurations((prevValue) => {
      return {
        ...prevValue,
        questions: parseInt(e.target.value) || 0,
      };
    });
  };

  const handleTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    console.log(e);
    if (!e.target.value) return;
    if (parseTime(e.target.value) > 24 * 60) {
      setError("Time must be less than a day");
      return;
    }
    setConfigurations((prevValue) => {
      return { ...prevValue, time: parseTime(e.target.value) || 0 };
    });
  };

  const parseTime = (value: string) => {
    const parts = value.split(":");
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

  useEffect(
    () => setType(inputType === "json" ? "custom" : "exact"),
    [inputType]
  );
  return (
    <section className="flex flex-col gap-3 mt-2 w-full items-start justify-start text-text">
      {inputType !== "json" && (
        <div className="w-full flex gap-1">
          <label htmlFor="type" className="font-bold text-md ">
            Select Exam Output Type:
          </label>
          <select
            id="type"
            className="w-fit bg-primary p-2 rounded-md border focus-visible:outline-none text-text"
            onChange={handleExamType}
            defaultValue="exact"
          >
            <option value="exact"> Exact </option>
            <option value="partial"> Partial </option>
            <option value="custom"> Custom </option>
          </select>
        </div>
      )}
      <div
        className={
          (type !== "custom" ? "pointer-events-none opacity-40 " : "") +
          "flex flex-col gap-2"
        }
      >
        <h1 className="text-xl font-bold text-text">Custom Configuration</h1>
        {inputType !== "json" && (
          <>
            <div className="flex gap-2 justify-start items-center">
              <label
                htmlFor="typeconfig"
                className="font-bold text-md text-text"
              >
                Type of questions
              </label>
              <select
                id="typeconfig"
                className="w-fit bg-primary p-2 rounded-md border focus-visible:outline-none text-text"
                onChange={handleExamTypeConfig}
                defaultValue="exact"
              >
                <option value="exact"> Exact </option>
                <option value="harder"> Harder </option>
                <option value="easier"> Easier </option>
              </select>
            </div>
            <div className="flex gap-2 justify-start items-center">
              <label htmlFor="number" className="font-bold text-md text-text">
                Number of questions
              </label>
              <input
                onChange={handleQuestionNumber}
                type="number"
                id="number"
                inputMode="numeric"
                className="w-fit max-w-20 h-9 bg-primary p-2 rounded-md border focus-visible:outline-none text-text"
                placeholder="0"
              />
            </div>
          </>
        )}
        <div className="flex gap-2 justify-start items-center">
          <label htmlFor="time" className="font-bold text-md text-text">
            Time
          </label>
          <div className="flex justify-start items-center gap-2 bg-primary p-2 rounded-md border">
            <input
              onChange={handleTime}
              type="time"
              id="time"
              className="w-fit bg-transparent focus-visible:outline-none text-text"
              placeholder="0"
            />
            <p className="font-bold text-text">Hours</p>
          </div>
        </div>
        {error && <p className="text-red-700 font-bold">{error}</p>}
      </div>
      {inputType !== "json" && (
        <p className="text-sm text-text">
          {type === "exact"
            ? "Exact same questions in the input sample would be generated with same variable values and time limit (if not provided, AI generated)"
            : type === "partial"
            ? "Exact same questions in the input sample would be generated with different variable values but same time limit (if not provided, AI generated)"
            : "You are free to customize the type of examination you want"}
        </p>
      )}
    </section>
  );
}
