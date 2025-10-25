/**
 * Enhanced Document Connection Analyzer
 * 
 * Main integration class that combines the theme storage system, 
 * semantic analyzer, and enhanced prompts to provide a complete
 * solution for document analysis and relationship detection.
 */

class DocumentConnectionAnalyzer {
  constructor(apiKey) {
    this.themeStorage = new ThemeStorageSystem();
    this.semanticAnalyzer = new SemanticAnalyzer(apiKey);
    this.promptGenerator = new DocumentAnalysisPrompts();
    this.apiKey = apiKey;
    
    // Configuration
    this.config = {
      minThemeConfidence: 0.7,
      maxThemesPerDocument: 8,
      semanticSimilarityThreshold: 0.7,
      connectionStrengthThreshold: 0.4,
      enableSemanticAnalysis: true,
      enableHierarchicalThemes: true,
      cacheResults: true
    };
    
    // Processing cache
    this.processingCache = new Map();
    this.analysisHistory = [];
  }

  /**
   * Main method: Process multiple documents and build comprehensive graph data
   */
  async processDocuments(documents, options = {}) {
    const startTime = Date.now();
    const processingId = `analysis-${startTime}`;
    
    try {
      console.log('🚀 Starting enhanced document analysis...');
      
      // Validate inputs
      if (!documents || documents.length === 0) {
        throw new Error('No documents provided for analysis');
      }
      
      // Validate documents structure
      for (let i = 0; i < documents.length; i++) {
        if (!documents[i] || typeof documents[i] !== 'object') {
          throw new Error(`Document ${i + 1} is invalid - must be an object with title and content`);
        }
        if (!documents[i].content && !documents[i].title) {
          throw new Error(`Document ${i + 1} is missing both title and content`);
        }
      }
      
      // Merge config with options
      const config = { ...this.config, ...options };
      
      // Step 1: Extract themes, definitions, and metadata from all documents
      console.log('📊 Extracting themes and definitions...');
      const extractedData = await this.extractDocumentData(documents, config);
      
      // Step 2: Store in optimized data structure
      console.log('💾 Building optimized storage structure...');
      const documentIds = await this.storeDocuments(documents, extractedData);
      
      // Step 3: Perform semantic analysis if enabled
      if (config.enableSemanticAnalysis) {
        console.log('🧠 Performing semantic analysis...');
        await this.performSemanticAnalysis(documentIds, extractedData);
      }
      
      // Step 4: Build relationship graph
      console.log('🔗 Building document relationship graph...');
      const graphData = await this.buildOptimizedGraph(documentIds, config);
      
      // Step 5: Generate analysis report
      console.log('📈 Generating analysis report...');
      const analysisReport = this.generateAnalysisReport(documentIds, graphData);
      
      const processingTime = Date.now() - startTime;
      console.log(`✅ Analysis completed in ${processingTime}ms`);
      
      // Cache results
      if (config.cacheResults) {
        this.processingCache.set(processingId, {
          documentIds,
          graphData,
          analysisReport,
          timestamp: new Date(),
          processingTime
        });
      }
      
      // Add to history
      this.analysisHistory.push({
        id: processingId,
        documentCount: documents.length,
        timestamp: new Date(),
        processingTime,
        config: { ...config }
      });
      
      return {
        success: true,
        processingId,
        documentIds,
        graphData,
        analysisReport,
        processingTime,
        themeStorage: this.themeStorage,
        stats: this.getSystemStats()
      };
      
    } catch (error) {
      console.error('❌ Document processing failed:', error);
      
      // Provide more specific error messages
      let errorMessage = error.message;
      if (error.message.includes('map is not a function')) {
        errorMessage = 'Data structure error: Expected array but received different data type. This may be due to malformed document data.';
      } else if (error.message.includes('API')) {
        errorMessage = `OpenAI API error: ${error.message}`;
      } else if (error.message.includes('JSON')) {
        errorMessage = `Data parsing error: ${error.message}`;
      }
      
      return {
        success: false,
        error: errorMessage,
        originalError: error.message,
        processingId,
        timestamp: new Date(),
        debugInfo: {
          documentsCount: documents?.length || 0,
          config: config || {}
        }
      };
    }
  }

