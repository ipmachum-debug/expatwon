# Verification availability

What a foreign resident can actually do, by which kind of phone line they
hold. This is not an observation series: a series records one number moving
over time, and this records a **state per service** — which is a matrix, not
a chart.

Three states, and the distinction between the second and the third is the
whole point:

| state | meaning |
|---|---|
| `works` | Available on a passport-opened line |
| `needs-rc` | Needs a line registered against the alien registration card |
| `alternative` | Blocked on the mobile route, but another path exists |

`alternative` is what stops this dataset overstating. Almost nothing in
Korea is genuinely closed to someone without a verifiable line — a bank
counter, a hospital reception desk, a paper lease and a joint or financial
certificate all still work. What breaks is the online, unattended route,
and it breaks repeatedly across services that look unrelated.

Every record needs a `source`. A claim about what a service permits is
exactly the kind of thing that rots, so an unsourced row does not belong
here.
