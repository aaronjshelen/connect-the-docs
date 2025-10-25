/**
 * Enhanced Document Analysis Prompt System
 *
 * This module provides sophisticated prompts for LLM-based document analysis
 * with focus on accurate theme identification, relationship detection, and
 * hierarchical organization of concepts.
 */

class DocumentAnalysisPrompts {
  constructor() {
    // Remove predefined categories - let LLM determine categories dynamically
    this.themeCategories = {};

    this.definitionTypes = {
      technical: "Technical terms with precise meanings",
      conceptual: "Abstract concepts or ideas",
      procedural: "Process or method definitions",
      categorical: "Classifications or categories",
      quantitative: "Measurable quantities or metrics",
    };
  }

  /**
   * Generate comprehensive document analysis prompt
   */
  generateAnalysisPrompt(documents, analysisOptions = {}) {
    const {
      focusOnHierarchy = true,
      includeDefinitions = true,
      detectRelationships = true,
      categorizeThemes = true,
      minThemeConfidence = 0.7,
      maxThemesPerDoc = 8,
      includeSubthemes = true,
    } = analysisOptions;

    const prompt = `You are an expert document analyst specializing in identifying thematic relationships and conceptual structures across multiple documents.

ANALYSIS TASK:
Analyze the following ${documents.length} document(s) to extract:
1. HIERARCHICAL THEMES (main themes → subthemes)
2. PRECISE DEFINITIONS with context
3. CROSS-DOCUMENT RELATIONSHIPS
4. THEMATIC CATEGORIES and importance weights

DOCUMENTS TO ANALYZE:
${documents
  .map(
    (doc, i) =>
      `--- DOCUMENT ${i + 1}: "${doc.title}" ---
${doc.content.slice(0, 4000)}${
        doc.content.length > 4000 ? "\n[Content truncated...]" : ""
      }
`
  )
  .join("\n")}

EXTRACTION GUIDELINES:

🎯 THEME IDENTIFICATION:
- Extract ${maxThemesPerDoc} most significant themes per document
- Include both MAIN themes and SUBTHEMES if hierarchically related
- Focus on themes that appear in MULTIPLE contexts within each document
- Assign categories based on the ACTUAL CONTENT (e.g., entertainment, sports, education, technology, science, business, culture, etc.)
- DO NOT force themes into predefined categories - create categories that fit the content
- Assign importance weight (0.1-1.0) based on prominence in document
- Only include themes with confidence ≥ ${minThemeConfidence}
- Be open to ANY topic: gaming, anime, sports, entertainment, fiction, non-fiction, academic, casual, etc.

📚 DEFINITION EXTRACTION:
- Extract technical terms, key concepts, and specialized vocabulary
- Include the EXACT definition as stated in the document
- Provide surrounding context (1-2 sentences)
- Categorize definition type: ${Object.keys(this.definitionTypes).join(", ")}
- Mark definitions that appear across multiple documents

🔗 RELATIONSHIP DETECTION:
- Identify themes that appear in MULTIPLE documents (even with different wording)
- Detect conceptual overlap (e.g., "renewable energy" and "solar power")
- Find causal relationships between themes
- Identify hierarchical relationships (general → specific)
- Mark the STRENGTH of relationships: strong (0.8-1.0), medium (0.5-0.8), weak (0.3-0.5)

⚖️ IMPORTANCE WEIGHTING:
Consider these factors for theme importance:
- Frequency of mention in document
- Depth of discussion/explanation
- Connection to other themes
- Centrality to document's main argument
- Presence in titles, headers, or conclusions

OUTPUT FORMAT (strict JSON only):
{
  "analysis_metadata": {
    "total_documents": ${documents.length},
    "analysis_timestamp": "${new Date().toISOString()}",
    "confidence_threshold": ${minThemeConfidence}
  },
  "shared_concepts": [
    {
      "concept": "shared theme name",
      "category": "theme category",
      "appears_in": [1, 2, 3],
      "variations": ["variation 1", "variation 2"],
      "relationship_strength": 0.85,
      "importance": 0.9
    }
  ],
  "documents": [
    {
      "document_id": 1,
      "title": "document title",
      "main_themes": [
        {
          "theme": "theme name",
          "category": "conceptual|methodological|technological|etc",
          "importance": 0.85,
          "confidence": 0.9,
          "subthemes": ["subtheme1", "subtheme2"],
          "context": "brief context where theme appears"
        }
      ],
      "definitions": [
        {
          "term": "exact term",
          "definition": "precise definition from document",
          "type": "technical|conceptual|procedural|categorical|quantitative",
          "context": "surrounding context sentences",
          "importance": 0.7
        }
      ],
      "summary": "2-3 sentence summary focusing on main purpose and key findings",
      "thematic_focus": ["primary", "secondary", "tertiary categories"],
      "connection_strength": {
        "to_document_2": 0.75,
        "to_document_3": 0.42
      }
    }
  ],
  "thematic_relationships": [
    {
      "theme_1": "theme from doc 1",
      "theme_2": "related theme from doc 2", 
      "relationship_type": "identical|similar|hierarchical|causal|contradictory",
      "strength": 0.8,
      "explanation": "brief explanation of how themes relate"
    }
  ],
  "conceptual_clusters": [
    {
      "cluster_name": "Energy Systems",
      "themes": ["solar power", "wind energy", "grid optimization"],
      "documents": [1, 2],
      "cohesion_score": 0.85
    }
  ]
}

CRITICAL REQUIREMENTS:
- Be PRECISE: Only extract themes explicitly discussed in the documents
- Be SELECTIVE: Quality over quantity - focus on the most significant themes
- Be ACCURATE: Ensure definitions are exact quotes or close paraphrases
- Be CONSISTENT: Use consistent terminology across documents
- NO HALLUCINATION: Only include information directly present in the documents
- STRICT JSON: Response must be valid JSON with no additional text

Begin analysis now:`;

    return prompt;
  }

