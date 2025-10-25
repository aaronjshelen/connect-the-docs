/**
 * Enhanced Theme & Document Storage System
 *
 * This module provides an optimized way to store and query document themes,
 * definitions, and relationships. It includes:
 * - Normalized theme storage with semantic grouping
 * - Efficient relationship indexing
 * - Weighted scoring for document connections
 * - Fast lookup capabilities
 */

class ThemeStorageSystem {
  constructor() {
    // Core data structures
    this.documents = new Map(); // docId -> Document
    this.themes = new Map(); // themeId -> Theme
    this.definitions = new Map(); // definitionId -> Definition

    // Indexing structures for fast lookups
    this.themesByDocument = new Map(); // docId -> Set<themeId>
    this.documentsByTheme = new Map(); // themeId -> Set<docId>
    this.definitionsByDocument = new Map(); // docId -> Set<definitionId>
    this.documentsByDefinition = new Map(); // definitionId -> Set<docId>

    // Semantic similarity cache
    this.similarityCache = new Map(); // "theme1|theme2" -> similarity score
    this.themeGroups = new Map(); // groupId -> Set<themeId>

    // Connection strength cache
    this.connectionStrengths = new Map(); // "doc1|doc2" -> strength score

    this.nextId = 1;
  }

  /**
   * Add a document to the storage system
   */
  addDocument(title, content, metadata = {}) {
    const docId = `doc-${this.nextId++}`;
    const document = {
      id: docId,
      title,
      content,
      metadata,
      addedAt: new Date(),
      themes: new Set(),
      definitions: new Set(),
      summary: "",
    };

    this.documents.set(docId, document);
    this.themesByDocument.set(docId, new Set());
    this.definitionsByDocument.set(docId, new Set());

    return docId;
  }

  /**
   * Add a theme with normalization and semantic grouping
   */
  addTheme(label, category = "general", importance = 1.0, semanticTags = []) {
    const normalizedLabel = this.normalizeText(label);
    const themeId = `theme-${normalizedLabel.replace(/\s+/g, "-")}`;

    // Check if similar theme already exists
    const similarTheme = this.findSimilarTheme(label, normalizedLabel);
    if (similarTheme) {
      return similarTheme.id;
    }

    const theme = {
      id: themeId,
      label: label.trim(),
      normalizedLabel,
      category,
      importance,
      semanticTags,
      documents: new Set(),
      relatedThemes: new Set(),
      frequency: 0,
      createdAt: new Date(),
    };

    this.themes.set(themeId, theme);
    this.documentsByTheme.set(themeId, new Set());

    // Group with similar themes
    this.groupSimilarThemes(themeId, theme);

    return themeId;
  }

  /**
   * Add a definition with normalization
   */
  addDefinition(term, definition, context = "", importance = 1.0) {
    const normalizedTerm = this.normalizeText(term);
    const definitionId = `def-${normalizedTerm.replace(/\s+/g, "-")}`;

    // Check if definition already exists
    if (this.definitions.has(definitionId)) {
      return definitionId;
    }

    const def = {
      id: definitionId,
      term: term.trim(),
      normalizedTerm,
      definition: definition.trim(),
      context,
      importance,
      documents: new Set(),
      frequency: 0,
      createdAt: new Date(),
    };

    this.definitions.set(definitionId, def);
    this.documentsByDefinition.set(definitionId, new Set());

    return definitionId;
  }

  /**
   * Link a document to a theme
   */
  linkDocumentToTheme(docId, themeId, confidence = 1.0, context = "") {
    if (!this.documents.has(docId) || !this.themes.has(themeId)) {
      throw new Error("Document or theme not found");
    }

    // Add bidirectional links
    this.themesByDocument.get(docId).add(themeId);
    this.documentsByTheme.get(themeId).add(docId);

    // Update document and theme objects
    const doc = this.documents.get(docId);
    const theme = this.themes.get(themeId);

    doc.themes.add(themeId);
    theme.documents.add(docId);
    theme.frequency++;

    // Store link metadata
    const linkKey = `${docId}-${themeId}`;
    if (!this.linkMetadata) this.linkMetadata = new Map();
    this.linkMetadata.set(linkKey, {
      confidence,
      context,
      createdAt: new Date(),
    });

    // Invalidate connection cache for affected documents
    this.invalidateConnectionCache(docId);
  }

  /**
   * Link a document to a definition
   */
  linkDocumentToDefinition(docId, definitionId, confidence = 1.0) {
    if (!this.documents.has(docId) || !this.definitions.has(definitionId)) {
      throw new Error("Document or definition not found");
    }

    this.definitionsByDocument.get(docId).add(definitionId);
    this.documentsByDefinition.get(definitionId).add(docId);

    const doc = this.documents.get(docId);
    const def = this.definitions.get(definitionId);

    doc.definitions.add(definitionId);
    def.documents.add(docId);
    def.frequency++;

    this.invalidateConnectionCache(docId);
  }

