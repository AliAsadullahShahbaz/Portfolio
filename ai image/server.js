const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const response = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch from Lexica" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
