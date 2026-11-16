import { defineField, defineType } from 'sanity'

// One checkable statement used by the AI-visibility blog strand.
// Only facts with approved == true ever reach an article prompt.
export default defineType({
  name: 'fact',
  title: 'Fact',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Fact', type: 'text', rows: 2, validation: (Rule) => Rule.required() }),
    defineField({ name: 'sourceUrl', title: 'Source URL', type: 'url' }),
    defineField({ name: 'checkedOn', title: 'Checked on', type: 'date', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
      description: 'Tick when you agree this fact is accurate. Unapproved facts are never used in articles.',
    }),
  ],
  preview: {
    select: { text: 'text', approved: 'approved', checkedOn: 'checkedOn' },
    prepare({ text, approved, checkedOn }) {
      return { title: text, subtitle: `${approved ? 'Approved' : 'Not approved'} · checked ${checkedOn ?? '?'}` }
    },
  },
})