  /**
   * Generate focused theme refinement prompt
   */
  generateThemeRefinementPrompt(extractedThemes, documentContent) {
    return `You are a theme analysis specialist. Review the following extracted themes and suggest improvements.

EXTRACTED THEMES: ${extractedThemes.map((t) => `"${t}"`).join(", ")}

DOCUMENT CONTENT:
${documentContent.slice(0, 2000)}

REFINEMENT TASKS:
1. IDENTIFY MISSED THEMES: Are there significant concepts not captured?
2. MERGE SIMILAR THEMES: Should any themes be combined?
3. SPLIT BROAD THEMES: Are any themes too general and should be split?
4. HIERARCHICAL ORGANIZATION: Which themes are subtopics of others?
5. CATEGORY CLASSIFICATION: Assign each theme to appropriate categories

Return JSON with refinement suggestions:
{
  "missed_themes": ["potential theme 1", "potential theme 2"],
  "merge_suggestions": [
    {"themes": ["theme A", "theme B"], "merged_as": "combined theme"}
  ],
  "split_suggestions": [
    {"theme": "broad theme", "split_into": ["specific 1", "specific 2"]}
  ],
  "hierarchy": {
    "main_theme": ["subtheme 1", "subtheme 2"]
  },
  "categorization": {
    "theme": "category"
  }
}`;
  }

  /**
   * Generate relationship analysis prompt
   */
  generateRelationshipPrompt(document1, document2) {
    return `Analyze the thematic relationships between these two documents:

DOCUMENT 1: "${document1.title}"
Themes: ${(document1.themes || []).join(", ")}
Content excerpt: ${(document1.content || "").slice(0, 1500)}

DOCUMENT 2: "${document2.title}"  
Themes: ${(document2.themes || []).join(", ")}
Content excerpt: ${(document2.content || "").slice(0, 1500)}

FIND RELATIONSHIPS:
1. EXACT MATCHES: Identical themes/concepts
2. SEMANTIC SIMILARITY: Related but differently worded concepts
3. HIERARCHICAL: General-to-specific relationships
4. CAUSAL: Cause-and-effect connections
5. CONTRADICTORY: Opposing viewpoints
6. COMPLEMENTARY: Concepts that work together

Return JSON analysis:
{
  "relationship_score": 0.75,
  "connection_type": "strong|medium|weak|none",
  "shared_themes": [
    {
      "theme1": "theme from doc1",
      "theme2": "theme from doc2", 
      "similarity": 0.9,
      "type": "exact|semantic|hierarchical|causal|contradictory|complementary"
    }
  ],
  "unique_to_doc1": ["unique theme 1"],
  "unique_to_doc2": ["unique theme 2"],
  "potential_synthesis": "How these documents could be combined or related"
}`;
  }

  /**
   * Generate definition extraction prompt
   */
  generateDefinitionPrompt(documentContent) {
    return `Extract precise definitions and key terms from this document:

DOCUMENT CONTENT:
${documentContent}

EXTRACTION RULES:
1. Find technical terms, specialized vocabulary, and key concepts
2. Extract the EXACT definition as written in the document
3. Include surrounding context (1-2 sentences)
4. Focus on terms that are:
   - Explicitly defined in the text
   - Central to understanding the document
   - Technical or domain-specific
   - Used repeatedly throughout the document

Return JSON with definitions:
{
  "definitions": [
    {
      "term": "exact term as appears in document",
      "definition": "precise definition from document", 
      "type": "technical|conceptual|procedural|categorical|quantitative",
      "context": "surrounding sentences for context",
      "importance": 0.8,
      "location": "where in document this appears"
    }
  ],
  "key_concepts": [
    {
      "concept": "important concept without explicit definition",
      "implied_meaning": "inferred meaning from context",
      "importance": 0.7
    }
  ]
}`;
  }

