from flask import Flask, request, jsonify
from groq import Groq  # Assuming you installed 'groq' package
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Set your Groq API key (use env var or hardcode temporarily for testing)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "your-groq-api-key")

client = Groq(api_key=GROQ_API_KEY)

@app.route('/tutor', methods=['POST'])
def tutor_agent():
    data = request.get_json()
    input_text = data.get('input', '')

    prompt = f"""
Please explain the following concept in simple, concise, and easy-to-understand terms for a beginner:
Question/Topic: "{input_text}"
Keep the explanation brief and avoid excessive details.
Do not refer to yourself as an AI tutor or mention that you're an assistant.
"""

    # Use the Compound Beta model
    completion = client.chat.completions.create(
        model="compound-beta",  # Using the Compound Beta model
        messages=[
            {"role": "system", "content": "You are a helpful and friendly tutor."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
    )

    output = completion.choices[0].message.content if completion.choices else None
    if output is None or output == "❌ Tutor could not generate a response.":
        output = "❌ Tutor could not generate a response."

    # Replace any instances of "content" with <b>content</b>
    output = output.replace("content", "<b>content</b>")

    # Remove the word 'undefined' from the response
    output = ' '.join([word for word in output.split() if word != 'undefined'])

    return jsonify({"response": output})

@app.route('/evaluator', methods=['POST'])
def evaluator_agent():
    data = request.get_json()
    input_text = data.get('input', '')

    prompt = f"""
Please evaluate the following submission based on its quality and clarity:
Submission: "{input_text}"
Provide a brief evaluation and assign a grade (A, B, C, D, F) at the end.
Do not refer to yourself as an AI evaluator or assistant.
"""

    # Use the Compound Beta model
    completion = client.chat.completions.create(
        model="compound-beta",  # Using the Compound Beta model
        messages=[
            {"role": "system", "content": "You are a strict evaluator for student submissions."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
    )

    output = completion.choices[0].message.content if completion.choices else None
    if output is None or output == "❌ Evaluator could not generate a response.":
        output = "❌ Evaluator could not generate a response."

    # Replace any instances of "content" with <b>content</b>
    output = output.replace("content", "<b>content</b>")

    # Remove the word 'undefined' from the response
    output = ' '.join([word for word in output.split() if word != 'undefined'])

    return jsonify({"response": output})

if __name__ == "__main__":
    app.run(port=5004, debug=True)
