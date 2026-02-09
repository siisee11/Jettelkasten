import React from "react";
import { Link } from "react-router-dom";

type Page = {
  slug: string;
  title: string;
  tags: string[];
};

export default function HomeSidebar({ pages, className = "" }: { pages: Page[]; className?: string }) {
  const categoryPages = pages.filter((p) => p.tags.includes("category"));

  return (
    <div className={`home-sidebar ${className}`.trim()}>
      <h1>Jtelkasten</h1>
      <div className="home-links">
        <Link to="/about">about</Link>
        <Link to="/graph">graph</Link>
        <Link to="/posts">posts</Link>
        <Link to="/keywords">keywords</Link>
      </div>
      <div className="home-links" style={{ marginTop: 8 }}>
        {categoryPages.map((p) => (
          <Link key={p.slug} to={`/${p.slug}`}>
            {p.slug.replace(/^p\//, "")}
          </Link>
        ))}
      </div>
    </div>
  );
}
