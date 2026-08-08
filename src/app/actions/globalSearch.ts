"use server";

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function searchGlobalOpportunities(query: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are WRKZ AI, an elite global career assistant and aggregator for freelancers. 
      The user is asking for career advice, platforms, or opportunities based on their niche.
      
      User's Query: "${query}"
      
      Act as a meta-search engine. Provide:
      1. The top 3-5 global platforms or websites specifically tailored to their niche (do not just say Upwork or Fiverr, find niche-specific platforms like WeWorkRemotely, Dribbble, Toptal, etc.).
      2. A strategy on how to stand out and find hidden opportunities in their field.
      3. A short, highly effective cold-outreach message template they can use immediately.
      
      Format the response beautifully in HTML (using <h3>, <p>, <ul>, <li>, <strong>) so it renders perfectly in a React dangerouslySetInnerHTML block. 
      Do NOT include markdown block ticks like \`\`\`html. Output raw HTML only.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const htmlContent = response.text().replace(/```html/g, '').replace(/```/g, '').trim();

    return { success: true, content: htmlContent };
  } catch (error: any) {
    console.error("Global search error:", error);
    return { success: false, error: error.message };
  }
}
