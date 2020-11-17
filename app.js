const http = require('http')
const express = require('express')
// const { createTerminus } = require('@godaddy/terminus')
const axios = require('axios');
const actuator = require('express-actuator');

const app = express()

//actualtor
const options = {
  customEndpoints: [
    {
      id: 'healthcheck',
      controller: (req, res) => {
          axios.all([
            axios.get('http://localhost:3001/health'),
            axios.get('http://localhost:3002/health')
          ]).then(axios.spread((response1, response2) => {
            if(response1.data.status == "UP" && response2.data.status == "UP"){
              res.send({status:"UP"})
            }else{
              res.send({status:"DOWN"})
            }
          })).catch(error => {
            res.send({status:"DOWN"})
          });
      }
    }
  ]
};

app.use(actuator(options));

const server = http.createServer(app)

server.listen(3000);

// process.on('SIGTERM', shutDown);
// process.on('SIGINT', shutDown);

// function shutDown() {
//     console.log('Received kill signal, shutting down gracefully');
//     server.close(() => {
//         console.log('Closed out remaining connections');
//         process.exit(0);
//     });

//     setTimeout(() => {
//         console.error('Could not close connections in time, forcefully shutting down');
//         process.exit(1);
//     }, 10000);
// }