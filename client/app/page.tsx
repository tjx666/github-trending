"use client";

import { trpc } from "../src/api";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    trpc.githubTrending
      .query()
      .then((result) => console.log(result.repositories));
  }, []);

  return <main className="home"></main>;
}
