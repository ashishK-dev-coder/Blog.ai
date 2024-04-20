import React, { useState, useEffect } from 'react';
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import DebouncedInput from 'react-debounce-input'; // Install react-debounce-input

function SuggestionBox(type) {
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestion = async () => {
    if (!input) return;
    setIsLoading(true);

    const promptTemplate = type === 'code' ?
      "Given the following code snippet, suggest the most likely continuation of the code." :
      "Given the following text, continue the text in a grammatically correct and consistent style.";

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        promptTemplate
      ],
      ["human", input],
    ]);

    const model = new ChatOllama({
      baseUrl: "http://localhost:11434",
      model: "llama2",
      format: "json",
    });

    const chain = prompt.pipe(model);
    const result = await chain.invoke({ input });

    setSuggestion(result.translated);
    console.log(result)
    setIsLoading(false);
  };

  useEffect(() => {
    generateSuggestion();
  }, [input]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  console.log(suggestion)

  return (
    <div>
      {isLoading ? (
        <p>Generating suggestion...</p>
      ) : (
        <>
          <DebouncedInput
            type="text"
            value={input}
            onChange={handleInputChange}
            debounceTimeout={300} // Adjust delay as needed
            placeholder={type === 'code' ? 'Enter code snippet' : 'Enter text'}
          />
          {suggestion && (
            <p>Suggestion: {suggestion}</p>
          )}
        </>
      )}
    </div>
  );
}

export default SuggestionBox;
