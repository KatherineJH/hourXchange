import api from "./Api.js";

/**
 * Get the first or last row from a specified table.
 * @param {string} table - Table name (must be whitelisted in backend).
 * @param {string} position - Either "first" or "last".
 * @returns {Promise<Object>} - The row data.
 */
export const getRowFromTable = async (table, position) => {
  try {
    const response = await api.get("/api/meta/row", {
      params: { table, position },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to get row from table:", error);
    throw error;
  }
};
