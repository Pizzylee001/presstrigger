import { redirect } from "next/navigation";
import { DEFAULT_MATCH_ID } from "../lib/matches.ts";

export default function Home() {
  redirect(`/match/${DEFAULT_MATCH_ID}`);
}
