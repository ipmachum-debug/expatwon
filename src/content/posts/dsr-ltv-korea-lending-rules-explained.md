---
title: 'DSR, LTV & Stress DSR: How Korean Loan Limits Work'
description: 'Your real limit is the smallest of three numbers. LTV rules and price caps, the 40%/50% DSR math, stress-rate mechanics, and the 2026 regional split.'
category: loans
publishDate: 2026-08-23
updatedDate: 2026-08-23
tags: [loans, DSR, LTV, stress-DSR, mortgage]
sources:
  - label: 'FSC — DSR definition and stress-DSR explainer materials'
    url: 'https://www.fsc.go.kr/no040101?cnId=2741'
  - label: 'FSC — 2026 regulated-area designations and LTV tightening (70% → 40%)'
    url: 'https://www.fsc.go.kr/no010101/87222'
  - label: 'FSC — capital-region/regulated-area mortgage measures and the 3.0% stress-rate floor'
    url: 'https://www.fsc.go.kr/po010101/85432'
  - label: 'FSC supervision regulation — borrower-level DSR at 40% (banks) / 50% (non-banks)'
    url: 'https://www.fsc.go.kr/po040200/78428'
  - label: 'FSC — DSR income and debt computation framework (documented / deemed / declared income)'
    url: 'https://www.fsc.go.kr/po010106/73369'
  - label: 'FSC — stage-3 stress DSR implementation (July 2025, all-sector expansion)'
    url: 'https://www.fsc.go.kr/no010101/84617'
  - label: 'FSC — jeonse-loan interest inclusion in DSR for single-home owners (from Oct 29, 2025)'
    url: 'https://www.fsc.go.kr/po010105/85432'
affiliate: false
revisions:
  - date: 2026-08-24
    change: 'Corrected: auto installments and leases are exception items in the borrower-level DSR calculation (worked example switched to a card loan)'
    source: 'https://www.fsc.go.kr/po020201/76750'
  - date: 2026-08-23
    change: 'Published'
keyFacts:
  - { label: 'Your limit', value: 'Smallest of three' }
  - { label: 'Borrower DSR', value: '40% bank / 50% non-bank' }
  - { label: 'Capital-region stress', value: '3.0% floor' }
  - { label: 'Stress rate charged?', value: 'No — limit only' }
faq:
  - question: 'What actually determines how much I can borrow for a home in Korea?'
    answer: 'The smallest of three numbers: the collateral-based LTV limit, the income-based DSR limit, and any institutional or policy cap (including the price-tier maximums in the capital region and regulated areas). Plenty of borrowers clear LTV comfortably and hit the DSR wall — or the reverse. Compute both before signing anything.'
  - question: 'Does stress DSR raise the interest I actually pay?'
    answer: 'No. The stress rate is a virtual add-on used only when computing your DSR limit — the FSC states it is not charged on the actual loan. A 4% loan with a 3% stress rate still costs 4% in interest; the bank simply lends only what you could service within DSR even if rates rose to 7%.'
  - question: 'Does my overseas income count toward DSR?'
    answer: 'Only to the extent a Korean lender recognizes it. DSR runs on documented income (tax and withholding records), with deemed income (pension/health-insurance-based) and declared income as fallbacks. Foreigners face no separate DSR formula — but foreign income a bank cannot verify through Korean records typically shrinks the recognized income, and with it the limit.'
  - question: 'Are jeonse loans exempt from DSR?'
    answer: 'Not always anymore. Since October 29, 2025, when a single-home owner takes a jeonse loan in the capital region or a regulated area, the interest portion counts in DSR. Ordinary jeonse loans for non-owners have not been wholesale absorbed into DSR — but the old blanket statement “jeonse loans don’t count” is now wrong.'
---
If you estimate a Korean mortgage by asking only "what percent of the
home's price can I borrow?", you will get the number badly wrong. A house
expensive enough to support ₩500M under LTV lends you only ₩300M if your
income and existing debts cap DSR there. Flip it around: income good for
₩700M under DSR still yields at most ₩400M on a ₩1B home at 40% LTV.

