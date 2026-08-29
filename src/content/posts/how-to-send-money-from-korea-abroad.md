---
title: 'Sending Money From Korea: What Actually Arrives'
description: 'Compare remittances by net received amount, not fees: FX spreads, the 90%-preferential myth, SWIFT deductions, fintech limits, and the real formulas.'
category: banking
publishDate: 2026-08-23
updatedDate: 2026-08-23
tags: [banking, remittance, FX, SWIFT, fees]
sources:
  - label: 'Korea Law Information Center — Foreign Exchange Transaction Regulations, Ch. 4 (payments and receipts)'
    url: 'https://www.law.go.kr/LSW/admRulLsInfoP.do?admRulSeq=2100000272774'
  - label: 'Foreign Exchange Transaction Regulations — small-amount remittance business limits (Art. 2-31)'
    url: 'https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000272774&chrClsCd=010201'
  - label: 'Foreign Exchange Transaction Regulations — general-resident undocumented remittance threshold'
    url: 'https://www.law.go.kr/LSW/admRulLsInfoP.do?admRulSeq=2100000233582'
  - label: 'Foreign Exchange Transaction Regulations — prior filings and designated-bank transactions'
    url: 'https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000254374&chrClsCd=010201'
  - label: 'Foreign Exchange Transactions Act Enforcement Decree — registration requirements for small-amount remitters'
    url: 'https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1033014421'
  - label: 'HANPASS — per-corridor rates, fees, and expected received amounts'
    url: 'https://hanpass.com/kr/'
  - label: 'HANPASS Business — invoice and documentation requirements for corporate payments'
    url: 'https://hanbiz.hanpass.com/faq'
affiliate: false
revisions:
  - date: 2026-08-23
    change: 'Published'
keyFacts:
  - { label: 'Compare by', value: 'Net received amount' }
  - { label: 'Cost points', value: 'Five, not one' }
  - { label: 'Biggest variable', value: 'The FX spread' }
  - { label: '“90% preferential”', value: 'Not 90% off' }
faq:
  - question: 'Why is a "zero fee" transfer not automatically the cheapest?'
    answer: 'Because the visible fee is one of five cost components: transfer fee, cable charge, FX spread, intermediary-bank deductions, and receiving-bank fees. A free transfer at a poor exchange rate loses more than a ₩10,000 fee at a tight rate — on ₩14M, a ₩20/USD rate difference alone costs about USD 141. Always compare the final amount the recipient gets.'
  - question: 'What does "90% exchange-rate preference" actually mean?'
    answer: 'It discounts 90% of the bank’s FX spread, not the exchange rate itself. If the mid-market rate is ₩1,400 and the bank’s base remittance spread is ₩20, a 90% preference leaves ₩2 of spread — applied rate ₩1,402. Two banks’ “90%” offers differ if their base spreads differ, so compare applied rates, not preference percentages.'
  - question: 'Is USD 50,000 per year the most I can send from Korea?'
    answer: 'No — the limits are tiered by who you are and which channel you use. Foreign residents who document how they earned the money (salary, declared income) can remit that documented amount through a bank. Through licensed small-amount remitters, foreign residents and non-residents face USD 5,000 per transaction and USD 50,000 per year each way. Separately, general residents’ undocumented-remittance threshold has been expanded to USD 100,000 a year under current regulations.'
  - question: 'Should I use a bank or a remittance app?'
    answer: 'Small, regular transfers usually favor licensed fintech remitters, whose structure strips out cable and intermediary fees; large transfers are dominated by the FX spread, where negotiated bank rates win — a ₩10 rate difference on USD 100,000 is ₩1,000,000. And for corporate, investment, or property-related money, the lawful channel and documentation outrank price entirely.'
---
The worst way to compare international transfers is the way everyone
starts: "Service A charges ₩5,000, Service B is free." The real cost of a
remittance is not the fee printed next to the send button. It is the gap
between **the won you spent and the foreign currency your recipient
finally received.**

<figure class="figure hero">
  <p class="figure-title">Five places a transfer loses money — only one is advertised</p>
  <p class="figure-sub">Everything between the won leaving and the cash arriving</p>
  <div class="flow">
    <div class="flow-node"><strong>Sending fee</strong><span class="sub">The number in the ad</span></div>
    <div class="flow-arrow leak"></div>
    <div class="flow-node"><strong>The FX spread</strong><span class="sub">Usually the largest single cost, and never called a fee</span></div>
    <div class="flow-arrow leak"></div>
    <div class="flow-node"><strong>Intermediary bank deductions</strong><span class="sub">Taken in transit on a SWIFT wire; unpredictable in advance</span></div>
    <div class="flow-arrow leak"></div>
    <div class="flow-node"><strong>Cable charge, then the receiving bank's fee</strong></div>
  </div>
  <figcaption class="figcap">Compare services on one number only: the <strong>net amount received</strong> in the destination currency.</figcaption>
</figure>


A zero-fee transfer at a bad exchange rate is an expensive transfer. A
₩10,000-fee transfer with a tight spread and no intermediary deductions
can be the cheap one. Remittance cost lives in five places:

