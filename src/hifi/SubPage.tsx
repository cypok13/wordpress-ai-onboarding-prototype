import { CONTACT_PAGE, PAGE_STUB_NOTE, pageTitle, type PageId } from './content'
import { SiteNav } from './SiteNav'

// Any page of the draft other than Home. Contact is built for real from the
// same block types as the home draft; the remaining pages render a labelled
// stub that says so, rather than faking content we did not design.
export function SubPage({ page }: { page: Exclude<PageId, 'home'> }) {
  return (
    <div className="hf-canvas-wrap">
      <div className="hf-canvas" aria-label={`Willow Room — ${pageTitle(page)} page`}>
        <SiteNav current={page} />
        {page === 'contact' ? <ContactPage /> : <StubPage page={page} />}
      </div>
    </div>
  )
}

function ContactPage() {
  return (
    <div className="hf-page">
      <h1 className="hf-page__title">{CONTACT_PAGE.heading}</h1>
      <p className="hf-page__lead">{CONTACT_PAGE.body}</p>

      <h2 className="hf-h2">{CONTACT_PAGE.detailsHeading}</h2>
      <div className="hf-schedule__rows">
        {CONTACT_PAGE.details.map((d) => (
          <div key={d.label} className="hf-schedule__row">
            <span className="hf-schedule__day">{d.label}</span>
            <span className="hf-schedule__detail">{d.value}</span>
          </div>
        ))}
      </div>

      <h2 className="hf-h2">{CONTACT_PAGE.formHeading}</h2>
      <form className="hf-contact__form" onSubmit={(e) => e.preventDefault()}>
        <div className="hf-field">
          <label htmlFor="hf-contactpage-name">Name</label>
          <input id="hf-contactpage-name" type="text" tabIndex={-1} />
        </div>
        <div className="hf-field">
          <label htmlFor="hf-contactpage-email">Email</label>
          <input id="hf-contactpage-email" type="email" tabIndex={-1} />
        </div>
        <div className="hf-field">
          <label htmlFor="hf-contactpage-note">What are you looking for?</label>
          <textarea id="hf-contactpage-note" rows={3} tabIndex={-1} />
        </div>
        <button type="submit" className="hf-btn-primary hf-contact__submit" tabIndex={-1}>
          {CONTACT_PAGE.formHeading}
        </button>
      </form>
    </div>
  )
}

function StubPage({ page }: { page: PageId }) {
  return (
    <div className="hf-page">
      <h1 className="hf-page__title">{pageTitle(page)}</h1>
      <p className="hf-page__stub">{PAGE_STUB_NOTE}</p>
    </div>
  )
}
