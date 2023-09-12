const express = require('express');
const images = require('./images.js')

const app = express();
const port = 3000;

app.get('/images', async(req, res) => {
    console.log(req.query)
    const image = await images.getImages(req.query.content);
    return res.json({ image });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