> **transfer fee + cable charge + FX spread + intermediary-bank fees +
> receiving-bank fees**

The single number that nets all five is the **Net Received Amount** — and
it is the only number worth comparing.

<figure class="figure">
  <p class="figure-title">Where a transfer loses value on its way abroad</p>
  <p class="figure-sub">Five cost points between "amount sent" and "amount received"</p>
  <div class="flow">
    <div class="flow-node"><strong>You send KRW</strong><span class="sub">The amount you type into the bank or app</span></div>
    <div class="flow-arrow leak">transfer fee · cable charge · FX spread</div>
    <div class="flow-node"><strong>Sending bank converts and dispatches</strong><span class="sub">The exchange rate applied here is the biggest single variable</span></div>
    <div class="flow-arrow leak">intermediary-bank deduction</div>
    <div class="flow-node"><strong>Intermediary (SWIFT) bank</strong><span class="sub">May take its cut out of the amount in transit</span></div>
    <div class="flow-arrow leak">receiving-bank fee</div>
    <div class="flow-node"><strong>Recipient's bank credits the account</strong><span class="sub">= Net Received Amount — the only number worth comparing</span></div>
  </div>
</figure>

## The rate can cost more than every fee combined

Say you are converting won to dollars. The mid-market (매매기준율) rate is
₩1,400/USD, but the bank's applied remittance rate is ₩1,420 — a ₩20
conversion cost per dollar. On ₩14,000,000, the mid-market rate buys
USD 10,000; at ₩1,420 you get about USD 9,859. That is a difference of
roughly **USD 141** — against which waiving a ₩5,000 fee is a rounding
error.

"90% exchange preference" (환율우대 90%) must be read the same way. It
does not discount the exchange rate by 90%; it discounts **the bank's
spread** by 90%:

> Applied rate = mid-market rate + base spread × (1 − preference rate)

With a ₩1,400 mid-market rate and a ₩20 base spread, no preference gives
₩1,420; a 90% preference gives ₩1,400 + ₩20 × 0.10 = **₩1,402**. Which
means two banks' "90%" offers are *not* the same price unless their base
spreads match — the only comparable number is the applied rate itself.

## A SWIFT wire is one transaction that may cross several banks

Traditional bank remittances mostly ride the SWIFT messaging network. If
your Korean bank has a direct settlement relationship with the receiving
bank, the path is short. If not, a **correspondent (intermediary) bank**
joins the route — and takes a cut.

So the sender pays the Korean bank's transfer fee and cable charge; an
intermediary may deduct along the way; and the receiving bank may charge
an incoming-wire fee. Send USD 10,000, lose USD 20 to an intermediary and
USD 15 at the receiving end, and the beneficiary sees **USD 9,965**.

