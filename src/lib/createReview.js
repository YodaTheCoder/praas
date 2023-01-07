import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function createReview({ response, categories }) {
  const lowerCategories = categories.join(",").toLowerCase().split(",");
  const review = {
    id: uuid(),
    response,
    categories: lowerCategories,
  };
  console.log(review);

  try {
    await dynamodb
      .put({
        TableName: process.env.REVIEWS_TABLE_NAME,
        Item: review,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return review;
}