  /**
   * Generate document summarization prompt with thematic focus
   */
  generateSummaryPrompt(documentContent, extractedThemes = []) {
    const themeContext =
      extractedThemes.length > 0
        ? `\nEXTRACTED THEMES: ${extractedThemes.join(", ")}`
        : "";

    return `Create a comprehensive summary of this document with focus on thematic content:

DOCUMENT CONTENT:
${documentContent}${themeContext}

SUMMARY REQUIREMENTS:
1. 2-3 sentences capturing the main purpose and findings
2. Highlight the primary themes and their relationships
3. Mention key methodologies or approaches used
4. Note any significant conclusions or implications
5. Identify the document's contribution to its field

Return JSON summary:
{
  "executive_summary": "2-3 sentence overview",
  "main_purpose": "primary goal or research question",
  "key_findings": ["finding 1", "finding 2"],
  "methodology": "approach used if applicable",
  "thematic_focus": "primary thematic area",
  "significance": "why this document is important",
  "target_audience": "intended readers"
}`;
  }

  /**
   * Generate batch processing prompt for multiple documents
   */
  generateBatchAnalysisPrompt(documents, focusAreas = []) {
    const focusSection =
      focusAreas.length > 0
        ? `\nSPECIAL FOCUS AREAS: ${focusAreas.join(", ")}`
        : "";

    return `Perform batch analysis on ${
      documents.length
    } documents to identify cross-document patterns and relationships.

${documents
  .map(
    (doc, i) =>
      `DOCUMENT ${i + 1}: "${doc.title}"
${doc.content.slice(0, 2000)}
---`
  )
  .join("\n")}${focusSection}

BATCH ANALYSIS GOALS:
1. Identify common themes across ALL documents
2. Find unique themes in each document
3. Detect thematic evolution or progression
4. Identify complementary documents
5. Find potential document clusters
6. Assess collection coherence

Return comprehensive JSON analysis:
{
  "collection_overview": {
    "total_documents": ${documents.length},
    "thematic_coherence": 0.75,
    "diversity_score": 0.6,
    "main_topics": ["topic 1", "topic 2"]
  },
  "cross_document_themes": [
    {
      "theme": "common theme",
      "appears_in": [1, 2, 3],
      "variations": ["var1", "var2"],
      "evolution": "how theme changes across docs"
    }
  ],
  "document_clusters": [
    {
      "cluster_name": "cluster theme",
      "documents": [1, 3],
      "similarity_score": 0.8,
      "shared_themes": ["theme1", "theme2"]
    }
  ],
  "unique_contributions": [
    {
      "document": 1,
      "unique_themes": ["unique1", "unique2"],
      "special_focus": "what makes this document unique"
    }
  ],
  "recommended_connections": [
    {
      "document_1": 1,
      "document_2": 2,
      "connection_strength": 0.7,
      "basis": "why these should be connected"
    }
  ]
}`;
  }

  /**
   * Get category descriptions for theme classification
   */
  getThemeCategories() {
    return this.themeCategories;
  }

  /**
   * Get definition types for classification
   */
  getDefinitionTypes() {
    return this.definitionTypes;
  }

  /**
   * Generate validation prompt for extracted data
   */
  generateValidationPrompt(extractedData, originalDocuments) {
    return `Validate the accuracy of this extracted thematic data against the original documents:

EXTRACTED DATA:
${JSON.stringify(extractedData, null, 2)}

ORIGINAL DOCUMENTS:
${originalDocuments
  .map((doc, i) => `${i + 1}. ${doc.title}: ${doc.content.slice(0, 1000)}`)
  .join("\n---\n")}

VALIDATION TASKS:
1. Verify themes are actually present in documents
2. Check definition accuracy
3. Validate relationship strength scores
4. Confirm document connections are justified

Return validation report:
{
  "overall_accuracy": 0.85,
  "theme_accuracy": 0.9,
  "definition_accuracy": 0.8,
  "relationship_accuracy": 0.75,
  "issues_found": [
    {
      "type": "missing_theme|incorrect_definition|wrong_relationship",
      "description": "what's wrong",
      "suggestion": "how to fix"
    }
  ],
  "confidence_score": 0.8
}`;
  }
}

// Export for use in other modules
if (typeof window !== "undefined") {
  window.DocumentAnalysisPrompts = DocumentAnalysisPrompts;
} else if (typeof module !== "undefined") {
  module.exports = DocumentAnalysisPrompts;
}
