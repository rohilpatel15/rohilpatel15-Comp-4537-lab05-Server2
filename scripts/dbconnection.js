const mysql = require('mysql2/promise');

module.exports = class DBconnection{
  constructor(){
    this.db = null;

  }

  connect() {
    return mysql.createConnection({
      host: 'mysql-lab5-do-user-15575838-0.c.db.ondigitalocean.com',
      user: 'user',
      password: '',
      database: 'lab5',
      port: 25060
    });
  }


  query(connection, sql){
   connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    return result;
  }
  );
  }

};