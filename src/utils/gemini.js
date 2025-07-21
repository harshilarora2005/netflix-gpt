import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export const getMovieRecommendations = async (promptText) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Act as a movie and TV show recommendation system. Based on the user's intent, suggest the most suitable movies and TV shows.
        Only respond with a comma-separated list of movie and TV show names, no explanations or extras.
        Mix both movies and TV shows in your recommendations.
        Prompt: "${promptText}", titles (movies and TV shows combined).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (err) {
        console.error("Gemini error:", err);
        return "Error fetching recommendations.";
    }
};
