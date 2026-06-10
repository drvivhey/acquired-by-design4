## Summary
Revert `getPillarSummary` from the current single static description back to a score-dependent 3-tier system, with all-new pillar copy provided.

## Changes
### `src/lib/questions.ts` — `getPillarSummary`
- Restore the function signature to accept `(key: string, percentage: number)`.
- Implement tier logic matching the existing UI thresholds already used in `PillarCard.tsx`:
  - **High**: `percentage >= 75`
  - **Mid**: `percentage >= 40`
  - **Low**: `percentage < 40`
- Populate each tier with the exact copy provided for all 6 pillars.

### No changes needed elsewhere
- `PillarCard.tsx` already passes `pillar.percentage` as the second argument — it was doing so even when the function only accepted one arg.
- `calculateResults`, `BANDS`, pillar scoring, and the rest of the results page remain untouched.

## Pillar copy
**Processes**
- High: "Your processes are well documented and scalable, so new people can get up to speed with very little friction. Keep them current as you grow and this stays a real asset."
- Mid: "Some of your processes are in place, but gaps remain. Formalising the rest is one of the clearest ways to lift transferable value, and it's very doable."
- Low: "Right now, too much of how you deliver lives in people's heads. Documenting it is one of the highest-value things you can do, and it's very doable."

**Relationships**
- High: "Healthy client diversification and strong contracts protect your revenue. That's exactly what a buyer wants to see."
- Mid: "There's some concentration in your client base. Broadening it and securing recurring agreements is a straightforward way to reduce risk and lift value."
- Low: "Your revenue is concentrated in a small number of clients. A buyer sees that as risk, so spreading it is one of the clearest ways to lift value."

**Owner independence**
- High: "The business generates revenue without depending on you, which is a hallmark of a valuable, sellable asset. Protect that as the team grows."
- Mid: "You're still involved in key revenue activities. Handing over sales and pipeline is the natural next step, and it's where a lot of value gets unlocked."
- Low: "At the moment, you are the business. That's normal for an owner-led company, and it's also the single biggest thing to shift to make it sellable."

**Financials**
- High: "Your financial infrastructure is investor-ready, with real-time visibility and the resilience to stand up to scrutiny. This is a genuine strength."
- Mid: "Your financial foundations are there but need strengthening. Moving to management-ready reporting removes a major obstacle later in any sale."
- Low: "Your financial visibility needs work. Buyers look here first, so getting your numbers management-ready early removes a major obstacle later."

**Independent team**
- High: "You have real leadership depth. The team can operate without you or any single individual, which is exactly what makes a business resilient and valuable."
- Mid: "There's some dependency on a few key people. Developing a clear second-in-command should be a priority, and it protects both you and the value."
- Low: "Key-person risk is high, which leaves the business exposed if someone steps away. Building bench strength protects both you and the value."

**Technology**
- High: "Strong systems and proprietary IP give you a defensible advantage. Keep it protected and current and it stays a real differentiator."
- Mid: "You've got some good foundations here. Centralising your data and protecting your IP would turn that into a real, defensible asset."
- Low: "Your data and knowledge are scattered at the moment. Centralising and protecting your IP is one of the most valuable early moves you can make."
