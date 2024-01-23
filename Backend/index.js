const connectToMongo = require('./databaseConnection');
const express = require('express');

connectToMongo();
const app = express()
const port = 3030

app.use(express.json()); // to access body
app.use('/api/auth' ,require('./routes/auth'));
app.use('/api/notes' ,require('./routes/notes'));

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})