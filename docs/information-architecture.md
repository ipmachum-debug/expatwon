# ExpatWon 정보구조 (IA) — 500편 기준

> 확정 2026-08-31 · 현황 35편 (발행 29 · 예약 6)
> 콘텐츠 목록은 `content-plan.md`. **이 문서는 그 글들을 어디에 걸지**를 정한다.
>
> ⚠️ **2026-09-04 개정** — `positioning.md` 가 최상위 축을 바꿨다.
> §1(Live/Visit 이분법)은 **폐기**, §2 의 `Visit Korea` 메뉴는 `Arrival & Setup`
> 으로 **개정**, §6(Visit Korea 281~500)은 **보류**다. 각 절 머리에 표시했다.
> URL 정책(§3), Path 원칙(§4), 내부링크 계약(§5)은 그대로 유효하다.

280편 시점에 고쳐도 되는 것과, 500편 시점에는 이미 못 고치는 것이 있다.
URL·네비게이션·허브 구조가 후자다. 지금 확정한다.

---

## 1. 최상위 이분법 — Live / Visit  ⛔ 폐기 (2026-09-04)

> **이 절은 더 이상 유효하지 않다.** 체류 기간은 독자가 자기를 분류하는
> 기준이 아니다 — 3개월 어학연수생도 은행계좌·ARC·건강보험이 필요하고,
> 2년 거주자도 공항 가는 법은 검색하지 않는다. 최상위 축은
> **"돈이나 서류가 오가는 결정인가"** 로 바뀌었다. `positioning.md` §2 참조.
> 아래는 기록으로 남긴다.

```
                    EXPATWON
                       │
          ┌────────────┴────────────┐
    LIVE IN KOREA              VISIT KOREA
      001~280                    281~500
   Money / Visa / Tax        Entry / Transport
   Housing / Work            Money / Stay / Food
   Business / Insurance      Seoul / Busan / Jeju
   Cars / Life / Exit        Safety / Itineraries
```

검색 의도가 완전히 다르다. 거주자는 `F-2 visa loan Korea` 를 치고,
여행자는 `best eSIM Korea` 를 친다. 같은 도메인에 두되 최상위에서 갈라야
구글도 사용자도 두 영역을 따로 이해한다.

**별도 도메인으로 떼지 않는다.** 대상이 "한국의 외국인" 으로 같고,
도메인을 나누면 지금까지 쌓은 권위가 절반으로 갈린다.

---

## 2. 메인 네비게이션 — 8개 고정  ⚠️ 개정 (2026-09-04)

> 8개 상한과 `Cost of Living` 해체는 유효하다. `Visit Korea` 항목만
> `Arrival & Setup`(통신·eSIM/USIM·ARC·교통카드)으로 교체됐다.
> 확정판은 `positioning.md` §7.

콘텐츠가 500편이 돼도 최상단 메뉴는 8개를 넘기지 않는다. 15개짜리 메뉴는
백과사전처럼 보이지만 실제로는 아무도 쓰지 않는다.

| 메뉴 | 내부 허브 |
|---|---|
| **Money** | Banking, Cards, Credit, Loans, FX |
| **Visa & Work** | Visas, Immigration, Employment |
| **Housing** | Renting, Buying, Mortgage, Utilities |
| **Business & Tax** | Business, VAT, Income Tax, Corporate Tax |
| **Health & Insurance** | NHIS, Pension, Private Insurance |
| **Cars** | License, Buy, Finance, Insurance, Sell |
| **Visit Korea** | 여행 전체 |
| **Tools** | 계산기·체크리스트 |

현재의 Banking / Loans / Cars / Business / Insurance / Cost of Living 을
그대로 메뉴에 계속 추가하는 방식은 여기서 끝낸다. `Loans` 는 Money 안의
하위 허브, `Cost of Living` 은 Housing 과 Visit Korea 로 나뉘어 흡수된다.

---

## 3. URL 정책 — 카테고리 1단계, 그 이상 없음

