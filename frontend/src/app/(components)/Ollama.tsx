// import React, { useState, useEffect } from 'react';
// import { ChatOllama } from "@langchain/community/chat_models/ollama";
// import { ChatPromptTemplate } from "@langchain/core/prompts";

// function Translator() {
//   const [inputText, setInputText] = useState('');
//   const [language, setLanguage] = useState('German'); // Default language
//   const [translation, setTranslation] = useState(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false); // Track loading state
//   const [startTime, setStartTime] = useState(null); // Track start time for response calculation

//   const translate = async () => {
//     setIsLoading(true); // Set loading state to true
//     setStartTime(Date.now()); // Record start time
//     setError(null); // Clear previous error

//     if (!inputText || !language) {
//       setIsLoading(false);
//       return; // Don't send request if no input or language selected
//     }

//     try {
//       const prompt = ChatPromptTemplate.fromMessages([
//         [
//           "system",
//           `You are an expert translator. Format all responses as JSON objects with two keys: "original" and "translated".`,
//         ],
//         ["human", `Translate "${inputText}" into ${language}.`],
//       ]);

//       console.log("prompt",prompt)

//       const model = new ChatOllama({
//         baseUrl: "http://localhost:11434", // Update with your server URL if needed
//         model: "llama2",
//         format: "json",
//       });

//       console.log("model",model)

//       const chain = prompt.pipe(model);
//       const result = await chain.invoke({ input: inputText, language });

//       console.log("chain", chain)
//       console.log("result",result)
//       setTranslation(result.content);
//       setError(null);
//     } catch (err) {
//       setError('Error during translation.');
//       console.error(err);
//     } finally {
//       setIsLoading(false); // Set loading state to false regardless of success or error
//     }
//   };

// //   useEffect(() => {
// //     translate(); // Translate on component mount
// //   }, [inputText, language]); // Re-translate on input or language change

//   const handleInputChange = (event) => {
//     setInputText(event.target.value);
//   };

//   const handleLanguageChange = (event) => {
//     setLanguage(event.target.value);
//   };

//   const calculateResponseTime = () => {
//     if (!startTime || !translation) return null; // Don't calculate if no start time or translation
//     const endTime = Date.now();
//     const elapsedTime = (endTime - startTime) / 1000; // Time in seconds
//     return elapsedTime.toFixed(2) + ' seconds';
//   };

//   return (
//     <div>
//       <h1>Translator</h1>
//       <input type="text" value={inputText} onChange={handleInputChange} placeholder="Enter text to translate" />
//       <select value={language} onChange={handleLanguageChange}>
//         <option value="German">German</option>
//         <option value="Hindi">Hindi</option>
//         <option value="French">French</option>
//         <option value="Sanskrit">Sanskrit</option>
//         {/* Add more language options here */}
//       </select>
//       <button onClick={translate} disabled={isLoading}>
//         {isLoading ? 'Translating...' : 'Translate'}
//       </button>
//       {error && <p className="error">{error}</p>}
//       {translation && <p>Translation: {translation}</p>}
//       {translation && <p>Response Time: {calculateResponseTime()}</p>}
//     </div>
//   );
// }

// export default Translator;


import React, { useState, useEffect } from 'react';
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";

interface TranslationState {
  inputText: string;
  language: string;
  translation: any | null ; // check type
  error: string | null;
  isLoading: boolean ;
  startTime: number | null;
}

function Translator() {
  const [state, setState] = useState<TranslationState>({
    inputText: '',
    language: '10', //German
    translation: null,
    error: null,
    isLoading: false,
    startTime: null,
  });
  const [loading, setLoding] = useState(false);

  const translate = async () => {
    setState((prevState) => ({ ...prevState, isLoading: true, startTime: Date.now(), error: null }));

    if (!state.inputText || !state.language) {
      setState((prevState) => ({ ...prevState, isLoading: false }));
      return;
    }

    try {
      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          // `You are an expert translator. Format all responses as JSON objects with two keys: "original" and "translated".`,
          `You are an expert content writter . write informative information . Format all responses as JSON objects with two keys: "original" and "message" `,
        ],
        // 
        ["human", ` write a short note content message on "${state.inputText}" in ${state.language} words.`],
       
      ]);
      setLoding(true)
      console.log("prompt", prompt);

      const model = new ChatOllama({
        baseUrl: "http://localhost:11434", // Update with your server URL if needed
        model: "llama2",
        format: "json",
      });

      console.log("model", model);

      const chain = prompt.pipe(model);
      const result = await chain.invoke({ input: state.inputText, language: state.language });

      console.log("chain", chain);
      console.log("result", result);

      setState((prevState) => ({ ...prevState, translation: result.content, error: null }));
      setLoding(false)
    } catch (err) {
      setState((prevState) => ({ ...prevState, error: 'Error during translation.', isLoading: false }));
      console.error(err);
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  };

  // useEffect(() => {
  //   translate(); // Translate on component mount
  // }, [state.inputText, state.language]); // Re-translate on input or language change

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({ ...prevState, inputText: event.target.value }));
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setState((prevState) => ({ ...prevState, language: event.target.value }));
  };

  const calculateResponseTime = (): string | null => {
    if (!state.startTime || !state.translation) return null;
    const endTime = Date.now();
    const elapsedTime = (endTime - state.startTime) / 1000;
    return elapsedTime.toFixed(2) + ' seconds';
  };

  return (
    <div>
      <h1>Translator</h1>
      <input type="text" className='text-black' value={state.inputText} onChange={handleInputChange} placeholder="Enter text to translate" />
      {/* <select className='text-black' value={state.language} onChange={handleLanguageChange}>
        <option value="German">German</option>
        <option value="Hindi">Hindi</option>
        <option value="French">French</option>
        <option value="Sanskrit">Sanskrit</option>
      </select>  */}
      <select className='text-black' value={state.language} onChange={handleLanguageChange}>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="50">50</option>
        {/* Add more language options here */}
      </select>
      <button  onClick={translate} disabled={state.isLoading}>
        {state.isLoading ? 'Translating...' : 'Translate'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      {state.translation && <p>Translation: {state.translation}</p>}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        state.translation && (
          <ul className="response-list">
            {state.translation.split("\n").map((item:string, index:number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )
      )}
      {state.translation && <p>Response Time: {calculateResponseTime()}</p>}
    </div>
  );
}

export default Translator;
