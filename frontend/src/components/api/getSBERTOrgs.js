export const getSBERTOrgs = async (email) => {
  try {
    const response = await fetch("http://localhost:8000/backend/sbert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch SBERT recommendations");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getSBERTOrgs:", error);
    return [];
  }
};