**현재 구조는 `/{category}/{slug}/` 이다** (`/banking/how-to-open-a-bank-account-in-korea/`).
`/articles/{slug}` 평면 구조가 아니다. 29편이 이미 이 형태로 색인돼 있다.

정책:

1. **발행된 URL 은 바꾸지 않는다.** 리다이렉트로 넘기는 순간 순위가 흔들리고,
   그럴 만한 이득이 없다.
2. **카테고리는 1단계로 끝낸다.** `/money/banking/mortgage/foreigners/` 같은
   4~5단계를 만들지 않는다. 깊이는 SEO 이득이 없고 관리만 어렵다.
3. **메뉴 그룹(Money, Visa & Work…)은 URL 세그먼트가 아니다.** 그룹은
   네비게이션과 허브 페이지에만 존재하고, 글은 계속 `/banking/…` 에 산다.
   `/money/` 허브 페이지는 만들되 그 아래로 글을 옮기지 않는다.

```
글      /banking/{slug}/        /loans/{slug}/        /visas/{slug}/
카테고리 허브  /banking/          /loans/               /visas/
그룹 허브     /money/  →  banking · cards · credit · loans · fx 로 링크
여행         /visit-korea/{slug}/  ·  허브 /visit-korea/
경로         /paths/{slug}/
```

**구조는 URL 이 아니라 내부링크와 breadcrumb 이 만든다.**

### 이주가 필요한 기존 글 2편

| 현재 | 이동 | 처리 |
|---|---|---|
| `/business/d-8-investor-visa-korea-requirements/` | `/visas/` | 301 |
| `/business/hiring-your-first-employee-in-korea/` (예약 9-01) | `/employment/` | ✅ 발행 전 확정, 비용 0 |

발행 전인 9/1 글은 지금 옮기면 비용이 0이다. D-8 글만 301 을 건다.

---

## 4. Persona 는 카테고리가 아니라 Path 다

280 계획의 256~280 (E-7 Worker / F-2 Resident / D-8 Founder / D-2 Student …)
은 `/persona/` 카테고리를 만들지 않는다. **Path 페이지**로 만든다.

```
/paths/e7-worker-in-korea/

  E-7 Visa → ARC → Bank Account → Credit Card → Salary & Tax
  → NHIS → Credit Score → Loan → Housing → Changing Jobs → Visa Renewal
```

한 페이지가 전문 글 10~15개를 순서대로 엮는 네비게이션 허브가 된다.
새 글을 쓰는 게 아니라 **있는 글을 재조립**하는 것이므로, 해당 클러스터가
채워진 뒤에 만든다.

여행에도 같은 구조를 쓴다:

```
/paths/first-time-in-korea/

  K-ETA → Incheon Airport → eSIM → T-money → Airport to Seoul
  → Cash vs Card → Naver Map → Where to Stay → Food → Shopping
  → Tax Refund → Departure
```

착수 계획: **Live 12개 + Visit 2개.** 500편 이후의 확장(Study in Korea /
Work in Korea / Start a Business / Retire in Korea)도 새 글이 아니라
같은 방식의 Audience Hub 다.

---

## 5. 내부링크 계약 — 모든 글에 적용

500편에서 이게 사이트의 실제 구조가 된다. 글마다 최소:

```
Parent Hub        1
Sibling Article   2~3
Previous Step     1
Next Step         1
Cross Cluster     1~2
```

= 글당 6~8개의 의미 있는 연결. 500편이면 3,000개 이상의 내부링크 네트워크.

예 — Korean Mortgage for Foreigners:

```
Parent     Loans
Previous   Korean Credit Score · DSR & LTV
Related    Buying Property · Acquisition Tax
Visa       E-7 / F-2 / F-5 금융 가이드
Next       Property Registration · Overseas Fund Transfer
```

**"Related" 를 자동 추천으로 채우지 않는다.** 같은 카테고리 최신 3편을
기계로 붙이는 건 링크지 구조가 아니다. 원고에 명시한다.

