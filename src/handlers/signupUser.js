import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function signupUser(event, context) {
  const { email, password } = event.body;
  const userPoolId = process.env.USER_POOL_ID;

  const params = {
    UserPoolId: userPoolId,
    Username: email,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
    MessageAction: "SUPPRESS",
  };

  try {
    const response = await cognito.adminCreateUser(params).promise();
    if (response.User) {
      const paramsForSetPass = {
        Password: password,
        UserPoolId: userPoolId,
        Username: email,
        Permanent: true,
      };
      await cognito.adminSetUserPassword(paramsForSetPass).promise();

      const localUser = {
        id: email,
        isAdmin: false,
      };

      await dynamodb
        .put({
          TableName: process.env.USERS_TABLE_NAME,
          Item: localUser,
        })
        .promise();

      return {
        statusCode: 201,
        body: JSON.stringify({ username: response.User.Username }),
      };
    }
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(
      `Failed to create user record: ${error.mesage}`
    );
  }
}

export const handler = commonMiddleware(signupUser);
