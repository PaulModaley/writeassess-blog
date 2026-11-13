import { defineField, defineType } from 'sanity'

// One document per competitor (_id "competitor-<competitorId>").
// nameable == false means articles may never name this competitor.
export default defineType({
  name: 'competitorFacts',
  title: 'Competitor facts',
  type: 'document',
  fields: [
    defineField({
      name: 'competitorId',
      title: 'Competitor ID',
      type: 'string',
      description: 'Slug-like ID, e.g. "no-more-marking".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'nameable',
      title: 'Can be named in articles',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'allowedUrls', title: 'Allowed URLs', type: 'array', of: [{ type: 'url' }] }),
    defineField({ name: 'facts', title: 'Facts', type: 'array', of: [{ type: 'fact' }] }),
  ],
  preview: {
    select: { title: 'name', nameable: 'nameable' },
    prepare({ title, nameable }) {
      return { title, subtitle: nameable ? 'Can be named' : 'Never named' }
    },
  },
})
