import './diagrams.css'
import { DiagramC } from './DiagramC'
import { DiagramE } from './DiagramE'
import { DiagramD } from './DiagramD'
import { DiagramA } from './DiagramA'
import { DiagramB } from './DiagramB'

export function Diagrams() {
  return (
    <div className="dg-page">
      <DiagramE />
      <DiagramD />
      <DiagramC />
      <DiagramA />
      <DiagramB />
    </div>
  )
}
