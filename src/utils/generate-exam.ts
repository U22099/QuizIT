// Imports necessary modules for Google Generative AI
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Defines the schema for the exam response.
const schema = {
  type: SchemaType.OBJECT,
  properties: {
    time: {
      type: SchemaType.NUMBER,
      description:
        "timeframe in which user is expected to finish the questions in minutes",
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
            description: "answer to the question asked",
            nullable: false,
          },
          options: {
            type: SchemaType.ARRAY,
            description:
              "Plausible array of three other options including the answer making four",
            items: { type: SchemaType.STRING },
          },
        },
        required: ["question", "answer", "options"],
      },
    },
  },
  required: ["time", "data"],
};

const answerSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      answer: {
        type: SchemaType.STRING,
        description: "answer to the question with thorough explanation",
        nullable: false,
      },
      topicExp: {
        type: SchemaType.STRING,
        description:
          "a detailed explanation of the topic to which the question is based",
        nullable: false,
      },
    },
    required: ["answer", "topicExp"],
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
  data: { question: string; answer: string }[] | [];
}

// Asynchronous function to generate exam from text using Google Gemini.
export async function GenerateExamForText(
  data: InputType
): Promise<OutputType> {
  // Creates a new Google Generative AI instance.
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  // Gets the Gemini 2.0 Flash Thinking model with specific generation configurations and system instructions.
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json", //Specifies the response type as JSON.
      responseSchema: schema, //Specifies the schema for the response.
    },
    systemInstruction:
      "Generate a quiz based on the provided text (topic, article, etc.). The output should be a JSON object with two properties: time (estimated quiz completion time in minutes) and data (an array of question objects). Each question object should have a question (string), answer (string), and options (an array of four strings: three plausible distractors and the correct answer, randomly ordered). If a timeframe isn’t specified, estimate a reasonable one.", //Instruction for the model.
  });
  // Defines the prompt for generating exam.
  const prompt = `Create a quiz based on the following input: ${data.input}. Each question should have a question, the correct answer, and four multiple-choice options (one correct, three plausible distractors, randomly ordered).
  Question Type:

  ${data.configurations.type === "exact" ? "Exact Match: Questions should be identical to the input text." : data.configurations.type === "partial" ? "Partial Variation: Questions should be similar to the input text, but with variable changes (e.g., '3x' becomes '6x')." : ""}

  Custom Configuration (if applicable):

  ${data.configurations.type !== "custom" ? "" : `Difficulty: ${data.configurations.typeconfig === "exact" ? "Exact Match" : data.configurations.typeconfig === "harder" ? "Harder" : "Easier"} than the input text. Number of Questions: ${data.configurations.questions || 10}. Time Limit: ${data.configurations.time} minutes.}`}
  In Summary: Generate multiple-choice questions from the provided text. The difficulty and format of the questions depend on the configuration settings (exact match, partial variation, or custom). If using a custom configuration, adhere to the specified difficulty, number of questions, and time limit`;

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
): Promise<OutputType> {
  // Creates a new Google Generative AI instance.
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  // Gets the Gemini 2.0 Flash Thinking model with specific generation configurations and system instructions.
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json", //Specifies the response type as JSON.
      responseSchema: schema, //Specifies the schema for the response.
    },
    systemInstruction:
      "Create a quiz based on the content of the provided file or image. The quiz should be a JSON object with two properties: time (estimated completion time in minutes) and data (an array of question objects)Each question object should have a question (string), answer (string), and options (an array of four strings: three plausible distractors and the correct answer, randomly ordered). If a specific time is not provided, estimate a reasonable completion time for the quiz", //Instruction for the model.
  });
  // Defines the prompt for generating exam from a file.
  const prompt = `Create a multiple-choice quiz from the provided file. Each question should have a question, the correct answer, and four options (one correct, three plausible distractors, randomly ordered).

  Question Style:

  ${file.configurations.type === "exact" ? "Exact Match: Questions must be identical to the source material in the file." : file.configurations.type === "partial" ? "Partial Variation: Questions must be similar to the source, but with variables changed (e.g., '3x' becomes '6x')." : ""}

  Custom Configuration (if applicable):

  ${file.configurations.type !== "custom" ? "" : `Difficulty: ${file.configurations.typeconfig === "exact" ? "Exact Match" : file.configurations.typeconfig === "harder" ? "Harder" : "Easier"} than the original content. Number of Questions: ${file.configurations.questions || 10}. Time Limit: ${file.configurations.time} minutes.}`}
  Summary: Generate multiple-choice questions based on the file content. The difficulty and format of the questions depend on the file.configurations settings (exact match, partial variation, or custom). If using a custom configuration, adhere to the specified difficulty level, number of questions, and time limit.`;

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
): Promise<{ inlineData: { data: string; mimeType: string } }> {
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
  data: { question: string; studentsAnswer: string; questionsOptions: string[] }[]
): Promise<{ answer: string; topicExp: string }[] | []> {
  // Creates a new Google Generative AI instance.
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  // Gets the Gemini 2.0 Flash Thinking model with specific generation configurations and system instructions.
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json", //Specifies the response type as JSON.
      responseSchema: answerSchema, //Specifies the schema for the response.
    },
    systemInstruction:
      `Analyze an array of student responses, where each response is an object with the following format: {question: string, studentsAnswer: string, questionsOptions?: string[]}.

      For each question, return an array of objects. Each object should contain:

      answer: The correct answer to the question.
      studentsMistakes: A clear explanation of the student’s error.
      topicExp: A concise explanation of the underlying topic, providing relevant knowledge related to the question.
      The overall goal is to provide a detailed analysis of each student’s answer, highlighting errors and offering relevant background information.`, //Instruction for the model.
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
    return [];
  }
}
