// Microsoft Clarity on the blog (same project as the main site, linked to Bing Webmaster Tools).
// Never in Sanity Studio (our admin area) or for internal traffic. No consent call is made,
// so UK visitors stay in Clarity's cookieless mode. See the main repo's CLAUDE.md "Microsoft Clarity".
export const CLARITY_PROJECT_ID = 'zf0vnw9df1'

export function shouldLoadBlogClarity(pathname: string, internal: boolean): boolean {
  if (internal) return false
  return !/(^|\/)studio(\/|$)/.test(pathname)
}
