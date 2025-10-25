// Configuration file for Document Knowledge Graph Analyzer
//
// SETUP INSTRUCTIONS:
// 1. Copy this file and rename it to 'config.js'
// 2. Replace 'your-openai-api-key-here' with your actual OpenAI API key
// 3. Get your API key from: https://platform.openai.com/api-keys
//
// SECURITY NOTE:
// Never commit config.js with your actual API key to a public repository!
// The .gitignore file is set up to exclude config.js

window.CONFIG = {
  // Your OpenAI API key
  // Get one at: https://platform.openai.com/api-keys
  OPENAI_API_KEY: "your-openai-api-key-here",

  // Optional: API configuration
  // Uncomment and modify if needed
  /*
  OPENAI_MODEL: 'gpt-4o-mini',
  OPENAI_EMBEDDING_MODEL: 'text-embedding-3-small',
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
  */
};
