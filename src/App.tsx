import React, { useEffect, useMemo, useState } from "react";
import { Route, Routes, useParams, Link } from "react-router-dom";
import About from "./About";
import ForceGraph2D from "react-force-graph-2d";
import HomeSidebar from "./HomeSidebar";

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

const buildDepthMap = (graph: Graph, center: string, maxDepth = 2) => {
  const depth = new Map([[center, 0]]);
  let frontier = new Set([center]);
  for (let d = 1; d <= maxDepth; d++) {
    const next = new Set<string>();
    for (const e of graph.edges) {
      const s = typeof e.source === "string" ? e.source : (e.source as any).id;
      const t = typeof e.target === "string" ? e.target : (e.target as any).id;
      if (frontier.has(s) && !depth.has(t)) next.add(t);
      if (frontier.has(t) && !depth.has(s)) next.add(s);
    }
    for (const n of next) depth.set(n, d);
    frontier = next;
  }
  return depth;
};

const PageView: React.FC<{ pages: Page[]; graph: Graph }> = ({ pages, graph }) => {
  const params = useParams();
  const slug = params["*"] || "index";
  const page = pages.find((p) => p.slug === slug);

  const localGraph = useMemo(() => {
    if (!page) return { nodes: [], links: [] };
    return buildLocalGraph(graph, page.slug, 2);
  }, [graph, page]);

  const depthMap = useMemo(() => {
    if (!page) return new Map();
    return buildDepthMap(graph, page.slug, 2);
  }, [graph, page]);

  const [graphSize, setGraphSize] = useState({ width: 720, height: 360 });
  useEffect(() => {
    const updateSize = () => {
      const isMobile = window.innerWidth <= 768;
      const w = isMobile
        ? Math.max(240, window.innerWidth - 48)
        : Math.min(720, Math.max(280, window.innerWidth - 80));
      const h = Math.min(isMobile ? 420 : 360, Math.max(220, Math.floor(w * 0.5)));
      setGraphSize({ width: w, height: h });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!page) return <div className="page">Not found</div>;

  return (
    <div className="page">
      <HomeSidebar pages={pages} />
      <div className="top-nav">
        <Link to="/">home/</Link>
      </div>
      <h1>{page.title}</h1>
      {page.aliases?.length > 0 && (
        <div className="aliases">Aliases: {page.aliases.join(", ")}</div>
      )}
      {page.tags?.filter((t) => t !== "public").length > 0 && (
        <div className="aliases">Tags: {page.tags.filter((t) => t !== "public").join(", ")}</div>
      )}
      <div className="content" dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
      {page.tags.includes("category") && localGraph.nodes.length > 1 && (
        <div className="home-links left-align">
          {localGraph.nodes
            .filter((n) => n.id !== page.slug)
            .map((n) => (
              <Link key={n.id} to={`/${n.slug || n.id}`}>
                {n.title || n.id}
              </Link>
            ))}
        </div>
      )}
      {(page.tags.includes("keyword") || page.tags.includes("person") || page.tags.includes("category")) &&
        localGraph.nodes.length > 1 && (
        <div className="graph">
          <ForceGraph2D
            graphData={localGraph}
            nodeId="id"
            nodeLabel={(n: any) => n.title}
            nodeRelSize={4}
            width={graphSize.width}
            height={graphSize.height}
            linkColor={(l: any) => {
              const s = typeof l.source === "string" ? l.source : l.source?.id;
              const t = typeof l.target === "string" ? l.target : l.target?.id;
              const d = Math.max(depthMap.get(s) ?? 2, depthMap.get(t) ?? 2);
              return d <= 1 ? "#000" : "#777";
            }}
            nodeColor={(n: any) => {
              const d = depthMap.get(n.id) ?? 2;
              return d <= 1 ? "#000" : "#777";
            }}
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

const Home: React.FC<{ pages: Page[] }> = ({ pages }) => {
  return (
    <div className="page home">
      <div className="home-inner">
        <HomeSidebar pages={pages} className="always" />
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
      <HomeSidebar pages={pages} />
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
      <HomeSidebar pages={pages} />
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

const GraphPage: React.FC<{ graph: Graph; pages: Page[] }> = ({ graph, pages }) => {
  const [graphSize, setGraphSize] = useState({ width: 900, height: 520 });
  useEffect(() => {
    const updateSize = () => {
      const isMobile = window.innerWidth <= 768;
      const w = isMobile
        ? Math.max(240, window.innerWidth - 48)
        : Math.min(1200, Math.max(280, window.innerWidth - 120));
      const h = Math.min(isMobile ? 520 : 700, Math.max(240, Math.floor(w * 0.6)));
      setGraphSize({ width: w, height: h });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="page">
      <HomeSidebar pages={pages} />
      <div className="top-nav">
        <Link to="/">home/</Link>
      </div>
      <h1>Graph</h1>
      <div className="graph">
        <ForceGraph2D
          graphData={{ nodes: graph.nodes, links: graph.edges }}
          nodeId="id"
          nodeLabel={(n: any) => n.title}
          nodeRelSize={3}
          width={graphSize.width}
          height={graphSize.height}
          linkColor={() => "#777"}
          nodeColor={() => "#000"}
        />
      </div>
    </div>
  );
};

export default function App() {
  const { pages, graph } = useData();

  if (!pages.length) return <div className="page">Loading…</div>;

  return (
    <Routes>
      <Route path="/" element={<Home pages={pages} />} />
      <Route path="/about" element={<About pages={pages} />} />
      <Route path="/posts" element={<IndexList pages={pages} />} />
      <Route path="/keywords" element={<KeywordList pages={pages} />} />
      <Route path="/graph" element={<GraphPage graph={graph} pages={pages} />} />
      <Route path="/*" element={<PageView pages={pages} graph={graph} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
