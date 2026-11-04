# PepBank Peptide Research MCP: Studies, Clinical Trials and Cited Findings

Look up what studies found about more than 160 peptides, such as BPC-157, semaglutide and GHK-Cu. Each result links to its paper and says if it came from people, animals or cells.

PepBank MCP connects your AI to [PepBank](https://pepbank.io), a database of peptide research. Add it to Claude, ChatGPT, Cursor or another MCP app. Your AI can then find a peptide by name and read a summary of its evidence. It can also search study findings and clinical trials, and compare up to five peptides. Each finding links to the sentence in the paper that supports it and cites its PMID or DOI. Developer guide: [pepbank.io/developers](https://pepbank.io/developers).

## Server address

```
https://pepbank.io/mcp
```

Transport: Streamable HTTP. The server runs at this address. This repository holds its listing files. The server code is not in it.

## Add it to your AI app

Claude: open Customize, then Connectors. Select Add custom connector. Name it PepBank and enter `https://pepbank.io/mcp`.

ChatGPT: turn on Developer mode in Settings, under Security and login. Open Plugins and select +, then Add custom MCP server. Name it PepBank and enter `https://pepbank.io/mcp`.

Grok: open [grok.com/connectors](https://grok.com/connectors). Select New Connector, then Custom. Enter `https://pepbank.io/mcp`.

Claude Code:

```
claude mcp add --transport http pepbank https://pepbank.io/mcp
```

Codex (`config.toml`):

```toml
[mcp_servers.pepbank]
url = "https://pepbank.io/mcp"
```

Cursor (`~/.cursor/mcp.json`):

```json
{ "mcpServers": { "pepbank": { "url": "https://pepbank.io/mcp" } } }
```

VS Code (`.vscode/mcp.json`):

```json
{ "servers": { "pepbank": { "type": "http", "url": "https://pepbank.io/mcp" } } }
```

Gemini CLI (`settings.json`):

```json
{ "mcpServers": { "pepbank": { "httpUrl": "https://pepbank.io/mcp" } } }
```

Other apps: add `https://pepbank.io/mcp` as a remote server with Streamable HTTP.

## Command line and local server

For apps that need a local (stdio) server, `bin/pepbank.mjs` forwards each request to `https://pepbank.io/mcp`. It needs Node 18 or later and has no dependencies. Clone this repository, then:

```
node bin/pepbank.mjs brief BPC-157
node bin/pepbank.mjs search tendon healing
node bin/pepbank.mjs trials GHK-Cu
```

Local server config for MCP apps (use the full path to your clone):

```json
{ "mcpServers": { "pepbank": { "command": "node", "args": ["/path/to/peptide-research-mcp/bin/pepbank.mjs"] } } }
```

The `Dockerfile` runs the same bridge in a container.

## Tools

| Tool | What it does |
|---|---|
| `resolve_peptide` | Finds the peptide that a name, alias or code means |
| `get_peptide_brief` | Reads the evidence summary for one peptide, with key findings, trials, studied doses and approval status |
| `search_peptides` | Lists peptides and filters them by name, category or evidence level |
| `search_findings` | Searches study findings, with the source sentence and the PMID or DOI for each |
| `search_publications` | Finds papers and shows which ones have checked findings |
| `search_trials` | Finds registered clinical trials, with status, phase and posted results |
| `search_live_sources` | Searches Europe PMC for papers that PepBank does not cover yet. These results are not checked |
| `get_record` | Reads one full peptide, paper, finding or trial record |
| `get_evidence_map` | Counts the findings for one peptide by outcome, evidence class and direction |
| `compare_peptides` | Compares the evidence for 2 to 5 peptides |
| `get_changes` | Lists data changes since a data version |
| `replay_query` | Runs a saved search again on the data version it first used |
| `get_freshness` | Shows when each source was last imported |
| `get_my_usage` | Shows your daily limits and how much of them you used |

## Prompts and resources

| Name | Type | What it does |
|---|---|---|
| `evidence_summary` | Prompt | Summarizes the evidence for one peptide, with sources and coverage limits |
| `compare_evidence` | Prompt | Compares the evidence for 2 to 5 peptides |
| `pepbank://guide` | Resource | Explains evidence classes, coverage, data versions, citations and limits |

## Plugin package

This repository is also a plugin package that connects the server and adds one skill, `skills/pepbank-peptide-research/SKILL.md`.

- `plugin.json` and `mcp.json`: Agent Plugins format (Hermes)
- `.claude-plugin/plugin.json` and `.mcp.json`: Claude Code plugin format
- `.cursor-plugin/plugin.json`: Cursor plugin format
- `openclaw.plugin.json`: OpenClaw (ClawHub)

Install the skill with the `skills` CLI:

```
npx skills add pepbank/peptide-research-mcp
```

## Questions to try

- What do studies say about BPC-157 for tendon healing?
- Are there clinical trials testing GHK-Cu?
- Compare the evidence for semaglutide and tirzepatide.

## Data and credit

PepBank data is under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). When you show it, credit it as "Data from PepBank" with a link to [pepbank.io](https://pepbank.io). Each tool result gives a credit line to use. The files in this repository are under the MIT License.

## Links

- [PepBank](https://pepbank.io)
- [Developer guide and limits](https://pepbank.io/developers)
- [Privacy](https://pepbank.io/privacy)
- [Terms](https://pepbank.io/terms)
- Support: [info@pepbank.io](mailto:info@pepbank.io)
- Official MCP Registry entry: [`io.pepbank/pepbank`](https://registry.modelcontextprotocol.io/?q=io.pepbank)

Mira Labs LLC runs PepBank. This is not medical advice.
