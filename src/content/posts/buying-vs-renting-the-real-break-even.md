---
title: 'Buying vs Renting in Korea: The Real Break-Even'
description: 'Loan principal is not a cost and a jeonse deposit is not free. Price both sides the same way and the question becomes how long you will stay.'
category: cost-of-living
publishDate: 2026-10-11
updatedDate: 2026-10-11
slot: pm
tags: [housing, buying, jeonse, wolse, financial-planning]
tracked: [monthly-rent-tax-credit-rate, monthly-rent-tax-credit-limit, comprehensive-property-tax-deduction]
lastVerified: 2026-10-11
draft: true
sources:
  - label: 'National Tax Service — monthly rent tax credit for employees'
    url: 'https://www.nts.go.kr/'
  - label: 'Korea Law Information Center — Income Tax Act (monthly rent tax credit, capital gains)'
    url: 'https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%86%8C%EB%93%9D%EC%84%B8%EB%B2%95'
  - label: 'Korea Law Information Center — Comprehensive Real Estate Holding Tax Act'
    url: 'https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%A2%85%ED%95%A9%EB%B6%80%EB%8F%99%EC%82%B0%EC%84%B8%EB%B2%95'
  - label: 'Financial Services Commission — DSR and stress DSR framework'
    url: 'https://www.fsc.go.kr/'
  - label: 'Korea Real Estate Board — housing price and jeonse indices'
    url: 'https://www.reb.or.kr/'
affiliate: false
revisions:
  - date: 2026-10-11
    change: 'Published'
keyFacts:
  - { label: 'Principal repayment', value: 'Not a cost' }
  - { label: 'Jeonse deposit', value: 'Not free either' }
  - { label: 'Rent credit', value: '17% / 15%, capped' }
  - { label: 'The answer turns on', value: 'g and r' }
faq:
  - question: 'Why is loan principal not a housing cost?'
    answer: 'Because it does not leave your net worth. Paying principal converts cash into equity in the property — it reduces a liability rather than consuming money, and it comes back to you when you sell. Interest is the cost of the loan; principal is a transfer between two of your own accounts. Counting it as a cost is what makes “rent is money down the drain” sound persuasive, and it is why that comparison consistently favours buying.'
  - question: 'A jeonse deposit is returned in full. How is that a cost?'
    answer: 'Because the money could have been doing something else. ₩500,000,000 in a deposit at a 4% alternative return is ₩20,000,000 a year of forgone income, whether or not the deposit itself is repaid intact. That is the true annual price of a jeonse. The point is symmetry: if you charge this to the deposit, you must charge the same rate to the equity tied up in a purchase, or the comparison is rigged before you begin.'
  - question: 'What is the monthly rent tax credit worth?'
    answer: 'For an employee who qualifies, 17% of qualifying annual rent where total salary is ₩55,000,000 or less, or 15% up to ₩80,000,000, applied to at most ₩10,000,000 of annual rent. So the ceiling is ₩1,700,000 or ₩1,500,000 a year. It is a credit against tax payable rather than a deduction from income, and it should be subtracted from the rental cost line — leaving it out overstates renting in every year of the model.'
  - question: 'Which assumption matters most?'
    answer: 'Two, and they work against each other: g, the expected annual growth in the property’s price, and r, the return the same capital would earn elsewhere. r is also the discount rate and is charged to tied-up equity on both sides, so it moves the answer more than anything else in the model. Anyone who tells you buying wins without stating both numbers has not done the comparison.'
---

The argument that ends most of these discussions is: rent disappears, mortgage
principal becomes yours.

The second half is true. Principal repayment is not a cost — it reduces a
liability and comes back when you sell.

The problem is what the argument leaves out on both sides. On the buying side:
the equity you put in, the acquisition costs, the interest, the annual taxes, the
upkeep, and what it will cost to sell. On the renting side: a jeonse deposit is
not free merely because you get it back.

<figure class="figure hero">
  <p class="figure-title">The comparison, done symmetrically</p>
  <p class="figure-sub">Charge tied-up capital the same rate on both sides, or don't bother</p>
  <div class="check-card">
    <div class="check-row ok"><span class="mark"></span><span><strong>Buying</strong> — acquisition costs, interest, taxes, upkeep, equity opportunity cost, selling costs, less price growth.</span></div>
    <div class="check-row ok"><span class="mark"></span><span><strong>Renting</strong> — rent, deposit-loan interest, deposit opportunity cost, less the rent tax credit.</span></div>
    <div class="check-row miss"><span class="mark"></span><span><strong>Neither side</strong> — loan principal. It is not consumption.</span></div>
    <div class="check-row miss"><span class="mark"></span><span><strong>Charge one and not the other</strong> — and the model is decided before any assumption is entered.</span></div>
    <div class="check-result">The output is not a verdict. It is a number of years.</div>
  </div>
</figure>

<div class="callout callout-note">
  <p class="callout-title">Run your own numbers</p>
  <p>Everything below is implemented in the
  <a href="/tools/buy-vs-rent-calculator/">buy vs rent break-even calculator</a> —
  purchase price, equity, acquisition and selling costs, mortgage rate, annual
  taxes and upkeep, jeonse or wolse, deposit loan, and the two assumptions that
  decide the answer. It returns the first year at which owning becomes the cheaper
  use of the same capital.</p>
</div>

## 1. The two formulas

**Total economic cost of buying:**

`C_buy = acquisition costs + Σ(interest + property taxes + upkeep + equity opportunity cost) + selling costs + expected capital gains tax − price appreciation`

**Total economic cost of renting:**

`C_rent = Σ(rent + deposit-loan interest + deposit equity opportunity cost) + leasing costs − rent tax credit`

