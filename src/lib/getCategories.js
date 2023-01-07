import AWS from "aws-sdk";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export async function getCategories() {
  let categories;

  const params = {
    TableName: process.env.REVIEWS_TABLE_NAME,
  };

  try {
    const result = await dynamodb.scan(params).promise();
    const reviews = result.Items;
    const allCategories = reviews.map((r) => {
      return r.categories;
    });
    categories = allCategories.flat().filter(onlyUnique);
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return categories;
}
