const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const { url, quality } = event.queryStringParameters;

  if (!url || !quality) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing URL or quality" }),
    };
  }

  const api_url = "https://api.easydownloader.app/api-extract/";
  const payload = {
    video_url: url,
    pagination: false,
    key: "175p86550h7m5r3dsiesninx194",
  };

  try {
    const response = await fetch(api_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const match = data.video.find(v => v.quality == quality);

    if (!match) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Requested quality not available" }),
      };
    }

    return {
      statusCode: 302,
      headers: {
        Location: match.url,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
