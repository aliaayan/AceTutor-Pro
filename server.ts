import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "AceTutor Pro API" });
  });

  // Mock endpoint to simulate fetching/listing CAIE data
  app.get("/api/caie/:subject/:year", (req, res) => {
    const { subject, year } = req.params;
    res.json({
      path: `/caie-data/${subject}/${year}/Marking-Scheme`,
      source: `https://pastpapers.papacambridge.com/papers/caie/o-level/${subject}`,
      note: "Data structure mapped from official sources."
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
