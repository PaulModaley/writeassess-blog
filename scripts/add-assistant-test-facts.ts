// One-off (2026-11-16): adds unapproved facts from the AI assistant test
// (main repo docs/content/ai-assistant-comparison-2026-11.md). Already run; do not re-run (it appends).
import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })
const CHECKED_ON = '2026-11-16'
const SRC = 'https://www.gov.uk/government/publications/2018-teacher-assessment-exemplification-ks2-english-writing'
let n = 0
const fact = (text: string) => ({ _type: 'fact', _key: `t16${(n++).toString(36)}${Date.now().toString(36)}`, text, sourceUrl: SRC, checkedOn: CHECKED_ON, approved: false })
const general = [
  'In a test on 4 published DfE exemplification pieces (16 November 2026), ChatGPT (Plus), Gemini (free) and Claude (Pro) each gave a WTS, EXS or GDS judgement against the DfE teacher assessment framework when asked in plain language, without being told the framework.',
  'In that test, ChatGPT and Claude looked up the current GOV.UK framework before answering, and said each time that one piece of writing cannot give a statutory judgement.',
  'In that test, the three assistants gave different judgements from each other on 2 of the 4 pieces.',
  'In that test, ChatGPT and Claude took about 40 to 60 seconds per piece and Gemini under 30 seconds.',
]
const product = [
  'In a test on 4 published DfE exemplification pieces (16 November 2026), WriteAssess returned a WTS, EXS or GDS suggestion, strengths, next steps and the transcript for each piece, all within 20 seconds.',
]
async function main() {
  await client.patch('competitor-general-ai-assistants').setIfMissing({ facts: [] }).append('facts', general.map(fact)).commit()
  await client.patch('productFacts').setIfMissing({ facts: [] }).append('facts', product.map(fact)).commit()
  console.table(await client.fetch('*[_id in ["productFacts","competitor-general-ai-assistants"]]{_id, "n": count(facts), "approved": count(facts[approved==true])}'))
}
main().catch((e) => { console.error(e); process.exit(1) })
