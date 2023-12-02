const express = require('express');
const path = require('path');

const app = express();

app.use('/views', express.static(path.resolve(__dirname, 'views')));
app.use('/scripts', express.static(path.resolve(__dirname, 'scripts')));
app.use('/stiles', express.static(path.resolve(__dirname, 'stiles')));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(8000, () => console.log('ok'));