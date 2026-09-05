---
title: 'Paying in Korea With a Foreign Card'
description: 'Korea runs on cards and still refuses foreign ones in specific, predictable places. Which places, why, and what to carry instead.'
category: banking
publishDate: 2026-09-13
updatedDate: 2026-09-13
slot: am
draft: true
tags: [banking, cards, arrival, payments, short-stay]
pairedWith: atms-in-korea-for-foreign-cards
lastVerified: 2026-09-13
tracked: [dcc-typical-markup, seoul-transit-foreign-card-machines, seoul-transit-foreign-card-fee, wowpass-topup-networks]
sources:
  - label: 'Visa — dynamic currency conversion and cardholder choice of currency'
    url: 'https://www.visa.co.kr/'
  - label: 'Mastercard — currency conversion and cross-border fees'
    url: 'https://www.mastercard.co.kr/'
  - label: 'Financial Supervisory Service — payment services and consumer guidance'
    url: 'https://www.fss.or.kr/'
  - label: 'Seoul Metropolitan Government — metro ticket machines accepting overseas-issued cards, from 17 March 2026'
    url: 'https://www.seoul.go.kr/'
  - label: 'WOWPASS — top-up methods and card usage guidance'
    url: 'https://www.wowpass.io/'
affiliate: false
revisions:
  - date: 2026-09-13
    change: 'Published'
  - date: 2026-09-13
    change: 'Seoul metro ticket machines now accept overseas cards; DCC markup and prepaid-card routes added'
keyFacts:
  - { label: 'Refusals are', value: 'Structural, not random' }
  - { label: 'Always pay in', value: 'KRW' }
  - { label: 'DCC markup', value: 'Typically 3–5%' }
  - { label: 'Seoul metro machines', value: 'Foreign cards since 3/2026' }
faq:
  - question: 'If Korea is so cashless, why does my card keep failing?'
    answer: 'Because "cashless" describes domestic cards, not foreign ones. Korea runs on a domestic card infrastructure that is enormously well established, and acceptance of internationally issued cards sits on top of it rather than being the same thing. So a card that works at a department store can be refused at a small restaurant, a market stall, a ticket kiosk or inside a delivery app — not because the business dislikes foreign cards but because that particular terminal or service was built for domestic ones. The pattern is predictable enough to plan around, which is what this guide is for.'
  - question: 'The terminal asks whether to charge me in my own currency. Which do I choose?'
    answer: 'Choose Korean won, effectively always. Being offered your home currency at a Korean terminal is dynamic currency conversion: the merchant’s side converts for you at a rate it sets, and that rate is normally worse than the one your own card network would have applied. Paying in KRW hands the conversion to your issuer instead. The offer is usually presented as a convenience and it is a pricing decision, so read the screen rather than tapping the highlighted button.'
  - question: 'Can I use Apple Pay or Google Pay in Korea?'
    answer: 'Less reliably than in most countries, and the situation differs by network, issuer and merchant, so treat mobile payment as a bonus rather than your plan. The same goes for contactless in general: Korean terminals have historically been built around inserting or swiping, and tap acceptance for foreign-issued cards is uneven. Carry the physical card, and expect to hand it over rather than tap it.'
  - question: 'What should I actually carry for two weeks in Korea?'
    answer: 'A foreign card for hotels, department stores, chains and larger restaurants; enough cash for small restaurants, markets, some taxis and anywhere with an older terminal; and a prepaid transport card for buses and the subway, which also works as a small-payment card in convenience stores. A Korean prepaid card such as WOWPASS is a useful fourth, because money loaded onto it from your overseas card is then spent as a domestic card — which clears at terminals that refuse the overseas card outright. What none of them solve is Korean apps that require a domestic card and identity verification.'
  - question: 'Can I buy a Seoul subway ticket with my foreign card now?'
    answer: 'At a large part of the network, yes — which reverses what almost every travel guide still says. Since 17 March 2026 Seoul has operated 440 new ticket machines across 273 stations on lines 1 to 8 that accept overseas-issued Visa and Mastercard for single-journey tickets and the short-term Climate Card, with an average service fee of about 3.7%. Two cautions: buying a ticket with a foreign card is not the same as tapping that card at the gate, which is being introduced in stages; and ordinary T-money top-up machines, other operators and regional networks are separate questions with their own answers.'
  - question: 'My card was declined at a kiosk. Is it unusable in Korea?'
    answer: 'Probably not. Unattended machines — older ordering kiosks, parking, laundry, vending, hospital payment terminals — are often built around domestic cards, and a decline there says something about that machine rather than about your card. The same card frequently works at the staff till in the same building. What you should not do is put it through the same terminal several times: repeated failures can look like risk to your issuer’s fraud system and get the card blocked for a reason that has nothing to do with Korea.'
