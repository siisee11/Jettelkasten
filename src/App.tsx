import React, { useEffect, useMemo, useState } from "react";
import { Route, Routes, useParams, Link } from "react-router-dom";
import About from "./About";
import ForceGraph2D from "react-force-graph-2d";

type Page = {
  slug: string;
  title: string;
  bodyHtml: string;
  tags: string[];
  aliases: string[];
  date: string | null;
  linksOut: string[];
};

type Graph = {
  nodes: { id: string; title: string; slug: string }[];
  edges: { source: string; target: string }[];
};

const useData = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
  useEffect(() => {
    Promise.all([fetch("/data/content.json"), fetch("/data/graph.json")])
      .then(async ([c, g]) => [await c.json(), await g.json()])
      .then(([c, g]) => {
        setPages(c);
        setGraph(g);
      });
  }, []);
  return { pages, graph };
};

const buildLocalGraph = (graph: Graph, center: string, hops = 2) => {
  const neighbors = new Set([center]);
  let frontier = new Set([center]);
  for (let i = 0; i < hops; i++) {
    const next = new Set<string>();
    for (const e of graph.edges) {
      const s = typeof e.source === "string" ? e.source : (e.source as any).id;
      const t = typeof e.target === "string" ? e.target : (e.target as any).id;
      if (frontier.has(s)) next.add(t);
      if (frontier.has(t)) next.add(s);
    }
    for (const n of next) neighbors.add(n);
    frontier = next;
  }
  const nodes = graph.nodes.filter((n) => neighbors.has(n.id));
  const edges = graph.edges.filter(
    (e) => neighbors.has(e.source as string) && neighbors.has(e.target as string),
  );
  return { nodes, links: edges.map((e) => ({ source: e.source, target: e.target })) };
};

const PageView: React.FC<{ pages: Page[]; graph: Graph }> = ({ pages, graph }) => {
  const params = useParams();
  const slug = params["*"] || "index";
  const page = pages.find((p) => p.slug === slug);

  const localGraph = useMemo(() => {
    if (!page) return { nodes: [], links: [] };
    return buildLocalGraph(graph, page.slug, 2);
  }, [graph, page]);

  if (!page) return <div className="page">Not found</div>;

  return (
    <div className="page">
      <div className="top-nav">
        <Link to="/">home/</Link>
      </div>
      <h1>{page.title}</h1>
      {page.aliases?.length > 0 && (
        <div className="aliases">Aliases: {page.aliases.join(", ")}</div>
      )}
      {page.tags?.filter((t) => t !== "public").length > 0 && (
        <div className="tags">
          {page.tags
            .filter((t) => t !== "public")
            .map((t) => (
              <span key={t} className="tag-badge">
                {t}
              </span>
            ))}
        </div>
      )}
      <div className="content" dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
      {(page.tags.includes("keyword") || page.tags.includes("person")) &&
        localGraph.nodes.length > 1 && (
        <div className="graph">
          <ForceGraph2D
            graphData={localGraph}
            nodeId="id"
            nodeLabel={(n: any) => n.title}
            nodeRelSize={4}
            width={720}
            height={360}
          />
        </div>
      )}
    </div>
  );
};

const NotFound: React.FC = () => (
  <div className="page">
    <h1>404</h1>
    <p>Not found</p>
  </div>
);

const Home: React.FC = () => {
  return (
    <div className="page home">
      <div className="home-inner">
        <h1>Jtelkasten</h1>
        <div className="home-links">
          <Link to="/posts">posts/</Link>
          <Link to="/about">about/</Link>
          <Link to="/keywords">keywords/</Link>
          <Link to="/categories">categories/</Link>
        </div>
      </div>
    </div>
  );
};

const IndexList: React.FC<{ pages: Page[] }> = ({ pages }) => {
  const list = pages.filter(
    (p) => p.slug !== "index" && !p.tags.includes("keyword") && !p.tags.includes("person"),
  );
  return (
    <div className="page home">
      <div className="top-nav">
        <Link to="/">home/</Link>
      </div>
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

const KeywordList: React.FC<{ pages: Page[] }> = ({ pages }) => {
  const list = pages.filter((p) => p.tags.includes("keyword"));
  return (
    <div className="page home">
      <div className="top-nav">
        <Link to="/">home/</Link>
      </div>
      <div className="home-inner">
        <h1>Keywords</h1>
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

const CategoryList: React.FC<{ pages: Page[] }> = ({ pages }) => {
  const list = pages.filter((p) => p.tags.includes("category"));
  return (
    <div className="page home">
      <div className="top-nav">
        <Link to="/">home/</Link>
      </div>
      <div className="home-inner">
        <h1>Categories</h1>
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
  const { pages, graph } = useData();

  if (!pages.length) return <div className="page">Loading…</div>;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/posts" element={<IndexList pages={pages} />} />
      <Route path="/keywords" element={<KeywordList pages={pages} />} />
      <Route path="/categories" element={<CategoryList pages={pages} />} />
      <Route path="/*" element={<PageView pages={pages} graph={graph} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
