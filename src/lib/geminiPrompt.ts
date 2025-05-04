type NGO = {
    id: string;
    name: string;
    des: string;
};

export function createGeminiPrompt(userQuery: string, ngos: NGO[]): string {
    return `
  You are an intelligent assistant that helps users find relevant NGOs based on their needs.
  
  The user asked:
  "${userQuery}"
  
  Below is a list of NGOs:
  ${ngos.map((ngo) => `- ID: ${ngo.id}, Name: ${ngo.name}, Description: ${ngo.des}`).join("\n")}
  
  Instructions:
  1. Read the user’s query.
  2. From the NGO list, pick the most relevant 2-3 NGOs (based on the description and user query).
  3. Write a helpful, friendly response message summarizing the recommendation.
  4. Return the result strictly in JSON format without any extra explanation or text.
  
  Respond only in this JSON format:
  {
    "message": "A short helpful reply for the user",
    "ngos": [
      {
        "id": "string",
        "name": "string",
        "des": "string"
      }
    ]
  }
  `;
}
