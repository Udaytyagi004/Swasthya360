# 🛡️ Swasthya360 QA & Testing Documentation

This document outlines the testing strategy and validation cases for the Swasthya360 Agentic AI system.

## 🧪 Testing Overview

As per hackathon requirements, we validate our system using two primary methods:
1.  **Manual End-to-End Testing**: Verifying the user experience and agent transitions.
2.  **Structured API Testing**: Validating the structured outputs and reasoning logic of the agents.

---

## 🚦 Test Cases

### 1. Intent: Medical (Diagnosis & Action)
- **Input**: "I have a sharp pain in my chest and difficulty breathing. Severity: 9."
- **Expected Reasoning**: Controller should identify "emergency" or "medical" intent.
- **Expected Plan**: `["clinicalAgent", "actionAgent"]`
- **Expected Action**: Action Agent should trigger a WhatsApp alert to the emergency contact.
- **Validation**: Check Twilio logs or WhatsApp for the alert.

### 2. Intent: General Chat (Support)
- **Input**: "How can I stay healthy during winter?"
- **Expected Reasoning**: Controller should identify "chat" intent.
- **Expected Plan**: `["chatAgent"]`
- **Expected Output**: Empathetic guidance on winter health without triggering medical alerts.

### 3. Edge Case: Low Severity Medical
- **Input**: "I have a slight headache since morning. Severity: 2."
- **Expected Plan**: `["clinicalAgent"]` (Action Agent should NOT trigger an alert).
- **Validation**: Verify that `alertStatus` is not "sent".

---

## 🛠️ How to Test Manually

### Using Postman/Curl
You can test the triage endpoint directly:

**Endpoint**: `POST /api/health/triage`
**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Body**:
```json
{
  "query": "I am feeling dizzy and have a fast heartbeat",
  "symptoms": ["dizziness", "palpitations"],
  "severity": 7
}
```

### UI Testing
1. Login to the application.
2. Navigate to the Assistant Chat.
3. Enter various symptoms and observe the agent's plan in the console (if in dev mode) and the UI response.
4. Verify that high-severity symptoms trigger the "Emergency Mode" in the UI.

---

## 📈 Quality Assurance Metrics
- **Reasoning Accuracy**: Does the Controller select the correct agents for the intent?
- **Response Latency**: System should respond within 2-4 seconds despite multi-agent execution.
- **Structured Data Integrity**: Ensure all diagnosis fields (Confidence, Measures, etc.) are populated correctly by the AI.
