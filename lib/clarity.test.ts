import { describe, it, expect } from 'vitest'
import { shouldLoadBlogClarity, CLARITY_PROJECT_ID } from './clarity'

describe('shouldLoadBlogClarity', () => {
  it('loads on blog posts and the blog index for normal visitors', () => {
    expect(shouldLoadBlogClarity('/blog', false)).toBe(true)
    expect(shouldLoadBlogClarity('/blog/assessing-punctuation-primary-writing', false)).toBe(true)
  })
  it('never loads in Sanity Studio or for internal traffic', () => {
    expect(shouldLoadBlogClarity('/blog/studio', false)).toBe(false)
    expect(shouldLoadBlogClarity('/blog/studio/structure/post', false)).toBe(false)
    expect(shouldLoadBlogClarity('/studio', false)).toBe(false)
    expect(shouldLoadBlogClarity('/blog', true)).toBe(false)
  })
  it('uses the same Clarity project as the main site', () => {
    expect(CLARITY_PROJECT_ID).toBe('zf0vnw9df1')
  })
})
