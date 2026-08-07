import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Flow } from './hifi/Flow.tsx'

const params = new URLSearchParams(window.location.search)
const step = params.get('step')

function Root() {
  // `?step=editor` / `?step=publish` deep-link into those steps for demos;
  // discovery needs a typed prompt, so the default entry is always intake.
  const start = step === 'editor' ? 'editor' : step === 'publish' ? 'publish' : 'intake'
  return <Flow start={start} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
