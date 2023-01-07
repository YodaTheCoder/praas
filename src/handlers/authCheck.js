const AWS = require("aws-sdk");
import commonMiddleware from "../lib/commonMiddleware";

async function authCheck(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      authorizer: event.requestContext.authorizer,
    }),
  };
}

export const handler = commonMiddleware(authCheck);
