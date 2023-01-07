import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import validator from "@middy/validator";
import createReviewsSchema from "../lib/schema/createReviews.schema";
import createError from "http-errors";
import { getLocalUser } from "../lib/getLocalUser";
import { createReview } from "../lib/createReview";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createReviews(event, context) {
  const reviews = event.body;
  const { email } = event.requestContext.authorizer.claims;

  const localUser = await getLocalUser(email);

  if (!localUser.isAdmin) {
    throw new createError.Unauthorized(
      "User is not permitted to create new reviews"
    );
  }

  const reviewPromises = reviews.map(async (r) => createReview(r));
  const savedReviews = await Promise.all(reviewPromises);

  return {
    statusCode: 200,
    body: JSON.stringify(savedReviews),
  };
}

export const handler = commonMiddleware(createReviews).use(
  validator({ inputSchema: createReviewsSchema })
);
