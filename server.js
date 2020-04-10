let express  = require('express');
let app      = express();
let path = require('path');
let port = process.env.SERVER_PORT || 8080

require('dotenv-flow').config();
app.use(express.static('.'));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.listen(port);
console.log(process.env.TITLE +  ' is running on port : ' + port);