---

Korea has a reputation for being nearly cashless, and for domestic
cardholders it is. A foreign-issued card meets a different country.

The refusals are not random. They cluster in the same places for the same
reasons, which means you can plan for them instead of discovering them one
awkward counter at a time.

<figure class="figure hero">
  <p class="figure-title">Where a foreign card works, and where it stops</p>
  <p class="figure-sub">The pattern is about the terminal, not about you</p>
  <div class="check-card">
    <div class="check-row ok"><span class="mark"></span><span><strong>Reliable</strong> — hotels, department stores, airport, large chains, bigger restaurants, most convenience stores.</span></div>
    <div class="check-row miss"><span class="mark"></span><span><strong>Unreliable</strong> — small independent restaurants, market stalls, older terminals, some taxis, self-service kiosks.</span></div>
    <div class="check-row miss"><span class="mark"></span><span><strong>Usually not at all</strong> — Korean delivery, shopping and booking apps that require a domestic card plus identity verification.</span></div>
    <div class="check-result">The first group covers most of a business trip. The second and third are what ruin a Tuesday evening.</div>
  </div>
</figure>

<p class="hand">Not "does Korea take cards". Does this terminal take yours.</p>

## Why the split exists

Korea's card economy grew on a domestic infrastructure — domestic issuers,
domestic acquiring, domestic networks — that is deep, cheap and everywhere.

International acceptance sits **on top of that**, not underneath it. A
merchant can be fully card-based for Korean customers and still not have,
or not have enabled, the arrangement that lets an overseas card clear.

Which is why the failure feels arbitrary and is not. It tracks the age of
the terminal and the size of the business far more than anything about your
card.

And there are two separate rails underneath, which is the part that catches
people out:

| | Runs through |
|---|---|
| In person | The card terminal and a VAN operator |
| Online | A payment gateway, with its own contract and authentication |

```
your card network → a Korean acquirer → VAN or PG → the merchant's system
  → your issuer's approval
```

Every link has to handle an overseas card. So a shop whose till takes your
card can still have an online store that does not — the two were set up
separately, and only one of them was set up for you.

## Always choose won

If a terminal offers to charge you in your home currency, that is **dynamic
currency conversion**, and it is a pricing decision dressed as a
convenience.

```
Pay in KRW   →  your card network converts
Pay in USD/EUR/etc  →  the merchant's side converts, at its own rate
```

The second is normally worse. Visa's own guidance puts the markup embedded in
that rate at [around 3 to 5%](/tracked/dcc-typical-markup/) — so on a
₩1,000,000 purchase, a rate 4% adrift of the market costs roughly ₩40,000 for
nothing.

<div class="callout callout-note">
  <p class="callout-title">Do not quote it as a fixed number either</p>
  <p>"DCC costs you 8%" is a guess presented as a fact, and it invites the
  reader to disbelieve the whole warning when their own statement shows
  something else. There are two variable components: the DCC provider's markup,
  and your issuer's foreign transaction fee — which applies whichever currency
  you choose.</p>
</div>

The offer appears at card terminals, at ATMs and occasionally online.

<div class="callout callout-warn">
  <p class="callout-title">Read the screen, do not tap the highlighted button</p>
  <p>The home-currency option is frequently the visually prominent one, and it
  is often presented as "so you know exactly what you are paying". You still
  know what you are paying if you choose won — your own bank tells you, at a
  better rate.</p>
</div>

Your issuer's own foreign transaction fee applies either way. That is a
separate charge and choosing won does not avoid it; it only avoids paying a
second markup on top.

