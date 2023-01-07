import AWS from "aws-sdk";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getReviews() {
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

  return reviews;
}
