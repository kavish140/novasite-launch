import { redirect } from "react-router";
export function loader() { return redirect("/terms-and-conditions", 301); }
