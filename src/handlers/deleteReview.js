import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
import { getLocalUser } from "../lib/getLocalUser";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function deleteReview(event, context) {
  const { id } = event.queryStringParameters;
  const { email } = event.requestContext.authorizer.claims;

  const localUser = await getLocalUser(email);

  console.log(localUser);

  if (!localUser.isAdmin) {
    throw new createError.Unauthorized(
      "User is not permitted to delete reviews"
    );
  }

  const params = {
    TableName: process.env.REVIEWS_TABLE_NAME,
    Key: { id },
  };

  try {
    await dynamodb.delete(params).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 204,
  };
}

export const handler = commonMiddleware(deleteReview);
