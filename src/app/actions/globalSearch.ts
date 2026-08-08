"use server";

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function searchGlobalOpportunities(query: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are WRKZ AI, an elite double-sided matchmaker and global career assistant.
      The user is asking for help finding work (Freelancer) OR finding talent (Client).
      
      User's Query: "${query}"
      
      If the user acts like a Client (e.g. "I need a designer"):
      1. Act as the WRKZ internal matchmaker. Tell them WRKZ has strictly verified professionals ready.
      2. Remind them of the "WRKZ Guarantee": They must deposit funds into Escrow upfront, but if the work isn't perfect, they get revisions, and bad actors are kicked out.
      3. Generate 3 mock profiles of "Verified Experts" on WRKZ that match their needs, with a link to "View Demo Portfolio".
      
      If the user acts like a Freelancer (e.g. "I do video editing, find me work"):
      1. Act as a global meta-search engine.
      2. Provide the top 3-5 global platforms highly trusted for their niche (e.g., LinkedIn Jobs, Wellfound, YCombinator, Toptal). Generate realistic clickable URLs for these platforms.
      3. Give them a strategy to stand out.
      4. Give them a cold-outreach message template.
      
      Format the response beautifully in HTML (using <h3>, <p>, <ul>, <li>, <strong>, <a href="#" class="text-blue-600 underline">) so it renders perfectly in a React dangerouslySetInnerHTML block. 
      Make the design look premium. Do NOT include markdown block ticks like \`\`\`html. Output raw HTML only.
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
