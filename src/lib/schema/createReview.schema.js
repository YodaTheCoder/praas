import { review } from "./commonObjects";

const schema = {
  type: "object",
  properties: {
    body: review,
  },
  required: ["body"],
};

export default schema;
