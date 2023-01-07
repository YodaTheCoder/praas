const AWS = require("aws-sdk");
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const cognito = new AWS.CognitoIdentityServiceProvider();

async function loginUser(event, context) {
  const { email, password } = event.body;
  const userPoolId = process.env.USER_POOL_ID;
  const clientId = process.env.CLIENT_ID;

  const params = {
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    UserPoolId: userPoolId,
    ClientId: clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  try {
    const response = await cognito.adminInitiateAuth(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Success",
        token: response.AuthenticationResult.IdToken,
      }),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(
      `Failed to authenticate user: ${error.mesage}`
    );
  }
}

export const handler = commonMiddleware(loginUser);
