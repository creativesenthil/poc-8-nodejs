const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from POC-8! Jenkins + SonarQube + Docker is working!');
});

app.listen(3000, () => {
    console.log('App running on port 3000');
});
