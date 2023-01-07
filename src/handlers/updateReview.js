import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
import { getLocalUser } from "../lib/getLocalUser";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function deleteReview(event, context) {
  const { id } = event.queryStringParameters;
  const { response, categories } = event.body;
  const { email } = event.requestContext.authorizer.claims;
  let review;

  const localUser = await getLocalUser(email);

  console.log(localUser);

  if (!localUser.isAdmin) {
    throw new createError.Unauthorized(
      "User is not permitted to alter reviews"
    );
  }

  const params = {
    TableName: process.env.REVIEWS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set #response = :response, categories = :categories",
    ExpressionAttributeValues: {
      ":response": response,
      ":categories": categories,
    },
    ExpressionAttributeNames: {
      "#response": "response",
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamodb.update(params).promise();

    review = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(review),
  };
}

export const handler = commonMiddleware(deleteReview);
