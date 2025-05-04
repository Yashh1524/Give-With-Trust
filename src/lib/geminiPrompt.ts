type NGO = {
    id: string;
    name: string;
    des: string;
};

export function createGeminiPrompt(userQuery: string, ngos: NGO[]): string {
    return `
You are an intelligent assistant helping users discover relevant NGOs.

User asked:
"${userQuery}"

List of NGOs:
${ngos.map((ngo) => `- ID: ${ngo.id}, Name: ${ngo.name}, Description: ${ngo.des}`).join("\n")}

Instructions:
1. Select the 2–3 most relevant NGOs based on the query.
2. Write a short, friendly reply (max 2 sentences).
3. For each recommended NGO, return its id, name, and description.
4. Respond strictly in the following JSON format:
    {
    "message": "Short helpful reply",
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
