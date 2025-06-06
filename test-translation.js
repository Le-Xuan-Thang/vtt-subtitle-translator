// Simple test script to verify Gemini API integration
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  console.log('Testing Gemini API integration...');
  
  // Replace with your actual API key
  const API_KEY = 'YOUR_API_KEY_HERE';
  
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    console.log('❌ Please add your Gemini API key to test the integration');
    console.log('Get your API key from: https://aistudio.google.com/app/apikey');
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Test available models
    const models = [
      'gemini-2.0-flash-exp',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b'
    ];
    
    for (const modelName of models) {
      try {
        console.log(`\nTesting model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = 'Translate this English text to Spanish: "Hello, how are you?"';
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName}: ${text.trim()}`);
      } catch (error) {
        console.log(`❌ ${modelName}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
  }
}

// Run the test
testGeminiAPI();
