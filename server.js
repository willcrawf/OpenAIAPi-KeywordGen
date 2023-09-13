const OpenAI = require('openai');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 8000;

// Set up your OpenAI API key
const openaiApiKey = process.env.OPENAI_API_KEY; // Replace with your actual OpenAI API key

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

// Initialize Express middleware
app.use(bodyParser.json());

// Serve static files (including index.html)
app.use(express.static(__dirname));

// T-shirt keyword generator function
async function generateKeywords(input) {
  try {
    const prompt = `Generate T-shirt keywords related to: ${input}. Provide generic keywords - make the keywords individual words only. Seperate each keyword by a comma, do not use numbers`;

    const params = {
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    };

    const completion = await openai.chat.completions.create(params);
    let responseText = completion.choices[0].message.content;

    // Remove unwanted characters and numbers
    responseText = responseText.replace(/\d+\.\s+/g, ''); // Remove numbers and periods
    responseText = responseText.replace(/-/g, ','); // Replace hyphens with commas
    responseText = responseText.replace(/\s+/g, ''); // Remove spaces

    // Split the response into individual keywords
    const keywords = responseText.split(',').map(keyword => keyword.trim());

    // Join keywords with commas on a single line
    return keywords.join(', ');
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
}




// Endpoint for generating T-shirt keywords
app.get('/generateKeywords', async (req, res) => {
  try {
    const inputKeywords = req.query.keywords;
    const keywords = await generateKeywords(inputKeywords);

    res.type('text/plain').send(keywords);
    } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
