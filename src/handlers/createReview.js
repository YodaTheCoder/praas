import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import validator from "@middy/validator";
import createReviewSchema from "../lib/schema/createReview.schema";
import createError from "http-errors";
import { getLocalUser } from "../lib/getLocalUser";
import { createReview } from "../lib/createReview";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function storeReview(event, context) {
  const { response, categories } = event.body;
  const { email } = event.requestContext.authorizer.claims;

  const review = {
    id: uuid(),
    response,
    categories,
  };

  const localUser = await getLocalUser(email);

  if (!localUser.isAdmin) {
    throw new createError.Unauthorized(
      "User is not permitted to create new reviews"
    );
  }

  await createReview(review);

  return {
    statusCode: 201,
    body: JSON.stringify(review),
  };
}

export const handler = commonMiddleware(storeReview).use(
  validator({ inputSchema: createReviewSchema })
);
