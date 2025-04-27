export const evaluatorAgent = async (input: string): Promise<string> => {
  const prompt = `
Please evaluate the following submission based on its quality and clarity:
Submission: "${input}"
Provide a brief evaluation and assign a grade (A, B, C, D, F) at the end.
Keep the response brief and avoid excessive details.
Do not include any undefined values or empty lines in the response.
Do not refer to yourself as an evaluator or assistant.
`;

  // Send request to Flask server running on port 5004
  const response = await fetch("http://localhost:5004/evaluator", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
  });

  const result = await response.json();
  
  // Ensure the response exists and is not undefined or empty
  if (result.response) {
    // Remove undefined or any unwanted empty lines from the response
    const cleanedResponse = result.response.split('\n')
      .filter((line: string | undefined) => line !== undefined && line.trim() !== '')
      .join('\n')
      .trim();

    // Remove the word 'undefined' from the response
    return cleanedResponse.replace(/\bundefined\b/g, '').trim() || "❌ Evaluator could not generate a response.";
  } else {
    return "❌ Evaluator could not generate a response.";
  }
};