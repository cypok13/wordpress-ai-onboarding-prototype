import { useState } from 'react'
import { COPY } from './copy'

interface LaunchModalProps {
  onClose: () => void
  onLaunched: () => void
}

type Plan = 'free' | 'domain'

export function LaunchModal({ onClose, onLaunched }: LaunchModalProps) {
  const [plan, setPlan] = useState<Plan>('free')
  const [address, setAddress] = useState('yourname')
  const [confirmingCost, setConfirmingCost] = useState(false)

  // "taken" simulates domain validation above the field
  const taken = address.trim().toLowerCase() === 'taken'

  const handleLaunch = () => {
    if (plan === 'domain') {
      if (taken) return
      setConfirmingCost(true)
      return
    }
    onLaunched()
  }

  return (
    <div className="lf-overlay" role="dialog" aria-modal="true" aria-label={COPY.launchReady}>
      <div className="lf-modal">
        <h2>{COPY.launchReady}</h2>

        {confirmingCost ? (
          <>
            <p>{COPY.costConfirm}</p>
            <div className="lf-modal__actions">
              <button
                type="button"
                className="lf-btn lf-btn--ghost"
                onClick={() => setConfirmingCost(false)}
              >
                Back
              </button>
              <button type="button" className="lf-btn lf-btn--strong" onClick={onLaunched}>
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            <label className={`lf-radio${plan === 'free' ? ' lf-radio--on' : ''}`}>
              <input
                type="radio"
                name="lf-plan"
                checked={plan === 'free'}
                onChange={() => setPlan('free')}
              />
              <span>
                {COPY.optionFree} <strong>{address || 'yourname'}</strong>.wordpress.com
              </span>
            </label>

            <label className={`lf-radio${plan === 'domain' ? ' lf-radio--on' : ''}`}>
              <input
                type="radio"
                name="lf-plan"
                checked={plan === 'domain'}
                onChange={() => setPlan('domain')}
              />
              <span>{COPY.optionDomain}</span>
            </label>

            {taken && (
              <p className="lf-alert" role="alert" style={{ marginTop: 8 }}>
                {COPY.domainTaken}
              </p>
            )}

            <div className="lf-addr">
              <label htmlFor="lf-address">{COPY.addressLabel}:</label>
              <input
                id="lf-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <p className="lf-help">{COPY.addressHelp}</p>

            <div className="lf-modal__actions">
              <button type="button" className="lf-btn lf-btn--ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="lf-btn lf-btn--strong"
                onClick={handleLaunch}
                disabled={plan === 'domain' && taken}
              >
                Launch
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
