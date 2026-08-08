"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Generates an embedding for a given text using the Gemini text-embedding-004 model.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding.");
  }
}

/**
 * Utility to create a rich text string for a freelancer profile embedding
 */
export async function buildFreelancerEmbeddingText(niche: string, bio: string, skills: string[]) {
  return `Niche: ${niche}\nBio: ${bio}\nSkills: ${skills.join(", ")}`;
}

/**
 * Utility to create a rich text string for a job posting embedding
 */
export async function buildJobEmbeddingText(title: string, description: string) {
  return `Job Title: ${title}\nDescription: ${description}`;
}
