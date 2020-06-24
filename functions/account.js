const axios = require("axios");

exports.handler = (event, context, callback) => {
  const { token } = JSON.parse(event.body);

  // send response
  const send = (body) => {
    callback(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      },
      body: JSON.stringify(body),
    });
  };

  // perform API call
  const getAccount = () => {
    axios
      .get(`https://api.tzstats.com/explorer/account/${token}`)
      .then((res) => {
        send(res.data);
      })
      .catch((err) => {
        send(err.data);
      });
  };

  // make sure method is POST
  if (event.httpMethod == "POST") {
    getAccount();
  }
};
