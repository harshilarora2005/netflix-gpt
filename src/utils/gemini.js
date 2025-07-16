import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export const getMovieRecommendations = async (promptText) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Act as a movie recommendation system. Based on the user's intent, suggest the most suitable movies.
    Only respond with a comma-separated list of movie names, no explanations or extras.
    Prompt: "${promptText}", Give exactly 25 movies.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (err) {
        console.error("Gemini error:", err);
        return "Error fetching recommendations.";
    }
};