### The choice is yours, and sometimes it is taken

Visa and Mastercard both require that the cardholder be offered the currency
choice and shown the rate and any charges. So a receipt that came out in your
home currency when nobody asked you is not how it is meant to work.

<div class="steps">
  <div class="step"><div class="step-num">1</div>
    <div class="step-body"><strong>At the counter</strong> — ask for the transaction to be voided and re-run in won. Straightforward while you are still standing there.</div></div>
  <div class="step"><div class="step-num">2</div>
    <div class="step-body"><strong>After the fact</strong> — raise it with your issuer with the receipt, which shows the currency and the rate applied.</div></div>
  <div class="step"><div class="step-num">3</div>
    <div class="step-body"><strong>Before you travel</strong> — some issuers can block DCC transactions outright. If yours does, turn it on and the question stops arising.</div></div>
</div>

Worth checking with your issuer before arrival, in one call: overseas use
enabled, online overseas payments enabled, 3-D Secure set up, the foreign
transaction fee, and whether DCC can be blocked.

## Contactless and phone payment are not the default here

Two habits from elsewhere do not travel well.

**Tap.** Korean terminals were built around inserting and swiping, and
contactless acceptance for foreign-issued cards is uneven. Hand the card
over and expect it to go into the machine.

**Apple Pay and Google Pay.** Availability in Korea is narrower than in most
comparable countries and varies by network, issuer and merchant. Treat
mobile payment as a lucky bonus and carry the plastic.

## The three hard cases

### Self-service kiosks

Ordering screens in fast food and cinemas, parking machines, laundry rooms,
vending machines and hospital payment terminals are often built around
domestic cards — and they are exactly the situation where you cannot ask
someone to try something else.

A decline at one of these is a fact about the machine. The staff till in the
same building frequently takes the same card without comment, so where a
counter exists, use the counter.

<div class="callout callout-warn">
  <p class="callout-title">Do not run it through three more times</p>
  <p>Repeated failed attempts can register as risk with your issuer's fraud
  system and get the card blocked — turning a machine that did not like your
  card into a card that no longer works anywhere. Switch payment method rather
  than retrying: another international card, a wallet, a Korean prepaid card,
  then cash.</p>
</div>

### Taxis

The card readers in taxis vary in age enormously. Some take foreign cards
without comment; some do not. The safe habit for a visitor is to **assume
cash** and be pleased when the card works.

Transport cards are widely accepted in taxis and are the better answer —
covered below.

### Korean apps

Delivery, shopping, booking and ticketing apps are the hardest case, but
"Korean sites do not take foreign cards" is too crude to act on.

Korean payment gateways do handle overseas cards — Toss Payments, for
instance, supports overseas-issued Visa, Mastercard and JCB with 3-D Secure.
Whether a particular shop or app has contracted and enabled that is a separate
question, and so is everything around the payment itself.

So when something fails online, locate **where** it failed:

<div class="steps">
  <div class="step"><div class="step-num">1</div>
    <div class="step-body"><strong>Sign-up</strong> — many services stop you at Korean identity verification before payment is ever reached. Nothing about your card is being tested yet.</div></div>
  <div class="step"><div class="step-num">2</div>
    <div class="step-body"><strong>Checkout</strong> — the merchant may simply not have overseas card payment enabled. Look for a separate "foreign card" or "overseas card" option, which some sites do provide.</div></div>
  <div class="step"><div class="step-num">3</div>
    <div class="step-body"><strong>Authentication</strong> — 3-D Secure or your issuer's one-time password can fail, often because the phone number registered with your bank is not the one you have with you.</div></div>
  <div class="step"><div class="step-num">4</div>
    <div class="step-body"><strong>The form</strong> — a Korean phone number, a domestic billing address or a member account can each be required independently of the card.</div></div>
</div>

Which services stop you at which of those, and why, is in
[what breaks without a Korean phone number](/cost-of-living/what-breaks-without-a-korean-phone-number/).

## The transport card is the quiet answer

A prepaid transport card — bought and topped up with cash at any convenience
store — solves more than transport.

