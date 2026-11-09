# PepBank Peptide Research

Look up what studies found about BPC-157, retatrutide, tirzepatide, GHK-Cu, TB-500 and more than 160 other peptides. Each result links to its paper and says if it came from people, animals or cells.

This plugin connects Claude to [PepBank](https://pepbank.io), a peptide research database. It has two parts:

- The PepBank connector, `https://pepbank.io/mcp/apps`. It gives Claude 15 read-only tools for peptides, study findings, papers and registered clinical trials. You need no account or key.
- The peptide-research skill. It tells Claude how to answer: find the right peptide, read its evidence summary, give the evidence class of each finding, cite the PMID or DOI, and end with the PepBank credit line.

## Set up

In claude.ai and Cowork, open the plugin's Connectors tab and connect PepBank. Claude Code connects to it directly.

## Try it

- What does the research say about BPC-157 in people?
- Compare retatrutide and tirzepatide on the evidence for weight loss.
- Which clinical trials of retatrutide are recruiting now? Give the NCT numbers.
- Where is tirzepatide approved, and for what?

## Data and limits

PepBank holds more than 97,000 study results, papers and clinical trials, including more than 8,400 registered trials. The data is under CC BY 4.0, so credit it as "Data from PepBank" with a link. Without a key, each network address can make 50,000 calls a day.

- Privacy: [pepbank.io/privacy](https://pepbank.io/privacy)
- Terms: [pepbank.io/terms](https://pepbank.io/terms)
- Support: info@pepbank.io

PepBank is a research reference, not medical advice. Talk to a qualified clinician before you use any peptide.
