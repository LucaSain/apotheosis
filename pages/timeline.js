import Navbar from "../components/navbar";
import Timeline from "../components/timeline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TimelinePage() {
  const router = useRouter();
  // Render only after hydration, once ?pos= is known (static export has no query at build time).
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (router.isReady) setReady(true);
  }, [router.isReady]);

  return (
    <>
      <Navbar />
      {ready && <Timeline pos={router.query.pos} />}
    </>
  );
}