---

## 6. Visit Korea (281~500) — 마찰 구간부터  ⏸ 보류 (2026-09-04)

> 이 절의 500편 배분은 `positioning.md` §2 의 돈·서류 필터를 다시 통과해야
> 한다. 통과한 항목은 기존 카테고리로 흡수되고, 나머지는 Michael Archive 몫.
> 재작성 전까지 착수하지 않는다.

280편이 끝나자마자 관광지 소개로 들어가지 않는다. 순서는:

| 구간 | 내용 | 성격 |
|---|---|---|
| 281~410 | 준비 · 입국 · 교통 · 결제 · 통신 · 숙박 | **마찰 구간** |
| 411~474 | 서울 · 부산 · 제주 · 지방 | 목적지 |
| 475~500 | 음식 · 쇼핑 · 응급 · 일정 | 혼합 |

### 마찰 구간이 이 사이트의 몫인 이유

`Can I use my Visa card in Korea?` / `Why was my card declined in Korea?` /
`ATM that accepts foreign cards` / `T-money for tourists` /
`Incheon Airport to Seoul` — 전부 **결제·통신·행정 문제**다. 001~280 에서
쌓는 전문성이 그대로 넘어간다. 영어권 경쟁도 얕다.

### 목적지 절반(411~474)에 대한 유보

`Seoul 3-Day Itinerary` / `Myeongdong vs Hongdae vs Gangnam` 은 영어권
여행 SEO 에서 가장 경쟁이 심한 구간이다. michaelarchive 다국어 검토에서
"경쟁이 살인적" 이라고 판단한 바로 그 시장이고, 저자의 E-E-A-T(한국 법인
대표·ISO 심사원)가 마찰 구간에는 전이되지만 관광지 추천에는 전이되지 않는다.

**281~410 을 먼저 쓰고, 그 130편의 실제 검색 데이터를 보고 411 이후를
다시 정한다.** 지금 411~500 을 확정하지 않는다. 280편이 8~9개월,
410편이 1년 이상 뒤다 — 그 시점의 검색 데이터가 지금 추측보다 낫다.

---

## 7. 단계

| 단계 | 콘텐츠 | 사이트 상태 |
|---|---|---|
| I | 001~040 | 금융 중심 초기 사이트 (진행 중, 35편) |
| II | 041~100 | Visa + Taxes |
| III | 101~180 | Banking + Loans + Real Estate |
| IV | 181~240 | Business + HR + Insurance + Cars |
| V | 241~280 | Exit + Path 페이지 |
| VI | 281~360 | 여행 준비 · 입국 · 교통 |
| VII | 361~410 | 결제 · 통신 · 숙박 |
| VIII | 411~474 | 목적지 — **VII 데이터 보고 재확정** |
| IX | 475~500 | 음식 · 쇼핑 · 응급 · 일정 |

하루 1편 기준: 280편 2027-05, 500편 2027-12.

---

## 8. 구현 순서 (코드)

IA 를 지금 다 만들지 않는다. 글이 없는 허브는 빈 페이지고, 빈 허브는
색인에서 손해다. 카테고리가 5편을 넘길 때 허브를 연다.

- [x] `categories.ts` 에 `employment` 추가 (9/1 글이 발행되기 전이라 지금이 유일한 무비용 시점)
- [ ] `visas` / `taxes` / `exit` 추가 (Phase II 착수 전)
- [ ] D-8 글 `/visas/` 이주 + 301
- [ ] 헤더를 8개 그룹 메뉴로 교체 (카테고리 10개가 될 때)
- [ ] 그룹 허브 `/money/` `/visa-work/` … (해당 그룹 20편 이상일 때)
- [ ] `/paths/` 라우트 + 첫 Path 페이지 (Phase V)
- [ ] `/visit-korea/` 허브 (Phase VI)
- [ ] 원고 템플릿에 내부링크 계약 6~8링크 필드 추가 (즉시)
