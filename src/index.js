import express from 'express';
import app from './app.js';
import dbConfig from './db/dbConfig.js';
import 'dotenv/config'
import sys from 'node:sys';

const { PORT } = process.env || 3000;

dbConfig();

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});