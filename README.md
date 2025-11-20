# 🍽️ BiteTrak  
### AI-Powered Weekly Meal Planning

BiteTrak is a modern, AI-assisted meal-planning application built with Next.js, React, and TailwindCSS.  
It helps users generate structured weekly meal plans based on:

- Daily calorie targets  
- Diet styles (balanced, high-protein, keto, Mediterranean, etc.)  
- Medical needs (IBS-safe, gluten-free, immune-safe)  
- 3-meal or 5-meal per-day preferences  
- Printable weekly layouts for fridge/PDF  

---

## 🚀 Live Demo

https://bitetrak.vercel.app  
Automatically deployed using Vercel.

---

## 🖼️ Screenshots (placeholders)

![Landing Page](docs/screenshots/landing.png)  
![Dashboard](docs/screenshots/dashboard.png)  
![Print Layout](docs/screenshots/print.png)

---

## 🧰 Tech Stack

- Next.js 16 (App Router)  
- React 18  
- TailwindCSS  
- TypeScript  
- Vercel hosting + serverless API routes  

---

## 📦 Features

### ✔️ Landing Page  
- Set calories, diet, medical flags, meals per day  
- Name + “Week of” fields for print header  
- Passes values to dashboard via query params  

### ✔️ Planner Dashboard  
- Generate a mock 7-day plan  
- Meals with name, calories, diet tags  
- Supports 3-meal and 5-meal formats  
- Column toggles: Calories, Tags, Daily Totals  
- Print/save as PDF  

### ✔️ Print Mode  
- Full-page print-optimized layout  
- Professional table styling  
- Name + Week-of header  
- Works for both 3-meal and 5-meal table types  

---

## 🛠️ Development

### Install

    git clone https://github.com/Gaz2600/bitetrak.git
    cd bitetrak
    npm install

### Run locally

    npm run dev

Visit:  
http://localhost:3000

### Build

    npm run build

---

## 🧪 API Routes

### POST /api/generate-plan  

**Input example:**  
    {
      "calories": 2100,
      "diet": "balanced",
      "ibsSafe": true,
      "glutenFree": false,
      "immuneSafe": false,
      "mealsPerDay": 3
    }

**Output example (mock):**  
    {
      "calories": 2100,
      "diet": "balanced",
      "flags": ["IBS-safe"],
      "mealsPerDay": 3,
      "week": [
        {
          "day": "Monday",
          "totalCalories": 2100,
          "meals": [
            { "label": "Breakfast", "name": "Oatmeal", "kcal": 550, "tag": "balanced" }
          ]
        }
      ]
    }

---

## 📅 Roadmap

### v0.2 — AI Meal Generation  
- Replace mock data with OpenAI/Anthropic  
- Validate JSON and enforce structure  

### v0.3 — Nutrition Database  
- Local recipe dataset  
- Integrations: USDA, Edamam, Spoonacular  

### v0.4 — Grocery Lists  
- Auto-group ingredients  
- Weekly printable grocery PDF  

### v0.5 — Saved Plans / Accounts  
- LocalStorage save slots  
- Optional cloud storage + auth  

---

## 🗂️ Project Structure

    app/
      page.tsx
      dashboard/
        page.tsx
        DashboardClient.tsx
      api/
        generate-plan/
          route.ts

    public/
    styles/
    tailwind.config.js
    package.json

---

## 🤝 Contributing

Pull requests and suggestions are welcome.

---

## 📄 License  
MIT License © 2025 Mike Guizzetti
