import { defineField, defineType } from 'sanity'

// Single document (_id "productFacts") holding WriteAssess's own facts.
export default defineType({
  name: 'productFacts',
  title: 'Product facts',
  type: 'document',
  fields: [
    defineField({ name: 'facts', title: 'Facts', type: 'array', of: [{ type: 'fact' }] }),
  ],
  preview: { prepare: () => ({ title: 'WriteAssess product facts' }) },
})
