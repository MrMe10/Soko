/**
 * aiPromptTemplate.js
 * -------------------
 * Server-side prompt template generator & roadmap synthesizer matching Node.js/CommonJS environment.
 * Generates beginner-friendly step-by-step project setup instructions.
 */

const SYSTEM_PROMPT_INSTRUCTION = `You are Soko AI, a friendly mentor and expert software architect.
Your task is to provide a simple, beginner-friendly, step-by-step guide on how to build the user's project from scratch.

CRITICAL INSTRUCTIONS FOR BEGINNER ACCESSIBILITY:
1. EXPLAIN THINGS SIMPLY: Assume the user has never created a coding project before. Briefly explain what each step does in plain English.
2. NO CONVERSATIONAL FLUFF: Do NOT say "Sure!", "Here is your guide", or "Good luck!". Start directly with Section 1.
3. CLEAR STEP-BY-STEP FORMAT: Provide exact terminal commands to copy-paste, where to run them, and what to expect.
4. RIGIDLY FOLLOW THE STRUCTURE BELOW.`;

function generateProjectPrompt(input) {
  const { name, description, type, assignedTechs = {} } = input;

  const formattedStackList = Object.entries(assignedTechs).length > 0
    ? Object.entries(assignedTechs)
        .map(([category, tech]) => `- **${category}**: ${tech}`)
        .join('\n')
    : '- **Default Stack**: React + Node.js';

  const formattedStackTable = Object.entries(assignedTechs).length > 0
    ? Object.entries(assignedTechs)
        .map(([category, tech]) => `| ${category} | ${tech} |`)
        .join('\n')
    : '| Stack | Standard Setup |';

  return `${SYSTEM_PROMPT_INSTRUCTION}

---

### TARGET PROJECT SPECIFICATIONS:
- **Project Name**: ${name || 'Decoupled Storehouse'}
- **Description**: ${description || 'No description provided'}
- **Architecture Setup**: ${type === 'fullstack' ? 'Fullstack / Monolith (Frontend & Backend together)' : 'Separate / Decoupled (Frontend & Backend in separate folders)'}

### SELECTED TECH STACK:
${formattedStackList}

---

### OUTPUT TEMPLATE (Generate your response strictly matching this simple beginner-friendly format):

# 🐣 Beginner-Friendly Guide: Building ${name || 'Your Project'}

## 1. Project Summary & Selected Tools
| Component | Technology Chosen | What It Does |
|---|---|---|
${formattedStackTable}

## 2. What You Need Before Starting
- **Node.js**: Installed on your computer (Download from nodejs.org if you don't have it).
- **Terminal / Command Prompt**: The black window on your computer where you type commands.

## 3. Step 1: Open Terminal & Create Your Project Folder
[Explain how to open terminal, create folder using \`mkdir\`, and enter it using \`cd\`]

## 4. Step 2: Initialize Your Code Structure
[Provide exact commands to generate starter template files for frontend & backend]

## 5. Step 3: Install Required Building Blocks (Dependencies)
[Explain what \`npm install\` means and provide exact copy-pasteable install commands]

## 6. Step 4: Create Your Secret Settings File (\`.env\`)
[Explain what a \`.env\` file is (where secret passwords & API keys live) and give exact copy-paste text]

## 7. Step 5: Copy Starter Code & Run Your App!
[Provide simple starter code for main entry file and show exact command to start app and view in browser]
`;
}

/**
 * Fallback AI response generator if Gemini API key is unconfigured or offline.
 * Produces beginner-friendly, step-by-step project creation code & commands.
 */
