const {postPredictHandler, predictHistories, testFirestoreConnection} = require('../server/handler');
     
const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        maxBytes: 1000 * 1000,
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: predictHistories   
  },

  {
    path: '/test/firestore',
    method: 'GET',
    handler: testFirestoreConnection
  }
]
 
module.exports = routes;