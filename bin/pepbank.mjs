#!/usr/bin/env node
// PepBank Peptide Research: a command-line tool and a local (stdio) bridge to the
// PepBank MCP server at https://pepbank.io/mcp. No dependencies. Node 18 or later.
import { createInterface } from "node:readline";

const VERSION = "1.0.0";
const SERVER = process.env.PEPBANK_MCP_URL || "https://pepbank.io/mcp";
const HELP = `pepbank ${VERSION}
Look up what studies found about more than 160 peptides. Each result links to its paper
and says if it came from people, animals or cells.

Usage:
  pepbank                     Run the PepBank MCP server over stdio (for MCP apps)
  pepbank brief <peptide>     Evidence summary and key findings for one peptide
  pepbank search <words>      Search study findings
  pepbank trials <peptide>    Registered clinical trials that test one peptide
  Add --json to print the raw result.

Developer guide: https://pepbank.io/developers
Data from PepBank (CC BY 4.0). This is not medical advice.`;

// One JSON-RPC call to the server. The server answers with JSON or with SSE "data:" lines.
async function post(message, userAgent) {
  const response = await fetch(SERVER, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "user-agent": userAgent },
    body: JSON.stringify(message),
  });
  const text = await response.text();
  if (!text.trim()) return [];
  if (text.trimStart().startsWith("{") || text.trimStart().startsWith("[")) return [].concat(JSON.parse(text));
  return text.split("\n").filter((line) => line.startsWith("data: ")).map((line) => JSON.parse(line.slice(6)));
}

// Stdio bridge: each line on stdin is one JSON-RPC message; each reply goes to stdout as one line.
function bridge() {
  let userAgent = `pepbank/${VERSION}`;
  const lines = createInterface({ input: process.stdin });
  lines.on("line", async (line) => {
    if (!line.trim()) return;
    let message;
    try { message = JSON.parse(line); } catch { return; }
    // Pass the app name on, so PepBank can tell which app sent the request.
    if (message.method === "initialize" && message.params?.clientInfo?.name) userAgent = `pepbank/${VERSION} (${message.params.clientInfo.name})`;
    try {
      for (const reply of await post(message, userAgent)) process.stdout.write(`${JSON.stringify(reply)}\n`);
    } catch (error) {
      if (message.id !== undefined) process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id: message.id, error: { code: -32603, message: `PepBank MCP server not reachable: ${error.message}` } })}\n`);
    }
  });
}

async function tool(name, args) {
  const [reply] = await post({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }, `pepbank-cli/${VERSION}`);
  if (reply?.error) throw new Error(reply.error.message);
  if (reply?.result?.isError) throw new Error(reply.result.content?.[0]?.text ?? "tool error");
  return reply.result.structuredContent ?? JSON.parse(reply.result.content[0].text);
}

const trialCount = (n = 0) => `${n} registered ${n === 1 ? "trial tests" : "trials test"} it.`;
const cite = (c) => (c?.pmid ? `PMID ${c.pmid}` : c?.doi ? `DOI ${c.doi}` : "");

const commands = {
  async brief(words) {
    const data = await tool("get_peptide_brief", { peptide: words.join(" ") });
    const e = data.evidence_summary ?? {};
    console.log(data.peptide?.preferred_name ?? words.join(" "));
    if (data.regulatory?.approval) console.log(`Approval: ${data.regulatory.approval}`);
    console.log(`Findings: ${e.human?.findings ?? 0} human, ${e.animal?.findings ?? 0} animal, ${e.laboratory?.findings ?? 0} lab. ${trialCount(e.trials?.total)}`);
    for (const n of data.notices ?? []) if (n.code !== "mcp_compact_view") console.log(`Note: ${n.text}`);
    console.log("\nKey findings:");
    for (const f of data.key_findings ?? []) console.log(`- [${f.evidence_class}] ${f.statement} ${cite(f.citation)}`.trimEnd());
    if (data.credit?.line) console.log(`\n${data.credit.line}`);
    return data;
  },
  async search(words) {
    const data = await tool("search_findings", { q: words.join(" ") });
    const papers = new Map((data.included?.publications ?? []).map((p) => [p.id, p]));
    const names = new Map((data.included?.peptides ?? []).map((p) => [p.id, p.name]));
    console.log(`${data.total_count ?? 0} findings. First ${data.results?.length ?? 0}:`);
    for (const r of data.results ?? []) {
      const name = names.get(r.peptide?.peptide_id);
      console.log(`- [${r.evidence_class}]${name ? ` ${name}:` : ""} ${r.claim?.statement} ${cite(papers.get(r.publication_id))}`.trimEnd());
    }
    if (data.credit?.line) console.log(`\n${data.credit.line}`);
    return data;
  },
  async trials(words) {
    const data = await tool("search_trials", { peptide: words.join(" ") });
    console.log(trialCount(data.total_count));
    for (const t of data.results ?? []) console.log(`- ${t.ids?.nct ?? t.trial_id}: ${t.title} (${(t.phases ?? []).join(", ") || "no phase"}, ${t.overall_status ?? "status unknown"})`);
    for (const n of data.notices ?? []) if (n.code !== "mcp_compact_view") console.log(`Note: ${n.text}`);
    if (data.credit?.line) console.log(`\n${data.credit.line}`);
    return data;
  },
};

const args = process.argv.slice(2);
const json = args.includes("--json");
const [command, ...words] = args.filter((a) => a !== "--json");

if (!command || command === "mcp") bridge();
else if (command === "help" || command === "--help" || command === "-h") console.log(HELP);
else if (command === "--version" || command === "-v") console.log(VERSION);
else if (!commands[command]) { console.error(`Unknown command: ${command}\n\n${HELP}`); process.exit(1); }
else if (!words.length) { console.error(`Usage: pepbank ${command} <words>`); process.exit(1); }
else {
  const log = console.log;
  if (json) console.log = () => {};
  try {
    const data = await commands[command](words);
    if (json) log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`PepBank MCP server error: ${error.message}`);
    process.exit(1);
  }
}
