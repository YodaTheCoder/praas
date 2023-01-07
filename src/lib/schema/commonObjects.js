const response = {
  type: "string",
};

const categories = {
  type: "array",
  items: {
    type: "string",
  },
};

const review = {
  type: "object",
  properties: {
    response,
    categories,
  },
  required: ["response", "categories"],
};

export { review, response, categories };
