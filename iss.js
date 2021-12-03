const request = require("request");


const fetchMyIP = function(callback) {
  const API = "https://api.ipify.org/?format=json";
  request(API, (err, response, body) => {
    if (!err) {
      const data = JSON.parse(body);
      callback(null,data.ip);
    }
    if (err) {
      callback(err, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
  });
};


const fetchCoordsByIP = function(ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (!error) {
      const {latitude, longitude} = JSON.parse(body);
      callback(null, {latitude, longitude});
    }
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }
  });
};


const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (!error) {
      const data = JSON.parse(body)
      callback(null, data.response)
    }
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
  })
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null)
    }
    fetchCoordsByIP(ip,(error, coords) => {
      if (error) {
        return callback(error, null)
      }
      fetchISSFlyOverTimes(coords, (error, time) => {
        if (error) {
          return callback(error, null)
        }
        callback(null, time)
      })
    })
  })
}

 module.exports = {fetchMyIP ,fetchCoordsByIP ,fetchISSFlyOverTimes , nextISSTimesForMyLocation };