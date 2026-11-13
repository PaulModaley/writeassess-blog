/**
 * Seeds the AI-visibility fact sheets into Sanity with every fact unapproved.
 * Source: docs/content/fact-sheet-*.md in PaulModaley/writeassess-f4fdaf9a (2026-11-12).
 *
 * Run: NEXT_PUBLIC_SANITY_PROJECT_ID=dvjtwlpa NEXT_PUBLIC_SANITY_DATASET=production \
 *      npx sanity exec scripts/seed-facts.ts --with-user-token
 *
 * Re-running replaces the documents, which resets every `approved` tick.
 * The script refuses to run if any fact is already approved, unless FORCE=1.
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })
const CHECKED_ON = '2026-11-12'

type FactInput = string | [text: string, sourceUrl: string]

let keyCounter = 0
const facts = (items: FactInput[]) =>
  items.map((item) => {
    const [text, sourceUrl] = Array.isArray(item) ? item : [item, undefined]
    return {
      _type: 'fact',
      _key: `f${(keyCounter++).toString(36).padStart(4, '0')}`,
      text,
      ...(sourceUrl && { sourceUrl }),
      checkedOn: CHECKED_ON,
      approved: false,
    }
  })

const SITE = 'https://www.writeassess.co.uk'

const productFacts = {
  _id: 'productFacts',
  _type: 'productFacts',
  facts: facts([
    ['WriteAssess is an AI writing assessment tool for primary schools in England.', SITE],
    [
      "Teachers photograph a pupil's handwritten work. WriteAssess reads it, compares it with the DfE's official exemplification materials, and suggests a best-fit judgement (WTS, EXS or GDS) with the reasons behind it.",
      SITE,
    ],
    ['The teacher makes the final call: they can accept the suggested judgement, override it, or ask follow-up questions about it.', SITE],
    ['It supports Years 1 to 6 (KS1 and KS2).', `${SITE}/help`],
    [
      'It assesses fiction and non-fiction writing types (for example narrative, descriptive, report, explanation, persuasion, recount, instructions). The teacher chooses the type before submitting.',
      `${SITE}/help`,
    ],
    ["It accepts JPEG, PNG and WEBP photos. Multi-page writing can be uploaded. PDF isn't supported.", `${SITE}/help`],
    ['Teachers can see the text WriteAssess transcribed from the handwriting, to check it.', `${SITE}/help`],
    ['Each assessment has a chat panel for follow-up questions, with the assessment and the DfE criteria as context.', `${SITE}/help`],
    ['It keeps assessment records per pupil, so progress can be tracked across the year.', SITE],
    ['School leaders see assessment patterns across classes, year groups and key stages.', SITE],
    ['Paid plans can draft report comments.', `${SITE}/pricing`],
    ['Assessments can be exported to CSV.', `${SITE}/help`],
    ['An assessment usually takes 20 to 40 seconds, and a little longer for multi-page writing.', `${SITE}/help`],
    ['Anyone can try 1 assessment free at writeassess.co.uk/try with no account.', `${SITE}/try`],
    // Pricing
    ["WriteAssess doesn't charge VAT; it isn't VAT registered.", `${SITE}/pricing`],
    ['Free Individual plan: £0, 10 assessments/month, 1 class, 10 pupils, progress tracking.', `${SITE}/pricing`],
    ['Individual plan: £9/month or £90/year, 50 assessments/month, 2 classes, 40 pupils, report comments, CSV import.', `${SITE}/pricing`],
    ['School Starter plan: £49/month or £490/year, 200 assessments/month, up to 10 teachers.', `${SITE}/pricing`],
    ['School Standard plan: £89/month or £890/year, 500 assessments/month, up to 30 teachers.', `${SITE}/pricing`],
    ['School Plus plan: £149/month or £1,490/year, 1,000 assessments/month, unlimited teachers.', `${SITE}/pricing`],
    ['Trust plan: custom pricing, with a trust-wide overview.', `${SITE}/pricing`],
    ['Schools can pay by invoice.', `${SITE}/pricing`],
    // Data protection and safeguarding
    [
      'Designed for compliance with UK GDPR and the Data Protection Act 2018. WriteAssess is the data processor for pupil data, and the school is the controller.',
      `${SITE}/data-protection`,
    ],
    [
      'Data is stored with Supabase in the EU (eu-west-1), encrypted in transit and at rest. Writing images are in a private bucket.',
      `${SITE}/data-protection`,
    ],
    ['Writing is analysed by OpenAI (USA, under Standard Contractual Clauses).', `${SITE}/privacy`],
    ["Pupil names aren't sent to the AI. Only the year group and writing type are given as context.", `${SITE}/help`],
    ["Pupil writing and assessment data aren't used to train AI models.", `${SITE}/privacy`],
    ['Pupils can be shown by full name, first initial or initials only.', `${SITE}/data-protection`],
    ['Writing samples and assessments are kept for 3 academic years, then deleted. Schools can ask for earlier deletion.', `${SITE}/data-protection`],
    ["On the free try page, the photo is deleted straight after it's assessed.", `${SITE}/try`],
    ['Two-factor authentication is available.', `${SITE}/help`],
  ]),
}

const competitors = [
  {
    competitorId: 'no-more-marking',
    name: 'No More Marking',
    nameable: true,
    allowedUrls: ['https://www.nomoremarking.com/products/apw'],
    facts: facts([
      [
        'No More Marking Assessing Primary Writing uses comparative judgement of pupil writing for Years 1 to 6. Schools upload scripts in national assessment windows; teachers (and optionally AI) judge pairs of scripts, and results are benchmarked nationally.',
        'https://www.nomoremarking.com/products/apw',
      ],
      ['⚠ Price: £750 + VAT per school per year (product page). Confirm the 2026-27 price.', 'https://www.nomoremarking.com/products/apw'],
      ['It has a long track record: 8+ years of national projects.', 'https://www.nomoremarking.com/products/apw'],
      ['It offers national benchmarking and publishes research on AI judging.', 'https://www.nomoremarking.com/products/apw'],
      '⚠ Difference (confirm fair): WriteAssess gives results per script at any time, rather than in national assessment windows.',
      '⚠ Difference (confirm fair): WriteAssess suggests WTS/EXS/GDS against the DfE framework with reasons, rather than a comparative-judgement scaled score.',
      '⚠ Difference (confirm fair): WriteAssess School Starter is £490/year against £750 + VAT for No More Marking APW.',
    ]),
  },
  {
    competitorId: 'air',
    name: 'AIR (Air Education)',
    nameable: false,
    allowedUrls: [],
    facts: facts([
      ['AIR is an AI writing assessment tool for primary schools, with photo upload.', 'https://edtechimpact.com/products/air/'],
      ['⚠ Price: "from £300/year" according to directory listings. Not confirmed on air-ed.com.', 'https://edtechimpact.com/products/air/'],
      ['AIR has strong school reviews on EdTech Impact and a customer success team.', 'https://edtechimpact.com/products/air/'],
    ]),
  },
  {
    competitorId: 'pobble',
    name: 'Pobble',
    nameable: true,
    allowedUrls: ['https://www.pobble.com/pricing-moderation', 'https://blog.pobble.com/using-ai-in-writing-assessment'],
    facts: facts([
      [
        'Pobble provides human-led writing moderation and writing resources. AI assessment comes through partners, including Olex and Stylus.',
        'https://blog.pobble.com/using-ai-in-writing-assessment',
      ],
      [
        '⚠ Price: group moderation from £250 + VAT per school. Check that it is current.',
        'https://help.pobble.com/hubfs/Group%20School%20Moderation%20Offer-1.pdf',
      ],
      '⚠ Framing (confirm fair): WriteAssess is a self-serve tool for ongoing judgements; external moderation such as Pobble gives assurance. The two are complementary.',
    ]),
  },
  {
    competitorId: 'olex',
    name: 'Olex.AI',
    nameable: false,
    allowedUrls: [],
    facts: facts([
      [
        'Olex.AI marks typed or handwritten writing from KS1 to KS4, with handwriting recognition. It says a class set can be marked "in under two minutes".',
        'https://edtechimpact.com/products/olexai/',
      ],
      ['⚠ Price: "from £5 per pupil" according to EdTech Impact. Confirm on Olex\'s own site.', 'https://edtechimpact.com/products/olexai/'],
      ['Olex.AI has 4.9/5 from 18 reviews on EdTech Impact, covers secondary as well as primary, and is a Pobble AI partner.', 'https://edtechimpact.com/products/olexai/'],
      '⚠ Difference (check on Olex\'s site): at £5 per pupil, a 200-pupil school pays £1,000 a year, against £890 for WriteAssess School Standard.',
    ]),
  },
  {
    competitorId: 'stylus',
    name: 'Stylus',
    nameable: false,
    allowedUrls: [],
    facts: facts([
      [
        'Stylus offers AI marking of handwritten writing for KS2 to KS4, with sentence-level analysis and human moderation. It is a Pobble AI partner.',
        'https://uk.bettshow.com/exhibitors/stylus',
      ],
      [
        'Stylus reportedly holds a UK government contract for handwriting assessment.',
        'https://www.edtechinnovationhub.com/news/stylus-secures-uk-government-contract-for-ai-driven-tool-capable-of-reading-and-assessing-handwritten-work',
      ],
      '⚠ Price: not found.',
      '⚠ Difference (check on Stylus\'s site): WriteAssess covers KS1 as well as KS2, has a free plan and self-serve sign-up.',
    ]),
  },
  {
    competitorId: 'assesswrite-ai',
    name: 'AssessWrite AI',
    nameable: false,
    allowedUrls: [],
    facts: facts([
      [
        'AssessWrite AI describes itself as "AI writing assessment for UK primary schools", covering pupil and class analysis and Year 6 moderation support.',
        'https://assesswriteai.co.uk',
      ],
      '⚠ Price: unknown. Check the pricing page in a browser.',
    ]),
  },
  {
    competitorId: 'general-ai-assistants',
    name: 'General AI assistants (ChatGPT, Gemini, Copilot, Claude)',
    nameable: true,
    allowedUrls: [],
    facts: facts([
      "General AI assistants such as ChatGPT, Gemini, Copilot and Claude aren't built for the DfE writing frameworks.",
      'With a general AI assistant, the teacher has to provide the framework, the year group and the writing.',
      "General AI assistants don't keep pupil assessment records.",
      '⚠ Free consumer versions may use conversations for model training unless the user changes settings. Check each provider\'s current policy before citing this.',
    ]),
  },
]

async function main() {
  const approved: number = await client.fetch(
    'count(*[_type in ["productFacts","competitorFacts"] && count(facts[approved == true]) > 0])',
  )
  if (approved > 0 && process.env.FORCE !== '1') {
    throw new Error(`${approved} fact sheet document(s) already have approved facts. Re-running would reset them. Set FORCE=1 to override.`)
  }

  const tx = client.transaction().createOrReplace(productFacts)
  for (const c of competitors) {
    tx.createOrReplace({ _id: `competitor-${c.competitorId}`, _type: 'competitorFacts', ...c })
  }
  await tx.commit()

  const result = await client.fetch(
    '*[_type in ["productFacts","competitorFacts"]] | order(_id) {_id, "n": count(facts), "approved": count(facts[approved == true])}',
  )
  console.table(result)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
