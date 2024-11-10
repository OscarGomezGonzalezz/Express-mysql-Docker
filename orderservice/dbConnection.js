// Import the mysql2 package
const mysql = require('mysql2');

//FIRST WE NEED TO INICIATE THE MYSQL CONTAINER IN DOCKER

// Create a connection pool
const pool = mysql.createPool({
  host: 'mysql-service',      // Replace with your database host
  user: 'node',   // Replace with your database username
  database: 'database1', // Replace with your database name
  password: '1234', // Replace with your database password
  waitForConnections: true
  //port:3306
});

// Export the pool for use in other parts of the application
module.exports = pool.promise();
