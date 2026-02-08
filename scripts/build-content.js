import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const contentDir = path.resolve("content");
const outDir = path.resolve("public/data");

const slugifySegment = (seg) =>
  seg
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}\-_.]/gu, "");

const slugifyPath = (p) => {
  const noExt = p.replace(/\.md$/i, "");
  const parts = noExt.split(path.sep).map(slugifySegment);
  return parts.join("/");
};

const collectMarkdownFiles = (dir, acc = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectMarkdownFiles(full, acc);
    else if (entry.isFile() && full.endsWith(".md")) acc.push(full);
  }
  return acc;
};

const parseLinks = (raw) => {
  const links = new Set();
  const wiki = /\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]/g;
  const md = /\]\((?!https?:\/\/)([^)]+)\)/g;
  let m;
  while ((m = wiki.exec(raw))) links.add(m[1]);
  while ((m = md.exec(raw))) links.add(m[1].replace(/\.md$/i, ""));
  return Array.from(links);
};

const toHtml = async (md) => {
  const file = await unified().use(remarkParse).use(remarkGfm).use(remarkHtml).process(md);
  return String(file);
};

const main = async () => {
  const files = collectMarkdownFiles(contentDir);
  const pages = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const rel = path.relative(contentDir, file);
    const slug = slugifyPath(rel);
    const title = data.title ?? path.basename(rel, ".md");
    const tags = Array.isArray(data.tags) ? data.tags : [];
    const date = data.date ?? null;
    const linksOut = parseLinks(raw).map((p) => slugifyPath(p));
    const bodyHtml = await toHtml(content);

    pages.push({ slug, title, tags, date, linksOut, bodyHtml });
  }

  const bySlug = new Map(pages.map((p) => [p.slug, p]));
  const edges = [];
  for (const p of pages) {
    for (const target of p.linksOut) {
      if (bySlug.has(target)) edges.push({ source: p.slug, target });
    }
  }

  const graph = {
    nodes: pages.map((p) => ({ id: p.slug, title: p.title, slug: p.slug })),
    edges,
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "content.json"), JSON.stringify(pages));
  fs.writeFileSync(path.join(outDir, "graph.json"), JSON.stringify(graph));
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
