# TODO List

## 🎯 Priority: High

- Checkbox filtering
  - ask Chatbot to highlight certain nodes.
- docx/pdf -> txt file conversion
- change UI color
- create DEMO
- check paths
  - use Claude API?

### 1. Adjust LLM Prompt for Better Responses

#### Theme Extraction Improvements

- [ ] Add more specific examples in the prompt for diverse document types
- [ ] Request LLM to provide confidence scores for each theme
- [ ] Add validation step to ensure themes are meaningful (not too generic)
- [ ] Request hierarchical theme structure more explicitly
- [ ] Add prompt instruction to avoid single-word themes (prefer descriptive phrases)

#### Relationship Analysis Enhancements

- [ ] Improve prompt to identify causal relationships vs. correlational
- [ ] Request specific evidence/quotes when identifying connections
- [ ] Add prompt section for identifying contrasting themes (not just shared ones)
- [ ] Request relationship type classification (supports, contradicts, extends, etc.)

#### Definition Extraction

- [ ] Add prompt instruction to extract domain-specific terminology
- [ ] Request multiple definitions when terms have different contexts
- [ ] Add examples of good vs. bad definition extraction

#### Edge Cases

- [ ] Handle very short documents (< 100 words)
- [ ] Handle very long documents (> 10,000 words) - add chunking strategy
- [ ] Handle documents with mixed languages
- [ ] Handle documents with code snippets or data tables
- [ ] Handle documents with mostly numeric content

#### Response Quality

- [ ] Add prompt instruction to avoid hallucination
- [ ] Request structured JSON with validation markers
- [ ] Add retry logic for malformed responses
- [ ] Implement response quality scoring

### 2. Fix UI

#### Visual Improvements

- [ ] Add loading skeleton screens instead of just progress bars
- [ ] Improve color scheme for better contrast (accessibility)
- [ ] Add visual indicators for node types (different shapes for documents vs themes)
- [ ] Improve link/edge styling (gradient colors based on strength?)
- [ ] Add legend explaining node colors and sizes

#### User Experience

- [ ] Add keyboard shortcuts (ESC to deselect, Space to toggle rotation, etc.)
- [ ] Implement undo/redo for camera positions
- [ ] Add "breadcrumb" showing current focused node path
- [ ] Improve error messages with actionable suggestions
- [ ] Add tooltips to all UI buttons explaining their function

#### Accessibility (WCAG 2.1)

- [ ] Add ARIA labels to all interactive elements
- [ ] Ensure keyboard navigation works for all features
- [ ] Add screen reader descriptions for graph state
- [ ] Ensure color contrast meets WCAG AA standards
- [ ] Add focus indicators for keyboard navigation
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)

#### Performance

- [ ] Add FPS counter toggle for debugging
- [ ] Optimize render loop (only update on changes, not every frame)
- [ ] Implement level-of-detail (LOD) for large graphs (> 100 nodes)
- [ ] Add option to disable visual effects for low-end devices
- [ ] Lazy load Three.js library

#### Error Handling

- [ ] Better error messages when API key is missing
- [ ] Handle network timeouts gracefully
- [ ] Add retry button for failed analyses
- [ ] Show API rate limit errors clearly
- [ ] Add validation for uploaded file formats

## 🎯 Priority: Medium

### 3. Feature Enhancements

#### Graph Visualization

- [ ] Add minimap/overview in corner
- [ ] Implement graph layout presets (circular, hierarchical, force-directed)
- [ ] Add "fly-through" animation mode
- [ ] Implement node clustering for large graphs
- [ ] Add time-series view if documents have timestamps

#### Export & Sharing

- [ ] Export graph as image (PNG/SVG)
- [ ] Export analysis report as PDF
- [ ] Export data as JSON/CSV
- [ ] Generate shareable link (save state to URL params or cloud)
- [ ] Add print-friendly view

#### Analysis Features

- [ ] Add sentiment analysis to documents
- [ ] Implement topic modeling (LDA) as alternative to LLM
- [ ] Add named entity recognition (people, places, organizations)
- [ ] Show document similarity matrix view
- [ ] Add "bridge documents" detection (docs connecting disparate clusters)

#### User Settings

- [ ] Save user preferences to localStorage
- [ ] Add theme switcher (light/dark mode)
- [ ] Allow custom color schemes for nodes
- [ ] Configurable graph physics parameters (exposed in UI)

### 4. Documentation

- [ ] Add inline code comments for complex algorithms
- [ ] Create video tutorial/demo
- [ ] Add JSDoc comments to all functions
- [ ] Create architecture diagram
- [ ] Add API documentation for each module
- [ ] Create troubleshooting guide

### 5. Testing

- [ ] Add unit tests for theme-storage-system.js
- [ ] Add unit tests for semantic-analyzer.js
- [ ] Add integration tests for analysis pipeline
- [ ] Test with 100+ documents (performance testing)
- [ ] Cross-browser testing (Safari, Firefox, Edge)
- [ ] Test with different API key permissions

## 🎯 Priority: Low

### 6. Advanced Features

- [ ] Add collaborative features (multiple users)
- [ ] Implement graph diffing (compare two analyses)
- [ ] Add version control for document sets
- [ ] Implement graph query language
- [ ] Add plugin system for custom analyzers
- [ ] Support for other LLM providers (Anthropic, Cohere, etc.)

### 7. Performance Optimizations

- [ ] Implement WebWorkers for analysis processing
- [ ] Add caching layer for embeddings
- [ ] Optimize Three.js geometry (instancing)
- [ ] Implement graph streaming for very large datasets
- [ ] Add compression for stored analysis results

### 8. Deployment

- [ ] Create Docker container
- [ ] Add backend option (Node.js) for API key security
- [ ] Deploy demo to GitHub Pages
- [ ] Add CI/CD pipeline
- [ ] Create browser extension version

---

## 📊 Progress Tracking

**Overall Progress:** 🟩🟩🟩⬜⬜⬜⬜⬜⬜⬜ 30%

### Completed ✅

- [x] 3D graph visualization with Three.js
- [x] OpenAI integration for analysis
- [x] Force-directed layout algorithm
- [x] Hover and focus interactions
- [x] Orbit controls around focused nodes
- [x] AI chatbot integration
- [x] Search functionality
- [x] Optimized storage system
- [x] Semantic similarity analysis
- [x] Real-time processing progress

### In Progress 🔄

- [ ] LLM prompt optimization
- [ ] UI improvements

### Blocked 🚫

- None currently

---

**Last Updated:** October 25, 2025
