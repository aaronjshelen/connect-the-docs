# Enhanced Graph Controls & Features Guide

## 🎮 Graph Navigation Controls

### Mouse Controls
- **Click + Drag**: Rotate the entire graph in 3D space (any mouse button)
- **Scroll Wheel**: Zoom in and out (smooth distance-based zooming)
- **Click on Node**: Select and focus on a specific node

### Control Buttons (Top-Left Corner)
- **🏠 Home**: Reset camera to default view
- **➕ Zoom In**: Move camera closer to the graph
- **➖ Zoom Out**: Move camera away from the graph
- **🔄 Auto-Rotate**: Toggle automatic rotation of the graph

## 🔍 Search Feature

### How to Use Search
1. Type in the "Search Graph" input box
2. Search works for:
   - Document titles
   - Theme names
   - Any node labels
3. Click on a search result to:
   - Focus the camera on that node
   - Display its details in the overlay

### Search Tips
- Search is case-insensitive
- Partial matches are supported
- Results show up to 10 most relevant items

## 💬 Chatbot / Question Feature

### AI-Powered Chatbot
The chatbot now uses **GPT-4o-mini** to intelligently answer your questions about the document analysis!

**How It Works:**
- The LLM has full context of your analysis (documents, themes, connections)
- Ask questions in natural language
- Get intelligent, context-aware responses
- The AI understands what you want and provides relevant insights

**Example Questions:**
- "How many documents are there?"
- "What are the most connected documents?"
- "Are there any isolated documents?"
- "What are the shared themes?"
- "Which documents discuss renewable energy?"
- "Compare the themes in document A and document B"
- "What's the main topic of this collection?"
- "Which document should I read first?"
- "Find documents about climate change"
- "Explain the connections between these documents"

### Advanced Queries
The LLM can handle complex questions:
- **Comparisons**: "How do documents X and Y relate?"
- **Summaries**: "Summarize the main findings"
- **Recommendations**: "Which documents are most important?"
- **Analysis**: "What patterns do you see in the themes?"
- **Navigation**: "Show me documents about [topic]"

### Features
- **Context-aware**: The AI knows all your document titles, themes, and connections
- **Natural language**: Ask questions however you like
- **Concise responses**: 2-3 sentence answers focused on your question
- **Actionable insights**: Get recommendations and suggestions
- **Chat history**: Previous messages are maintained during your session

## 📊 Force-Directed Graph Layout

### What It Does
The graph now uses an **enhanced force-directed algorithm** that:
- **Strongly repels** nodes from each other (4x stronger than before)
- **Gently attracts** connected nodes together
- **Spreads nodes widely** to prevent overlap and show connections clearly
- **Organizes** the graph automatically for maximum clarity
- **Scales** to fit all nodes with generous spacing

### Layout Parameters (Optimized)
- **Repulsion Strength**: 2000 (prevents node overlap)
- **Attraction Strength**: 0.05 (keeps connections visible)
- **Iterations**: 150 (more time for nodes to settle)
- **Scale Factor**: 100 (wider spread)
- **Damping**: 0.85 (smooth, stable movement)

### Layout Features
- **Wide Spacing**: Nodes are spread far apart so connections are clearly visible
- **No Overlap**: Strong repulsion ensures nodes never touch
- **Clustered by Connection**: Related documents appear in the same region but well-spaced
- **Hierarchical Structure**: Shared themes positioned between connected documents
- **3D Positioning**: Uses Z-axis for additional organization and depth
- **Clear Links**: Connection lines are easily visible between nodes

### Node Types & Colors
- **🔵 Document Nodes** (Blue): Primary documents
- **🔴 Shared Theme Nodes** (Red/Orange): Themes in multiple documents
  - Color varies by category (technological, environmental, etc.)
- **⚪ Unique Theme Nodes** (Gray): Document-specific themes
- **🔗 Links**: Lines connecting related nodes
  - Thickness = connection strength
  - Opacity = relationship confidence

## 🎯 Best Practices

### Viewing the Graph
1. **Start with Reset**: Click 🏠 to get the default view
2. **Explore**: Use right-click drag to rotate and see connections from different angles
3. **Focus**: Click nodes to see details and auto-focus
4. **Search**: Use search to quickly find specific documents or themes

### Understanding Connections
- **Thick lines** = Strong thematic connections
- **Thin lines** = Weak or single-theme connections
- **Node proximity** = Conceptual similarity
- **Node size** = Number of themes or importance

### Performance Tips
- Graphs with 5-20 documents work best
- Enable semantic analysis for better theme detection
- Adjust "Connection Strength Threshold" to filter weak connections
- Use search instead of manually looking for nodes in large graphs

## 🔧 Configuration Options

### Theme Confidence Threshold (0.1 - 1.0)
- **Lower values** (0.3-0.5): More themes, more connections, busier graph
- **Higher values** (0.7-0.9): Fewer but higher-quality themes, cleaner graph
- **Recommended**: 0.7 for balanced results

### Max Themes per Document (3-15)
- **Lower values**: Focus on most important themes only
- **Higher values**: Capture more nuanced concepts
- **Recommended**: 8 for comprehensive analysis

### Semantic Analysis
- **Enabled**: Uses AI embeddings to find similar concepts with different wording
- **Disabled**: Only exact word matches (faster but less accurate)
- **Recommended**: Enabled for best results

## 🐛 Troubleshooting

### Graph Not Showing
- Ensure documents are uploaded
- Click "Analyze Documents" button
- Check browser console for errors
- Verify API key in config.js

### Graph Too Cluttered
- Increase "Theme Confidence Threshold"
- Reduce "Max Themes per Document"
- Increase "Connection Strength Threshold" in config
- Use search to focus on specific nodes

### Performance Issues
- Reduce number of documents (< 20 recommended)
- Disable "Enable Semantic Analysis" for faster processing
- Close other browser tabs
- Try refreshing the page

### Controls Not Working
- Ensure graph has loaded completely
- Try clicking the Reset (🏠) button
- Refresh the browser page
- Check that Three.js loaded properly

## 🚀 Advanced Features

### Auto-Rotate Mode
Perfect for presentations:
1. Click 🔄 to enable auto-rotation
2. Graph slowly rotates around the center
3. Click 🔄 again to stop
4. Combine with zoom for best effect

### Multi-Level Exploration
1. Start with zoomed-out view (see all documents)
2. Identify clusters visually
3. Zoom into interesting clusters
4. Click individual nodes for details
5. Use search to jump between areas

### Comparative Analysis
Use the chatbot to ask comparative questions:
- "How does document A compare to document B?"
- "What themes are unique to each document?"
- "Which documents are most similar?"

## 📝 Keyboard Shortcuts (Future Enhancement)
Currently mouse-only, but future versions may include:
- Arrow keys for rotation
- +/- for zoom
- R for reset
- Space for auto-rotate toggle
