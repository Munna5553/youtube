import express from 'express';
import app from './app.js';

const PORT  = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});