import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { categorizeError, ErrorCategory } from '@/lib/errorUtils';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// The main API route handler
export async function POST(request: Request) {
  try {
    // Parse the request body
    const { image, prompt, settings } = await request.json();

    // Validation checks
    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: 'No image provided',
          errorCategory: ErrorCategory.VALIDATION
        },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          error: 'No prompt provided',
          errorCategory: ErrorCategory.VALIDATION
        },
        { status: 400 }
      );
    }

    // Check for valid API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing API key configuration',
          errorCategory: ErrorCategory.PERMISSION,
          suggestions: ['Configure the GEMINI_API_KEY environment variable']
        },
        { status: 500 }
      );
    }

    // For development/testing phase, just return the original image
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_API === 'true') {
      // Add artificial delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate random errors for testing (5% chance)
      if (Math.random() < 0.05) {
        const errorTypes = [
          'Network error: Connection timeout',
          'Rate limit exceeded. Please try again later.',
          'Content policy violation detected',
          'Model not available in your region',
        ];
        const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];

        throw new Error(randomError);
      }

      return NextResponse.json({
        success: true,
        image: image,
        message: "Mock API mode is enabled. Using original image as placeholder for generated content.",
        settings
      });
    }

    // Extract base64 data and sanitize
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    const imageType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

    try {
      // Initialize model with updated approach
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
          responseModalities: ['Text', 'Image']
        },
      });

      // Prepare the content parts - FIXED to match expected format
      const contents = [
        { text: prompt },  // Using the actual prompt instead of undefined enhancedPrompt
        {
          inlineData: {
            mimeType: imageType,
            data: base64Image
          }
        }
      ];

      // Set timeout to avoid hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out after 45 seconds')), 45000);
      });

      // Race the API call against the timeout
      const responseResult = await Promise.race([
        model.generateContent(contents),
        timeoutPromise
      ]);

      // Extract text response and generated image
      let responseText = '';
      let generatedImageBase64 = null;

      if (responseResult && responseResult.response) {
        // Updated to correctly process the response structure
        const candidate = responseResult.response.candidates[0];
        const parts = candidate?.content?.parts || [];

        // Process each part correctly
        for (const part of parts) {
          if (part.text) {
            responseText = part.text;
          } else if (part.inlineData) {
            const mimeType = part.inlineData.mimeType || 'image/jpeg';
            generatedImageBase64 = `data:${mimeType};base64,${part.inlineData.data}`;
          }
        }
      }

      // Return the generated image if available, otherwise return original with description
      return NextResponse.json({
        success: true,
        image: generatedImageBase64 || image,
        message: responseText,
        settings
      });

    } catch (apiError) {
      console.error('API error:', apiError);

      // Check if this is a model availability issue
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);

      if (errorMessage.includes('not found') ||
        errorMessage.includes('not available') ||
        errorMessage.includes('permission')) {
        return NextResponse.json(
          {
            success: false,
            error: 'The requested model is not available with your current API key or configuration.',
            errorCategory: ErrorCategory.PERMISSION,
            suggestions: [
              'Ensure your API key has access to the required models',
              'Check that the model is available in your region',
              'Verify your account has appropriate permissions'
            ]
          },
          { status: 403 }
        );
      }

      // Check if this is a content policy issue
      if (errorMessage.includes('content') ||
        errorMessage.includes('policy') ||
        errorMessage.includes('safety')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Content policy violation detected.',
            errorCategory: ErrorCategory.VALIDATION,
            suggestions: [
              'Ensure your image complies with content policies',
              'Modify your prompt to avoid policy violations',
              'Try using different language in your settings'
            ]
          },
          { status: 400 }
        );
      }

      // Generic API error
      throw apiError;
    }

  } catch (error) {
    console.error('Generation error:', error);

    // Categorize the error for better handling on the client
    const errorDetails = categorizeError(error);

    return NextResponse.json(
      {
        success: false,
        error: errorDetails.message,
        errorCategory: errorDetails.category,
        retryable: errorDetails.retryable,
        suggestions: errorDetails.suggestions
      },
      { status: errorDetails.category === ErrorCategory.VALIDATION ? 400 : 500 }
    );
  }
}
