import React, { useState, JSX, Dispatch, SetStateAction } from "react";

interface CustomConfigurationProps{
  setConfigurations: Dispatch<SetStateAction<{
    time: number,
    questions: number,
    disabled: boolean
  }>>
}
export function CustomConfiguration({ setConfigurations }: CustomConfigurationProps ): JSX.Element{
  const [ disabled, setDisabled ] = useState<boolean>(true);
  
  const handleQuestionNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.value) return;
    
    setConfigurations(prevValue => {
      return {...prevValue,
      disabled,
      questions: parseInt(e.target.value) || 0}
    });
  }
  
  const handleTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.value) return;
    
    setConfigurations(prevValue => {
      return {...prevValue,
      disabled,
      time: parseInt(e.target.value) || 0}
    });
  }
  return(
    <section className="flex flex-col gap-3 mt-2 w-full items-start justify-start">
      <div className="flex gap-2">
        <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisabled(e.target.checked)} type="checkbox" className="check-box" id="checkbox" defaultChecked/>
        <label htmlFor="checkbox" className="font-bold text-sm text-text">Use AI configuration</label>
      </div>
      <div className={(disabled ? "pointer-events-none opacity-40 " : "") + "flex flex-col gap-2"}>
        <h1 className="text-xl font-bold text-text">Custom Configuration</h1>
        <div className="flex gap-2 justify-start items-center">
          <label htmlFor="number" className="font-bold text-md text-text">Number of questions</label>
          <input onChange={handleQuestionNumber} type="number" id="number" inputMode="numeric" className="w-10 h-9 bg-primary p-2 rounded-md border focus-visible:outline-none text-text" placeholder="0"/>
        </div>
        <div className="flex gap-2 justify-start items-center">
          <label htmlFor="time" className="font-bold text-md text-text">Time</label>
          <div className="flex justify-start items-center gap-2 bg-primary p-2 rounded-md border">
            <input onChange={handleTime} type="number" id="time" inputMode="numeric" className="w-10 bg-transparent focus-visible:outline-none text-text" placeholder="0"/>
            <p className="font-bold text-text">mins</p>
          </div>
        </div>
      </div>
    </section>
  )
}