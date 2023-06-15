var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testdatabd'
});

connection.connect(function(err){
    if(err) console.log("Kết nối thất bại!!")
});

module.exports = connection;