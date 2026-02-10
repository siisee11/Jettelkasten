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
  if (parts[0] === "fleeting" || parts[0] === "permanent") {
    parts[0] = "p";
  }
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

const normalizeWikiTarget = (target) => {
  const cleaned = target.replace(/^\.*\//, "").replace(/\.md$/i, "");
  return `p/${slugifySegment(cleaned.split("/").pop())}`;
};

const convertWikilinks = (raw) => {
  return raw.replace(/\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/g, (_, t, label) => {
    const slug = normalizeWikiTarget(t.trim());
    const text = (label ?? t).split("/").pop();
    return `[${text}](/${slug})`;
  });
};

const parseLinks = (raw) => {
  const links = new Set();
  const wiki = /\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]/g;
  const md = /\]\((?!https?:\/\/)([^)]+)\)/g;
  let m;
  while ((m = wiki.exec(raw))) links.add(normalizeWikiTarget(m[1]));
  while ((m = md.exec(raw))) links.add(normalizeWikiTarget(m[1]));
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
    const normalized = convertWikilinks(content);
    const rel = path.relative(contentDir, file);

    const aliases = Array.isArray(data.aliases) ? data.aliases : [];
    const englishAlias = aliases.find(
      (a) => typeof a === "string" && /^[A-Za-z0-9 _.-]+$/.test(a),
    );
    const slugBase = englishAlias ? englishAlias : rel;
    const fileBase = path.basename(slugBase, ".md");
    const slug = `p/${slugifySegment(fileBase)}`;

    const title = data.title ?? path.basename(rel, ".md");
    const tags = Array.isArray(data.tags) ? data.tags : [];
    const date = data.date ?? null;
    const linksOut = parseLinks(raw);
    const bodyHtml = tags.includes("private")
      ? "<p>This document is not public.</p>"
      : await toHtml(normalized);

    const stats = fs.statSync(file);
    const created = stats.birthtime;
    const createdAt = created.getFullYear() >= 2000 ? created.toISOString() : null;
    const updatedAt = stats.mtime.toISOString();

    pages.push({ slug, title, tags, aliases, date, linksOut, bodyHtml, createdAt, updatedAt });
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
