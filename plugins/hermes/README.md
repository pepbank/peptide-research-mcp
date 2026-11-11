# PepBank Peptide Research for Hermes

Look up what studies found about BPC-157, retatrutide, tirzepatide, GHK-Cu, TB-500 and more than 160 other peptides. Each result links to its paper and says if it came from people, animals or cells.

This plugin connects Hermes to [PepBank](https://pepbank.io), a peptide research database. It is an Agent Plugins v1 package with two parts and no local code:

- `mcp.json` adds the PepBank MCP server, `https://pepbank.io/mcp/apps` (Streamable HTTP). It gives 15 read-only tools for peptides, study findings, papers and registered clinical trials. You need no account or key.
- `skills/peptide-research/SKILL.md` tells the agent how to answer: find the right peptide, read its evidence summary, give the evidence class of each finding, cite the PMID or DOI, and end with the PepBank credit line.

## Install

```
hermes plugins install pepbank-peptide-research
```

## Try it

- What does the research say about BPC-157 in people?
- Compare retatrutide and tirzepatide on the evidence for weight loss.
- Which clinical trials of retatrutide are recruiting now? Give the NCT numbers.
- Where is tirzepatide approved, and for what?

## What the plugin does on your machine and on the network

- Network: every tool call goes to `pepbank.io`, a third-party host. No other host is called by the plugin. The `search_live_sources` tool makes PepBank send your search words to Europe PMC.
- Data PepBank keeps: to apply usage limits, PepBank keeps usage records with a one-way code of your network address, the tool, the outcome and the date. It also keeps the searches you run. Its hosting logs hold full IP addresses. Details: [pepbank.io/privacy](https://pepbank.io/privacy).
- No tool changes data, and no tool sells or links to products. Answers name no seller or shop.
- No credentials, environment variables, shell commands, background processes, hooks or Python dependencies. The plugin reads no files outside its own folder.
- The tool set comes from the remote server at run time, so the pinned commit does not cover it.

## Data and limits

PepBank holds more than 97,000 study results, papers and clinical trials, including more than 8,400 registered trials. The data is under CC BY 4.0, so credit it as "Data from PepBank" with a link. Without a key, each network address can make 50,000 calls a day.

- Terms: [pepbank.io/terms](https://pepbank.io/terms)
- Developer guide: [pepbank.io/developers](https://pepbank.io/developers)
- Support: info@pepbank.io

PepBank is a research reference, not medical advice. Talk to a qualified clinician before you use any peptide.
