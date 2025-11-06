import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export interface SentimentResult {
  score: number;
  comparative: number;
  emotion: 'positive' | 'neutral' | 'negative';
  intensity: 'low' | 'medium' | 'high';
  colorTone: string;
  suggestions: string[];
}

/**
 * Analyzes the sentiment of a given text and returns emotion data
 * to influence UI elements (colors, suggestions, tone)
 */
export function analyzeSentiment(text: string): SentimentResult {
  const analysis = sentiment.analyze(text);
  
  // Determine emotion category
  let emotion: 'positive' | 'neutral' | 'negative';
  if (analysis.score > 2) {
    emotion = 'positive';
  } else if (analysis.score < -2) {
    emotion = 'negative';
  } else {
    emotion = 'neutral';
  }
  
  // Determine intensity
  const absScore = Math.abs(analysis.score);
  let intensity: 'low' | 'medium' | 'high';
  if (absScore < 3) {
    intensity = 'low';
  } else if (absScore < 6) {
    intensity = 'medium';
  } else {
    intensity = 'high';
  }
  
  // Map emotion to color tone for UI
  let colorTone: string;
  switch (emotion) {
    case 'positive':
      colorTone = intensity === 'high' ? '#F7DFA7' : '#E3C07B';
      break;
    case 'negative':
      colorTone = intensity === 'high' ? '#8B7355' : '#A0826D';
      break;
    default:
      colorTone = '#D9A55B';
  }
  
  // Generate contextual suggestions
  const suggestions: string[] = [];
  if (emotion === 'negative' && intensity === 'high') {
    suggestions.push('Take a moment to breathe');
    suggestions.push('Consider exploring this feeling deeper');
  } else if (emotion === 'positive' && intensity === 'high') {
    suggestions.push('What made this moment special?');
    suggestions.push('How can you recreate this feeling?');
  } else if (emotion === 'neutral') {
    suggestions.push('Explore different perspectives');
    suggestions.push('What would change if you chose differently?');
  }
  
  return {
    score: analysis.score,
    comparative: analysis.comparative,
    emotion,
    intensity,
    colorTone,
    suggestions
  };
}

/**
 * Adjusts AI response tone based on user's emotional state
 */
export function getResponseTone(sentimentResult: SentimentResult): {
  tone: string;
  empathyLevel: 'gentle' | 'supportive' | 'explorative' | 'celebratory';
} {
  const { emotion, intensity } = sentimentResult;
  
  if (emotion === 'negative') {
    return {
      tone: intensity === 'high' 
        ? 'compassionate and validating'
        : 'understanding and reflective',
      empathyLevel: 'gentle'
    };
  } else if (emotion === 'positive') {
    return {
      tone: intensity === 'high'
        ? 'celebratory and amplifying'
        : 'affirming and curious',
      empathyLevel: 'celebratory'
    };
  } else {
    return {
      tone: 'thoughtful and open-ended',
      empathyLevel: 'explorative'
    };
  }
}

/**
 * Creates a timeline entry based on reflection sentiment
 */
export function createEmotionalTimestamp(
  text: string,
  sentimentResult: SentimentResult
): {
  timestamp: Date;
  emotion: string;
  intensity: string;
  keyThemes: string[];
} {
  return {
    timestamp: new Date(),
    emotion: sentimentResult.emotion,
    intensity: sentimentResult.intensity,
    keyThemes: extractKeyThemes(text)
  };
}

/**
 * Extracts key themes from text using simple keyword analysis
 */
function extractKeyThemes(text: string): string[] {
  const themeKeywords = {
    relationships: ['love', 'family', 'friend', 'partner', 'relationship'],
    career: ['job', 'work', 'career', 'business', 'professional'],
    growth: ['learn', 'grow', 'develop', 'improve', 'change'],
    health: ['health', 'wellness', 'body', 'mind', 'exercise'],
    creativity: ['create', 'art', 'music', 'write', 'express'],
    purpose: ['purpose', 'meaning', 'why', 'goal', 'dream']
  };
  
  const lowerText = text.toLowerCase();
  const detectedThemes: string[] = [];
  
  Object.entries(themeKeywords).forEach(([theme, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      detectedThemes.push(theme);
    }
  });
  
  return detectedThemes.slice(0, 3); // Return top 3 themes
}
