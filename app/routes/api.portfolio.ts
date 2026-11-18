import type { LoaderFunctionArgs } from "react-router";
import { readPortfolio } from "@/lib/portfolio.server";
export async function loader({context}: LoaderFunctionArgs) {
  const result = await readPortfolio(context);
  return Response.json(result, {status: result.available ? 200 : 503, headers:{"Cache-Control":"no-store"}});
}
