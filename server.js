const OpenAI = require('openai');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000; // Use the dynamic port provided by Heroku, or 8000 as a fallback

// Set up your OpenAI API key
const openaiApiKey = process.env.OPENAI_API_KEY;

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
    // Trim the input to remove leading/trailing spaces or hidden characters
    input = input.trim();

    const prompt = `Generate T-shirt keywords related to: ${input}. Include synonyms and variations for ${input}. Make sure the keywords related to "${input}" are listed first, and separate each keyword by a comma with no spaces. These are search keywords, so pretend that you are a user looking for a T-shirt design when generating the keywords - do the keyword only (do not specifically write t-shirt, hat, shirt, etc. unless it is used in ${input}). If the ${input} includes a number, start the list with that number. Uncommon words like 'Rendezvous' should not be used in the response.`;

    const params = {
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
    };

    const completion = await openai.chat.completions.create(params);
    let responseText = completion.choices[0].message.content;

    // Remove unwanted characters
    responseText = responseText.replace(/[^a-zA-Z\s,]/g, '');

    // Split the response into individual keywords
    const keywords = responseText.split(',').map(keyword => keyword.trim());

    // If the input contains a number, insert it at the beginning
    if (/^\d+$/.test(input)) {
      keywords.unshift(input);
    } else {
      // If there's no number in the input, return it as the first keyword
      keywords.unshift(input);
    }

    // Remove any empty strings from the keywords list
    const filteredKeywords = keywords.filter(keyword => keyword !== '');

    // Join keywords with commas on a single line
    return filteredKeywords.join(',');
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
