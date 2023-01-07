import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
import { generate } from "../lib/generate";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function peerReview(event, context) {
  const { peer, gender, categories, count } = event.queryStringParameters;

  //   const params = {
  //     peer,
  //     gender,
  //     categories,
  //     count,
  //   };
  const reviews = await generate(peer, gender, categories, count);

  return {
    statusCode: 200,
    body: JSON.stringify({ reviews }),
  };
}

export const handler = commonMiddleware(peerReview);
