// Imports necessary modules for Google Generative AI
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Defines the schema for the exam response.
const schema = {
  type: SchemaType.OBJECT,
  properties: {
    time: {
      type: SchemaType.NUMBER,
      description: "timeframe in minutes",
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
    },
  },
  required: ["time", "data"],
};

const schemaAnswer = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      answer: {
        type: SchemaType.STRING,
        description: "answer to the question with thorough explanation",
        nullable: false,
      },
      questionsTopicAndBriefIntro: {
        type: SchemaType.STRING,
        description: "a brief but compactful intro to the topic in with the question is based on",
        nullable: false,
      },
    },
    required: ["answer", "questionsTopicAndBriefIntro"],
  },
};

interface InputType {
  input: string;
  configurations: {
    time: number;
    questions: number;
    type: "exact" | "partial" | "custom";
    typeconfig: "exact" | "harder" | "easier";
  };
}

interface OutputType {
  time: number;
  data: { question: string;answer: string } [] | [];
}

// Asynchronous function to generate exam from text using Google Gemini.
export async function GenerateExamForText(
  data: InputType
): Promise <OutputType> {
  // Creates a new Google Generative AI instance.
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  // Gets the Gemini 2.0 Flash Thinking model with specific generation configurations and system instructions.
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json", //Specifies the response type as JSON.
      responseSchema: schema, //Specifies the schema for the response.
    },
    systemInstruction: "You are to generate a set of questions with answers using the input file or image as a sample document. If not specified, assign a reasonable timeframe in which the user would be expected to finish the examination in minutes.", //Instruction for the model.
  });
  // Defines the prompt for generating exam.
  const prompt = `Using the input below as a sample, generate set of examination questions:\n${
    data.input
  }\nThe questions must be ${
    data.configurations.type === "exact"
      ? "exactly the same as the input sample with no variable changes"
      : data.configurations.type === "partial"
      ? "exactly the same as the input sample but with variables changed"
      : ""
  }${
    data.configurations.type === "custom"
      ? ""
      : `\nThe questions must be ${
          data.configurations.typeconfig === "exact"
            ? "exactly the same as the input sample"
            : data.configurations.typeconfig === "harder"
            ? "harder than the input sample"
            : "easier than the input sample"
        } Make sure the questions is exactly ${
          data.configurations.questions || 10
        } in numbers and its within the timeframe of ${
          data.configurations.time
        }`
  }`;
  
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
      data: [],
    };
  }
}

// Asynchronous function to generate exams from a file using Google Gemini.
export async function GenerateExamForFile(
  file: InputType
): Promise <OutputType> {
  // Creates a new Google Generative AI instance.
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  // Gets the Gemini 2.0 Flash Thinking model with specific generation configurations and system instructions.
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json", //Specifies the response type as JSON.
      responseSchema: schema, //Specifies the schema for the response.
    },
    systemInstruction: "You are to generate a set of questions with answers using the input file or image as a sample document. If not specified, assign a reasonable timeframe in which the user would be expected to finish the examination in minutes.", //Instruction for the model.
  });
  // Defines the prompt for generating exam from a file.
  const prompt = `Using the input file as a sample, generate set of examination questions.\nThe questions must be ${
    file.configurations.type === "exact"
      ? "exactly the same as the input sample with no variable changes"
      : file.configurations.type === "partial"
      ? "exactly the same as the input sample but with variables changed"
      : ""
  }${
    file.configurations.type === "custom"
      ? ""
      : `\nThe questions must be ${
          file.configurations.typeconfig === "exact"
            ? "exactly the same as the input sample"
            : file.configurations.typeconfig === "harder"
            ? "harder than the input sample"
            : "easier than the input sample"
        } Make sure the questions is exactly ${
          file.configurations.questions || 10
        } in numbers and its within the timeframe of ${
          file.configurations.time
        }`
  }.`;
  
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
      data: [],
    };
  }
}

// Asynchronous function to convert a file to a format suitable for Google Generative AI.
async function fileToGenerativePart(
  file: string
): Promise <{ inlineData: { data: string;mimeType: string } }> {
  // Converts the file to base64.
  const base64 = file;
  // Extracts the data and mime type from the base64 string.
  const data = base64.split(",")[1];
  const mimeType = base64.split(",")[0].split(";")[0].split(":")[1];
  // Returns an object containing the data and mime type.
  return {
    inlineData: {
      data,
      mimeType,
    },
  };
}

export async function AnalyseAnswer(
  data: { question: string, studentsAnswer: string } []
): Promise <{answer: string, questionsTopicAndBriefIntro: string}[]> {
  // Creates a new Google Generative AI instance.
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  // Gets the Gemini 2.0 Flash Thinking model with specific generation configurations and system instructions.
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json", //Specifies the response type as JSON.
      responseSchema: answerSchema, //Specifies the schema for the response.
    },
    systemInstruction: "You are to analyse the input which would be in the format\n {question: string, studentsAnswer: string}[] \n analyse each question and return an array of objects with answer and questionsTopicAndBriefIntro to rach question accordingly", //Instruction for the model.
  });
  // Defines the prompt for generating exam.
  const prompt = `Analyse this input: ${JSON.stringify(data)}`;
  
  try {
    // Generates exams from the given text using the model.
    const generatedContent = await model.generateContent(prompt);
    // Extracts the text from the response.
    const response = generatedContent.response.text() as string;
    // Returns the generated exams.
    return JSON.parse(response);
  } catch (e: any) {
    console.log(e); // Logs any errors that occur during exam generation.
    return [{ answer: "", questionsTopicAndBriefIntro: "" }];
  }
}