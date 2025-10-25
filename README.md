# Document Knowledge Graph Analyzer

An interactive 3D knowledge graph visualization tool that analyzes document relationships using AI-powered semantic analysis. Upload multiple documents and discover connections, shared themes, and conceptual relationships visualized in an immersive 3D graph.

![Document Knowledge Graph](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

### 📊 Interactive 3D Visualization

- **Force-directed graph layout** with optimized node spacing
- **Hover interactions** - nodes scale up and glow when hovered
- **Click to focus** - smooth camera animation zooms to selected nodes
- **Orbit controls** - rotate and zoom around focused nodes
- **Auto-rotate mode** - automated graph rotation for presentations

### 🤖 AI-Powered Analysis

- **OpenAI GPT-4o-mini** integration for intelligent document analysis
- **Dynamic theme extraction** - no predefined categories, analyzes ANY content
- **Semantic similarity** using OpenAI embeddings (text-embedding-3-small)
- **Relationship detection** - automatically finds conceptual connections
- **AI Chatbot** - ask questions about your document relationships

### 📈 Advanced Analytics

- **Optimized storage system** - O(1) lookups with bidirectional indexing
- **Theme hierarchies** - identifies main themes and subthemes
- **Connection strength scoring** - quantifies relationship strength
- **Shared theme analysis** - finds documents with common concepts
- **Real-time search** - filter nodes by document or theme names

### 🎨 Modern UI

- **Dark theme** with glassmorphism effects
- **Responsive sidebar** with custom scrollbars
- **Live processing progress** indicators
- **Detailed node information** overlays
- **Hover tooltips** for quick node identification

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/document-knowledge-graph.git
   cd document-knowledge-graph
   ```

2. **Configure your API key**

   Edit `config.js` and add your OpenAI API key:

   ```javascript
   window.CONFIG = {
     OPENAI_API_KEY: "your-api-key-here",
   };
   ```

3. **Open the application**

   Simply open `enhanced-analyzer.html` in your web browser!

   No build process required - this is a pure client-side application.

## 📖 Usage

### 1. Upload Documents

- Click **"Choose Files"** button
- Select multiple text files (.txt)
- Files are loaded instantly in the browser

### 2. Process Documents

- Click **"Analyze Documents"** button
- AI analyzes themes, definitions, and relationships
- Progress updates show analysis stages

### 3. Explore the Graph

- **Hover** over nodes to see quick info
- **Click** nodes to focus and view details
- **Drag** to rotate around focused node
- **Scroll** to zoom in/out
- **🏠 Reset** button returns to overview

### 4. Search & Filter

- Use search bar to find specific documents/themes
- Click search results to focus on nodes

### 5. Chat with AI

- Ask questions about your documents
- Example: "What themes do these documents share?"
- AI has full context of your graph analysis

## 🎮 Controls

| Action                 | Control         |
| ---------------------- | --------------- |
| **Rotate camera**      | Drag with mouse |
| **Zoom in/out**        | Scroll wheel    |
| **Select node**        | Click node      |
| **Reset view**         | 🏠 button       |
| **Toggle auto-rotate** | 🔄 button       |
| **Manual zoom**        | ➕ ➖ buttons   |

## 🏗️ Architecture

### Core Components

#### `theme-storage-system.js`

Optimized data structure for O(1) lookups:

- Bidirectional Maps for themes ↔ documents
- Efficient relationship queries
- Memory-optimized storage

#### `semantic-analyzer.js`

AI-powered semantic analysis:

- OpenAI embeddings integration
- Cosine similarity calculations
- Conceptual connection detection

#### `enhanced-prompts.js`

Structured LLM prompts for:

- Theme extraction (no predefined categories)
- Definition identification
- Relationship analysis

#### `document-connection-analyzer.js`

Main orchestrator that:

- Processes documents through AI pipeline
- Builds optimized graph structure
- Generates analysis reports

#### `enhanced-analyzer.html`

React + Three.js frontend:

- 3D graph visualization
- Interactive UI components
- Real-time state management

## 🔧 Configuration

Edit the `config` object in `enhanced-analyzer.html` (lines 476-483):

```javascript
{
  minThemeConfidence: 0.7,           // Minimum confidence for theme extraction
  maxThemesPerDocument: 8,            // Maximum themes per document
  semanticSimilarityThreshold: 0.7,   // Threshold for semantic connections
  connectionStrengthThreshold: 0.4,   // Minimum connection strength
  enableSemanticAnalysis: true,       // Enable embeddings analysis
  enableHierarchicalThemes: true      // Enable theme hierarchies
}
```

## 📁 Project Structure

```
document-knowledge-graph/
├── enhanced-analyzer.html          # Main application (React + Three.js)
├── config.js                       # API key configuration
├── theme-storage-system.js         # Optimized storage data structure
├── semantic-analyzer.js            # AI semantic analysis engine
├── enhanced-prompts.js             # LLM prompt templates
├── document-connection-analyzer.js # Main analysis orchestrator
├── GRAPH_CONTROLS_GUIDE.md        # User control guide
├── README.md                       # This file
└── test files/                     # Sample documents for testing
    ├── beyblades.txt
    ├── climate_change_and_fish_migration_patterns.txt
    ├── Energy_Analytics_and_Grid_Optimization.txt
    ├── Marine_Biodiversity_and_Coral_Reef_Fish.txt
    ├── Solar_Forecasting_Trends.txt
    ├── sustainable_fisheries_and_ocean_conservation.txt
    └── Wind_Integration_Challenges.txt
```

## 🎯 Use Cases

- **Research Analysis** - Find connections between academic papers
- **Content Organization** - Understand relationships in documentation
- **Knowledge Discovery** - Uncover hidden themes across documents
- **Literature Review** - Visualize research landscapes
- **Documentation Management** - Organize technical documentation
- **Creative Writing** - Track themes and character relationships

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 TODO

- [ ] **Adjust LLM prompt for better responses**
  - Improve theme extraction accuracy
  - Better handling of edge cases
  - More nuanced relationship detection
- [ ] **Fix UI**
  - Improve responsive design for mobile
  - Better error message styling
  - Enhanced loading states
  - Accessibility improvements (ARIA labels, keyboard navigation)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenAI** - GPT-4o-mini and text-embedding-3-small APIs
- **Three.js** - 3D graphics library
- **React** - UI framework

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using React, Three.js, and OpenAI**
