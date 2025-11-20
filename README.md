# await-sleep-until

Lightweight async sleep utilities for TypeScript and JavaScript.

Features:

- `sleep.for(ms)` — delay for N ms
- `sleep.until(cond)` — poll until a condition becomes true
- Supports:
  - `AbortSignal`
  - timeouts
  - monotonic timing (`performance.now()`)
  - optional exponential/custom backoff
- `sleep.at(date)` — sleep until a specific moment in time

## Installation

```sh
npm install await-sleep-until
```
