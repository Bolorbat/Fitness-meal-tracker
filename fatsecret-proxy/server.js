import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/search-food", async (req, res) => {
  const { query, page = 0, maxResults = 10 } = req.query;

  try {
    const response = await axios.get(
      "https://platform.fatsecret.com/rest/foods/search/v3",
      {
        params: {
          search_expression: query,
          page_number: page,
          max_results: maxResults,
          format: "json",
          region: "MN"
        },
        headers: {
          Authorization: `Bearer ${process.env.FATSECRET_ACCESS_TOKEN}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Proxy error:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
