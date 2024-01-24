const connectToMongo = require('./databaseConnection');
const express = require('express');
const cors = require('cors');

connectToMongo();
const app = express()
const port = 3030

app.use(cors());
app.use(express.json()); // to access body
app.use('/api/auth' ,require('./routes/auth'));
app.use('/api/notes' ,require('./routes/notes'));

app.listen(port, () => {
    console.log(`iNotebook listening on port ${port}`)
})