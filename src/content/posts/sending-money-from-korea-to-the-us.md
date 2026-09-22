---
title: 'Sending Money From Korea to the US'
description: 'Wire or ACH changes the route and the fees; the tax result is set by whose money it is. Routing numbers, intermediary charges, FBAR and Form 3520.'
category: banking
publishDate: 2026-09-23
updatedDate: 2026-09-23
tags: [banking, remittance, USA, tax, FBAR]
sources:
  - label: 'FinCEN — Report of Foreign Bank and Financial Accounts (FBAR, FinCEN Form 114), cited for the aggregate USD 10,000 highest-balance test'
    url: 'https://www.fincen.gov/'
  - label: 'IRS — cited for Form 3520 reporting of large gifts or bequests from foreign persons, for Form 8938 specified foreign financial asset thresholds, and for the Green Card and Substantial Presence tests'
    url: 'https://www.irs.gov/'
  - label: 'Federal Reserve — cited for the Fedwire Funds Service as a real-time gross settlement system and for the FedACH operator role'
    url: 'https://www.federalreserve.gov/'
  - label: 'Nacha — cited for the ACH network as batch settlement, including Same Day ACH'
    url: 'https://www.nacha.org/'
  - label: 'Bank of America — cited for incoming wire fees on standard personal accounts and for third-party charges arising on international wires'
    url: 'https://www.bankofamerica.com/'
  - label: 'Wells Fargo — cited for a bank publishing different routing numbers for direct deposit and for wires'
    url: 'https://www.wellsfargo.com/'
  - label: 'Foreign Exchange Transaction Regulations — small-amount remittance business limits (Art. 2-31)'
    url: 'https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000272774&chrClsCd=010201'
affiliate: false
revisions:
  - date: 2026-09-23
    change: 'Published'
keyFacts:
  - { label: 'Two different numbers', value: 'ACH and wire routing' }
  - { label: 'FBAR trigger', value: 'USD 10,000, highest balance' }
  - { label: 'Gift from abroad', value: 'Form 3520 over $100,000' }
  - { label: 'Form 3520 is', value: 'A report, not a tax' }
faq:
  - question: 'Is there a limit on how much my US account can receive from abroad?'
    answer: 'An ordinary US checking or savings account has no personal annual foreign-exchange quota of the kind that exists in China — receiving is not the constrained step. What goes wrong on this corridor is a wire sent with an ACH routing number, or money that arrives correctly and then turns out to carry a reporting obligation nobody checked. The limits you will actually meet are Korean ones on the sending side.'
  - question: 'Do I owe US tax on money I send from my own Korean account to my own US account?'
    answer: 'Moving your own money between your own accounts is not a gift and does not create income by itself. The separate question is the Korean account it came from: a US tax resident holding foreign financial accounts may have to file an FBAR if the combined highest balance passed USD 10,000 at any point in the year, and possibly Form 8938 as well. Emptying the account does not end that — the test is the highest balance during the year, not the balance at the end of it.'
  - question: 'My parents in Korea sent me money. Is that taxable in the US?'
    answer: 'A gift or bequest is generally not income to the person receiving it. What it can create is a reporting duty: a US person who receives more than USD 100,000 in a year from a non-resident alien individual reports it on Form 3520, and gifts from related donors can be aggregated toward that figure. Form 3520 is an information return rather than a tax bill — but failing to file one carries a penalty of 5% of the unreported amount per month, up to 25%.'
  - question: 'Is a wire always faster than ACH?'
    answer: 'Not reliably. Fedwire settlement is real-time and final, but an international wire from Korea adds the sending bank''s cut-off, SWIFT transmission, correspondent-bank review and the receiving bank''s posting — commonly one to two business days. ACH is batch settlement, much of it completing within a business day, and Same Day ACH exists. What you feel is the remitter''s KYC review and its US partner''s cut-off, not the network''s theoretical speed.'
---

On the China route the hard question is whether the money can be paid out at
all. On the US route it almost always can: an ordinary checking or savings
account has no personal foreign-exchange quota, and receiving is not the
constrained step.

So the failures here sit somewhere else entirely. They are **confusing a
wire with an ACH credit, entering the wrong routing number, or misjudging
what the money legally is once it has arrived**. The last one is the
expensive mistake, and it happens after the transfer has apparently
succeeded.

The destination-neutral mechanics — the spread, how a SWIFT wire loses money
at each bank it crosses, comparing on the amount received — are in
[sending money from Korea](/banking/how-to-send-money-from-korea-abroad/),
and what Korea lets you send is in
[managing money in Korea](/cost-of-living/managing-money-in-korea-fx-remittance-cards/).

## Two arrival routes into the same account

A **bank wire** leaves Korea over SWIFT, reaches a US correspondent bank,
and settles through Fedwire or CHIPS. Fedwire is the Federal Reserve's
real-time gross settlement system, so that leg is immediate and final. The
transfer as a whole is not: add the sending bank's cut-off, the SWIFT hop,
the correspondent's review and the receiving bank's posting, and US banks
generally quote one to two business days for an incoming international wire.

**ACH** is a different animal — a domestic US network that settles in
batches, operated by FedACH and EPN. When a Korean fintech takes your won,
sources dollars with a US partner and has that partner send an ACH credit,
the last leg of your international transfer is a domestic US payment.

