# 🤖 AskAny – AI Chatbot & Text-to-Image App

AskAny is a full-stack AI-powered web application that provides intelligent chatbot conversations with contextual memory and advanced text-to-image generation from natural language prompts.

---
### Demo Link -  [https://chat-bot-rho-sooty.vercel.app/](https://chat-bot-rho-sooty.vercel.app/)

## 🚀 Features

### 💬 AI Chatbot
- Real-time conversational chatbot powered by AI
- Maintains contextual memory for seamless, continuous interactions
- Handles user queries with structured and meaningful responses

### 🎨 Text-to-Image Generator
- Generates images from natural language prompts
- Supports creative and descriptive inputs
- Displays and stores generated images securely

### 🔐 Authentication
- Secure OTP-based authentication using **NextAuth**
- Session-based access control for protected routes

### ☁️ Cloud Integration
- Image storage and retrieval using **Cloudinary**
- Efficient media handling with database persistence

---

## 🧠 Tech Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS

**Backend**
- Next.js API Routes
- Prisma ORM

**Database**
- MongoDB

**AI & Media**
- AI APIs for chatbot and text-to-image generation
- Cloudinary for image storage

**Authentication**
- NextAuth (OTP-based login)

---

## 🏗 Architecture & Implementation

- Modular component-based architecture
- Secure API routes with authentication checks
- Clean separation of UI, logic, and data layers
- Optimized state handling for real-time AI responses
- Scalable setup suitable for production use

---

## 📦 Getting Started

```bash
# Clone the repository
git clone https://github.com/harishreyya/chatBot.git

# Install dependencies
npm install

# Configure environment variables
# (MongoDB, NextAuth, AI APIs, Cloudinary)

# Run locally
npm run dev
