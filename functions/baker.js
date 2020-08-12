const axios = require("axios");

exports.handler = (event, context, callback) => {
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
  const getBakers = () => {
    axios
      .get("https://api.tzkt.io/v1/suggest/accounts/")
      .then((res) => {
        send(res.data);
      })
      .catch((err) => {
        send(err.data);
      });
  };

  // make sure method is GET
  if (event.httpMethod == "GET") {
    getBakers();
  }
};