  /**
   * Find documents that share themes with a given document
   */
  getRelatedDocuments(docId, minSharedThemes = 1, includeDefinitions = true) {
    if (!this.documents.has(docId)) return [];

    const docThemes = this.themesByDocument.get(docId);
    const docDefinitions = this.definitionsByDocument.get(docId);
    const relatedDocs = new Map(); // docId -> { sharedThemes, sharedDefinitions, score }

    // Find documents sharing themes
    for (const themeId of docThemes) {
      const docsWithTheme = this.documentsByTheme.get(themeId);
      for (const otherDocId of docsWithTheme) {
        if (otherDocId === docId) continue;

        if (!relatedDocs.has(otherDocId)) {
          relatedDocs.set(otherDocId, {
            sharedThemes: new Set(),
            sharedDefinitions: new Set(),
            score: 0,
          });
        }

        const relation = relatedDocs.get(otherDocId);
        relation.sharedThemes.add(themeId);

        // Weight by theme importance
        const theme = this.themes.get(themeId);
        relation.score += theme.importance;
      }
    }

    // Find documents sharing definitions
    if (includeDefinitions) {
      for (const definitionId of docDefinitions) {
        const docsWithDefinition = this.documentsByDefinition.get(definitionId);
        for (const otherDocId of docsWithDefinition) {
          if (otherDocId === docId) continue;

          if (!relatedDocs.has(otherDocId)) {
            relatedDocs.set(otherDocId, {
              sharedThemes: new Set(),
              sharedDefinitions: new Set(),
              score: 0,
            });
          }

          const relation = relatedDocs.get(otherDocId);
          relation.sharedDefinitions.add(definitionId);

          // Weight by definition importance
          const def = this.definitions.get(definitionId);
          relation.score += def.importance * 1.2; // Definitions weighted higher
        }
      }
    }

    // Filter by minimum shared themes and sort by score
    return Array.from(relatedDocs.entries())
      .filter(
        ([_, relation]) =>
          relation.sharedThemes.size + relation.sharedDefinitions.size >=
          minSharedThemes
      )
      .map(([docId, relation]) => ({
        documentId: docId,
        document: this.documents.get(docId),
        sharedThemes: Array.from(relation.sharedThemes).map((id) =>
          this.themes.get(id)
        ),
        sharedDefinitions: Array.from(relation.sharedDefinitions).map((id) =>
          this.definitions.get(id)
        ),
        connectionStrength: relation.score,
        totalShared:
          relation.sharedThemes.size + relation.sharedDefinitions.size,
      }))
      .sort((a, b) => b.connectionStrength - a.connectionStrength);
  }

  /**
   * Get all themes shared by multiple documents
   */
  getSharedThemes(minDocuments = 2) {
    return Array.from(this.themes.values())
      .filter((theme) => theme.documents.size >= minDocuments)
      .map((theme) => ({
        ...theme,
        documents: Array.from(theme.documents).map((id) =>
          this.documents.get(id)
        ),
        sharedBy: Array.from(theme.documents),
      }))
      .sort((a, b) => b.documents.length - a.documents.length);
  }

  /**
   * Get document connectivity map for graph visualization
   */
  getDocumentConnectivityMap() {
    const connections = [];
    const processedPairs = new Set();

    for (const [docId] of this.documents) {
      const related = this.getRelatedDocuments(docId, 1, true);

      for (const relation of related) {
        const pairKey = [docId, relation.documentId].sort().join("|");
        if (processedPairs.has(pairKey)) continue;

        processedPairs.add(pairKey);
        connections.push({
          source: docId,
          target: relation.documentId,
          strength: relation.connectionStrength,
          sharedThemes: relation.sharedThemes.map((t) => t.label),
          sharedDefinitions: relation.sharedDefinitions.map((d) => d.term),
          totalShared: relation.totalShared,
        });
      }
    }

    return connections.sort((a, b) => b.strength - a.strength);
  }

  /**
   * Analyze theme clusters and identify potential theme hierarchies
   */
  analyzeThemeClusters() {
    const clusters = new Map();
    const processed = new Set();

    for (const [themeId, theme] of this.themes) {
      if (processed.has(themeId)) continue;

      const cluster = this.buildThemeCluster(themeId, processed);
      if (cluster.size > 1) {
        const clusterId = `cluster-${clusters.size + 1}`;
        clusters.set(clusterId, {
          id: clusterId,
          themes: Array.from(cluster).map((id) => this.themes.get(id)),
          commonDocuments: this.findCommonDocuments(cluster),
          strength: this.calculateClusterStrength(cluster),
        });
      }
    }

    return Array.from(clusters.values()).sort(
      (a, b) => b.strength - a.strength
    );
  }

