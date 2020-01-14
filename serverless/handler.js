const db = require("./dbConnect");
const crypto = require("crypto");

function signRequestBody(key, body) {
  return `sha1=${crypto.createHmac("sha1", key).update(body, "utf-8").digest("hex")}`;
}

module.exports.githubWebhookListener = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  var errMsg; // eslint-disable-line
  const token = process.env.GITHUB_WEBHOOK_SECRET;
  const headers = event.headers;
  const sig = headers["X-Hub-Signature"];
  const githubEvent = headers["X-GitHub-Event"];
  const id = headers["X-GitHub-Delivery"];
  const calculatedSig = signRequestBody(token, event.body);

  if (typeof token !== "string") {
    errMsg = "Must provide a 'GITHUB_WEBHOOK_SECRET' env variable";
    return callback(null, {
      statusCode: 401,
      headers: { "Content-Type": "text/plain" },
      body: errMsg,
    });
  }

  if (!sig) {
    errMsg = "No X-Hub-Signature found on request";
    return callback(null, {
      statusCode: 401,
      headers: { "Content-Type": "text/plain" },
      body: errMsg,
    });
  }

  if (!githubEvent) {
    errMsg = "No X-Github-Event found on request";
    return callback(null, {
      statusCode: 422,
      headers: { "Content-Type": "text/plain" },
      body: errMsg,
    });
  }

  if (!id) {
    errMsg = "No X-Github-Delivery found on request";
    return callback(null, {
      statusCode: 401,
      headers: { "Content-Type": "text/plain" },
      body: errMsg,
    });
  }

  if (sig !== calculatedSig) {
    errMsg = "X-Hub-Signature incorrect. Github webhook token doesn't match";
    return callback(null, {
      statusCode: 401,
      headers: { "Content-Type": "text/plain" },
      body: errMsg,
    });
  }

  try {
    const data = JSON.parse(event.body);
    await db.insert("github_hook", {archived: false, event: githubEvent, source_meta: data});

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        input: event,
      }),
    };

    callback(null, response);
  } catch (e) {
    console.log("Error");
    console.log(e);
    callback(null,{
      statusCode: e.statusCode || 500,
      body: e
    });
  }
};