Two variables drive everything: **g**, the expected annual growth in the
property's price, and **r**, the expected return on the alternative use of the
same money.

The property's value after n years is `Pₙ = P₀ × (1 + g)ⁿ` — but the appreciation
is not the gain. Acquisition, holding, financing and selling costs come out of
it, and where the sale is taxable, capital gains tax comes out of the terminal
value too.

Discount each year's cash flows at `r` and find the first year where

`NPV_buy(n) = NPV_rent(n)`

That year is the **break-even holding period**.

## 2. The symmetry rule

<div class="callout callout-warn">
  <p class="callout-title">This is the whole methodology in one sentence</p>
  <p>If you charge an opportunity cost to a jeonse deposit, you must charge the
  same rate to the equity locked into a purchase. Omit the second and the result is
  structurally biased toward buying — not because of any assumption you made about
  house prices, but because of one you did not make about your own capital.</p>
</div>

₩500,000,000 in a jeonse deposit at a 4% alternative return costs ₩20,000,000 a
year. ₩400,000,000 of equity in a purchase at the same 4% costs ₩16,000,000 a
year. Both are real. Neither appears on a statement.

Most published comparisons charge the first and not the second.

## 3. Renting has a cost line that gets forgotten

The **monthly rent tax credit** reduces the cost of renting for an employee who
qualifies, and it is routinely absent from these comparisons.

Where total salary is ₩55,000,000 or less the rate is
[17%](/tracked/monthly-rent-tax-credit-rate/); above that up to ₩80,000,000 it is
15%. It applies to at most
[₩10,000,000 of annual rent](/tracked/monthly-rent-tax-credit-limit/).

So the maximum is ₩1,700,000 or ₩1,500,000 a year. Two consequences follow.

It is a **credit against tax payable**, not a deduction from income — so its value
does not rise with your marginal rate.

And because the rent base is capped, it stops growing above roughly ₩833,000 a
month. On an expensive lease it behaves as a fixed annual amount rather than a
percentage, which matters over a ten-year projection.

## 4. Wolse is not simply more expensive than jeonse

A monthly rent is visible cash leaving every month, which makes wolse feel
strictly worse than jeonse. In cost terms it often is not.

The smaller deposit means less capital tied up — and that freed capital is
earning `r` somewhere else. Whether wolse or jeonse is cheaper depends on the
conversion between them, on `r`, and on whether the rent credit is available.

The comparison between those two specifically, including the conversion rate, is
in [jeonse vs wolse](/cost-of-living/jeonse-vs-wolse-korean-rental-system/).

## 5. What the model does not capture

**Liquidity.** A home is a concentrated, illiquid asset. For someone who may
change employer, city or country, the transaction cost of exiting is not a
footnote — it is the point. Renting buys optionality; the model prices the cash
flows but not the option.

**Renewal risk.** The tenant's side of that trade is uncertainty about renewal
terms and about the deposit itself.

**Concentration.** A purchase generally puts most of a household's net worth into
one asset in one city. That is a portfolio decision as much as a housing one, and
`g` is not a market average — it is the growth of that specific property.

**Borrowing capacity.** DSR measures annual principal and interest on all
household lending against income, so a mortgage is not simply LTV multiplied by
the price. Stress DSR tightens it further. What you can actually borrow is a
separate question, worked through in
[getting a mortgage in Korea as a foreigner](/loans/korean-mortgage-for-foreigners/).

## 6. The decision matrix

| | Buying | Jeonse | Wolse |
|---|---|---|---|
| Capital needed up front | High | High | Lower |
| Transaction costs | Very high | None | None |
| Ongoing cash cost | Interest, taxes, upkeep | Deposit-loan interest | Rent |
| Equity opportunity cost | High | High | Lower |
| Price appreciation | Yours | None | None |
| Price decline | Yours | None | None |
| Liquidity | Low | Medium | High |
| Tax factors | Acquisition, property, holding, capital gains | Limited | Rent credit possible |
| Suits | Long stay, stability | Medium term, capital preservation | Short stay, mobility |

Read the transaction-cost row against the "suits" row. That pairing is the whole
result: because Korean purchase costs are front-loaded and large, a short expected
stay makes buying hard to justify almost regardless of what happens to prices.

## 7. So the question is not what prices will do

It is whether, over the number of years you actually expect to stay, the
property's return after all costs and taxes exceeds what the same equity would
have earned elsewhere.

How sharply it turns on those two numbers is worth seeing once. On an
₩800,000,000 purchase with ₩400,000,000 of equity against a ₩500,000,000 jeonse,
holding `r` at 4%: at 3% price growth buying breaks even in year five, at 3.5% in
year three — and at 2% it never breaks even at all inside thirty years, because
the transaction costs are never recovered.

That reframing does two useful things. It makes the answer personal rather than
market-wide — two people looking at the same apartment can correctly reach
opposite conclusions because one is staying three years and the other fifteen.
And it makes the assumptions visible, so a disagreement becomes a disagreement
about `g` and `r` rather than about property in general.

Put the purchase price, your equity, the loan and its rate, the expected holding
period, acquisition costs, annual holding costs, expected selling costs, `g`, `r`
and the deposit or rent into
[one cash flow table](/tools/buy-vs-rent-calculator/), and read the year the two
lines cross.

The annual costs that go into the buying side of it are in
[what owning a Korean home costs every year](/cost-of-living/what-owning-a-korean-home-costs-every-year/),
and the one-off transaction costs are in
[closing costs when buying property in Korea](/cost-of-living/closing-costs-when-buying-property-in-korea/).

Buying versus renting is not a forecast. It is a capital allocation decision with
a holding period attached.