  // Private helper methods
  normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  findSimilarTheme(label, normalizedLabel) {
    const threshold = 0.8;

    for (const theme of this.themes.values()) {
      const similarity = this.calculateSimilarity(
        normalizedLabel,
        theme.normalizedLabel
      );
      if (similarity >= threshold) {
        return theme;
      }
    }

    return null;
  }

  calculateSimilarity(str1, str2) {
    // Simple Jaccard similarity for now - could be enhanced with semantic embeddings
    const set1 = new Set(str1.split(" "));
    const set2 = new Set(str2.split(" "));

    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  groupSimilarThemes(themeId, theme) {
    // Find and group similar themes (could be enhanced with ML clustering)
    for (const [existingId, existingTheme] of this.themes) {
      if (existingId === themeId) continue;

      const similarity = this.calculateSimilarity(
        theme.normalizedLabel,
        existingTheme.normalizedLabel
      );

      if (similarity >= 0.6) {
        theme.relatedThemes.add(existingId);
        existingTheme.relatedThemes.add(themeId);
      }
    }
  }

  invalidateConnectionCache(docId) {
    // Remove cached connection strengths involving this document
    for (const key of this.connectionStrengths.keys()) {
      if (key.includes(docId)) {
        this.connectionStrengths.delete(key);
      }
    }
  }

  buildThemeCluster(startThemeId, processed) {
    const cluster = new Set([startThemeId]);
    const toProcess = [startThemeId];

    while (toProcess.length > 0) {
      const currentId = toProcess.shift();
      processed.add(currentId);

      const theme = this.themes.get(currentId);
      for (const relatedId of theme.relatedThemes) {
        if (!cluster.has(relatedId)) {
          cluster.add(relatedId);
          toProcess.push(relatedId);
        }
      }
    }

    return cluster;
  }

  findCommonDocuments(themeIds) {
    const themeSets = Array.from(themeIds).map(
      (id) => this.documentsByTheme.get(id) || new Set()
    );

    if (themeSets.length === 0) return new Set();

    let common = new Set(themeSets[0]);
    for (let i = 1; i < themeSets.length; i++) {
      common = new Set([...common].filter((x) => themeSets[i].has(x)));
    }

    return common;
  }

  calculateClusterStrength(themeIds) {
    const commonDocs = this.findCommonDocuments(themeIds);
    const totalDocs = new Set();

    for (const themeId of themeIds) {
      const docs = this.documentsByTheme.get(themeId) || new Set();
      for (const docId of docs) {
        totalDocs.add(docId);
      }
    }

    return totalDocs.size > 0 ? commonDocs.size / totalDocs.size : 0;
  }

  // Export/import functionality
  export() {
    return {
      documents: Array.from(this.documents.entries()),
      themes: Array.from(this.themes.entries()),
      definitions: Array.from(this.definitions.entries()),
      indices: {
        themesByDocument: Array.from(this.themesByDocument.entries()).map(
          ([k, v]) => [k, Array.from(v)]
        ),
        documentsByTheme: Array.from(this.documentsByTheme.entries()).map(
          ([k, v]) => [k, Array.from(v)]
        ),
        definitionsByDocument: Array.from(
          this.definitionsByDocument.entries()
        ).map(([k, v]) => [k, Array.from(v)]),
        documentsByDefinition: Array.from(
          this.documentsByDefinition.entries()
        ).map(([k, v]) => [k, Array.from(v)]),
      },
      metadata: {
        nextId: this.nextId,
        exportedAt: new Date(),
      },
    };
  }

  import(data) {
    // Clear existing data
    this.documents.clear();
    this.themes.clear();
    this.definitions.clear();
    this.themesByDocument.clear();
    this.documentsByTheme.clear();
    this.definitionsByDocument.clear();
    this.documentsByDefinition.clear();

    // Import data
    this.documents = new Map(data.documents);
    this.themes = new Map(data.themes);
    this.definitions = new Map(data.definitions);

    // Rebuild indices
    data.indices.themesByDocument.forEach(([k, v]) => {
      this.themesByDocument.set(k, new Set(v));
    });
    data.indices.documentsByTheme.forEach(([k, v]) => {
      this.documentsByTheme.set(k, new Set(v));
    });
    data.indices.definitionsByDocument.forEach(([k, v]) => {
      this.definitionsByDocument.set(k, new Set(v));
    });
    data.indices.documentsByDefinition.forEach(([k, v]) => {
      this.documentsByDefinition.set(k, new Set(v));
    });

    this.nextId = data.metadata.nextId || 1;
  }
}

// Export for use in other modules
if (typeof window !== "undefined") {
  window.ThemeStorageSystem = ThemeStorageSystem;
} else if (typeof module !== "undefined") {
  module.exports = ThemeStorageSystem;
}
