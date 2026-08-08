import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { renderToReadableStream } from "react-dom/server";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        console.error("SSR render error:", error);
        responseStatusCode = 500;
      },
    }
  );

  responseHeaders.set("Content-Type", "text/html");

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("<!DOCTYPE html>\n"));
      const reader = body.getReader();
      return pump();
      function pump(): Promise<void> | void {
        return reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
          return pump();
        }).catch((err) => {
          controller.error(err);
        });
      }
    },
  });

  return new Response(stream, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
