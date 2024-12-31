// Imports necessary modules for Google Generative AI
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Defines the schema for the exam response.
const schema = {
  type: SchemaType.OBJECT,
  properties: {
    time: {
      type: SchemaType.NUMBER,
      description: "time",
    },
    data: {
      description: "data",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: {
            type: SchemaType.STRING,
            description: "question",
            nullable: false,
          },
          answer: {
            type: SchemaType.STRING,
            description: "answer",
            nullable: false,
          },
        },
        required: ["question", "answer"],
      },
    }
  },
  required: ["time", "data"],
}

interface InputType {
  input: string,
  configurations: {
    disabled: boolean,
    time: number,
    questions: number
  }
}

interface OutputType {
  time: number,
  data: { question: string, answer: string } [] | []
}

// Asynchronous function to generate exam from text using Google Gemini.
export async function GenerateExamForText(data: InputType): Promise<OutputType> {
  // Creates a new Google Generative AI instance.
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  // Gets the Gemini 2.0 Flash Thinking model with specific generation configurations and system instructions.
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json", //Specifies the response type as JSON.
      responseSchema: schema, //Specifies the schema for the response.
    },
    systemInstruction: "You are an expert at generating examination questions from sample questions and also giving answers to each question while assigning a total time frame in minutes expected for the student to complete the exam", //Instruction for the model.
  });
  // Defines the prompt for generating exam.
  const prompt = `Using the input below as a sample, generate a new set of examination questions:\n${data.input}${data.configurations.disabled ? "": `\nmake sure the questions is exactly ${data.configurations.questions || 10} in numbers and its within the timeframe of ${data.configurations.time}`}\nDo not generate same questions as given in the sample data just generate similar questions`;

  try {
    // Generates exams from the given text using the model.
    const generatedContent = await model.generateContent(prompt);
    // Extracts the text from the response.
    const response = generatedContent.response.text() as string;
    // Returns the generated exams.
    return JSON.parse(response);
  } catch (e: any) {
    console.log(e); // Logs any errors that occur during exam generation.
    return {
      time: 0,
      data: []
    };
  }
}

// Asynchronous function to generate exams from a file using Google Gemini.
export async function GenerateExamForFile(file: InputType): Promise<OutputType> {
  // Creates a new Google Generative AI instance.
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  // Gets the Gemini 2.0 Flash Thinking model with specific generation configurations and system instructions.
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json", //Specifies the response type as JSON.
      responseSchema: schema, //Specifies the schema for the response.
    },
    systemInstruction: "You are an expert at generating new examination questions from sample question and also giving answers to each question while assigning a total time frame in minutes expected for the student to complete the exam", //Instruction for the model.
  });
  // Defines the prompt for generating exam from a file.
  const prompt = `Using the input file as a sample, generate a new set of examination questions.\n${file.configurations.disabled ? "": `\nmake sure the questions is exactly ${file.configurations.questions || 10} in numbers and its within the timeframe of ${file.configurations.time}`}\nDo not generate same questions as given in the sample data just generate similar questions`;

  try {
    // Converts the file to the required format.
    const filePart = await fileToGenerativePart(file.input);
    // Generates exams from the file data and prompt using the model.
    const generatedContent = await model.generateContent([filePart, prompt]);
    // Extracts the text from the response.
    const response = generatedContent.response.text() as string;
    return JSON.parse(response); // Returns the generated exams.
  } catch (e: any) {
    console.log(e.message); // Logs any errors that occur during exam generation.
    return {
      time: 0,
      data: []
    };
  }
}

// Asynchronous function to convert a file to a format suitable for Google Generative AI.
async function fileToGenerativePart(file: string): Promise<{inlineData: { data: string, mimeType: string }}> {
  // Converts the file to base64.
  const base64 = file;
  // Extracts the data and mime type from the base64 string.
  const data = base64.split(",")[1];
  const mimeType = base64.split(",")[0].split(";")[0].split(":")[1];
  // Returns an object containing the data and mime type.
  return {
    inlineData: {
      data,
      mimeType
    },
  };
}