import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  // Studio is embedded at /blog/studio on the main domain.
  basePath: '/blog/studio',
  projectId: 'dvjtwlpa',
  dataset: 'production',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})
