#!/usr/bin/env node
/**
 * check_by_domain.js
 *
 * Usage:
 *   node check_by_domain.js <domain> <name1> [name2 ...]
 *   node check_by_domain.js --detect <url>
 *
 * What it does:
 * - For each name provided, resolves name.domain (A/AAAA) and tries HTTPS fetch on https://name.domain and https://domain/name
 * - If called with --detect <url>, fetches the URL and performs simple heuristic detection of tech stack (Next.js, React, Vite, Tailwind, Vercel) by inspecting headers and HTML
 *
 * Notes:
 * - Requires Node.js 18+ (for global fetch). If you have older Node, install node-fetch and adjust accordingly.
 */

const dns = require('dns').promises;
const { URL } = require('url');
const { AbortController } = require('abort-controller');

const TIMEOUT = 8000;

function timeoutFetch(url, opts = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);
  return fetch(url, { signal: controller.signal, ...opts })
    .finally(() => clearTimeout(id));
}

async function resolveSubdomain(name, domain) {
  const hostname = `${name}.${domain}`;
  const result = { hostname, resolved: false, ips: [] };
  try {
    const a = await dns.resolve(hostname, 'A');
    result.ips.push(...a);
  } catch (e) { /* ignore */ }
  try {
    const aaaa = await dns.resolve(hostname, 'AAAA');
    result.ips.push(...aaaa);
  } catch (e) { /* ignore */ }
  if (result.ips.length) result.resolved = true;
  return result;
}

async function httpCheck(url) {
  try {
    const res = await timeoutFetch(url, { method: 'GET', redirect: 'follow' });
    const contentType = res.headers.get('content-type') || '';
    return { url, status: res.status, ok: res.ok, contentType };
  } catch (e) {
    return { url, status: null, ok: false, error: String(e) };
  }
}

async function checkName(name, domain) {
  const sub = await resolveSubdomain(name, domain);
  const subUrl = `https://${sub.hostname}`;
  const pathUrl = `https://${domain.replace(/\/+$/, '')}/${encodeURIComponent(name)}`;
  const [subHttp, pathHttp] = await Promise.all([httpCheck(subUrl), httpCheck(pathUrl)]);
  return { name, subdomain: sub, http: { sub: subHttp, path: pathHttp } };
}

function detectTechFromHtml(html, headers) {
  const lower = html.toLowerCase();
  const found = [];
  // Headers
  const xPowered = (headers.get && headers.get('x-powered-by')) || '';
  const server = (headers.get && headers.get('server')) || '';
  if (/next/i.test(xPowered) || /next/i.test(server)) found.push('Next.js');
  if (/vercel/i.test(xPowered) || /vercel/i.test(server)) found.push('Vercel');
  // HTML heuristics
  if (html.includes('__NEXT_DATA__')) found.push('Next.js');
  if (html.includes('data-nextjs') || /<script[^>]+src=["'][^"']+_next\//i.test(html)) found.push('Next.js');
  if (lower.includes('react') && (lower.includes('data-reactroot') || lower.includes('react-dom') || /<div id="root"/.test(lower))) found.push('React');
  if (/vite|import.meta.env/.test(html)) found.push('Vite');
  if (/tailwind|tw-/i.test(html) || /class="[^\"]*(?:bg-|text-|flex|grid|container|mx-|px-)/i.test(html)) found.push('Tailwind CSS');
  if (/angular|ng-/i.test(html)) found.push('Angular');
  // make unique
  return Array.from(new Set(found));
}

async function detectTech(url) {
  try {
    const res = await timeoutFetch(url, { method: 'GET', redirect: 'follow' });
    const headers = res.headers;
    const text = await res.text();
    const heuristics = detectTechFromHtml(text, headers);
    // Also include server/x-powered-by headers
    const headerHints = [];
    const xp = headers.get('x-powered-by');
    const server = headers.get('server');
    if (xp) headerHints.push(`x-powered-by: ${xp}`);
    if (server) headerHints.push(`server: ${server}`);
    return { url, status: res.status, headers: headerHints, heuristics };
  } catch (e) {
    return { url, status: null, error: String(e) };
  }
}

async function main() {
  const argv = process.argv.slice(2);
  if (!argv.length) {
    console.log('Usage: node check_by_domain.js <domain> <name1> [name2 ...]');
    console.log('   or: node check_by_domain.js --detect <url>');
    process.exit(1);
  }

  if (argv[0] === '--detect') {
    const url = argv[1];
    if (!url) {
      console.error('Please provide a URL after --detect');
      process.exit(1);
    }
    const info = await detectTech(url);
    console.log(JSON.stringify(info, null, 2));
    return;
  }

  const domain = argv[0];
  const names = argv.slice(1);
  if (!names.length) {
    console.error('Provide at least one name to check as subdomain/path');
    process.exit(1);
  }

  console.log(`Checking domain: ${domain}`);
  const results = [];
  for (const name of names) {
    try {
      const r = await checkName(name, domain);
      results.push(r);
    } catch (e) {
      results.push({ name, error: String(e) });
    }
  }
  console.log(JSON.stringify({ domain, results }, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
