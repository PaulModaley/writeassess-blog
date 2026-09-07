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
