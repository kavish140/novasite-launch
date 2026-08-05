import { redirect } from "react-router";

export function loader() {
  throw redirect("/location/pedder-road", 301);
}

export default function PeddarRoadRedirect() {
  return null;
}
