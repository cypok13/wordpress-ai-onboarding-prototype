import { pageTitle, SITE_NAV, SITE_TITLE, type PageId } from './content'

// The site's own header (real site chrome, not editor UI). Shared by every page
// of the draft so switching pages keeps the same site frame; the link matching
// the page on screen is marked current.
export function SiteNav({ current }: { current: PageId }) {
  const currentTitle = pageTitle(current)
  return (
    <header className="hf-sitenav">
      <span className="hf-sitenav__brand">{SITE_TITLE}</span>
      <nav className="hf-sitenav__links" aria-label="Site">
        {SITE_NAV.map((item) => (
          <span
            key={item}
            className={`hf-sitenav__link${item === currentTitle ? ' is-current' : ''}`}
            aria-current={item === currentTitle ? 'page' : undefined}
          >
            {item}
          </span>
        ))}
      </nav>
    </header>
  )
}
