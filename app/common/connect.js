var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'bzjwg60wxaoynthft7sl-mysql.services.clever-cloud.com',
    user: 'uuerpr6bebufqb68',
    password: 'I9Lp6fqdgCXcZKludcbK',
    database: 'bzjwg60wxaoynthft7sl'
});

connection.connect(function(err){
    if(err) console.log("Kết nối thất bại!!")
});

module.exports = connection;