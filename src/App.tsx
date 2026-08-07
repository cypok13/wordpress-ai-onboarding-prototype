import { useState } from 'react'
import { Button, Card, CardBody, TextControl } from '@wordpress/components'
import './App.css'

function App() {
  const [siteName, setSiteName] = useState('')

  return (
    <main className="page">
      <div className="container">
        <header className="masthead">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">WordPress.com</span>
        </header>

        <section className="hero">
          <h1 className="hero-title">Design language smoke test</h1>
          <p className="hero-lead">
            A clean editorial base built in WordPress.com&rsquo;s real
            open-source language: Color Studio palette, a Recoleta-substitute
            display serif, system-sans body copy, and genuine{' '}
            <code>@wordpress/components</code> on flat white surfaces.
          </p>

          <div className="cta-row">
            <button type="button" className="btn-primary">
              Primary button (#3858e9)
            </button>
            <a className="text-link" href="#components">
              View a component below
            </a>
          </div>
        </section>

        <section id="components" className="components">
          <h2 className="section-title">Rendered from @wordpress/components</h2>
          <p className="section-note">
            The card, input, and buttons below are the actual Gutenberg
            components the WordPress.com edit surface uses.
          </p>

          <Card className="wp-demo-card" size="large">
            <CardBody>
              <TextControl
                __next40pxDefaultSize
                __nextHasNoMarginBottom
                label="Site name"
                help="Try typing — HMR and state are wired up."
                placeholder="My new website"
                value={siteName}
                onChange={(value) => setSiteName(value)}
              />
              <div className="wp-demo-actions">
                <Button variant="primary">Create site</Button>
                <Button variant="secondary">Cancel</Button>
              </div>
              {siteName && (
                <p className="wp-demo-echo">
                  Building <strong>{siteName}</strong>&hellip;
                </p>
              )}
            </CardBody>
          </Card>
        </section>
      </div>
    </main>
  )
}

export default App
