import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getReview(event, context) {
  const { id } = event.queryStringParameters;
  let review;

  const params = {
    TableName: process.env.REVIEWS_TABLE_NAME,
    Key: { id },
  };

  try {
    const result = await dynamodb.get(params).promise();

    review = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(review),
  };
}

export const handler = commonMiddleware(getReview);