It covers buses and the subway, is accepted by many taxis, and works as a
small-payment card in convenience stores and some vending and kiosk
situations. For a visitor it neatly fills the gap where foreign cards are
weakest: small, fast, unattended payments.

<div class="callout callout-note">
  <p class="callout-title">Top it up with cash</p>
  <p>Ordinary T-money top-up machines are frequently domestic-card-only, so
  plan to load it with notes. Buying and topping up at a convenience store
  counter is still the path with the fewest surprises.</p>
</div>

### Seoul changed this in March 2026

The advice that metro ticket machines take cash or Korean cards only is now
out of date for much of Seoul. Since **17 March 2026** the city has run
[440 new machines across 273 stations](/tracked/seoul-transit-foreign-card-machines/)
on lines 1 to 8 that accept overseas-issued Visa and Mastercard for
single-journey tickets and the short-term Climate Card.

The convenience is not free: an average service fee of about
[3.7%](/tracked/seoul-transit-foreign-card-fee/) applies, and your issuer's
foreign transaction fee sits on top of that. For a few journeys it is worth
it; for two weeks of daily travel, a transport card loaded with cash is still
cheaper.

<div class="callout callout-warn">
  <p class="callout-title">Buying a ticket is not tapping at the gate</p>
  <p>Open-loop acceptance — tapping your own Visa or Mastercard directly on the
  reader — is being introduced in stages and should not be assumed anywhere. Nor
  does the change extend to ordinary T-money top-up machines, other operators or
  regional networks. Outside the specific machines, plan as before.</p>
</div>

How the prepaid and post-paid versions differ, and why a foreign resident
gets refused the post-paid one, is in
[post-paid transport cards for foreigners](/banking/postpaid-transportation-cards-for-foreigners/).

## Prepaid cards turn your foreign card into a domestic one

The structural problem is that your card is foreign. A Korean prepaid card
sidesteps it: load it from your overseas card, then spend it as a **domestic**
card — which clears at terminals that would decline the overseas card outright.

WOWPASS is the established one for visitors, taking mobile top-up from
[overseas Visa, Mastercard and JCB](/tracked/wowpass-topup-networks/) as well
as foreign cash at its machines, and spending as a domestic prepaid card at
offline merchants. NAMANE is a comparable service.

<div class="callout callout-warn">
  <p class="callout-title">The payment balance is not the transport balance</p>
  <p>WOWPASS cards carry T-money functionality, and the two balances are
  separate. A well-funded payment balance does not pay a bus fare — the
  transport balance is topped up on its own. This is the single most common
  confusion with these cards.</p>
</div>

Treat the specifics as perishable. Top-up methods, fees, supported networks and
daily limits on these cards change often, so confirm in the app rather than
from an article — including this one. What is stable is the structure: foreign
money in, domestic card out.

## What to carry, by trip

| | Foreign card | Cash | Transport card |
|---|---|---|---|
| Hotels, department stores, chains | Primary | Backup | — |
| Small restaurants, markets | Backup | Primary | — |
| Seoul metro ticket machines | Works, ~3.7% fee | Fine | — |
| Buses, and the gates themselves | — | Awkward | Primary |
| T-money top-up machines | Often refused | Primary | — |
| Taxis | Sometimes | Reliable | Reliable |
| Convenience stores | Usually fine | Fine | Fine |
| Unattended kiosks | Often refused | Sometimes | Sometimes |
| Korean apps | Depends on the merchant | No | No |

**A business traveller** can run mostly on the card and keep cash for
dinners. **A tourist moving around** will use the transport card far more
than expected. **Anyone staying more than a few weeks** should stop
patching and set up a domestic account — the reasons compound quickly.

## If you are staying longer than a visit

Everything above is a workaround. Past a few weeks the workarounds cost more
than the setup does.

What the branch asks for, and why the first account is limited, is in
[opening a bank account in Korea as a foreigner](/banking/how-to-open-a-bank-account-in-korea-as-a-foreigner/);
the currency and remittance structure that follows is in
[managing money in Korea](/cost-of-living/managing-money-in-korea-fx-remittance-cards/).

Getting cash out in the meantime — which machines take your card, and what
each withdrawal actually costs — is in
**ATMs in Korea for foreign cards**.
