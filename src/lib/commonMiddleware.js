import middy from "@middy/core";
import httpJsonBodyParserMiddleware from "@middy/http-json-body-parser";
import httpEventNormalizerMiddleware from "@middy/http-event-normalizer";
import httpErrorHandlerMiddleware from "@middy/http-error-handler";

export default (handler) =>
  middy()
    .use([
      httpJsonBodyParserMiddleware(),
      httpEventNormalizerMiddleware(),
      httpErrorHandlerMiddleware(),
    ])
    .handler(handler);
