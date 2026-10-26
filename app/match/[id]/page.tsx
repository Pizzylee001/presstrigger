import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeskClient } from "../../../components/DeskClient";
import { DEFAULT_AS_OF, listMatches, loadMatch } from "../../../lib/engine.ts";

export const dynamicParams = false;

export function generateStaticParams() {
  return listMatches().map((match) => ({ id: match.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const match = loadMatch(id);
  if (!match) return { title: "Press Trigger" };
  return { title: `${match.home} v ${match.away} · Press Trigger live desk` };
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = loadMatch(id);
  if (!match) notFound();
  return <DeskClient matchId={id} initialMinute={DEFAULT_AS_OF} />;
}
