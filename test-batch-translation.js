// Test script for batch translation
// This tests the new single-request batch translation functionality

const { TranslationService } = require('./src/lib/translation-service');

// Mock test data
const testTexts = [
  "Hello, welcome to our service!",
  "Please wait while we process your request.",
  "Thank you for your patience.",
  "Your order has been completed successfully.",
  "Have a great day!"
];

const testConfig = {
  provider: 'gemini',
  apiKey: 'YOUR_API_KEY_HERE', // Replace with actual API key for testing
  model: 'gemini-1.5-flash',
  translationStyle: 'subtitle'
};

async function testBatchTranslation() {
  console.log('🧪 Testing Batch Translation...\n');
  
  if (testConfig.apiKey === 'YOUR_API_KEY_HERE') {
    console.log('❌ Please set your actual API key in the test config');
    return;
  }
  
  try {
    const service = new TranslationService(testConfig);
    
    console.log('📝 Original texts:');
    testTexts.forEach((text, index) => {
      console.log(`${index + 1}. "${text}"`);
    });
    
    console.log('\n🔄 Translating all texts in one request...');
    
    const startTime = Date.now();
    const translatedTexts = await service.translateBatch(
      testTexts,
      'English',
      'Vietnamese',
      (completed, total) => {
        console.log(`Progress: ${completed}/${total}`);
      }
    );
    const endTime = Date.now();
    
    console.log('\n✅ Translation completed!');
    console.log(`⏱️  Time taken: ${endTime - startTime}ms`);
    console.log('\n📄 Translated texts:');
    
    translatedTexts.forEach((text, index) => {
      console.log(`${index + 1}. "${text}"`);
    });
    
    console.log('\n🎉 Batch translation test completed successfully!');
    console.log(`📊 Processed ${testTexts.length} subtitles in 1 API request`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testBatchTranslation();
}

module.exports = { testBatchTranslation };
