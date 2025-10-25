# Git Repository Setup Guide

Follow these steps to push your project to GitHub:

## 1. Initialize Git Repository

```bash
# Navigate to your project directory
cd "c:\Users\sheli\Documents\connect the docs"

# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Document Knowledge Graph Analyzer"
```

## 2. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `document-knowledge-graph` (or your preferred name)
3. Description: "Interactive 3D knowledge graph visualization tool using AI"
4. **Keep it Public** (or Private if you prefer)
5. **DO NOT** initialize with README, license, or .gitignore (we already have these)
6. Click "Create repository"

## 3. Connect to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/document-knowledge-graph.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## 4. Verify Upload

Visit your repository URL:

```
https://github.com/YOUR_USERNAME/document-knowledge-graph
```

You should see all your files uploaded!

## 5. Set Up API Key (Important!)

⚠️ **BEFORE using the app:**

1. Copy `config.example.js` to `config.js`:

   ```bash
   cp config.example.js config.js
   ```

2. Edit `config.js` and add your OpenAI API key

3. `config.js` is in `.gitignore` so it won't be committed

## 6. Optional: Add Topics to Repository

On your GitHub repository page:

1. Click the gear icon next to "About"
2. Add topics: `3d-visualization`, `knowledge-graph`, `openai`, `threejs`, `react`, `ai`, `document-analysis`
3. Add the website URL if you deploy it

## 7. Future Updates

When you make changes:

```bash
# Check what changed
git status

# Add changed files
git add .

# Commit with descriptive message
git commit -m "feat: Add new feature description"

# Push to GitHub
git push
```

## Common Git Commands

```bash
# View commit history
git log --oneline

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD
```

## Need Help?

- [GitHub Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Git Documentation](https://git-scm.com/doc)

---

**Ready to share your project with the world! 🚀**
