import React, { useState, JSX, Dispatch, SetStateAction } from "react";

interface CustomConfigurationProps{
  setConfigurations: Dispatch<SetStateAction<{
    time: number,
    questions: number
  }>>
}
export function CustomConfiguration({ setConfigurations }: CustomConfigurationProps ): JSX.Element{
  const [ disabled, setDisabled ] = useState<boolean>(true);
  
  const handleQuestionNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.value) return;
    
    setConfigurations(prevValue => {
      return {...prevValue,
      questions: parseInt(e.target.value) || 0}
    });
  }
  
  const handleTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.value) return;
    
    setConfigurations(prevValue => {
      return {...prevValue,
      time: parseInt(e.target.value) || 0}
    });
  }
  return(
    <section className="flex flex-col gap-3 mt-2">
      <div className="flex gap-2">
        <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisabled(!e.target.checked)} type="checkbox" className="check-box" id="checkbox"/>
        <label htmlFor="checkbox" className="font-bold text-sm text-text">Use AI configuration</label>
      </div>
      <div className={(disabled ? "pointer-events-none opacity-50 " : "") + "flex flex-col gap-2"}>
        <h1 className="text-xl font-bold">Custom Configuration</h1>
        <div className="flex gap-2">
          <label htmlFor="number" className="font-bold text-sm text-text">Number of questions</label>
          <input onChange={handleQuestionNumber} type="number" input-mode="numeric" className="w-12 h-9 bg-primary p-2 rounded-md border focus-visible:outline-none" placeholder="0"/>
        </div>
        <div className="flex gap-2">
          <label htmlFor="time" className="font-bold text-sm text-text">Time</label>
          <div className="flex gap-2 w-fit h-fit bg-primary p-2 rounded-md border">
            <input onChange={handleTime} type="time" input-mode="numeric" className="w-12 h-9 bg-transparent focus-visible:outline-none" placeholder="0"/>
            <p className="font-bold">mins</p>
          </div>
        </div>
      </div>
    </section>
  )
}