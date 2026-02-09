import React from "react";
import HomeSidebar from "./HomeSidebar";

type Page = {
  slug: string;
  title: string;
  tags: string[];
};

export default function About({ pages }: { pages: Page[] }) {
  return (
    <div className="page">
      <HomeSidebar pages={pages} />
      <div className="top-nav">
        <a href="/">home/</a>
      </div>
      <h1>About</h1>
      <p>I live in Suwon, South Korea, and I'm a co-founder of Wordbricks.</p>
      <p>Email: siisee111@gmail.com.</p>

      <h2>Things I'm involved with and areas of interest:</h2>
      <ul>
        <li>
          <strong>AI native programming.</strong>
        </li>
        <li>
          <strong>Bridging technology to the public.</strong>
        </li>
        <li>
          <strong>Building agentic systems.</strong>
        </li>
        <li>
          <strong>Books.</strong>
        </li>
        <li>
          <strong>Digital nomad.</strong>
        </li>
      </ul>

      <h2>Elsewhere</h2>
      <p>
        GitHub: <a href="https://github.com/siisee11">https://github.com/siisee11</a>
      </p>
    </div>
  );
}