  /**
   * Extract themes and definitions using enhanced LLM prompts
   */
  async extractDocumentData(documents, config) {
    const prompt = this.promptGenerator.generateAnalysisPrompt(documents, {
      focusOnHierarchy: config.enableHierarchicalThemes,
      includeDefinitions: true,
      detectRelationships: true,
      categorizeThemes: true,
      minThemeConfidence: config.minThemeConfidence,
      maxThemesPerDoc: config.maxThemesPerDocument
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 4000
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }

    // Extract and parse JSON from response
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in LLM response');
    }

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in LLM response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse LLM response:', content);
      throw new Error(`Failed to parse LLM response: ${parseError.message}`);
    }
  }

  /**
   * Store documents in optimized data structure
   */
  async storeDocuments(originalDocuments, extractedData) {
    const documentIds = [];

    for (let i = 0; i < originalDocuments.length; i++) {
      const originalDoc = originalDocuments[i];
      const extractedDoc = extractedData.documents?.[i];
      
      if (!extractedDoc) continue;

      // Add document to storage
      const docId = this.themeStorage.addDocument(
        originalDoc.title || originalDoc.filename || `Document ${i + 1}`,
        originalDoc.content || '',
        {
          originalFilename: originalDoc.filename,
          fileSize: originalDoc.content?.length || 0,
          extractedAt: new Date(),
          thematicFocus: extractedDoc.thematic_focus || [],
          summary: extractedDoc.summary || ''
        }
      );

      documentIds.push(docId);

      // Add themes
      if (extractedDoc.main_themes) {
        for (const themeData of extractedDoc.main_themes) {
          const themeId = this.themeStorage.addTheme(
            themeData.theme,
            themeData.category || 'general',
            themeData.importance || 1.0,
            themeData.subthemes || []
          );
          
          this.themeStorage.linkDocumentToTheme(
            docId, 
            themeId, 
            themeData.confidence || 1.0,
            themeData.context || ''
          );
        }
      }

      // Add definitions
      if (extractedDoc.definitions) {
        for (const defData of extractedDoc.definitions) {
          const defId = this.themeStorage.addDefinition(
            defData.term,
            defData.definition,
            defData.context || '',
            defData.importance || 1.0
          );
          
          this.themeStorage.linkDocumentToDefinition(docId, defId);
        }
      }

      // Update document summary
      const doc = this.themeStorage.documents.get(docId);
      doc.summary = extractedDoc.summary || '';
    }

    // Process shared concepts
    if (extractedData.shared_concepts) {
      for (const sharedConcept of extractedData.shared_concepts) {
        const themeId = this.themeStorage.addTheme(
          sharedConcept.concept,
          sharedConcept.category || 'shared',
          sharedConcept.importance || 1.0
        );

        // Link to all documents that mention this shared concept
        for (const docIndex of sharedConcept.appears_in || []) {
          if (docIndex - 1 < documentIds.length) {
            this.themeStorage.linkDocumentToTheme(
              documentIds[docIndex - 1],
              themeId,
              sharedConcept.relationship_strength || 1.0
            );
          }
        }
      }
    }

    return documentIds;
  }

  /**
   * Perform semantic analysis on stored documents
   */
  async performSemanticAnalysis(documentIds, extractedData) {
    try {
      // Analyze cross-document relationships
      for (let i = 0; i < documentIds.length; i++) {
        for (let j = i + 1; j < documentIds.length; j++) {
          const doc1 = this.themeStorage.documents.get(documentIds[i]);
          const doc2 = this.themeStorage.documents.get(documentIds[j]);
          
          if (!doc1 || !doc2) {
            console.warn(`Missing document: ${documentIds[i]} or ${documentIds[j]}`);
            continue;
          }
          
          const relationship = await this.semanticAnalyzer.analyzeDocumentRelationship(doc1, doc2);
        
        // Store relationship metadata
        if (!this.documentRelationships) {
          this.documentRelationships = new Map();
        }
        
        const relationshipKey = `${documentIds[i]}-${documentIds[j]}`;
        this.documentRelationships.set(relationshipKey, {
          score: relationship.score,
          connections: relationship.semanticConnections,
          contentSimilarity: relationship.contentSimilarity,
          recommendedStrength: relationship.recommendedLinkStrength,
          analyzedAt: new Date()
        });
      }
    }

      // Analyze theme semantics
      const allThemes = Array.from(this.themeStorage.themes.values());
      if (allThemes.length > 0) {
        const themeSemantics = await this.semanticAnalyzer.analyzeThemeSemantics(allThemes);
        this.themeSemanticData = themeSemantics;
      }
    } catch (error) {
      console.warn('Semantic analysis failed, continuing without it:', error);
      this.themeSemanticData = { semanticGroups: [], hierarchicalStructure: {} };
    }
  }

  /**
   * Build optimized graph structure for visualization
   */
  async buildOptimizedGraph(documentIds, config) {
    const nodes = [];
    const links = [];
    const nodePositions = this.calculateOptimalPositions(documentIds);

    // Document nodes
    documentIds.forEach((docId, index) => {
      const doc = this.themeStorage.documents.get(docId);
      const position = nodePositions.documents[index];
      
      nodes.push({
        id: docId,
        type: 'document',
        label: doc.title,
        data: doc,
        size: Math.max(8, Math.min(20, doc.themes.size * 2)),
        color: this.getNodeColor('document'),
        x: position.x,
        y: position.y,
        z: position.z || 0,
        metadata: {
          themeCount: doc.themes.size,
          definitionCount: doc.definitions.size,
          importance: this.calculateDocumentImportance(docId)
        }
      });
    });

    // Shared theme nodes
    const sharedThemes = this.themeStorage.getSharedThemes(2);
    sharedThemes.forEach((theme, index) => {
      const position = nodePositions.sharedThemes[index] || { x: 0, y: 0, z: 10 };
      
      nodes.push({
        id: theme.id,
        type: 'shared-theme',
        label: theme.label,
        data: theme,
        size: Math.max(6, Math.min(15, theme.documents.length * 3)),
        color: this.getNodeColor('shared-theme', theme.category),
        x: position.x,
        y: position.y,
        z: position.z || 10,
        metadata: {
          sharedBy: theme.sharedBy,
          frequency: theme.frequency,
          category: theme.category
        }
      });

      // Link shared themes to documents
      theme.sharedBy.forEach(docId => {
        const linkStrength = this.calculateLinkStrength(docId, theme.id);
        links.push({
          source: docId,
          target: theme.id,
          type: 'theme-connection',
          strength: linkStrength,
          color: this.getLinkColor(linkStrength)
        });
      });
    });

    // Document-to-document connections
    const connections = this.themeStorage.getDocumentConnectivityMap();
    connections.forEach(connection => {
      if (connection.strength >= config.connectionStrengthThreshold) {
        links.push({
          source: connection.source,
          target: connection.target,
          type: 'document-connection',
          strength: connection.strength,
          sharedThemes: connection.sharedThemes,
          sharedDefinitions: connection.sharedDefinitions,
          color: this.getLinkColor(connection.strength),
          metadata: {
            totalShared: connection.totalShared,
            semanticSimilarity: this.getSemanticSimilarity(connection.source, connection.target)
          }
        });
      }
    });

    // Unique theme nodes (for documents with unique themes)
    documentIds.forEach(docId => {
      const doc = this.themeStorage.documents.get(docId);
      const docThemes = this.themeStorage.themesByDocument.get(docId);
      
      let uniqueThemeIndex = 0;
      docThemes.forEach(themeId => {
        const theme = this.themeStorage.themes.get(themeId);
        if (theme.documents.size === 1) { // Unique to this document
          const angle = (uniqueThemeIndex / 5) * Math.PI * 2;
          const radius = 25;
          const docNode = nodes.find(n => n.id === docId);
          
          nodes.push({
            id: themeId,
            type: 'unique-theme',
            label: theme.label,
            data: theme,
            size: 4 + theme.importance * 3,
            color: this.getNodeColor('unique-theme', theme.category),
            x: docNode.x + Math.cos(angle) * radius,
            y: docNode.y + Math.sin(angle) * radius,
            z: docNode.z - 5,
            metadata: {
              parent: docId,
              category: theme.category,
              importance: theme.importance
            }
          });

          links.push({
            source: docId,
            target: themeId,
            type: 'unique-theme-connection',
            strength: 0.8,
            color: this.getLinkColor(0.8, 0.6) // Semi-transparent
          });

          uniqueThemeIndex++;
        }
      });
    });

    return {
      nodes,
      links,
      metadata: {
        documentCount: documentIds.length,
        sharedThemeCount: sharedThemes.length,
        totalConnections: links.length,
        avgConnectionStrength: links.length > 0 
          ? links.reduce((sum, link) => sum + link.strength, 0) / links.length 
          : 0,
        graphDensity: this.calculateGraphDensity(nodes, links),
        createdAt: new Date()
      }
    };
  }

  /**
   * Generate comprehensive analysis report
   */
  generateAnalysisReport(documentIds, graphData) {
    const report = {
      overview: {
        totalDocuments: documentIds.length,
        totalThemes: this.themeStorage.themes.size,
        totalDefinitions: this.themeStorage.definitions.size,
        sharedThemes: this.themeStorage.getSharedThemes(2).length,
        avgThemesPerDoc: documentIds.reduce((sum, docId) => {
          return sum + this.themeStorage.themesByDocument.get(docId).size;
        }, 0) / documentIds.length
      },
      connectivity: {
        averageConnectionStrength: graphData.metadata.avgConnectionStrength,
        graphDensity: graphData.metadata.graphDensity,
        mostConnectedDocument: this.findMostConnectedDocument(documentIds),
        isolatedDocuments: this.findIsolatedDocuments(documentIds)
      },
      themeAnalysis: {
        topSharedThemes: this.themeStorage.getSharedThemes(2).slice(0, 10),
        themeCategories: this.analyzeThemeCategories(),
        themeClusters: this.themeSemanticData?.semanticGroups || [],
        hierarchicalStructure: this.themeSemanticData?.hierarchicalStructure || {}
      },
      recommendations: this.generateRecommendations(documentIds, graphData)
    };

    return report;
  }

  /**
   * Get system statistics
   */
  getSystemStats() {
    return {
      documentsProcessed: this.themeStorage.documents.size,
      themesExtracted: this.themeStorage.themes.size,
      definitionsFound: this.themeStorage.definitions.size,
      totalConnections: this.themeStorage.getDocumentConnectivityMap().length,
      cacheSize: this.processingCache.size,
      analysisHistory: this.analysisHistory.length,
      lastAnalysis: this.analysisHistory[this.analysisHistory.length - 1]
    };
  }

  // Helper methods for graph optimization and visualization
  
  calculateOptimalPositions(documentIds) {
    const docCount = documentIds.length;
    const positions = {
      documents: [],
      sharedThemes: []
    };

    // Position documents in a circle
    documentIds.forEach((docId, index) => {
      const angle = (index / docCount) * Math.PI * 2;
      const radius = Math.max(30, docCount * 5);
      
      positions.documents.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 0
      });
    });

    // Position shared themes in inner circles
    const sharedThemes = this.themeStorage.getSharedThemes(2);
    sharedThemes.forEach((theme, index) => {
      const angle = (index / sharedThemes.length) * Math.PI * 2;
      const radius = Math.max(15, docCount * 2);
      
      positions.sharedThemes.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 8 + (theme.documents.length * 2)
      });
    });

    return positions;
  }

  getNodeColor(type, category = 'general') {
    const colors = {
      document: '#4F46E5',
      'shared-theme': {
        conceptual: '#EF4444',
        methodological: '#F59E0B',
        technological: '#10B981',
        environmental: '#059669',
        economic: '#DC2626',
        social: '#7C3AED',
        regulatory: '#B45309',
        general: '#6B7280'
      },
      'unique-theme': '#94A3B8',
      definition: '#F472B6'
    };

    if (type === 'shared-theme' && typeof colors[type] === 'object') {
      return colors[type][category] || colors[type].general;
    }

    return colors[type] || '#6B7280';
  }

  getLinkColor(strength, opacity = 1.0) {
    if (strength >= 0.8) return `rgba(239, 68, 68, ${opacity})`; // Strong - Red
    if (strength >= 0.6) return `rgba(245, 158, 11, ${opacity})`; // Medium - Orange  
    if (strength >= 0.4) return `rgba(16, 185, 129, ${opacity})`; // Weak - Green
    return `rgba(156, 163, 175, ${opacity})`; // Very weak - Gray
  }

  calculateLinkStrength(docId, themeId) {
    // Get link metadata if available
    const linkKey = `${docId}-${themeId}`;
    const metadata = this.themeStorage.linkMetadata?.get(linkKey);
    
    if (metadata) {
      return metadata.confidence;
    }

    // Fallback calculation
    const theme = this.themeStorage.themes.get(themeId);
    return theme ? Math.min(theme.importance, 1.0) : 0.5;
  }

  calculateDocumentImportance(docId) {
    const relatedDocs = this.themeStorage.getRelatedDocuments(docId);
    const themeCount = this.themeStorage.themesByDocument.get(docId).size;
    const defCount = this.themeStorage.definitionsByDocument.get(docId).size;
    
    return (relatedDocs.length * 0.4) + (themeCount * 0.3) + (defCount * 0.3);
  }

  calculateGraphDensity(nodes, links) {
    const nodeCount = nodes.filter(n => n.type === 'document').length;
    if (nodeCount < 2) return 0;
    
    const maxPossibleLinks = (nodeCount * (nodeCount - 1)) / 2;
    const actualDocLinks = links.filter(l => l.type === 'document-connection').length;
    
    return actualDocLinks / maxPossibleLinks;
  }

  getSemanticSimilarity(docId1, docId2) {
    const relationshipKey = `${docId1}-${docId2}`;
    const reverseKey = `${docId2}-${docId1}`;
    
    const relationship = this.documentRelationships?.get(relationshipKey) || 
                        this.documentRelationships?.get(reverseKey);
                        
    return relationship?.contentSimilarity || 0;
  }

  findMostConnectedDocument(documentIds) {
    let maxConnections = 0;
    let mostConnected = null;

    documentIds.forEach(docId => {
      const connections = this.themeStorage.getRelatedDocuments(docId).length;
      if (connections > maxConnections) {
        maxConnections = connections;
        mostConnected = docId;
      }
    });

    return mostConnected ? {
      documentId: mostConnected,
      document: this.themeStorage.documents.get(mostConnected),
      connectionCount: maxConnections
    } : null;
  }

  findIsolatedDocuments(documentIds) {
    return documentIds.filter(docId => {
      const connections = this.themeStorage.getRelatedDocuments(docId);
      return connections.length === 0;
    }).map(docId => ({
      documentId: docId,
      document: this.themeStorage.documents.get(docId)
    }));
  }

  analyzeThemeCategories() {
    const categories = {};
    
    this.themeStorage.themes.forEach(theme => {
      const category = theme.category || 'general';
      if (!categories[category]) {
        categories[category] = { count: 0, themes: [], avgImportance: 0 };
      }
      
      categories[category].count++;
      categories[category].themes.push(theme.label);
      categories[category].avgImportance += theme.importance || 0;
    });

    // Calculate averages
    Object.values(categories).forEach(category => {
      category.avgImportance /= category.count;
    });

    return categories;
  }

  generateRecommendations(documentIds, graphData) {
    const recommendations = [];

    // Check for isolated documents
    const isolated = this.findIsolatedDocuments(documentIds);
    if (isolated.length > 0) {
      recommendations.push({
        type: 'connectivity',
        priority: 'high',
        message: `${isolated.length} document(s) appear isolated. Consider re-analyzing for missed connections or adding bridging documents.`,
        action: 'review_isolation',
        affectedDocuments: isolated.map(d => d.documentId)
      });
    }

    // Check graph density
    if (graphData.metadata.graphDensity < 0.3) {
      recommendations.push({
        type: 'density',
        priority: 'medium', 
        message: 'Document collection has low connectivity. Consider adding more related documents or reviewing theme extraction.',
        action: 'improve_density',
        currentDensity: graphData.metadata.graphDensity
      });
    }

    // Check for potential missing themes
    const avgThemesPerDoc = documentIds.reduce((sum, docId) => {
      return sum + this.themeStorage.themesByDocument.get(docId).size;
    }, 0) / documentIds.length;

    if (avgThemesPerDoc < 3) {
      recommendations.push({
        type: 'themes',
        priority: 'medium',
        message: 'Low average themes per document. Consider lowering confidence threshold or reviewing extraction prompt.',
        action: 'review_theme_extraction',
        currentAverage: avgThemesPerDoc
      });
    }

    return recommendations;
  }

  /**
   * Export complete system state
   */
  exportSystemState() {
    return {
      themeStorage: this.themeStorage.export(),
      config: this.config,
      analysisHistory: this.analysisHistory,
      documentRelationships: this.documentRelationships ? 
        Array.from(this.documentRelationships.entries()) : [],
      themeSemanticData: this.themeSemanticData,
      exportedAt: new Date()
    };
  }

  /**
   * Import system state
   */
  importSystemState(state) {
    this.themeStorage.import(state.themeStorage);
    this.config = { ...this.config, ...state.config };
    this.analysisHistory = state.analysisHistory || [];
    
    if (state.documentRelationships) {
      this.documentRelationships = new Map(state.documentRelationships);
    }
    
    this.themeSemanticData = state.themeSemanticData;
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.DocumentConnectionAnalyzer = DocumentConnectionAnalyzer;
} else if (typeof module !== 'undefined') {
  module.exports = DocumentConnectionAnalyzer;
}