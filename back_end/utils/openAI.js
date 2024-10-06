
async function getAIQuiz( req, quizName ) {
    const openai = req.app.get('openai');

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
              role: "user",
              content: `
              Give me an array of 10 quiz questions about ${quizName} in the following format :-
              [ { questionText: '//Question goes here', options: ['opt-1', 'opt-2', 'correctoption', 'opt-4'], correctAnswer: 2//index of correct asnwer in answer, points: 10//based on difficulty}, //More questions],
              return only the array in JSON format ONLY.
              Note: If the topic doesnt make sense return an empty array.
              `
          },
      ],
  });
  
  const r = completion.choices[0].message;
  return r;
}

module.exports = { getAIQuiz };