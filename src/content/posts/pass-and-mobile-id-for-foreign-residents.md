---
title: 'PASS and Mobile ID for Foreign Residents in Korea'
description: 'Both work on MVNO lines, and both are available to foreign residents. What decides it is the subscriber record underneath, not the brand on the plan.'
category: cost-of-living
publishDate: 2026-09-30
updatedDate: 2026-09-30
slot: pm
tags: [cost-of-living, telecom, identity-verification, mobile-id, foreign-residents]
tracked: [mobile-id-types-for-foreign-residents, phone-identity-verification-agencies]
lastVerified: 2026-09-30
draft: true
sources:
  - label: 'PASS — certificate service, MVNO support and service limitations'
    url: 'https://www.passapp.co.kr/'
  - label: 'Government of Korea — mobile identification service: mobile resident card for foreign nationals, mobile driving licence'
    url: 'https://www.mobileid.go.kr/'
  - label: 'Korea Immigration Service — IC alien registration card and mobile issuance'
    url: 'https://www.immigration.go.kr/'
  - label: 'Korea Internet & Security Agency — designated identity verification agencies'
    url: 'https://www.kisa.or.kr/'
affiliate: false
revisions:
  - date: 2026-09-30
    change: 'Published'
keyFacts:
  - { label: 'PASS on MVNO', value: 'Supported, with exceptions' }
  - { label: 'Mobile resident card', value: 'Available now' }
  - { label: 'Mobile driving licence', value: 'Also available' }
  - { label: 'Both depend on', value: 'The subscriber record' }
faq:
  - question: 'Can I use PASS on an MVNO line?'
    answer: 'In principle yes. PASS states that MVNO subscribers on SKT, KT and LG U+ can use the service, and a foreign resident who can pass mobile identity verification and register in the app can hold a PASS certificate. So "MVNO means no PASS" is wrong. Equally, it is not a guarantee for every line and plan — PASS itself notes that service can be limited on some MVNO lines, which is why this is a question to test on your own line rather than to settle from a table.'
  - question: 'Can foreign residents get a government mobile ID?'
    answer: 'Yes. The mobile identification service issues mobile versions of the alien registration card, the permanent residence card and the domestic residence report for overseas Koreans, and a foreign resident holding a Korean driving licence can also hold the mobile driving licence. Issuance is either by tagging an IC-chip card to your phone, or in person at an immigration office by QR code if you hold an existing card. Guidance saying mobile ID is unavailable to foreigners is describing an earlier state of the service.'
  - question: 'Is PASS the same as the government mobile ID?'
    answer: 'No. PASS is an authentication service run by the three mobile network operators; the mobile ID is a government digital identity credential. They can both be on your phone and they are issued by different bodies for different purposes — one proves you are the person behind this phone line when a site asks, the other is an official identity document in digital form. Having one does not give you the other.'
  - question: 'PASS keeps failing. Should I register my device IMEI?'
    answer: 'That is a device management step with the network operator and it is not the standard fix for this. PASS depends on the line being in your own name and the operator’s subscriber details being correct and matching. Registering a handset can resolve some service faults on particular device and USIM combinations, but "English name mismatch, therefore register the IMEI, therefore PASS works" is not a chain that holds. Check the subscriber name, registration number and Korean-or-foreign flag first.'
---

Two things sit on top of a Korean phone line and do most of the identity work:
**PASS**, the operators' authentication service, and the **government mobile
ID**. Both are available to foreign residents on MVNO lines, and both fail for
the same underlying reason when they fail.

That reason is never the brand of the plan. It is the subscriber record beneath
it.

<figure class="figure hero">
  <p class="figure-title">Two systems, one dependency</p>
  <p class="figure-sub">Different issuers, same failure point</p>
  <div class="check-card">
    <div class="check-row ok"><span class="mark"></span><span><strong>PASS</strong> — run by the three network operators. Authentication.</span></div>
    <div class="check-row ok"><span class="mark"></span><span><strong>Mobile ID</strong> — run by the government. An identity document.</span></div>
    <div class="check-row miss"><span class="mark"></span><span><strong>Both need mobile identity verification to pass</strong>, which needs the operator's record to be right.</span></div>
    <div class="check-result">Fix the line's record and both usually come back together.</div>
  </div>
</figure>

<p class="hand">Not the same service. Not issued by the same body. Same prerequisite.</p>

## PASS works on MVNO lines — with a real caveat

PASS states that MVNO subscribers on SKT, KT and LG U+ can use the service. A
foreign resident who can complete mobile identity verification and register in
the app can hold a PASS certificate.

So the widespread claim is wrong:

```
"MVNO → no PASS"     ✗
```

