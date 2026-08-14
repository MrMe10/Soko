/**
 * aiRoutes.js
 * -----------
 * Express route handlers for AI prompt generation & internal Gemini API integration.
 */

const express = require('express');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');
const router = express.Router();
const { generateProjectPrompt, generateFallbackRoadmap } = require('../utils/aiPromptTemplate');

// POST: /api/ai/prompt - Generate compiled prompt template string
router.post('/prompt', (req, res) => {
  try {
    const { name, description, type, assignedTechs } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const compiledPrompt = generateProjectPrompt({
      name: name.trim(),
      description: description ? description.trim() : '',
      type: type || 'separate',
      assignedTechs: assignedTechs || {}
    });

    res.json({
      success: true,
      projectName: name,
      type: type || 'separate',
      prompt: compiledPrompt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate AI prompt', error: error.message });
  }
});

// POST: /api/ai/generate - Send prompt internally to Gemini API and return generated answer
router.post('/generate', async (req, res) => {
  try {
    // Dynamically reload .env.local on each request so user API key updates apply instantly
    dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

    const { name, description, type, assignedTechs } = req.body;

    const projectName = name && name.trim() ? name.trim() : 'Decoupled Storehouse';
    const projectDesc = description ? description.trim() : '';
    const projType = type || 'separate';
    const techs = assignedTechs || {};

    const compiledPrompt = generateProjectPrompt({
      name: projectName,
      description: projectDesc,
      type: projType,
      assignedTechs: techs
    });

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim()) {
      // Priority model list for Google Gemini API
      const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];

      for (const model of candidateModels) {
        try {
          console.log(`🤖 Requesting live AI roadmap from Gemini API (${model}) for "${projectName}"...`);
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

          const geminiRes = await axios.post(
            geminiUrl,
            {
              contents: [
                {
                  parts: [{ text: compiledPrompt }]
                }
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 3000
              }
            },
            {
              headers: { 'Content-Type': 'application/json' },
              timeout: 25000
            }
          );

          const candidateText = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (candidateText) {
            console.log(`✅ Live Gemini AI response received successfully using model ${model}!`);
            return res.json({
              success: true,
              source: `Gemini API (${model})`,
              projectName,
              roadmap: candidateText
            });
          }
        } catch (geminiErr) {
          const errMsg = geminiErr.response?.data?.error?.message || geminiErr.message;
          console.warn(`⚠️ Model ${model} failed (${errMsg}). Trying next candidate model...`);
        }
      }
    } else {
      console.log('ℹ️ GEMINI_API_KEY not found in .env.local. Using internal architecture engine...');
    }

    // Synthesized response fallback when GEMINI_API_KEY is not set or API fails
    const synthesizedRoadmap = generateFallbackRoadmap({
      name: projectName,
      description: projectDesc,
      type: projType,
      assignedTechs: techs
    });

    return res.json({
      success: true,
      source: 'Soko AI Architecture Engine',
      projectName,
      roadmap: synthesizedRoadmap
    });

  } catch (error) {
    console.error('❌ Error generating AI roadmap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI setup roadmap',
      error: error.message
    });
  }
});

module.exports = router;