function generateFallbackRoadmap(input) {
  const { name, type, assignedTechs = {} } = input;

  const projSlug = (name || 'soko-app').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const frontend = assignedTechs['Frontend'] || assignedTechs['Fullstack Framework'] || 'React';
  const backend = assignedTechs['Backend'] || assignedTechs['Fullstack Framework'] || 'Node.js';
  const database = assignedTechs['Database'] || 'PostgreSQL';
  const auth = assignedTechs['Auth'] || 'Clerk';
  const email = assignedTechs['Email Service'] || 'Resend';
  const hosting = assignedTechs['Hosting'] || 'Vercel';

  const isFullstack = type === 'fullstack';

  return `# 🐣 Beginner-Friendly Guide: Building "${name || 'Decoupled Storehouse'}"

Welcome! This step-by-step guide is written in simple terms so anyone—even if you've never built a project before—can follow along easily.

---

## 1. Your Selected Project Tools Summary

| Component | Selected Tool | What This Tool Does (Simple Terms) |
|---|---|---|
| **Architecture** | ${isFullstack ? 'Fullstack Monolith' : 'Decoupled (Separate)'} | ${isFullstack ? 'Frontend and Backend live inside one single folder.' : 'Frontend & Backend live in separate, dedicated folders.'} |
| **Frontend** | ${frontend} | The visual website interface that users see and interact with in their browser. |
| **Backend** | ${backend} | The server behind the scenes that processes data and connects to databases. |
| **Database** | ${database} | The digital file cabinet where your user data and app records are stored safely. |
| **Authentication**| ${auth} | Handles user sign-ups, logins, and password security. |
| **Email Service** | ${email} | Sends automated emails (welcome emails, password resets) to your users. |
| **Hosting Target** | ${hosting} | Puts your project live on the internet so anyone can visit it. |

---

## 2. What You Need Installed First (Prerequisites)

Before typing commands, ensure you have **Node.js** installed on your computer:
- **Node.js**: Download the free installer from [nodejs.org](https://nodejs.org/). (It allows your computer to run JavaScript commands).
- **Terminal**: Open **Command Prompt** (on Windows) or **Terminal** (on Mac). This is where you type commands.

---

## 3. Step 1: Create Your Project Folder

Open your Terminal / Command Prompt app, copy the commands below, and press **Enter**:

\`\`\`bash
# 1. Create a new folder for your project on your computer
mkdir ${projSlug}

# 2. Move inside your new project folder
cd ${projSlug}

${isFullstack ? `# 3. Create your project setup:
npx create-next-app@latest . --typescript --tailwind --eslint --app` : `# 3. Create two sub-folders: one for Frontend (website) and one for Backend (server)
mkdir client server`}
\`\`\`

💡 **What just happened?** You created a main folder named \`${projSlug}\` on your computer where all your project files will live.

---

## 4. Step 2: Initialize Your App Files

Now run these commands to set up the starter files:

\`\`\`bash
${isFullstack ? `# You are ready! Next.js has already created your starter files.` : `# First, set up the Frontend (client):
cd client
npx create-vite@latest . --template react-ts
npm install

# Next, set up the Backend (server):
cd ../server
npm init -y`}
\`\`\`

💡 **What just happened?** The computer created standard starter files like \`package.json\` (your project's ingredient list).

---

## 5. Step 3: Install Required Building Blocks (Dependencies)

Projects use pre-built packages (called dependencies) so you don't have to code everything from scratch. Run this command:

\`\`\`bash
# Download the tools for Database (${database}), Auth (${auth}), and Email (${email})
npm install ${database.toLowerCase().includes('mongo') ? 'mongoose' : 'prisma @prisma/client'}
npm install ${auth.toLowerCase().includes('clerk') ? '@clerk/clerk-sdk-node' : 'jsonwebtoken dotenv'}
npm install ${email.toLowerCase().includes('resend') ? 'resend' : 'nodemailer'} cors
\`\`\`

💡 **What just happened?** Your computer downloaded code libraries for ${database}, ${auth}, and ${email} into a folder called \`node_modules\`.

---

## 6. Step 4: Create Your Secret Settings File (\`.env\`)

A \`.env\` file is a secret text file where you store database passwords and API keys safely. 

Create a file named \`.env\` in your project folder and paste the text below inside it:

\`\`\`env
# Project Settings for ${name}
PORT=5000

# Database Address (${database})
DATABASE_URL="${database.toLowerCase().includes('mongo') ? 'mongodb://localhost:27017/' + projSlug : 'postgresql://user:password@localhost:5432/' + projSlug}"

# Security & API Secret Keys
AUTH_SECRET="change-this-to-any-random-secret-words"
${auth.toLowerCase().includes('clerk') ? 'CLERK_SECRET_KEY="your_clerk_secret_key_here"' : ''}
${email.toLowerCase().includes('resend') ? 'RESEND_API_KEY="your_resend_api_key_here"' : ''}
\`\`\`

💡 **What just happened?** You created a central secret file where your database connection details and secret passwords live.

---

## 7. Step 5: Add Starter Code & Launch Your App!

Create a file named \`index.js\` inside your server folder and paste this code:

\`\`\`javascript
const express = require('express');
const app = express();
app.use(express.json());

// This is your first API route (health check)
app.get('/', (req, res) => {
  res.json({
    message: "🎉 Success! Your ${name} project server is running!",
    frontend: "${frontend}",
    backend: "${backend}",
    database: "${database}"
  });
});

app.listen(5000, () => {
  console.log("🚀 Project server running on http://localhost:5000");
});
\`\`\`

Now, start your project by typing:

\`\`\`bash
# Start your application
npm run dev
\`\`\`

🎉 **Congratulations!** Open your browser and go to **\`http://localhost:5000\`** (or \`http://localhost:3000\`). You will see your new project running live on your computer!
`;
}

module.exports = {
  SYSTEM_PROMPT_INSTRUCTION,
  generateProjectPrompt,
  generateFallbackRoadmap
};