<figure class="figure hero">
  <p class="figure-title">Your limit is the smallest of three, not the largest</p>
  <p class="figure-sub">Each rule caps a different thing; the binding one wins</p>
  <div class="flow">
    <div class="flow-node"><strong>LTV — how much the property supports</strong><span class="sub">40–70% of value, by area and property type</span></div>
    <div class="flow-arrow"></div>
    <div class="flow-node"><strong>DSR — how much your income supports</strong><span class="sub">40% at banks, 50% at non-banks, across all your debt</span></div>
    <div class="flow-arrow"></div>
    <div class="flow-node"><strong>The product's own cap</strong><span class="sub">Set by the lender, independent of both rules above</span></div>
  </div>
  <figcaption class="figcap">Three ceilings, one room. Raising the two you are not touching changes nothing — find the binding constraint first.</figcaption>
</figure>


The working rule for a real-world limit:

> **Actual loan limit = the smallest of the LTV limit, the DSR limit, and
> any institutional or policy maximum**

And since July 2025, stage-3 stress DSR — extended across effectively the
whole lending sector — pushes the DSR leg down further. The FSC defines
DSR exactly as it sounds: **all household loans' annual principal and
interest payments divided by annual income.** This article is the
reference for how the three mechanisms interact — the hub behind
[the foreigner loans pillar](/loans/can-foreigners-get-a-loan-in-korea/).

## LTV: what is the collateral worth?

LTV (loan-to-value) is the loan as a share of recognized collateral
value:

> LTV = mortgage amount ÷ recognized home price × 100

An ₩800M home at 70% LTV supports ₩560M; at 40%, ₩320M.

As of 2026, purchase-purpose mortgages for ordinary non-owners (and
disposal-conditioned single-home owners) run at up to **70% in
non-regulated areas and 40% in regulated areas** — and regulation moves:
areas newly designated in July 2026 (Dongtan-gu, Giheung-gu, Guri)
dropped from 70% to 40% at designation. First-time-buyer and
policy-mortgage programs carry their own relaxed standards.

In the capital region and regulated areas, clearing LTV is still not the
end, because purchase mortgages also face **price-tier maximum loan
caps**:

| Home price | Max mortgage (capital region / regulated) |
| --- | ---: |
| ≤ ₩1.5B | ₩600M |
| ₩1.5B–2.5B | ₩400M |
| > ₩2.5B | ₩200M |

So a ₩2.0B home at 40% LTV computes to ₩800M — and actually caps at
₩400M. And the "home price" is not the seller's asking number:
apartments use recognized price sources such as KB market prices, with
appraisals where market data is unavailable.

## DTI vs DSR: does the other debt's principal count?

Both are income-based affordability ratios; the computation scope
differs.

