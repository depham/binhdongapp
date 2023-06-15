var express = require('express');
var app = express();
const session = require('express-session');
const exceljs = require('exceljs');
const path = require('path'); // Thêm dòng này

/*Body parser */
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({
    secret: 'my-secret-key',
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 100 * 60 * 1000 } // 100 phút
}));

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('public', path.join(__dirname, 'public'));

require('./app/routers/home.router')(app);
require('./app/routers/dulieutron.router')(app);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});
