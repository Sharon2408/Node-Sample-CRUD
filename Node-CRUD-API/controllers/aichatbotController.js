const { saveMessage, getChatHistory } = require('../models/aichatbotModel');
const axios = require('axios');
const COHERE_API_KEY = process.env.COHERE_API_KEY;


exports.getChatHistory = async (req, res) => {
  const { id: userId } = req.params;

  try {
    const history = await getChatHistory(userId);
    res.json({ history });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

exports.aichat = async (req, res) => {
  const { message, userId } = req.body;


  if (!message || !userId) {
    return res.status(400).json({ error: 'Message and userId are required.' });
  }

  try {

    const rawHistory = await getChatHistory(userId);
    const conversationHistory = Array.isArray(rawHistory)
      ? rawHistory.filter((msg) => msg.role === 'user' && msg.message && msg.message.trim() !== '')
      : [];

    const messages = [
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.message,
      })),
      { role: 'user', content: message },
    ];

    const response = await axios.post(
      'https://api.cohere.com/v2/chat',
      {
        model: 'command-r',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.message.content[0].text;

    await saveMessage(userId, 'user', message);
    await saveMessage(userId, 'ai', aiResponse);

    res.status(200).json({ message: aiResponse });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error generating response' });
  }
};