Which kills a rule of thumb worth unlearning: **"wire takes a day, ACH takes
three" is not how this works.** Much of ACH now settles within a business
day and Same Day ACH exists. What determines the time you actually
experience is the remitter's KYC and AML review plus its US partner's
cut-off — one to three business days end to end, depending mostly on the
review and not on the network.

The practical consequence is that some services only ever use one of the two.
At least one Korean remitter accepts **only an ACH routing number** for US
payouts, and another instructs you specifically to enter the electronic
payment routing number. If the form asks for one kind, the other kind is not
a substitute.

## Nine digits is not one number

A US routing transit number — the ABA number — is nine digits, but a bank
does not necessarily use the same nine digits on every network. Wells Fargo
publishes that its direct-deposit routing number and its wire routing number
can differ, and Bank of America likewise provides a separate one for wires.

So:

- The form says **ACH**, or direct deposit, or electronic → find the
  **direct deposit / electronic / ACH routing number** in online banking.
  Do not substitute the wire routing number.
- You are sending an international **wire** → use the receiving bank's own
  incoming international wire instructions: the SWIFT/BIC code, and the wire
  ABA where one is required.

Two more that cause returns:

**Checking or savings has to match the actual account.** It is a routing
instruction, not a preference.

**The account number is the bank account number** — never the sixteen digits
on a debit card.

And do not assume the ABA printed at the bottom of a cheque is your
international wire instruction. For several large US banks it is not.

## What the money is decides the tax, not how it travelled

US tax residence is wider than citizenship: permanent residents, and
non-citizens who meet the Green Card test or the Substantial Presence test,
are US tax residents too. That is the status the rest of this section turns
on.

### Your own money, your own account

A self-transfer is not a gift, and the amount transferred is not new income.
What deserves a look is the Korean account it left.

**FBAR** — FinCEN Form 114 — is reportable in principle where the combined
highest balance of your foreign financial accounts exceeded **USD 10,000**
at any point in the year. Note what that does not say: emptying the account
before December does not end the obligation, because the test is the highest
balance during the year, not the balance at the end of it.

**Form 8938** under FATCA is a separate regime with its own thresholds — for
a single person living in the US, specified foreign financial assets over
USD 50,000 at year end or over USD 75,000 at any point during it, with
different figures for joint filers and for those living abroad. Filing one
of these two does not excuse the other. They overlap; they do not substitute.

### A gift from family in Korea

Where a US person receives a gift or bequest from a non-resident alien
individual — parents in Korea, in the ordinary case — and the year's total
exceeds **USD 100,000**, it is reported on Form 3520. Gifts from related
donors can be aggregated toward that figure, so splitting a transfer between
two parents does not necessarily split the test.

Two distinctions worth holding onto, because they are usually collapsed:

**Form 3520 is an information return, not a tax bill.** A gift or bequest is
generally not income to the recipient. Reporting it is not paying on it.

**The USD 100,000 is an annual total, not a per-transfer threshold.** It is
the sum received from related foreign donors in the tax year.

What is expensive is not filing. Where a reportable foreign gift is omitted,
the penalty runs at 5% of the unreported amount per month, to a maximum of
**25%**. Covered expatriates and foreign trusts sit under separate rules
again.

## Intermediary fees, and what actually lands

The least predictable line on a SWIFT wire is the correspondent and
intermediary bank charge. There is no fixed USD 15 or USD 30 deducted from
every transfer — it depends on how many banks the payment crosses, the
sending bank's terms, and the receiving account product.

On standard personal accounts at large US banks an incoming wire fee of
around USD 15 is common, with some premium accounts waiving it, and Bank of
America states plainly that other institutions' charges can be added along
the way.

A local ACH payout works differently: no SWIFT correspondent stands between
the US partner and the recipient's account, so the traditional intermediary
deduction has nowhere to occur. That is a structural difference, not a
discount someone is offering you.

The figures below are **a worked structure, not a live quote**. They assume
USD 1 = ₩1,400, a ₩5,000 fintech fee, ₩18,000 in Korean bank charges on a
wire, and USD 15 + USD 15 taken by an intermediary and the receiving bank on
the wire route.

| Route | Sent | Korean cost | US-side cost | Received |
| --- | --- | --- | --- | --- |
| Fintech ACH | ₩1,000,000 | ₩5,000 | $0 | $714.29 |
| Bank wire | ₩1,000,000 | ₩18,000 | $30 | $684.29 |
| Fintech ACH | ₩5,000,000 | ₩5,000 | $0 | $3,571.43 |
| Bank wire | ₩5,000,000 | ₩18,000 | $30 | $3,541.43 |

Compare the same way for real: the **total won leaving your Korean account**
against the **amount finally posted to the US account**. The advertised fee
is the smallest part of the gap.

Each route has a job. A wire is for urgency, for large sums, and for a
transfer you may need traced between banks. A local ACH payout suits small,
repeated transfers — living costs, tuition — where the intermediary
deduction is the thing worth removing.

And arriving is not the end of it. If it was your own money, check whether
the Korean account puts you inside FBAR or Form 8938. If it was a gift from
family who are not US persons, check the year's total against USD 100,000
and whether Form 3520 is due. **Wire or ACH decides how the money travels.
Where it came from, and what it legally is, decides the US tax outcome.**
