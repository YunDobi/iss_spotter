const iss = require('./iss')

iss.fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});

iss.fetchCoordsByIP('50.98.240.38', (error, coordinates) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  console.log('It worked! Returned coordinates:' , coordinates);
})

iss.fetchISSFlyOverTimes({ latitude: 49.213, longitude: -123.0951 }, (error, time) => {
  if (error) {
    console.log("Error: ", error);
    return;
  }
  console.log("It worked! ",time)
})

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

iss.nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes)
});