<div class="callout callout-warn">
  <p class="callout-title">And the opposite claim is also too strong</p>
  <p>PASS notes that service can be limited on some MVNO lines. So neither "all
  MVNOs work" nor "MVNOs do not work" is publishable as a fact — which is why the
  only reliable answer is to test the line you are on, and to ask the operator
  before subscribing.</p>
</div>

Old support pages naming specific MVNO brands as excluded are worth treating
with suspicion in both directions: an exclusion documented years ago is not
evidence of today's position, and repeating one as current is how a stale
footnote becomes a permanent internet fact.

## The subsidiary MVNOs do not hold better authority

Verification follows the **network the line runs on**, which is why PASS
organises MVNO support by network rather than by brand. Being owned by a
carrier makes an operator easier to deal with; it does not confer a superior
grade of verification.

Which of the three networks the line runs on, and whether the subscriber record
is correct, is what decides it — set out in
[choosing an MVNO that will actually verify you](/cost-of-living/choosing-an-mvno-that-will-verify-you/).

## Mobile ID is a different system, and foreigners are in it

PASS is authentication run by telecom operators. The **mobile ID** is a
government digital identity credential. Having one does not give you the other.

For foreign residents the government service now issues
[three credential types](/tracked/mobile-id-types-for-foreign-residents/) — the
mobile alien registration card, the mobile permanent residence card, and the
mobile domestic residence report for overseas Koreans. A foreign resident with a
Korean driving licence can also hold the mobile driving licence.

Two issuance routes:

<div class="steps">
  <div class="step"><div class="step-num">1</div>
    <div class="step-body"><strong>IC card tag.</strong> Obtain an IC-chip residence card and tag it to your phone to register the mobile credential.</div></div>
  <div class="step"><div class="step-num">2</div>
    <div class="step-body"><strong>In person by QR.</strong> Holders of an existing card can attend an immigration office and be issued by QR code.</div></div>
</div>

The mobile resident card carries what identity checks need — status of stay,
nationality, expiry, address.

<div class="callout callout-note">
  <p class="callout-title">So "the plastic card is your only ID" is out of date</p>
  <p>It was true, and a lot of guidance still says it. It is a live government
  service now, not a pilot, and the set of credentials has been growing rather
  than shrinking.</p>
</div>

## But issuance runs through the same verification

Getting a mobile credential involves mobile phone identity verification. So a
line whose subscriber record is wrong blocks the government ID for the same
reason it blocks a bank login.

```
subscriber record correct
  → phone identity verification passes
      → PASS registration
      → mobile ID issuance
```

Which means a per-brand table of "this MVNO supports mobile ID, that one does
not" is the wrong instrument. The dependency is the line, and the line is
per-subscriber.

## Do not reach for the IMEI fix

A recurring piece of advice is that registering your handset with the operator
resolves PASS problems.

Device registration is a **handset management** step. It can resolve service
faults on particular device and USIM combinations. It is not the standard remedy
for a mismatch in your name or registration details, and this chain does not
hold:

```
English name mismatch → register IMEI → PASS works    ✗
```

Check the subscriber name, the registration number and the Korean-or-foreign
flag first. That is where the fault usually is, and fixing it fixes the whole
stack rather than one app.

## The order to test in

Once the line is registered in your own name:

<div class="steps">
  <div class="step"><div class="step-num">1</div>
    <div class="step-body"><strong>Mobile identity verification</strong> on any bank or government site. If this fails, stop and fix the record.</div></div>
  <div class="step"><div class="step-num">2</div>
    <div class="step-body"><strong>PASS registration</strong>, then a PASS certificate.</div></div>
  <div class="step"><div class="step-num">3</div>
    <div class="step-body"><strong>Bank and card verification</strong> using the number.</div></div>
  <div class="step"><div class="step-num">4</div>
    <div class="step-body"><strong>Mobile ID issuance</strong>, by IC tag or at an immigration office.</div></div>
</div>

Test in that order and each failure tells you something. Test out of order and
a mobile ID refusal looks like a government problem when it is a telecom record
problem.

## What this is worth

A line that clears all four is worth more than a cheaper one that does not,
because the alternative is not a small inconvenience — it is repeated in-person
trips for things everyone else does on a phone.

<div class="callout callout-warn">
  <p class="callout-title">The saving and the cost are not in the same units</p>
  <p>A few thousand won a month against a bank branch visit, a government office
  queue, a card application that cannot complete online. Once the four checks
  pass, there is no reason to pay for a major carrier plan — but choosing the
  cheapest line without testing them is how the saving turns into an
  administrative tax.</p>
</div>

For a foreign resident in Korea a phone number is not really a communications
product. It is the key the financial and public systems use to recognise you,
and the four tests above are how you find out whether yours turns.
