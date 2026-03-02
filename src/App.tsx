import React, { useEffect, useMemo, useRef, useState } from "react";
import { Route, Routes, useParams, Link, useNavigate } from "react-router-dom";
import About from "./About";
import ForceGraph3D from "react-force-graph-3d";
import SpriteText from "three-spritetext";
import * as THREE from "three";
import HomeSidebar from "./HomeSidebar";
import SeoHead from "./SeoHead";
import HandGestureOverlay, { type GestureControlEvent } from "./HandGestureOverlay";

type Page = {
  slug: string;
  title: string;
  bodyHtml: string;
  tags: string[];
  aliases: string[];
  date: string | null;
  linksOut: string[];
  createdAt?: string;
  updatedAt?: string;
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

const toTimestamp = (value?: string | null): number | null => {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp;
};

const getPostTimestamp = (page: Page): number => {
  const postDate = page.createdAt ?? null;
  return toTimestamp(postDate) ?? 0;
};

const formatRelativeEnglish = (value?: string | null): string => {
  const timestamp = toTimestamp(value);
  if (timestamp === null) return "";

  const diffSeconds = Math.round((timestamp - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSeconds < 60) return rtf.format(diffSeconds, "second");
  if (absSeconds < 60 * 60) return rtf.format(Math.round(diffSeconds / 60), "minute");
  if (absSeconds < 60 * 60 * 24) return rtf.format(Math.round(diffSeconds / (60 * 60)), "hour");
  if (absSeconds < 60 * 60 * 24 * 7) return rtf.format(Math.round(diffSeconds / (60 * 60 * 24)), "day");
  if (absSeconds < 60 * 60 * 24 * 30)
    return rtf.format(Math.round(diffSeconds / (60 * 60 * 24 * 7)), "week");
  if (absSeconds < 60 * 60 * 24 * 365)
    return rtf.format(Math.round(diffSeconds / (60 * 60 * 24 * 30)), "month");

  return rtf.format(Math.round(diffSeconds / (60 * 60 * 24 * 365)), "year");
};

const buildDegreeMapFromLinks = (links: Array<{ source: any; target: any }>) => {
  const degrees = new Map<string, number>();
  for (const link of links) {
    const sourceId = typeof link.source === "string" ? link.source : link.source?.id;
    const targetId = typeof link.target === "string" ? link.target : link.target?.id;

    if (sourceId) degrees.set(sourceId, (degrees.get(sourceId) ?? 0) + 1);
    if (targetId) degrees.set(targetId, (degrees.get(targetId) ?? 0) + 1);
  }
  return degrees;
};

const nodeSizeFromDegree = (degree: number) => {
  if (degree <= 0) return 1;
  return Math.min(12, 1 + degree * 0.8);
};

const LABEL_DISTANCE_THRESHOLD = 600;
const LABEL_SHOW_DISTANCE = LABEL_DISTANCE_THRESHOLD;
const LABEL_FULL_OPACITY_DISTANCE = 400;
const LABEL_MIN_OPACITY = 0.1;
const NODE_INTERACTIVE_DISTANCE = 400;
const CAMERA_CHANGE_EPSILON = 0.05;

const GESTURE_ORBIT_SPEED = 2.4;
const GESTURE_ZOOM_SPEED = 2.2;
const GESTURE_PAN_SPEED = 0.9;
const GESTURE_MIN_CAMERA_DISTANCE = 30;
const GESTURE_MAX_CAMERA_DISTANCE = 1600;

const buildNodeLabelSprite = (
  node: { id: string; title?: string },
  labelMap: Map<string, SpriteText>,
) => {
  const sprite = new SpriteText(node.title || node.id);
  sprite.color = "#222";
  sprite.backgroundColor = "rgba(255,255,255,0.9)";
  sprite.padding = 2;
  sprite.borderRadius = 2;
  sprite.textHeight = 3.5;
  sprite.position.set(0, 8, 0);
  sprite.visible = false;
  if (sprite.material) {
    sprite.material.transparent = true;
    sprite.material.opacity = 0;
  }
  labelMap.set(node.id, sprite);
  return sprite;
};

const getNodeDistanceFromCamera = (
  graphRef: any,
  node?: { x?: number; y?: number; z?: number } | null,
): number | null => {
  if (!node) return null;
  const camera = graphRef?.camera?.();
  if (!camera) return null;

  const cx = camera.position.x;
  const cy = camera.position.y;
  const cz = camera.position.z;

  const nx = node.x ?? 0;
  const ny = node.y ?? 0;
  const nz = node.z ?? 0;

  return Math.hypot(nx - cx, ny - cy, nz - cz);
};

const isNodeInteractiveByDistance = (
  graphRef: any,
  node?: { x?: number; y?: number; z?: number } | null,
  threshold = NODE_INTERACTIVE_DISTANCE,
) => {
  const distance = getNodeDistanceFromCamera(graphRef, node);
  if (distance === null) return false;
  return distance <= threshold;
};

const getNodeRoutePath = (node: any): string | null => {
  const slug = node?.slug || node?.id;
  if (!slug) return null;
  if (slug === "index") return "/";
  return `/${slug}`;
};

const updateLabelVisibilityByDistance = (
  graphRef: any,
  labelMap: Map<string, SpriteText>,
  nodes: Array<{ id: string; x?: number; y?: number; z?: number }>,
  showDistance = LABEL_SHOW_DISTANCE,
  fullOpacityDistance = LABEL_FULL_OPACITY_DISTANCE,
  minOpacity = LABEL_MIN_OPACITY,
) => {
  for (const node of nodes) {
    const sprite = labelMap.get(node.id);
    if (!sprite || !sprite.material) continue;

    const distance = getNodeDistanceFromCamera(graphRef, node);
    if (distance === null) continue;

    if (distance > showDistance) {
      sprite.visible = false;
      sprite.material.opacity = 0;
      continue;
    }

    sprite.visible = true;

    if (distance <= fullOpacityDistance) {
      sprite.material.opacity = 1;
      continue;
    }

    const t = (showDistance - distance) / (showDistance - fullOpacityDistance);
    const opacity = minOpacity + Math.max(0, Math.min(1, t)) * (1 - minOpacity);
    sprite.material.opacity = opacity;
  }
};

const useLabelVisibilityUpdater = (
  graphRef: React.MutableRefObject<any>,
  labelMapRef: React.MutableRefObject<Map<string, SpriteText>>,
  nodes: Array<{ id: string; x?: number; y?: number; z?: number }>,
) => {
  useEffect(() => {
    let rafId = 0;
    let active = true;
    let lastCameraState: [number, number, number, number, number, number] | null = null;

    const tick = () => {
      if (!active) return;

      const graph = graphRef.current;
      const camera = graph?.camera?.();
      const controls = graph?.controls?.();
      const target = controls?.target;

      if (camera && target) {
        const currentState: [number, number, number, number, number, number] = [
          camera.position.x,
          camera.position.y,
          camera.position.z,
          target.x,
          target.y,
          target.z,
        ];

        const cameraMoved =
          !lastCameraState ||
          currentState.some((value, index) => Math.abs(value - lastCameraState![index]) > CAMERA_CHANGE_EPSILON);

        if (cameraMoved) {
          updateLabelVisibilityByDistance(graph, labelMapRef.current, nodes);
          lastCameraState = currentState;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(rafId);
    };
  }, [graphRef, labelMapRef, nodes]);
};

const PageView: React.FC<{ pages: Page[]; graph: Graph }> = ({ pages, graph }) => {
  const params = useParams();
  const navigate = useNavigate();
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

  const categoryBacklinks = useMemo(() => {
    if (!page || !page.tags.includes("category") || localGraph.nodes.length <= 1) return [] as Page[];

    return localGraph.nodes
      .filter((n) => n.id !== page.slug && (depthMap.get(n.id) ?? 2) === 1)
      .map((n) => pages.find((p) => p.slug === (n.slug || n.id)))
      .filter((p): p is Page => Boolean(p))
      .sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
  }, [depthMap, localGraph.nodes, page, pages]);

  const localDegreeMap = useMemo(
    () => buildDegreeMapFromLinks(localGraph.links as Array<{ source: any; target: any }>),
    [localGraph.links],
  );

  const localGraphRef = useRef<any>(null);
  const localLabelMapRef = useRef<Map<string, SpriteText>>(new Map());

  useEffect(() => {
    localLabelMapRef.current.clear();
  }, [localGraph.nodes]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "default";
    };
  }, []);
  useLabelVisibilityUpdater(
    localGraphRef,
    localLabelMapRef,
    localGraph.nodes as Array<{ id: string; x?: number; y?: number; z?: number }>,
  );

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
      {(page.createdAt || page.updatedAt) && (
        <div className="aliases">
          {page.createdAt && `Created: ${new Date(page.createdAt).toLocaleDateString()}`}
          {page.createdAt && page.updatedAt && " · "}
          {page.updatedAt && `Updated: ${new Date(page.updatedAt).toLocaleDateString()}`}
        </div>
      )}
      {page.tags?.filter((t) => t !== "public").length > 0 && (
        <div className="aliases">Tags: {page.tags.filter((t) => t !== "public").join(", ")}</div>
      )}
      <div className="content" dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
      {page.tags.includes("category") && categoryBacklinks.length > 0 && (
        <div className="home-links left-align">
          {categoryBacklinks.map((p) => {
            const relativeDate = formatRelativeEnglish(p.createdAt ?? null);
            return (
              <div key={p.slug} className="post-list-item category-backlink-item">
                <Link to={`/${p.slug}`}>{p.title}</Link>
                {relativeDate && <span className="post-list-date">{relativeDate}</span>}
              </div>
            );
          })}
        </div>
      )}
      {(page.tags.includes("keyword") || page.tags.includes("person") || page.tags.includes("category")) &&
        localGraph.nodes.length > 1 && (
        <div className="graph">
          <ForceGraph3D
            ref={localGraphRef}
            graphData={localGraph}
            nodeId="id"
            nodeLabel={(n: any) => n.title}
            nodeThreeObject={(n: any) =>
              buildNodeLabelSprite(
                { id: n.id, title: n.title },
                localLabelMapRef.current,
              )
            }
            nodeThreeObjectExtend={true}
            onNodeHover={(node: any) => {
              const isInteractive = isNodeInteractiveByDistance(localGraphRef.current, node);
              document.body.style.cursor = isInteractive ? "pointer" : "default";
            }}
            onNodeClick={(node: any) => {
              if (!isNodeInteractiveByDistance(localGraphRef.current, node)) return;
              const path = getNodeRoutePath(node);
              if (!path) return;
              navigate(path);
            }}
            nodeVal={(n: any) => nodeSizeFromDegree(localDegreeMap.get(n.id) ?? 0)}
            nodeRelSize={4}
            width={graphSize.width}
            height={graphSize.height}
            backgroundColor="#fff"
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
    <div className="page">
      <HomeSidebar pages={pages} className="show-mobile" />
    </div>
  );
};

const IndexList: React.FC<{ pages: Page[] }> = ({ pages }) => {
  const list = useMemo(
    () =>
      pages
        .filter(
          (p) =>
            p.slug !== "index" &&
            !p.tags.includes("keyword") &&
            !p.tags.includes("person") &&
            !p.tags.includes("category"),
        )
        .sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a)),
    [pages],
  );

  return (
    <div className="page home">
      <HomeSidebar pages={pages} />
      <div className="top-nav">
        <Link to="/">home/</Link>
      </div>
      <div className="home-inner">
        <h1>Posts</h1>
        <div className="list-scroll">
          <div className="home-links">
            {list.map((p) => {
              const postDate = p.createdAt ?? null;
              const relativeDate = formatRelativeEnglish(postDate);
              return (
                <div key={p.slug} className="post-list-item">
                  {relativeDate && <span className="post-list-date">{relativeDate}</span>}
                  <Link to={`/${p.slug}`}>{p.title}</Link>
                </div>
              );
            })}
          </div>
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
        <div className="list-scroll">
          <div className="home-links">
            {list.map((p) => (
              <div key={p.slug}>
                <Link to={`/${p.slug}`}>{p.title}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const GraphPage: React.FC<{ graph: Graph; pages: Page[] }> = ({ graph, pages }) => {
  const navigate = useNavigate();
  const [graphSize, setGraphSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const updateSize = () => {
      setGraphSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const fullDegreeMap = useMemo(
    () => buildDegreeMapFromLinks(graph.edges as Array<{ source: any; target: any }>),
    [graph.edges],
  );

  const fullGraphRef = useRef<any>(null);
  const fullLabelMapRef = useRef<Map<string, SpriteText>>(new Map());
  const cameraLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    fullLabelMapRef.current.clear();
  }, [graph.nodes]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "default";
    };
  }, []);
  useLabelVisibilityUpdater(
    fullGraphRef,
    fullLabelMapRef,
    graph.nodes as Array<{ id: string; x?: number; y?: number; z?: number }>,
  );

  const getCameraAndLookAt = () => {
    const graphInstance = fullGraphRef.current;
    const camera = graphInstance?.camera?.() as THREE.PerspectiveCamera | undefined;
    if (!camera) return null;

    const controls = graphInstance?.controls?.() as any;
    const target = controls?.target;
    if (target && typeof target.x === "number" && typeof target.y === "number" && typeof target.z === "number") {
      cameraLookAtRef.current.set(target.x, target.y, target.z);
    }

    return {
      camera,
      lookAt: cameraLookAtRef.current.clone(),
    };
  };

  const applyCameraState = (cameraPosition: THREE.Vector3, lookAt: THREE.Vector3) => {
    const graphInstance = fullGraphRef.current;
    if (!graphInstance?.cameraPosition) return;

    graphInstance.cameraPosition(
      { x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z },
      { x: lookAt.x, y: lookAt.y, z: lookAt.z },
      0,
    );

    cameraLookAtRef.current.copy(lookAt);

    const controls = graphInstance?.controls?.() as any;
    if (controls?.target?.set) {
      controls.target.set(lookAt.x, lookAt.y, lookAt.z);
      if (typeof controls.update === "function") {
        controls.update();
      }
    }
  };

  const orbitCameraByGesture = (dx: number, dy: number) => {
    if (!dx && !dy) return;
    const current = getCameraAndLookAt();
    if (!current) return;

    const offset = current.camera.position.clone().sub(current.lookAt);
    const radius = Math.max(offset.length(), GESTURE_MIN_CAMERA_DISTANCE);

    const spherical = new THREE.Spherical().setFromVector3(offset);
    spherical.theta -= dx * GESTURE_ORBIT_SPEED;
    spherical.phi += dy * GESTURE_ORBIT_SPEED;
    spherical.makeSafe();

    const nextOffset = new THREE.Vector3().setFromSpherical(spherical).setLength(radius);
    const nextCameraPosition = current.lookAt.clone().add(nextOffset);
    applyCameraState(nextCameraPosition, current.lookAt);
  };

  const zoomCameraByGesture = (zoomDelta: number) => {
    if (!zoomDelta) return;
    const current = getCameraAndLookAt();
    if (!current) return;

    const offset = current.camera.position.clone().sub(current.lookAt);
    if (offset.lengthSq() === 0) return;

    const nextDistance = THREE.MathUtils.clamp(
      offset.length() * (1 + zoomDelta * GESTURE_ZOOM_SPEED),
      GESTURE_MIN_CAMERA_DISTANCE,
      GESTURE_MAX_CAMERA_DISTANCE,
    );

    const nextCameraPosition = current.lookAt.clone().add(offset.normalize().multiplyScalar(nextDistance));
    applyCameraState(nextCameraPosition, current.lookAt);
  };

  const panCameraByGesture = (dx: number, dy: number) => {
    if (!dx && !dy) return;
    const current = getCameraAndLookAt();
    if (!current) return;

    const viewDirection = current.lookAt.clone().sub(current.camera.position);
    const viewDistance = Math.max(viewDirection.length(), 1);
    const forward = viewDirection.normalize();

    let right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0));
    if (right.lengthSq() < 1e-6) {
      right = new THREE.Vector3(1, 0, 0);
    }
    right.normalize();

    const up = new THREE.Vector3().crossVectors(right, forward).normalize();
    const panScale = Math.max(1, viewDistance * GESTURE_PAN_SPEED);

    const offset = right.multiplyScalar(-dx * panScale).add(up.multiplyScalar(dy * panScale));
    const nextCameraPosition = current.camera.position.clone().add(offset);
    const nextLookAt = current.lookAt.clone().add(offset);

    applyCameraState(nextCameraPosition, nextLookAt);
  };

  const handleGestureControl = (event: GestureControlEvent) => {
    if (event.mode === "orbit") {
      orbitCameraByGesture(event.deltaX ?? 0, event.deltaY ?? 0);
      if (event.zoomDelta) {
        zoomCameraByGesture(event.zoomDelta);
      }
      return;
    }

    if (event.mode === "zoom") {
      zoomCameraByGesture(event.zoomDelta ?? 0);
      return;
    }

    if (event.mode === "pan") {
      panCameraByGesture(event.deltaX ?? 0, event.deltaY ?? 0);
    }
  };

  return (
    <div className="page graph-page">
      <HomeSidebar pages={pages} className="show-mobile" />
      <div className="graph graph-fullscreen">
        <ForceGraph3D
          ref={fullGraphRef}
          graphData={{ nodes: graph.nodes, links: graph.edges }}
          nodeId="id"
          nodeLabel={(n: any) => n.title}
          nodeThreeObject={(n: any) =>
            buildNodeLabelSprite(
              { id: n.id, title: n.title },
              fullLabelMapRef.current,
            )
          }
          nodeThreeObjectExtend={true}
          onNodeHover={(node: any) => {
            const isInteractive = isNodeInteractiveByDistance(fullGraphRef.current, node);
            document.body.style.cursor = isInteractive ? "pointer" : "default";
          }}
          onNodeClick={(node: any) => {
            if (!isNodeInteractiveByDistance(fullGraphRef.current, node)) return;
            const path = getNodeRoutePath(node);
            if (!path) return;
            navigate(path);
          }}
          nodeVal={(n: any) => nodeSizeFromDegree(fullDegreeMap.get(n.id) ?? 0)}
          nodeRelSize={3}
          width={graphSize.width}
          height={graphSize.height}
          backgroundColor="#fff"
          linkColor={() => "#777"}
          nodeColor={() => "#000"}
        />
      </div>
      <HandGestureOverlay onControl={handleGestureControl} />
    </div>
  );
};

export default function App() {
  const { pages, graph } = useData();

  if (!pages.length) return <div className="page">Loading…</div>;

  return (
    <>
      <SeoHead pages={pages} />
      <Routes>
        <Route path="/" element={<Home pages={pages} />} />
        <Route path="/about" element={<About pages={pages} />} />
        <Route path="/posts" element={<IndexList pages={pages} />} />
        <Route path="/keywords" element={<KeywordList pages={pages} />} />
        <Route path="/graph" element={<GraphPage graph={graph} pages={pages} />} />
        <Route path="/*" element={<PageView pages={pages} graph={graph} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
