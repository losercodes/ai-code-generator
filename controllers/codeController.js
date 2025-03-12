// File: controllers/codeController.js
const axios = require('axios');

// @desc    Generate code from prompt
// @route   POST /api/generate-code
// @access  Public
exports.generateCode = async (req, res, next) => {
  try {
    const { 
      prompt, 
      language = 'javascript', 
      framework = 'react', 
      temperature = 0.2,
      model = 'llama3-70b-8192'
    } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        error: 'Prompt is required' 
      });
    }

    // Create a complete prompt with formatting instructions based on language/framework
    let systemPrompt = 'You are an expert programmer that writes clean, efficient, and well-documented code.';
    
    // Add specific instructions based on language and framework
    if (language === 'typescript') {
      systemPrompt += ' You write TypeScript code with proper type annotations and interfaces.';
    }
    
    if (framework === 'react') {
      systemPrompt += ' You create React components following best practices, with proper hooks usage and component structure.';
    } else if (framework === 'vue') {
      systemPrompt += ' You create Vue.js components with proper structure, lifecycle hooks, and Vue best practices.';
    } else if (framework === 'angular') {
      systemPrompt += ' You create Angular components with proper decorators, dependency injection, and Angular best practices.';
    }

    const completePrompt = `
      Generate code for a ${framework} ${language === 'typescript' ? 'TypeScript' : 'JavaScript'} component based on this description:
      
      ${prompt}
      
      Please provide clean, well-formatted, and commented code that follows best practices.
      Include imports, exports, and any necessary TypeScript interfaces or types.
      Only return the code without any additional explanations.
    `;

    // Call GROQ API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: completePrompt }
        ],
        temperature: parseFloat(temperature),
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract code from response
    const generatedCode = response.data.choices[0].message.content.trim();
    
    // Extract only the code if it's wrapped in markdown code blocks
    let cleanCode = generatedCode;
    const codeBlockRegex = /```(?:javascript|typescript|jsx|tsx|js|ts)?\n([\s\S]*?)```/;
    const match = generatedCode.match(codeBlockRegex);
    if (match && match[1]) {
      cleanCode = match[1].trim();
    }

    res.json({
      success: true,
      data: {
        code: cleanCode,
        language,
        framework,
        model,
        prompt
      }
    });
  } catch (error) {
    console.error('Error generating code:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        error: 'API key is invalid or missing'
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      });
    }
    
    next(error);
  }
};

// @desc    Get available models
// @route   GET /api/models
// @access  Public
exports.getModels = async (req, res, next) => {
  try {
    // These are the models supported by GROQ at the time of development
    // In a production app, you might want to fetch this dynamically from GROQ API
    const models = [
      { id: 'llama3-70b-8192', name: 'LLaMA-3 70B', description: 'Best for code generation with complex requirements' },
      { id: 'llama3-8b-8192', name: 'LLaMA-3 8B', description: 'Faster response, good for simpler code snippets' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Good balance of quality and speed' }
    ];
    
    res.json({
      success: true,
      data: models
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available languages and frameworks
// @route   GET /api/languages-frameworks
// @access  Public
exports.getLanguagesAndFrameworks = async (req, res) => {
  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' }
  ];
  
  const frameworks = [
    { id: 'react', name: 'React', languages: ['javascript', 'typescript'] },
    { id: 'vue', name: 'Vue.js', languages: ['javascript', 'typescript'] },
    { id: 'angular', name: 'Angular', languages: ['typescript'] },
    { id: 'svelte', name: 'Svelte', languages: ['javascript', 'typescript'] },
    { id: 'node', name: 'Node.js (Express)', languages: ['javascript', 'typescript'] }
  ];
  
  res.json({
    success: true,
    data: {
      languages,
      frameworks
    }
  });
};