export const tutorAgent = async (input: string): Promise<string> => {
  const prompt = `
Please explain the following concept in simple, concise, and easy-to-understand terms for a beginner:
Question/Topic: "${input}"
Provide a clear explanation with minimal detail. Do not include any undefined values or empty lines in the response.
Do not refer to yourself as a tutor or mention that you're an assistant.
`;

  // Send request to Flask server running on port 5004
  const response = await fetch("http://localhost:5004/tutor", {
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
    return cleanedResponse.replace(/\bundefined\b/g, '').trim() || "❌ Tutor could not generate a response.";
  } else {
    return "❌ Tutor could not generate a response.";
  }
};