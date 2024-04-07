import app from './app.js';
import dbConfig from './db/dbConfig.js';
import 'dotenv/config'

const { PORT } = process.env || 3000;

dbConfig();

app.get("/", (_req, res) => {
    res.send("Hello from yt backend!");
})

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});