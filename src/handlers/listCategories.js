import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import { getCategories } from "../lib/getCategories";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function listCategories() {
  let categories = await getCategories();

  return {
    statusCode: 200,
    body: JSON.stringify({ categories }),
  };
}

export const handler = commonMiddleware(listCategories);
