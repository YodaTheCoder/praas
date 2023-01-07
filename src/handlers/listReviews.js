import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function listReviews() {
  let reviews;

  const params = {
    TableName: process.env.REVIEWS_TABLE_NAME,
  };

  try {
    const result = await dynamodb.scan(params).promise();

    reviews = result.Items;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ reviews }),
  };
}

export const handler = commonMiddleware(listReviews);
