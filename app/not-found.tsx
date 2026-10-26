import Link from "next/link";

export default function NotFound() {
  return (
    <div className="app">
      <div className="tally">
        <div className="wordmark">
          Press <i>Trigger</i>
        </div>
        <div className="spacer" />
      </div>
      <main className="page">
        <div className="page-head">
          <h1 className="page-title">No such match</h1>
          <p className="page-sub">
            This desk only carries three synthetic matches. Nothing else is on the feed.
          </p>
        </div>
        <p style={{ padding: "22px 0", fontSize: 13 }}>
          <Link href="/match/m14">Open the live desk</Link>
        </p>
      </main>
    </div>
  );
}
