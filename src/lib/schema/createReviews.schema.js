import { review } from "./commonObjects";

const schema = {
  type: "object",
  properties: {
    body: {
      type: "array",
      items: review,
    },
  },
  required: ["body"],
};

export default schema;
