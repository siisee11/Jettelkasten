import React, { useEffect, useState } from "react";
import { Route, Routes, useParams, Link } from "react-router-dom";

type Page = {
  slug: string;
  title: string;
  bodyHtml: string;
  tags: string[];
  date: string | null;
  linksOut: string[];
};

const useData = () => {
  const [pages, setPages] = useState<Page[]>([]);
  useEffect(() => {
    fetch("/data/content.json")
      .then((c) => c.json())
      .then((c) => setPages(c));
  }, []);
  return { pages };
};

const PageView: React.FC<{ pages: Page[]; graph: Graph }> = ({ pages }) => {
  const params = useParams();
  const slug = params["*"] || "index";
  const page = pages.find((p) => p.slug === slug) ?? pages.find((p) => p.slug === "index");

  if (!page) return <div>Not found</div>;

  return (
    <div className="page">
      <h1>{page.title}</h1>
      <div className="content" dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="page home">
      <div className="home-inner">
        <h1>Jtelkasten</h1>
        <div className="home-links">
          <Link to="/list">posts/</Link>
        </div>
      </div>
    </div>
  );
};

const IndexList: React.FC<{ pages: Page[] }> = ({ pages }) => {
  const list = pages.filter((p) => p.slug !== "index" && !p.tags.includes("keyword"));
  return (
    <div className="page home">
      <div className="home-inner">
        <h1>Posts</h1>
        <div className="home-links">
          {list.map((p) => (
            <div key={p.slug}>
              <Link to={`/${p.slug}`}>{p.title}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const { pages } = useData();

  if (!pages.length) return <div className="page">Loading…</div>;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/list" element={<IndexList pages={pages} />} />
      <Route path="/*" element={<PageView pages={pages} />} />
    </Routes>
  );
}
