import AWS from "aws-sdk";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getLocalUser(id) {
  let localUser;

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.USERS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    localUser = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!localUser) {
    throw new createError.NotFound(`User with id: ${id} not found`);
  }

  return localUser;
}
