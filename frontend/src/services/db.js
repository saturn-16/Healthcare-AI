// Client-side Database Connector mapping database requests to Express API routes

export const initDb = async () => {
  try {
    // Ping backend to make sure database is ready
    const res = await fetch("/api/history");
    if (res.ok) {
      console.log("Persistent SQLite database connected successfully.");
    }
  } catch (error) {
    console.error("Failed to connect to backend SQLite database:", error);
  }
};

export const db = {
  // Execute raw SQL query on SQLite backend
  query: async (sql, params = []) => {
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sql, params })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Query execution failed");
      }
      return await res.json();
    } catch (error) {
      console.error("SQL query failed:", sql, error);
      throw error;
    }
  },

  // Get all health history records
  getHistory: async () => {
    try {
      const res = await fetch("/api/history");
      if (!res.ok) throw new Error("Failed to fetch history");
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch history:", error);
      return [];
    }
  },

  // Add a new encounter
  addEncounter: async (encounter) => {
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(encounter)
      });
      return res.ok;
    } catch (error) {
      console.error("Failed to save encounter:", error);
      return false;
    }
  },

  // Get all clinical reports
  getReports: async () => {
    try {
      const res = await fetch("/api/reports");
      if (!res.ok) throw new Error("Failed to fetch reports");
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      return [];
    }
  },

  // Add a clinical report
  addReport: async (report) => {
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report)
      });
      return res.ok;
    } catch (error) {
      console.error("Failed to save report:", error);
      return false;
    }
  },

  // Delete an encounter
  deleteEncounter: async (id) => {
    try {
      const res = await fetch(`/api/history/${id}`, {
        method: "DELETE"
      });
      return res.ok;
    } catch (error) {
      console.error("Failed to delete encounter:", error);
      return false;
    }
  }
};