> DTI = (mortgage annual P&I + other loans' annual **interest**) ÷ income
>
> DSR = **all** loans' annual **principal and interest** ÷ income

That difference bites. A borrower earning ₩80M with a ₩50M credit loan
and a card loan sees mostly interest drag under DTI — but under DSR, the
*principal repayment* of those debts enters too. This is why DSR became
the true wall of Korean lending. (One precision note: per FSC guidance,
**auto installments and leases are exception items in the borrower-level
DSR calculation** — they do not enter the formula the way credit and
card loans do, though they remain real credit-screened obligations that
banks can weigh in internal reviews; see
[the rental-vs-lease-vs-buying comparison](/cars/long-term-car-rental-janggi-rent-korea/).)

## The 40% / 50% split — and why non-banks aren't a 25% bonus

Borrower-level DSR applies at **40% in banks and 50% in non-bank
lenders** for borrowers with over ₩100M of total loans, per the FSC's
supervisory framework.

On a ₩50M income, the bank-sector ceiling on annual debt service is:

> ₩50M × 40% = **₩20M/year** (≈ ₩1.67M/month)

Non-bank at 50%: ₩25M/year (≈ ₩2.08M/month).

But "banks refused me, so the second tier lends 25% more" oversimplifies
dangerously: higher non-bank rates inflate the annual P&I of the same
principal, so the *principal* difference is smaller than the ratio gap
suggests — and the new second-tier debt sits in your file at the next
bank review, as covered in
[the loans pillar's tier-2 warning](/loans/can-foreigners-get-a-loan-in-korea/).

## Existing debt is measured in annual payments, not balances

Before a new mortgage, convert every existing debt into annual P&I. A
bank borrower earning ₩70M:

> DSR ceiling: ₩70M × 40% = ₩28M/year
> Existing credit + car loans: ₩8M/year
> **Available for the new loan: ₩28M − ₩8M = ₩20M/year**

Then reverse-engineer the principal that ₩20M/year services at the new
loan's rate and term. The sequence matters: you do not compute a limit
from the ₩70M — you first compute **how much DSR space existing debt
already occupies.**

## Income means *recognized* income, not deposits

This is where foreigners, freelancers, and business owners diverge
hardest. The strongest category is **documented income** (증빙소득):
withholding receipts, NTS income certificates, pension statements —
government-verifiable records. Where those fall short, the framework
allows **deemed income** (인정소득) estimated from national-pension or
health-insurance payments, and **declared income** (신고소득) from
card-usage or financial-income data.

Two cautions. First, there is no universal formula like "₩200,000/month
of health insurance = exactly ₩X of income" — estimation methods, caps,
and eligibility vary by product and sector. Second, foreigners get no
separate DSR formula; the binding constraint is **verification**. Earning
USD 100,000 abroad means little if no Korean lender can recognize it —
which is the same
[domestic-income problem](/loans/can-foreigners-get-a-loan-in-korea/)
that governs every foreigner credit decision.

## Stress DSR does not raise your interest rate

The most misunderstood mechanism in the system. A 4% loan with a 3%
stress rate does **not** cost 7%. The bank charges the contracted 4%; it
merely *computes your DSR limit* at a higher virtual rate:

> DSR calculation rate = actual loan rate + applicable stress rate

The point is pre-testing: could you still service the debt within DSR if
rates rose? The FSC states explicitly that the stress rate is not
charged on the actual loan. Stage 3, in force since July 2025, extends
stress DSR across effectively all DSR-covered household lending — with
credit loans joining once total credit-loan balances exceed **₩100M**.

### The 2026 stress map is regional, not uniform

- **Capital region and regulated areas:** the stress-rate floor was
  raised to **3.0%** in October 2025 and carries into 2026.
- **Non-regulated regional mortgages:** relief holds through H2 2026 —
  a 1.5% stress base at a 50% application ratio (stage-2 level) from
  July 1 to December 31, while credit and other loans run 1.5% at the
  full stage-3 100% ratio.

So "everything gets 3% in 2026" is wrong in both directions.

### Rate structure changes your stress — and your limit

The stress applied scales with rate-change risk: pure long-term fixed
rates carry the least, floating rates the most, and mixed
(fixed-then-floating) or periodic-reset loans a partial ratio by fixed
period and reset cycle — ratios that stage 3 tightened for mixed and
periodic loans specifically, by design, to push borrowers toward long
fixed rates. The practical consequence: choosing a floating loan for a
0.1% cheaper rate can cost you not just future interest risk but **loan
limit today.**

## What stress DSR does to a ₩50M income

A bank borrower, ₩50M income, no existing debt, 30-year amortizing loan:

- DSR 40% → ₩20M/year of allowable P&I.
- At the actual 4% rate only: supportable principal ≈ **₩349M**.
- Assume a capital-region floating loan where the full 3% stress applies
  → 7% calculation rate: the same ₩20M/year supports ≈ **₩251M**.

<figure class="figure">
  <p class="figure-title">Borrowing capacity on a ₩50M income — before and after stress DSR</p>
  <p class="figure-sub">Bank DSR 40% · 30-year amortizing loan · no existing debt</p>
  <div class="bars">
    <div class="bar-row"><span class="bar-label">Actual rate 4%</span><span class="bar-track"><span class="bar-fill" style="width:100%"></span></span><span class="bar-value">≈ ₩349M</span></div>
    <div class="bar-row"><span class="bar-label">Calculated at 7% (4% + 3% stress)</span><span class="bar-track"><span class="bar-fill alt" style="width:72%"></span></span><span class="bar-value">≈ ₩251M</span></div>
  </div>
  <figcaption class="figcap">The stress rate is never charged — the loan still costs 4% — but roughly ₩100M of limit disappears at underwriting. Capital-region floating-rate case, 3.0% stress floor.</figcaption>
</figure>

Nearly ₩100M of limit evaporates — while the interest actually charged
stays 4%. The bank is lending only what survives a 7% world.

The reverse-engineering formulas, for your own estimates:

> Allowable annual P&I = recognized income × DSR cap − existing annual P&I
>
> Loan principal = monthly capacity × [1 − (1+r)^(−n)] ÷ r

with *r* the monthly rate including stress and *n* the term in months.
Bank systems apply per-product DSR maturities, repayment types, and rate
structures, so treat any online estimate — including
[our loan calculator](/tools/loan-calculator/) — as directional, not an
approval.

## Which wall you hit first depends on you

A ₩1B non-regulated home at 70% LTV offers ₩700M — but a ₩50M income
will hit the DSR wall far below that; the bottleneck is income. A ₩200M
earner with no debt buying a ₩1B regulated-area home clears DSR easily
and stops at LTV's ₩400M; the bottleneck is collateral policy. Before
any contract, compute both:

> **Collateral limit = recognized price × applicable LTV**
> **Income limit = principal reverse-engineered from allowable DSR P&I**

— and plan on the smaller one.

## "Jeonse loans never count in DSR" is now outdated

Jeonse financing was long the textbook DSR exemption. Since **October
29, 2025**, that is only partly true: a **single-home owner** taking a
jeonse loan in the capital region or a regulated area has the loan's
**interest portion reflected in DSR**. Non-owners' ordinary jeonse loans
have not been wholesale absorbed — but the blanket exemption statement is
dead. When running
[the jeonse-vs-wolse math](/cost-of-living/jeonse-vs-wolse-korean-rental-system/),
homeownership status and the property's region now belong in the loan
column.

## Exemptions are not bypasses

Certain loans receive exceptional DSR treatment for policy reasons —
portions of jeonse lending, interim/relocation payments on
presale apartments, credit loans of ₩3M or less, some inclusive-finance
products, deposit-secured loans, and auto installments and leases. Two things follow. Exempt debt is still
debt — it never disappears from your finances. And **business loans are
not a personal-mortgage bypass**: the FSC is explicitly targeting
diverted business lending and real-estate workarounds in its 2026
inspections, so
[business borrowing](/business/registering-a-business-in-korea-as-a-foreigner/)
must track real business purposes and repayment sources.

## Sequencing your borrowing changes your limits

Take a ₩50M car installment and a ₩50M credit loan this year, and next
year's mortgage has that much less DSR space. Reverse the order — clear
the big housing loan first, then evaluate consumer financing — and the
same person ends up with a different capital structure.

If a major loan sits 6–12 months out: pay down high-rate credit and card
loans, add no new car installments, keep withheld income stable if
salaried, and — if freelance or self-employed — objectify income through
proper filings, since
[unreported income cannot be recognized income](/business/freelancing-in-korea-legally/).
Foreigners add stay duration and
[domestic credit history](/loans/korean-credit-score-for-foreigners-nice-kcb/)
to the same checklist. A high KCB/NICE score cannot break through DSR,
and abundant collateral cannot break through LTV.

Korean loan limits reduce to three questions:

> **What is the collateral worth? How much can you repay each year?
> Does that capacity survive rising rates?**

The first is LTV, the second is DSR, and the third is stress DSR.