SWIFT transfers also carry a fee-bearing designation — **OUR** (sender
bears costs), **SHA** (each side bears its own institutions' costs), or
**BEN** (recipient bears costs) — though actual intermediary-fee handling
and availability vary by bank, currency, and route. If the counterparty
must receive exactly USD 10,000 — a trade payment, say — start from the
fact that *amount sent* and *amount received* are different concepts.

## Fintech remitters shrink SWIFT costs — they do not abolish cost

Licensed small-amount remitters (Sentbe, HANPASS, and peers) use a
different settlement architecture: aggregating customer funds, netting
flows against partner liquidity, and paying out through the destination
country's local rails. Your ₩1,000,000 does not individually ride SWIFT
to Vietnam or the Philippines; it is paid locally from held liquidity.
That is precisely why cable and intermediary fees largely disappear at
the small end — HANPASS's interface shows per-corridor applied rates,
fees (some around ₩5,000), and the expected received amount up front.

But fintech providers can also earn on the exchange rate. **Fee-free is
not conversion-free.** On any comparison screen, the number to check is
never the "today's rate" banner — it is *how many USD, VND, or PHP the
recipient receives when you pay exactly ₩1,000,000.*

## Compute the net received amount with currencies kept separate

Mixing won-denominated fees and dollar-denominated deductions in one
subtraction breaks the units. Working from a total-won budget, the
practical formula is:

> **N = (B − F₍krw₎) ÷ R − F₍fx₎**

where **B** is the total won you will spend, **F₍krw₎** the won-side
fees (transfer + cable), **R** the actual applied rate (KRW per unit of
foreign currency), and **F₍fx₎** the foreign-currency deductions taken by
intermediary and receiving banks. The applied rate itself simplifies to
R = mid-market + base spread × (1 − preference).

### Same ₩14,000,000, different outcomes

**Bank A:** mid-market ₩1,400, base spread ₩20, 50% preference → applied
rate ₩1,410; fees ₩15,000; intermediary USD 20 + receiving USD 10.

(14,000,000 − 15,000) ÷ 1,410 ≈ USD 9,918 → minus USD 30 = **≈ USD 9,888**

**Service B:** fee ₩5,000, applied rate ₩1,405, no receiving-side
deductions.

(14,000,000 − 5,000) ÷ 1,405 ≈ **USD 9,961**

The visible fee difference was ₩10,000. The real difference is **about
USD 73**. That is the entire argument for comparing on net received
amount.

### When the recipient must receive an exact amount, invert the formula

For trade payments where exactly USD 10,000 must arrive, work backwards.
Expecting USD 30 of en-route deductions, USD 10,030 must enter the
corridor:

> Required won = (target amount + F₍fx₎) × R + F₍krw₎

At ₩1,405 with ₩15,000 of domestic fees: 10,030 × 1,405 + 15,000 ≈
**₩14,107,150**. For a CFO, that — not the fee table — is the price of
the payment.

## Small transfers are ruled by fixed costs; large ones by the spread

On USD 1,000, a fixed ₩10,000 of transfer costs is roughly 1% of
principal; on USD 10,000 it is ~0.1%. So at the small end, the fintech
architecture that deletes cable and intermediary fees tends to win.

As size grows, the spread takes over: ₩1 of rate difference on USD 10,000
is ₩10,000; ₩10 is ₩100,000; on USD 100,000, a ₩10 difference is
**₩1,000,000**. Above a certain size, negotiating the rate with your bank
— or qualifying for corporate preferential rates — dwarfs any fixed-fee
saving.

Rule of thumb, not breakeven table: **cut fixed costs on small transfers,
cut the spread on large ones.** Where the crossover sits depends on
currency, corridor, bank preference rates, and intermediary paths — there
is no universal USD 3,000 or USD 10,000 threshold.

## In 2026, handle the phrase "the $50,000 limit" with care

USD 50,000 is not a single cap that applies to everyone. Under the
current Foreign Exchange Transaction Regulations, the tiers look like
this:

- **Foreign residents, documented source:** funds earned in Korea
  (salary, declared income) can be remitted in the documented amount
  through a foreign-exchange bank's verification — someone remitting a
  fully documented ₩100M salary is not "over a limit."
  (The [money-management guide](/cost-of-living/managing-money-in-korea-fx-remittance-cards/)
  covers this documented-vs-undocumented split in detail.)
- **Small-amount remitters serving foreign residents and
  non-residents:** the regulations set **USD 5,000 per transaction and
  USD 50,000 per person per year** in each direction through that
  channel.
- **General (non-foreign) residents' undocumented remittances:** the
  threshold has been **expanded to USD 100,000 per year** under current
  regulations — which is exactly why recycling older "everyone,
  $50,000" articles is dangerous.

And distinguish regulatory limits from **service limits**: a legally
permissible transfer can still exceed a specific app's own per-transaction
or annual caps, in which case that channel simply cannot carry it.

## For large sums, the money's character comes before its price

Corporate import payments, outbound investment, real-estate money,
dividends, and loans are not processed like family living expenses. Where
the underlying transaction requires an FX filing, the regulations require
the filing **before** payment; some transaction types must also run
through a designated foreign-exchange bank.

For a company, choosing a poorly documented channel to save ₩20,000 in
fees is anti-efficiency: the contract, invoice, tax records, import
declarations, and remittance records need to read as one continuous
story for future audits and tax or FX reviews. Even fintech corporate
services enforce this — HANPASS's business payment service requires
per-transaction invoices and reserves the right to request further
documents by purpose. (Structuring this properly starts with
[separating corporate and personal flows](/business/registering-a-business-in-korea-as-a-foreigner/).)

## Judge a remittance service by its registration, not its app-store rating

Before trusting a fintech remitter with meaningful money, confirm the
basics: is it a **registered** small-amount remittance business, how does
it hold customer funds, and who are its actual payout partners? The
Enforcement Decree conditions registration on capital, dedicated business
accounts, IT systems, and qualified staff — the regulatory floor that
separates a licensed remitter from an unregistered money mover.

Cheaper than a bank and structured like a bank are different claims. As
amounts rise, weigh — alongside price — the failure-recovery process,
customer support, traceability at the receiving end, and whether the
service issues the remittance documentation you may need later.

## Match the channel to your stay pattern

- **Visitors** rarely remit out of Korea; their money problems are
  exchange spreads and card/DCC fees — a different toolkit.
- **D-2 students** sit in two distinct flows: parents' tuition and
  living-expense money coming *into* Korea, and the student's own money
  going home — different FX characters that deserve their own guide.
- **E-7/F-4 workers** sending a fixed amount home monthly should stop
  hunting for the cheapest provider per transfer and instead re-compare
  banks and registered remitters periodically on the same amount,
  corridor, and payout method — anchored at
  [the bank where salary lands](/banking/how-to-open-a-bank-account-in-korea-as-a-foreigner/).
- **F-6 households** need purpose clarity above all: family living
  support, gifts, personal funds, and business money carry different tax
  meanings downstream.

Comparing remittance prices requires no financial sophistication. Get
quotes at the same time, for the same won amount, to the same country,
via the same payout method — then compare what actually lands in the
recipient's account. Fee-free banners, preference percentages, and
bank-versus-fintech labels are just components. In foreign exchange, the
only true price is the **Net Received Amount**.
