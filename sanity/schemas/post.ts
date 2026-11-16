import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown in post listings and meta descriptions (max 200 chars).',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Used for filtering on the blog index (e.g. "Assessment", "DfE", "KS2").',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Leave blank to use title and excerpt as defaults.',
      fields: [
        defineField({ name: 'title', title: 'SEO Title', type: 'string' }),
        defineField({
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'ogImage',
          title: 'OG Image override',
          type: 'image',
          description: 'Defaults to mainImage if not set. Recommended 1200×630px.',
        }),
      ],
    }),
    defineField({
      name: 'cluster',
      title: 'Topic cluster',
      type: 'string',
      group: 'editorial',
      description: 'Content cluster this post belongs to — used by the blog automation pipeline to check topic coverage and avoid semantic duplication.',
      options: {
        list: [
          { title: 'Statutory writing assessment', value: 'statutory-writing-assessment' },
          { title: 'Moderation', value: 'moderation' },
          { title: 'Writing evidence', value: 'writing-evidence' },
          { title: 'Year-group assessment', value: 'year-group-assessment' },
          { title: 'Teacher workload', value: 'teacher-workload' },
          { title: 'AI-assisted assessment', value: 'ai-assisted-assessment' },
          { title: 'Writing development', value: 'writing-development' },
        ],
      },
    }),
    defineField({
      name: 'primaryKeyword',
      title: 'Primary keyword',
      type: 'string',
      group: 'editorial',
      description: 'Main target keyword/phrase for this post — used for semantic overlap checks against future proposed topics.',
    }),
    defineField({
      name: 'secondaryKeywords',
      title: 'Secondary keywords',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'editorial',
    }),
    defineField({
      name: 'searchIntent',
      title: 'Search intent',
      type: 'string',
      group: 'editorial',
      description: 'The reader question or query this post answers, e.g. "What counts as independent writing in Year 6?"',
    }),
    defineField({
      name: 'teacherProblem',
      title: 'Teacher problem',
      type: 'text',
      rows: 2,
      group: 'editorial',
      description: 'The specific problem a teacher has when they land on this post — distinct from the broader topic cluster.',
    }),
    // AI-visibility strand fields. All optional; standard posts leave them empty.
    defineField({
      name: 'strand',
      title: 'Strand',
      type: 'string',
      group: 'editorial',
      options: {
        list: [
          { title: 'Standard', value: 'standard' },
          { title: 'AI visibility', value: 'ai-visibility' },
        ],
      },
    }),
    defineField({
      name: 'articleType',
      title: 'Article type',
      type: 'string',
      group: 'editorial',
      options: {
        list: [
          { title: 'Approach comparison', value: 'approach-comparison' },
          { title: 'Tool comparison', value: 'tool-comparison' },
          { title: 'Decision guide', value: 'decision-guide' },
          { title: 'Product FAQ', value: 'product-faq' },
          { title: 'Use case', value: 'use-case' },
        ],
      },
    }),
    defineField({
      name: 'questionBankId',
      title: 'Question bank ID',
      type: 'string',
      group: 'editorial',
      description: 'Row ID in the n8n ai_visibility_questions table this post answers.',
    }),
    defineField({
      name: 'namedCompetitors',
      title: 'Named competitors',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'editorial',
      description: 'competitorId values of competitors named in this post.',
    }),
    defineField({
      name: 'lastReviewedAt',
      title: 'Last checked',
      type: 'datetime',
      group: 'editorial',
      description: 'When the facts in this post were last checked. Shown on the page and used as dateModified.',
    }),
    defineField({
      name: 'comparisonTable',
      title: 'Comparison table',
      type: 'object',
      group: 'editorial',
      fields: [
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
        defineField({ name: 'columns', title: 'Columns', type: 'array', of: [{ type: 'string' }] }),
        defineField({
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'tableRow',
              fields: [defineField({ name: 'cells', title: 'Cells', type: 'array', of: [{ type: 'string' }] })],
              preview: {
                select: { cells: 'cells' },
                prepare: ({ cells }) => ({ title: Array.isArray(cells) ? cells.join(' | ') : '' }),
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'editorial',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string' }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'question', subtitle: 'answer' } },
        },
      ],
    }),
  ],
  groups: [
    {
      name: 'editorial',
      title: 'Editorial / SEO metadata',
    },
  ],
  preview: {
    select: { title: 'title', media: 'mainImage', date: 'publishedAt' },
    prepare({ title, media, date }) {
      return {
        title,
        media,
        subtitle: date ? new Date(date).toLocaleDateString('en-GB') : 'Unpublished',
      }
    },
  },
})
