🏥 Swasthya360 – Agentic AI Healthcare Assistance System
🚀 Overview

Swasthya360 is an Agentic AI-powered healthcare assistance system that autonomously analyzes user symptoms, plans actions, and executes decisions such as providing medical guidance, enabling conversational support, or triggering emergency alerts.

Unlike traditional chatbots, this system demonstrates:

🧠 Goal-driven reasoning
🪜 Step-by-step planning
⚙️ Tool-based execution

⚡ Quick Setup

🔹 Clone Repository
git clone https://github.com/your-username/swasthya360.git
cd swasthya360

🔹 Backend Setup
cd backend
npm install
npm start

🔹 Frontend Setup
cd frontend
npm install
npm run dev

🔐 Environment Variables

Create a .env file in backend:

PORT=5000
JWT_SECRET=your_secret

GOOGLE_API_KEY=your_gemini_api_key

TWILIO_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE=your_twilio_number

🧠 Agent Architecture (Core of the System)
User Input (Goal)
↓
Controller Agent (Planner + Decision Maker)
↓
┌───────────────┬───────────────┬
│ │ │  
Clinical Action Chat
Agent Agent Agent
(Analysis) (Execution) (Conversation)

⚙️ How the Agent Works (Reasoning → Planning → Execution)
🧩 Step 1: Goal Understanding

User provides input (symptoms/query)

🧠 Step 2: Reasoning (Controller Agent)
Classifies intent:
medical
emergency
chat

🪜 Step 3: Planning
Decides:
Which agent to call
What data is needed
What action to execute

⚡ Step 4: Execution
Clinical Agent → symptom severity analysis
Action Agent → triggers SMS alert via Twilio
Chat Agent → conversational response
