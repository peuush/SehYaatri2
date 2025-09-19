import { GoogleGenerativeAI } from "@google/generative-ai";
import data from "./data.json";

const STORAGE_KEY = "GEMINI_API_KEY";

export function setGeminiKey(key: string) {
	localStorage.setItem(STORAGE_KEY, key.trim());
}

export function getGeminiKey(): string | null {
	return localStorage.getItem(STORAGE_KEY);
}

const TRAVEL_SYSTEM_PROMPT = `You are SehYaatri, a Jharkhand-only travel assistant.
- Answer ONLY about places, travel, culture, food, and logistics in Jharkhand.
- If asked about anything outside Jharkhand or non-travel topics, reply: "I can only help with Jharkhand travel." and briefly suggest a Jharkhand place that matches the intent.
- Prefer concise, practical tips.
- Use the provided JSON knowledge when relevant. If not in data, answer generally but still only about Jharkhand.
- Language should match the user's language (English or Hindi if obvious).`;

export async function askGemini(query: string, language: "en" | "hi"): Promise<string> {
	const apiKey = getGeminiKey();
	if (!apiKey) throw new Error("Missing Gemini API key. Set it in settings.");

	const genAI = new GoogleGenerativeAI(apiKey);
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

	const knowledge = JSON.stringify(data);
	const prompt = `${TRAVEL_SYSTEM_PROMPT}\n\nUser language: ${language}\nUser question: ${query}\n\nKnowledge JSON: ${knowledge}`;
	const result = await model.generateContent(prompt);
	const text = result.response.text().trim();
	return text;
}

export async function submitFeedback(payload: unknown, email?: string): Promise<void> {
    await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload, email })
    }).then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
    });
}