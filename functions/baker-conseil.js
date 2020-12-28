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
  const getBakersConseil = () => {
    const API_KEY = process.env.API_KEY;
    const headers = { apiKey: API_KEY };
    axios
      .get(
        "https://conseil-prod.cryptonomic-infra.tech:443/v2/metadata/tezos/mainnet/accounts/attributes",
        { headers: headers }
      )
      .then((res) => {
        send(res.data);
      })
      .catch((err) => {
        send(err.data);
      });
  };

  // make sure method is GET
  if (event.httpMethod == "GET") {
    getBakersConseil();
  }
};
