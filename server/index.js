require('dotenv').config();
const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

const server = async () => {
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
};

server();