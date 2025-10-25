/**
 * Semantic Similarity Module
 * 
 * Provides advanced semantic analysis capabilities for theme identification
 * and document relationship scoring using multiple approaches:
 * - OpenAI embeddings for semantic similarity
 * - TF-IDF with cosine similarity as fallback
 * - N-gram analysis for syntactic similarity
 * - Conceptual clustering based on semantic groups
 */

class SemanticAnalyzer {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.embeddingsCache = new Map();
    this.similarityCache = new Map();
    this.conceptClusters = new Map();
    
    // Remove predefined semantic groups - let the LLM decide categories dynamically
    this.semanticGroups = {};
  }

  /**
   * Get embeddings from OpenAI API with caching
   */
  async getEmbeddings(texts) {
    const results = [];
    const textsToFetch = [];
    const indices = [];
    
    // Check cache first
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i].trim();
      const cacheKey = this.hashString(text);
      
      if (this.embeddingsCache.has(cacheKey)) {
        results[i] = this.embeddingsCache.get(cacheKey);
      } else {
        textsToFetch.push(text);
        indices.push(i);
      }
    }
    
    // Fetch missing embeddings
    if (textsToFetch.length > 0) {
      try {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: textsToFetch
          })
        });
        
        const data = await response.json();
        
        if (data.data) {
          data.data.forEach((embedding, idx) => {
            const originalIndex = indices[idx];
            const text = textsToFetch[idx];
            const cacheKey = this.hashString(text);
            
            results[originalIndex] = embedding.embedding;
            this.embeddingsCache.set(cacheKey, embedding.embedding);
          });
        }
      } catch (error) {
        console.warn('Failed to fetch embeddings, using fallback similarity:', error);
        // Use fallback for missing embeddings
        for (let i = 0; i < indices.length; i++) {
          const originalIndex = indices[i];
          results[originalIndex] = this.createFallbackEmbedding(textsToFetch[i]);
        }
      }
    }
    
    return results;
  }

  /**
   * Calculate semantic similarity between two texts
   */
  async calculateSemanticSimilarity(text1, text2) {
    const cacheKey = [text1, text2].sort().join('|');
    if (this.similarityCache.has(cacheKey)) {
      return this.similarityCache.get(cacheKey);
    }
    
    try {
      const embeddings = await this.getEmbeddings([text1, text2]);
      const similarity = this.cosineSimilarity(embeddings[0], embeddings[1]);
      this.similarityCache.set(cacheKey, similarity);
      return similarity;
    } catch (error) {
      // Fallback to TF-IDF similarity
      const fallbackSimilarity = this.calculateTFIDFSimilarity(text1, text2);
      this.similarityCache.set(cacheKey, fallbackSimilarity);
      return fallbackSimilarity;
    }
  }

  /**
   * Analyze themes for semantic grouping and hierarchy
   */
  async analyzeThemeSemantics(themes) {
    // Ensure we have an array of themes
    if (!Array.isArray(themes)) {
      console.warn('analyzeThemeSemantics received non-array:', typeof themes, themes);
      return {
        semanticGroups: [],
        hierarchicalStructure: { root: [], children: {} },
        conceptualCategories: {},
        embeddings: []
      };
    }
    
    if (themes.length === 0) {
      return {
        semanticGroups: [],
        hierarchicalStructure: { root: [], children: {} },
        conceptualCategories: {},
        embeddings: []
      };
    }
    
    const themeTexts = themes.map(t => typeof t === 'string' ? t : (t?.label || t?.term || String(t)));
    const embeddings = await this.getEmbeddings(themeTexts);
    
    const semanticGroups = this.clusterThemesBySemantic(themes, embeddings);
    const hierarchicalStructure = await this.buildThemeHierarchy(themes, embeddings);
    const conceptualCategories = this.categorizeThemes(themes);
    
    return {
      semanticGroups,
      hierarchicalStructure,
      conceptualCategories,
      embeddings: embeddings.map((emb, i) => ({ theme: themes[i], embedding: emb }))
    };
  }

  /**
   * Find conceptually related themes across documents
   */
  async findConceptualConnections(document1Themes, document2Themes) {
    // Ensure we have arrays to work with
    const themes1 = Array.isArray(document1Themes) ? document1Themes : [];
    const themes2 = Array.isArray(document2Themes) ? document2Themes : [];
    
    const allThemes = [...themes1, ...themes2];
    const themeTexts = allThemes.map(t => typeof t === 'string' ? t : (t?.label || t?.term || String(t)));
    
    const embeddings = await this.getEmbeddings(themeTexts);
    const connections = [];
    
    // Compare themes between documents
    for (let i = 0; i < themes1.length; i++) {
      for (let j = themes1.length; j < allThemes.length; j++) {
        const similarity = this.cosineSimilarity(embeddings[i], embeddings[j]);
        
        if (similarity >= 0.7) { // Threshold for conceptual similarity
          connections.push({
            theme1: themes1[i],
            theme2: themes2[j - themes1.length],
            semanticSimilarity: similarity,
            connectionType: this.determineConnectionType(similarity),
            conceptualCategory: this.findConceptualCategory(
              themeTexts[i], 
              themeTexts[j]
            )
          });
        }
      }
    }
    
    return connections.sort((a, b) => b.semanticSimilarity - a.semanticSimilarity);
  }

  /**
   * Analyze document relationship strength with multiple factors
   */
  async analyzeDocumentRelationship(doc1, doc2) {
    // Safely extract themes and definitions, converting Sets to Arrays if needed
    const doc1Themes = Array.isArray(doc1.themes) ? doc1.themes : 
                      (doc1.themes instanceof Set ? Array.from(doc1.themes) : []);
    const doc2Themes = Array.isArray(doc2.themes) ? doc2.themes : 
                      (doc2.themes instanceof Set ? Array.from(doc2.themes) : []);
    const doc1Defs = Array.isArray(doc1.definitions) ? doc1.definitions : 
                     (doc1.definitions instanceof Set ? Array.from(doc1.definitions) : []);
    const doc2Defs = Array.isArray(doc2.definitions) ? doc2.definitions : 
                     (doc2.definitions instanceof Set ? Array.from(doc2.definitions) : []);
    
    // Exact matches
    const exactThemeMatches = this.findExactMatches(doc1Themes, doc2Themes);
    const exactDefMatches = this.findExactMatches(
      doc1Defs.map(d => d.term || d), 
      doc2Defs.map(d => d.term || d)
    );
    
    // Semantic connections
    const semanticConnections = await this.findConceptualConnections(doc1Themes, doc2Themes);
    
    // Content similarity (if available)
    let contentSimilarity = 0;
    if (doc1.content && doc2.content) {
      contentSimilarity = await this.calculateSemanticSimilarity(
        doc1.content.slice(0, 1000),
        doc2.content.slice(0, 1000)
      );
    }
    
    // Calculate weighted relationship score
    const relationshipScore = this.calculateRelationshipScore({
      exactThemeMatches: exactThemeMatches.length,
      exactDefMatches: exactDefMatches.length,
      semanticConnections: semanticConnections.length,
      avgSemanticSimilarity: semanticConnections.length > 0 
        ? semanticConnections.reduce((sum, conn) => sum + conn.semanticSimilarity, 0) / semanticConnections.length
        : 0,
      contentSimilarity,
      themeOverlap: exactThemeMatches.length / Math.max(doc1Themes.length, doc2Themes.length),
      defOverlap: exactDefMatches.length / Math.max(doc1Defs.length, doc2Defs.length)
    });
    
    return {
      score: relationshipScore,
      exactThemeMatches,
      exactDefMatches,
      semanticConnections,
      contentSimilarity,
      connectionTypes: this.categorizeConnections(semanticConnections),
      recommendedLinkStrength: this.recommendLinkStrength(relationshipScore)
    };
  }

  /**
   * Enhanced theme extraction suggestions
   */
  async suggestThemeImprovements(extractedThemes, documentContent) {
    const suggestions = {
      potentialMissedThemes: [],
      themeRefinements: [],
      hierarchicalOrganization: {},
      semanticClusters: []
    };
    
    // Analyze document for missed themes using semantic groups
    const contentWords = this.extractKeyWords(documentContent);
    for (const [category, keywords] of Object.entries(this.semanticGroups)) {
      const relevantWords = contentWords.filter(word => 
        keywords.some(keyword => word.includes(keyword) || keyword.includes(word))
      );
      
      if (relevantWords.length > 0) {
        const hasExistingTheme = extractedThemes.some(theme => 
          keywords.some(keyword => theme.toLowerCase().includes(keyword))
        );
        
        if (!hasExistingTheme) {
          suggestions.potentialMissedThemes.push({
            category,
            suggestedTheme: this.generateThemeFromWords(relevantWords),
            evidence: relevantWords,
            confidence: relevantWords.length / keywords.length
          });
        }
      }
    }
    
    // Suggest theme refinements
    const themeAnalysis = await this.analyzeThemeSemantics(extractedThemes);
    suggestions.semanticClusters = themeAnalysis.semanticGroups;
    suggestions.hierarchicalOrganization = themeAnalysis.hierarchicalStructure;
    
    return suggestions;
  }

  // Private helper methods
  
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    return normA && normB ? dotProduct / (normA * normB) : 0;
  }

  calculateTFIDFSimilarity(text1, text2) {
    // Simple TF-IDF implementation as fallback
    const words1 = this.tokenize(text1);
    const words2 = this.tokenize(text2);
    const allWords = new Set([...words1, ...words2]);
    
    const vec1 = Array.from(allWords).map(word => words1.filter(w => w === word).length);
    const vec2 = Array.from(allWords).map(word => words2.filter(w => w === word).length);
    
    return this.cosineSimilarity(vec1, vec2);
  }

  createFallbackEmbedding(text) {
    // Create a simple pseudo-embedding based on word frequency and semantic groups
    const words = this.tokenize(text);
    const embedding = new Array(384).fill(0); // Match embedding dimension
    
    // Map words to pseudo-dimensions based on semantic groups
    words.forEach((word, idx) => {
      const hash = this.hashString(word) % embedding.length;
      embedding[hash] += 1 / words.length;
    });
    
    return embedding;
  }

  clusterThemesBySemantic(themes, embeddings) {
    const clusters = [];
    const processed = new Set();
    
    for (let i = 0; i < themes.length; i++) {
      if (processed.has(i)) continue;
      
      const cluster = [i];
      processed.add(i);
      
      for (let j = i + 1; j < themes.length; j++) {
        if (processed.has(j)) continue;
        
        const similarity = this.cosineSimilarity(embeddings[i], embeddings[j]);
        if (similarity >= 0.6) {
          cluster.push(j);
          processed.add(j);
        }
      }
      
      if (cluster.length > 1) {
        clusters.push({
          themes: cluster.map(idx => themes[idx]),
          averageSimilarity: this.calculateClusterCohesion(cluster, embeddings),
          category: this.inferClusterCategory(cluster.map(idx => themes[idx]))
        });
      }
    }
    
    return clusters;
  }

  async buildThemeHierarchy(themes, embeddings) {
    // Build hierarchy based on semantic similarity and generality
    const hierarchy = { root: [], children: {} };
    
    // Simple hierarchy: group by semantic similarity and generality
    for (let i = 0; i < themes.length; i++) {
      const theme = themes[i];
      const themeText = typeof theme === 'string' ? theme : theme.label;
      
      let parent = null;
      let maxSimilarity = 0;
      
      for (let j = 0; j < themes.length; j++) {
        if (i === j) continue;
        
        const otherTheme = themes[j];
        const otherText = typeof otherTheme === 'string' ? otherTheme : otherTheme.label;
        
        const similarity = this.cosineSimilarity(embeddings[i], embeddings[j]);
        if (similarity > maxSimilarity && this.isMoreGeneral(otherText, themeText)) {
          maxSimilarity = similarity;
          parent = otherTheme;
        }
      }
      
      if (parent) {
        const parentKey = typeof parent === 'string' ? parent : parent.label;
        if (!hierarchy.children[parentKey]) {
          hierarchy.children[parentKey] = [];
        }
        hierarchy.children[parentKey].push(theme);
      } else {
        hierarchy.root.push(theme);
      }
    }
    
    return hierarchy;
  }

  categorizeThemes(themes) {
    const categories = {};
    
    for (const theme of themes) {
      const themeText = typeof theme === 'string' ? theme : theme.label;
      const category = this.findConceptualCategory(themeText);
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(theme);
    }
    
    return categories;
  }

  findConceptualCategory(text1, text2 = null) {
    // Return 'general' instead of trying to match predefined categories
    // Let the LLM determine categories dynamically during analysis
    return 'general';
  }

  findExactMatches(arr1, arr2) {
    // Ensure we have arrays to work with
    const array1 = Array.isArray(arr1) ? arr1 : [];
    const array2 = Array.isArray(arr2) ? arr2 : [];
    
    const normalized1 = array1.map(item => 
      typeof item === 'string' ? item.toLowerCase().trim() : (item.label || item.term || '').toLowerCase().trim()
    );
    const normalized2 = array2.map(item => 
      typeof item === 'string' ? item.toLowerCase().trim() : (item.label || item.term || '').toLowerCase().trim()
    );
    
    return normalized1.filter(item => normalized2.includes(item));
  }

  calculateRelationshipScore(metrics) {
    const weights = {
      exactThemeMatches: 2.0,
      exactDefMatches: 2.5,
      semanticConnections: 1.5,
      avgSemanticSimilarity: 1.0,
      contentSimilarity: 0.8,
      themeOverlap: 1.2,
      defOverlap: 1.3
    };
    
    let score = 0;
    for (const [metric, value] of Object.entries(metrics)) {
      score += (value || 0) * (weights[metric] || 0);
    }
    
    return Math.min(score / 5, 1.0); // Normalize to 0-1 range
  }

  determineConnectionType(similarity) {
    if (similarity >= 0.9) return 'identical';
    if (similarity >= 0.8) return 'very-similar';
    if (similarity >= 0.7) return 'similar';
    if (similarity >= 0.6) return 'related';
    return 'weakly-related';
  }

  categorizeConnections(connections) {
    const types = {};
    connections.forEach(conn => {
      const type = conn.connectionType;
      if (!types[type]) types[type] = [];
      types[type].push(conn);
    });
    return types;
  }

  recommendLinkStrength(score) {
    if (score >= 0.8) return 'strong';
    if (score >= 0.6) return 'medium';
    if (score >= 0.4) return 'weak';
    return 'very-weak';
  }

  extractKeyWords(text, minLength = 3) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= minLength)
      .filter(word => !this.isStopWord(word));
  }

  generateThemeFromWords(words) {
    // Simple theme generation - could be enhanced with NLP
    return words.slice(0, 3).join(' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  calculateClusterCohesion(cluster, embeddings) {
    if (cluster.length < 2) return 0;
    
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (let i = 0; i < cluster.length; i++) {
      for (let j = i + 1; j < cluster.length; j++) {
        totalSimilarity += this.cosineSimilarity(embeddings[cluster[i]], embeddings[cluster[j]]);
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalSimilarity / comparisons : 0;
  }

  inferClusterCategory(themes) {
    const allText = themes.map(t => typeof t === 'string' ? t : t.label).join(' ').toLowerCase();
    return this.findConceptualCategory(allText);
  }

  isMoreGeneral(text1, text2) {
    // Simple heuristic: shorter, more common words are more general
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    
    return words1.length < words2.length && text2.includes(text1);
  }

  isStopWord(word) {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    return stopWords.has(word);
  }

  tokenize(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0 && !this.isStopWord(word));
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.SemanticAnalyzer = SemanticAnalyzer;
} else if (typeof module !== 'undefined') {
  module.exports = SemanticAnalyzer;
}