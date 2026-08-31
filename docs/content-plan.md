# ExpatWon 마스터 콘텐츠 플랜 — 280편

> 확정 2026-08-31 · 현황 **35/280** (발행 29 · 예약 6)
> v1(39편 설계)은 `content-plan-v1-archive.md` 로 보존.

**이 문서가 단일 source 입니다.** 새 글은 여기 있는 번호·slug 로만 씁니다.
여기 없는 주제를 즉흥으로 쓰지 않습니다 — 카니벌라이제이션은 계획 밖에서
생깁니다. 발행하면 `[LIVE]`, 예약은 `[예약 MM-DD]` 로 표시합니다.

---

## ⚠️ 착수 전 해결해야 할 충돌 4건

280편을 순서대로 쓰기 전에 아래는 구조를 확정해야 한다. 그냥 쓰면 서로
잡아먹는다.

### 1. 비자별 신용대출 4편 (122~125) — **통합 필요**

```
122 E-7 Credit Loans
123 F-2 Credit Loans
124 F-4 Credit Loans
125 F-5 & F-6 Credit Loans
```

이 네 편은 본문의 80% 가 같아진다. 심사 항목·필요 서류·DSR 계산이 동일하고
비자 이름만 바뀐다. 구글이 thin content 로 보고 넷 다 순위가 안 오른다.

**답이 실제로 갈라지는 축은 비자가 아니라 상황이다.**

| 살릴 것 (답이 다름) | 접을 것 (답이 같음) |
|---|---|
| 121 급여소득 신용대출 (허브) | 122 E-7 |
| 127 인정소득 판정 | 123 F-2 |
| 128 해외소득 인정 | 124 F-4 |
| 129 잔여 체류기간 vs 만기 | 125 F-5·F-6 |

→ **121 을 허브로 두고 비자는 그 안의 비교표로 처리.** 비운 4칸은 아래로
대체: `대출 거절 사유 상위 7가지` / `배우자 소득 합산 대출` / `신규 입국자
무신용 대출 옵션` / `외국인 대출 사기·중개 수수료`.

Visas 클러스터(036~070)는 예외 — 거기선 비자 자체가 주제라 E-7 근무처 변경과
F-2 점수제는 실제로 다른 글이다.

### 2. 보증기관 비교 중복 (138 ↔ 162)

```
138 HUG vs HF vs SGI for Jeonse Finance   (Loans)
162 HUG vs HF vs SGI Deposit Guarantees   (Real Estate)
```
같은 글이다. **162 하나로 통합**하고 138 은 `전세대출 보증 거절 시 대안`으로
대체.

### 3. 국민연금 반환일시금 중복 (212 ↔ 249)

```
212 National Pension Lump-Sum Refund
249 Claiming Your National Pension Refund
```
**212 하나로 통합.** 249 는 `출국 후 연금 수령 계좌·환율·세금` 으로 대체.

### 4. 퇴직금 (198 ↔ 250)

198 은 제도 일반, 250 은 출국자 정산. 250 단독으로는 얇다.
→ **250 을 241(출국 금융 체크리스트) 에 흡수**하고, 250 자리는
`퇴직연금 DB·DC·IRP 외국인 실무` 로 대체.

### 5. 거주자/비거주자 3편 (070 / 074 / 103) — 유지하되 역할 고정

셋 다 살릴 수 있다. 단 **070 을 허브**로 명시하고 나머지는 각 영역만 다룬다.

- **070** 출입국·세법·외환법에서 "거주자"가 각각 다르다 (개념 허브)
- **074** 세법상 거주자 판정 기준과 과세 범위
- **103** 거주자·비거주자 계좌의 상품 차이

셋이 서로를 링크하고, 각자 다른 검색어를 노린다.

---

## 카테고리 · URL 구조

기존 URL 은 절대 바꾸지 않는다. 주거 관련이 `/cost-of-living/` 에 있는 것도
그대로 둔다(표시명만 "Housing & Living"). 신설 4개는
`src/lib/categories.ts` 에 색·아이콘·설명 추가 필요.

| 카테고리 | slug | 목표 | 현재 | 비고 |
|---|---|---:|---:|---|
| Banking | `banking` | 34 | 6 | |
| Loans & Credit | `loans` | 36 | 9 | |
| Visas & Immigration | `visas` | 35 | 1 | **신설** (D-8 편 이관) |
| Taxes | `taxes` | 31 | 0 | **신설** |
| Housing & Living | `cost-of-living` | 33 | 5 | 표시명 변경 |
| Business | `business` | 26 | 4 | |
| Employment & HR | `employment` | 19 | 1 | **신설** |
| Insurance & Social Security | `insurance` | 18 | 3 | |
| Cars & Mobility | `cars` | 22 | 7 | |
| Leaving Korea | `exit` | 15 | 0 | **신설** |
| Persona / Scenario | 각 홈 카테고리 | 25 | 0 | 별도 URL 두지 않음 |
| **합계** | | **280** | **35** | |

**페르소나 25편은 `/persona/` 를 만들지 않는다.** "E-7 입국 30일" 은
`/visas/`, "F-6 금융 가이드" 는 `/banking/` 에 둔다. 페르소나는 검색 의도가
아니라 묶음일 뿐이라 URL 카테고리로 만들면 약해진다.

**헤더 내비게이션**: 10개는 한 줄에 안 들어간다. 상위 6개 노출 + "More"
드롭다운, 또는 2단 구성이 필요하다. Phase 2 착수 시점에 처리.

---

## 발행 속도 — 3구간

| 구간 | 속도 | 하는 일 | 도달 시점 |
|---|---|---|---|
| **~200** | **하루 2편** | 오전 Pillar / 오후 Supporting | 2026-11-23 |
| **200~280** | 하루 1편 | + 기존 글 검증 1~3편/일 | 2027-02-11 |
| **280~500** | 하루 1편 | + 현장 데이터(Layer 3) 축적 | 2027-09-19 |

### 오전 Pillar · 오후 Supporting

같은 날 나가는 두 편을 **한 쌍으로 묶는다.** 오전에 허브를 세우고, 오후에
그 허브가 답하지 않는 좁은 질문을 붙인다.

```
오전  E-7 Visa Explained            ←→  오후  E-7 Visa Renewal Requirements
오전  Korean VAT Guide              ←→  오후  VAT Refund on Startup Investment
```

쌍으로 쓰면 두 글이 서로를 자연스럽게 링크한다. 하루 2편을 무관한 주제로
흩뿌리면 클러스터가 안 생기고 편수만 는다.

**구현**: 프론트매터 `slot: pm` 이 오후 발행으로 보낸다. 없으면 오전.
같은 `publishDate` 를 가진 두 편이 따로 나간다.

### 200편 이후 — 신규보다 관리가 커진다

```
신규 글         1편/일
기존 글 검증    1~3편/일   ← npm run queue
  tracked 재확인 · observed 추가 · evidence 축적
  내부링크 보강 · Calendar 갱신 · Tools 개발
```

280편을 하루 3편씩 검증하면 **93일에 한 바퀴**, 500편이면 167일. 둘 다
6개월 재검증 주기 안에 들어온다. `npm run queue` 가 그날 볼 3편을 고른다 —
이번 달에 값이 움직이는 시리즈를 추적하는 글이 최우선, 그 다음 오래된 순.

---

## 진행 단계

완료 시점은 위 속도 기준. P1~P8 은 하루 2편 구간이라 이전 계획보다 5개월 이상 당겨진다.

| 단계 | 번호 | 내용 | 완료 시점 |
|---|---|---|---|
| **P0** | 001–029 | 기초 필러 | ✅ 완료 |
| **P1** | 030–035 | 확장 원고 | 2026-09-06 |
| **P2** | 036–070 | **Visas 신설** | 2026-09-24 |
| **P3** | 071–101 | **Taxes 신설** | 2026-10-09 |
| **P4** | 102–120 | Banking 확장 | 2026-10-19 |
| **P5** | 121–142 | Loans 확장 | 2026-10-30 |
| **P6** | 143–169 | Real Estate & Living | 2026-11-12 |
| **P7** | 170–191 | Business | 2026-11-23 |
| **P8** | 192–200 | Employment & HR (전반) | 2026-11-27 |
| — | — | *여기서 하루 1편으로 전환* | — |
| **P8** | 201–210 | Employment & HR (후반) | 2026-12-07 |
| **P9** | 211–225 | Insurance & Social Security | 2026-12-22 |
| **P10** | 226–240 | Cars 확장 | 2027-01-05 |
| **P11** | 241–255 | Retirement & Exit | 2027-01-20 |
| **P12** | 256–280 | 페르소나 롱테일 | 2027-02-11 |

**Visas 를 P2 로 먼저 여는 이유**: 이미 발행된 29편이 체류자격을 계속
참조하는데 실체가 없어 링크를 못 걸고 있다. 신설하는 순간 기존 글들의
내부링크가 즉시 촘촘해진다 — 새 글로 옛 글의 SEO 를 같이 올리는 유일한 구간.

**페르소나(P12)를 마지막에 두는 이유**: 종합 시나리오 글은 참조할 개별 글이
다 있어야 성립한다. 먼저 쓰면 링크 걸 곳이 없어 얇아진다.

**하루 2편의 진짜 제약은 집필이 아니라 검증이다.** 이 사이트의 글 한 편은
공식 출처 대조 · keyFacts · 도식 · 내부링크 · tracked 연결을 거친다. 원고는
2편이 나와도, **틀린 수치를 잡아내는 건 최종적으로 저자다** — 2026-08-31 에
자동차세 연납을 "1월만 가능" 으로, 중간예납을 "신고" 로 쓴 것을 저자가 잡았다.
하루 2편이면 그 검증도 하루 2회다. **이게 지속 불가능해지는 순간 속도를 줄인다.
잘못된 수치가 실린 200편은 검증된 100편보다 나쁘다.**

---

# P0 · 001–029 — 발행 완료

## Banking
- `001` [LIVE] kakaobank-toss-bank-kbank-for-foreigners — 인터넷은행 3사, 업데이트형
- `002` [LIVE] how-to-open-a-bank-account-in-korea-as-a-foreigner — 신원·목적 확인 구조
- `003` [LIVE] how-to-send-money-from-korea-abroad — 순수취액 산식
- `004` [LIVE] korean-limited-accounts-hando-gyejwa-explained — 한도제한계좌 해제

## Loans & Credit
- `005` [LIVE] savings-banks-and-capital-companies-korea — 2금융권 조달구조
- `006` [LIVE] personal-credit-loan-requirements-korea — 심사 실무
- `007` [LIVE] jeonse-loan-for-foreigners-explained — 4중 한도 최솟값
- `008` [LIVE] can-foreigners-get-a-loan-in-korea — 필러 ★현재 유입 1위
- `009` [LIVE] dsr-ltv-korea-lending-rules-explained — 3중 한도 허브
- `010` [LIVE] korean-credit-score-for-foreigners-nice-kcb — Thin filer 프레임
- `011` [LIVE] p2p-lending-in-korea-explained — 온투업 구조

## Cars
- `012` [LIVE] car-ownership-taxes-and-costs-korea — 취득세·자동차세·검사
- `013` [LIVE] selling-or-exporting-your-car-when-leaving-korea — 인도≠소유권이전
- `014` [LIVE] getting-a-korean-drivers-license-license-exchange — 아포스티유≠인정국
- `015` [LIVE] car-installment-financing-halbu-korea — 할부 심사·선수금
- `016` [LIVE] buying-a-used-car-in-korea-as-a-foreigner — 이전등록 체인
- `017` [LIVE] car-lease-in-korea-for-foreigners-real-cost — 세무 한도
- `018` [LIVE] long-term-car-rental-janggi-rent-korea — TCO 프레임

## Business & Tax
- `019` [LIVE] sole-proprietor-vs-corporation-korea — 2026 법인세·인출층 이중과세
- `020` [LIVE] d-8-investor-visa-korea-requirements — FDI 자금 연속성 → **`/visas/` 이관 예정**
- `021` [LIVE] freelancing-in-korea-legally — 3분리 프레임
- `022` [LIVE] registering-a-business-in-korea-as-a-foreigner — 비자→등록 순서

## Insurance
- `023` [LIVE] korean-car-insurance-for-expats-explained — 무사고 이력·운전자범위
- `024` [LIVE] nhis-korean-health-insurance-for-foreigners — 평균보험료 하한
- `025` [LIVE] private-health-insurance-silbi-korea — 4세대 차등·5세대

## Housing & Living
- `026` [LIVE] jeonse-vs-wolse-korean-rental-system — 보증금=신용공여
- `027` [LIVE] korean-phone-plans-for-foreigners — 본인인증 인프라
- `028` [LIVE] managing-money-in-korea-fx-remittance-cards — FX 누수 지점
- `029` [LIVE] rental-deposit-protection-korea — 대항력·확정일자·126%

---

# P1 · 030–035 — 예약 완료

- `030` [예약 09-03] best-korean-banks-for-foreigners-compared — 4사 비교, 업데이트형
- `031` [예약 09-04] korean-mortgage-for-foreigners — 3중 천장·토허구역 2년 실거주
- `032` [예약 09-05] korean-vat-for-small-business-owners — 간이 1억400만·0.5%·환급불가
- `033` [예약 09-06] korean-check-card-vs-credit-card-for-foreigners — 후불교통=신용기능
- `034` [예약 09-02] utilities-and-maintenance-fees-korea — 장기수선충당금 반환청구
- `035` [예약 09-01] hiring-your-first-employee-in-korea — 인건비 웨지 · `/employment/` 확정

---

# P2 · 036–070 — Visas & Immigration ★신설 (`/visas/`)

## 기초
- `036` korean-visa-system-explained — 비자와 체류자격의 법적 차이 (필러)
- `037` alien-registration-card-guide — ARC 발급·사용·재발급
- `038` reporting-a-change-of-address-korea — 체류지 변경신고와 금융 주소변경
- `039` extending-your-korean-visa — 연장 시기·서류·만료 관리
- `040` changing-visa-status-inside-korea — 자격변경 vs 출국 후 재발급

## E-7
- `041` korea-e-7-visa-explained — 특정활동 기본 구조
- `042` e-7-salary-and-qualification-requirements — 직종별 학력·경력·임금
- `043` changing-jobs-on-an-e-7-visa — 근무처 변경·추가 신고
- `044` bringing-family-to-korea-on-f-3 — 배우자·자녀 동반
- `045` renewing-an-e-7-visa — 연장 심사와 재직·소득 증빙

## F-2 · F-4
- `046` korea-f-2-7-point-visa-explained — 점수제 산정 구조
- `047` f-2-7-renewal-requirements — 연장 시 소득·점수 요건
- `048` f-2-99-long-term-resident-visa — 장기체류자 자격
- `049` korea-f-4-visa-explained — 재외동포 경제활동 범위
- `050` f-4-restricted-jobs-and-simple-labor — 단순노무 제한 업종

## F-5 · F-6
- `051` korea-f-5-permanent-residency — 영주권 요건과 금융상 의미
- `052` f-5-card-renewal-and-long-absence — 갱신·출국·재입국
- `053` korea-f-6-marriage-visa-explained — 결혼이민 체류·취업·금융
- `054` f-6-visa-after-divorce-or-separation — 혼인관계 종료 후

## 사업·투자
- `055` d-8-1-corporate-investor-visa — 외투법인 설립·취득·연장
- `056` d-8-4-technology-startup-visa — 기술창업 요건
- `057` korea-d-9-trade-management-visa — 무역경영 개인사업 구조

## 학생·구직
- `058` working-part-time-on-a-d-2-student-visa — 시간제취업 허가·소득 제한
- `059` changing-from-d-2-to-e-7 — 졸업 후 취업비자 전환
- `060` korea-d-10-job-seeker-visa — 구직 체류 실무

## 근로·방문취업
- `061` korea-e-9-worker-visa-explained — 고용허가제 체류·금융 구조
- `062` korea-h-2-working-visit-visa — 방문취업 취업범위·사업장 이동
- `063` can-f-3-dependents-work-in-korea — 동반가족 취업 제한

## 가족·이동·리스크
- `064` inviting-a-spouse-or-family-to-korea — 소득·주거·관계 증빙
- `065` re-entry-rules-for-foreign-residents — 장기출국과 자격 유지
- `066` when-your-korean-visa-expires — 만료가 은행·통신·임대차에 미치는 영향
- `067` business-registration-vs-permission-to-work — 사업자등록≠취업허가
- `068` overstay-and-immigration-penalties — 체류초과·연장지연 리스크
- `069` apostille-and-legalization-for-korean-immigration — 아포스티유·번역·공증
- `070` resident-vs-non-resident-in-korea — **거주자 개념 허브** (074·103 이 참조)

---

# P3 · 071–101 — Taxes ★신설 (`/taxes/`)

## 거주자 판정·소득 구분
- `071` korean-income-tax-for-foreign-sole-proprietors — 외국인 개인사업자 종소세
- `072` korean-year-end-tax-settlement-for-foreigners — 외국인 연말정산 (필러)
- `073` korea-19-percent-flat-tax-for-foreign-workers — 단일세율 선택 실무
- `074` tax-resident-vs-non-resident-in-korea — 세법상 거주자 판정 (070 참조)
- `075` korean-source-vs-foreign-source-income — 국내·국외원천 과세 구조
- `076` foreign-tax-credit-in-korea — 외국납부세액공제
- `077` overseas-financial-account-reporting-korea — 해외금융계좌 신고의무
- `078` may-global-income-tax-filing-for-foreigners — 5월 종합소득세 신고

## 원천징수
- `079` getting-a-refund-on-3-3-withholding — 3.3% 환급·추가납부
- `080` payroll-withholding-tax-for-foreign-employees — 근로소득 원천징수
- `081` withholding-tax-for-freelancers-korea — 사업소득 원천징수

## 경비·증빙
- `082` business-expense-deductions-in-korea — 필요경비 인정 기준
- `083` standard-vs-simplified-expense-ratios — 기준경비율·단순경비율
- `084` [예약 PM 09-05] registering-a-business-card-on-hometax — 사업용 신용카드 등록 · ↔ korean-vat-for-small-business-owners · **원고 완료**
- `085` electronic-tax-invoice-rules-korea — 전자세금계산서 의무
- `086` cash-receipt-rules-for-korean-businesses — 현금영수증 의무발행·가산세

## 부가세 심화
- `087` zero-rated-vat-for-exports-korea — 수출·국외용역 영세율
- `088` vat-on-cross-border-and-digital-services — 해외용역·디지털서비스
- `089` vat-refunds-on-startup-investment — 인테리어·설비 매입세액 환급
- `090` switching-from-simplified-to-general-vat — 일반과세 전환
- `091` vat-on-commercial-property-rent — 상가 임대료·보증금 부가세
- `092` tax-invoices-for-commercial-lease — 사업장 임대료 세금계산서

## 법인·임원
- `093` korean-corporate-income-tax — 법인세 세율·과세표준
- `094` corporate-local-income-tax-korea — 법인지방소득세
- `095` dividends-paid-to-foreign-shareholders — 외국인 주주 배당 원천징수
- `096` salary-vs-bonus-for-foreign-directors — 대표이사 급여·상여 세무
- `097` severance-income-tax-in-korea — 퇴직소득세

## 부동산 세금
- `098` capital-gains-tax-when-foreigners-sell-property — 양도소득세
- `099` acquisition-tax-for-foreign-property-buyers — 취득세 (147 은 현금흐름 담당)
- `100` property-tax-and-comprehensive-real-estate-tax — 재산세·종부세
- `101` getting-korean-tax-certificates-on-hometax — 소득금액증명·납세증명 발급

---

# P4 · 102–120 — Banking 확장 (`/banking/`)

- `102` opening-a-bank-account-before-your-arc-arrives — ARC 이전 여권 계좌
- `103` resident-vs-non-resident-bank-accounts — 계좌 상품 차이 (070 참조)
- `104` setting-up-a-salary-account-in-korea — 급여통장 세팅
- `105` [예약 PM 09-03] foreign-currency-accounts-in-korea — 예치(보유) 전용 · 송금은 범위 밖 · ↔ best-korean-banks-for-foreigners-compared · **원고 완료**
- `106` designated-foreign-exchange-bank-explained — 지정거래외국환은행
- `107` sending-large-amounts-of-money-overseas — 고액송금 증빙·심사
- `108` proving-source-of-funds-for-transfers — 자금출처 증빙
- `109` korean-bank-vs-fintech-remittance-apps — 실질 비용 비교
- `110` exchange-rates-spreads-and-preferential-fx — 환율우대 90%의 실제 의미
- `111` getting-your-first-korean-credit-card — 첫 신용카드 로드맵
- `112` [예약 PM 09-06] postpaid-transportation-cards-for-foreigners — 후불교통 심사·결제 · ↔ korean-check-card-vs-credit-card-for-foreigners
- `113` online-banking-otp-and-digital-certificates — 공동·금융인증·OTP
- `114` foreign-name-matching-problems-in-korean-banking — 영문명 불일치
- `115` when-your-korean-bank-account-is-frozen — 지급정지 대응
- `116` voice-phishing-and-account-fraud-korea — 대포통장 연루 예방
- `117` business-bank-accounts-for-sole-proprietors — 사업용계좌
- `118` corporate-bank-accounts-for-foreign-companies — 법인계좌 AML
- `119` joint-bank-accounts-in-korea — 공동명의와 대체 구조
- `120` keeping-or-closing-a-korean-account-after-leaving — 출국 후 유지·해지

---

# P5 · 121–142 — Loans & Credit 확장 (`/loans/`)

## 소득·심사 (충돌 1 반영 — 비자별 4편 → 상황별로 대체)
- `121` salary-loans-for-foreign-employees-korea — 급여소득 신용대출 **허브**, 비자는 표로
- `122` top-reasons-foreigner-loans-get-rejected — 거절 사유 상위 7가지 *(대체)*
- `123` loans-using-spouse-income-korea — 배우자 소득 합산 *(대체)*
- `124` credit-options-for-new-arrivals-korea — 신용정보 없는 신규 입국자 *(대체)*
- `125` loan-brokers-and-fees-in-korea — 대출중개 수수료·사기 *(대체)*
- `126` loans-for-d-2-students-and-e-9-workers — 유학생·E-9 실제 상품
- `127` what-income-do-korean-banks-recognize — 인정소득과 증빙
- `128` can-overseas-income-count-for-a-korean-loan — 해외소득 인정
- `129` visa-expiry-vs-loan-maturity — 잔여 체류기간과 만기

## 부채·상품
- `130` which-debts-count-toward-dsr — DSR 포함·제외 부채
- `131` credit-card-loans-and-cash-advances — 카드론·현금서비스
- `132` korean-overdraft-accounts-explained — 마이너스통장
- `133` refinancing-a-loan-in-korea — 대환·갈아타기
- `134` requesting-a-lower-interest-rate — 금리인하요구권
- `135` early-repayment-fees-explained — 중도상환수수료 2025 개편

## 주택금융
- `136` how-banks-value-a-home-for-mortgage — KB시세·감정가·담보평가
- `137` regulated-vs-non-regulated-mortgage-limits — 지역별 LTV
- `138` when-your-jeonse-loan-guarantee-is-refused — 보증 거절 시 대안 *(대체, 충돌 2)*
- `139` why-foreigner-jeonse-loans-get-rejected — 전세대출 거절 사유
- `140` korean-policy-loans-can-foreigners-qualify — 정책서민금융 대상 여부

## 사업자·회생
- `141` loans-for-foreign-sole-proprietors — 사업자대출
- `142` debt-adjustment-and-rehabilitation-for-foreigners — 채무조정이 체류에 미치는 영향

---

# P6 · 143–169 — Housing & Living (`/cost-of-living/`)

## 매수 절차
- `143` buying-an-apartment-in-korea-as-a-foreigner — 매수 전체 절차 (필러)
- `144` foreign-real-estate-transaction-reporting — 제3조·제8조 신고 구분
- `145` bringing-overseas-money-to-buy-korean-property — 해외자금 취득
- `146` property-ownership-registration-for-foreigners — 소유권이전등기
- `147` [예약 PM 09-04] closing-costs-when-buying-property-in-korea — 등기까지 필요한 현금 총액 · ↔ korean-mortgage-for-foreigners · **원고 완료**
- `148` korean-real-estate-agent-fees-explained — 중개보수 계산

## 물건 검증
- `149` how-to-read-a-korean-property-registry — 등기부 갑구·을구
- `150` checking-mortgages-liens-and-seizures — 근저당·압류·가압류
- `151` apartment-vs-officetel-for-foreign-buyers — 매수 비교
- `152` residential-vs-business-officetels — 주거용·업무용 세금 차이
- `153` buying-a-villa-in-korea-risks — 빌라·다세대 리스크
- `154` buying-a-presale-apartment-in-korea — 신축·분양권
- `155` korean-housing-subscription-for-foreigners — 청약 가능 구조

## 임대차
- `156` jeonse-contract-checklist-for-foreigners — 전세계약 체크리스트
- `157` wolse-contract-checklist-for-foreigners — 월세계약 체크리스트
- `158` korea-lease-renewal-right-explained — 계약갱신요구권
- `159` korea-5-percent-rent-increase-rule — 임대료 증액 제한
- `160` move-in-registration-and-fixed-date — 전입·확정일자
- `161` hug-deposit-guarantee-application-guide — HUG 가입·거절 사유
- `162` hug-vs-hf-vs-sgi-deposit-guarantees — **보증기관 비교 통합본** (충돌 2)
- `163` when-a-landlord-does-not-return-your-deposit — 지급명령·소송
- `164` ending-a-lease-and-moving-out — 해지·중도퇴거·정산
- `165` what-happens-if-your-landlord-sells — 임대기간 중 소유자 변경

## 법인·생활
- `166` corporate-housing-for-foreign-executives — 사택 임대차
- `167` company-lease-vs-personal-lease — 법인명의 vs 개인명의
- `168` [예약 PM 09-02] apartment-management-offices-explained — 공동주택관리법 vs 집합건물법 · ↔ utilities-and-maintenance-fees-korea · **원고 완료**
- `169` moving-home-in-korea-settlement-checklist — 이사 종합정산

---

# P7 · 170–191 — Business (`/business/`)

- `170` setting-up-a-foreign-owned-corporation-in-korea — 외투법인 설립 (필러)
- `171` fdi-notification-vs-business-registration — 외국인투자신고 vs 사업자등록
- `172` foreign-invested-company-registration — 외투기업 등록 절차
- `173` benefits-and-limits-of-fie-status — 외투기업 지위의 실제 효과
- `174` starting-a-sole-proprietorship-on-a-d-9-visa — D-9 개인사업 구조
- `175` sole-proprietor-registration-documents — 개인사업자 등록서류
- `176` korean-incorporation-documents-for-foreigners — 법인설립 필요서류
- `177` korean-company-types-compared — 주식회사·유한회사·유한책임회사
- `178` capital-and-share-structure-for-foreign-founders — 자본금·지분율 설계
- `179` foreign-director-and-ceo-registration — 대표이사·사내이사 등기
- `180` office-address-and-virtual-office-rules — 사업장·비상주사무실
- `181` corporate-seal-and-certificates-korea — 법인인감·등기사항증명
- `182` corporate-credit-cards-for-foreign-executives — 법인카드 발급
- `183` bookkeeping-setup-for-a-korean-business — 장부·계정과목
- `184` choosing-a-korean-tax-accountant — 세무사 기장계약
- `185` e-commerce-business-registration-korea — 온라인 쇼핑몰 등록
- `186` mail-order-sales-registration-korea — 통신판매업 신고
- `187` restaurant-and-food-business-licensing — 음식점 영업신고·허가
- `188` import-and-export-business-setup-korea — 통관고유부호·무역업
- `189` employing-foreign-workers-in-your-company — 외투기업의 외국인 채용
- `190` business-loans-for-foreign-owned-companies — 기업대출·보증 심사
- `191` closing-a-business-in-korea — 폐업·해산·청산

---

# P8 · 192–210 — Employment & HR ★신설 (`/employment/`)

- `192` korean-employment-contracts-for-foreign-workers — 근로계약서 작성
- `193` korean-payroll-and-payslip-rules — 임금명세서 실무
- `194` korean-minimum-wage-explained — 최저임금·수습 감액
- `195` working-hours-and-overtime-pay-korea — 연장·야간·휴일근로
- `196` weekly-holiday-pay-korea — 주휴수당 산정
- `197` annual-paid-leave-in-korea — 연차유급휴가 계산
- `198` korean-severance-pay-explained — 퇴직금 발생요건·계산
- `199` probation-period-rules-korea — 수습기간·최저임금·해고
- `200` dismissal-and-30-day-notice-korea — 해고 제한과 해고예고
- `201` workplaces-with-fewer-than-five-employees — 5인 미만 적용 범위
- `202` [예약 PM 09-01] registering-employees-for-four-insurances — 4대보험 취득신고 · ↔ hiring-your-first-employee-in-korea · **원고 완료**
- `203` national-pension-rules-for-foreign-employees — 국적별 가입 (사업주 관점)
- `204` nhis-workplace-enrollment-korea — 직장 건강보험
- `205` employment-insurance-for-foreign-workers — 체류자격별 고용보험
- `206` industrial-accident-insurance-for-foreign-workers — 산재보험 적용
- `207` payroll-tax-and-withholding-setup — 급여 원천징수·지방소득세
- `208` employee-resignation-and-offboarding — 퇴사자 정산
- `209` changing-workplaces-as-a-foreign-worker — 근무처 변경과 출입국 신고
- `210` employer-immigration-compliance-korea — 고용 회사의 행정 의무

---

# P9 · 211–225 — Insurance & Social Security (`/insurance/`)

- `211` korean-national-pension-for-foreigners — 가입 구조 (근로자 관점)
- `212` national-pension-lump-sum-refund — **반환일시금 통합본** (충돌 3)
- `213` koreas-social-security-agreements — 사회보장협정·가입기간 합산
- `214` adding-dependents-to-korean-nhis — 피부양자 등록
- `215` workplace-vs-regional-nhis — 직장·지역 보험료 비교
- `216` nhis-arrears-and-visa-renewal — 체납과 체류연장
- `217` nhis-vs-private-health-insurance — 국민건강보험과 민간보험의 역할
- `218` life-insurance-for-foreigners-in-korea — 사망·종신보험 가입
- `219` cancer-and-critical-illness-insurance-korea — 진단비 보험
- `220` travel-insurance-for-foreign-residents — 장기체류자의 여행보험
- `221` home-and-renter-insurance-korea — 주택화재·임차인 보험
- `222` personal-liability-insurance-korea — 일상생활배상책임
- `223` filing-a-korean-car-insurance-claim — 사고접수·보상절차
- `224` traffic-accident-injury-and-settlement — 치료·합의·보험처리
- `225` cancelling-insurance-when-leaving-korea — 출국 시 해지·환급

---

# P10 · 226–240 — Cars & Mobility 확장 (`/cars/`)

- `226` buying-a-new-car-in-korea-as-a-foreigner — 신차 구매 절차
- `227` vehicle-registration-in-korea — 신규·이전등록
- `228` vehicle-registration-documents-for-foreigners — 등록 필요서류
- `229` why-foreigners-get-rejected-for-auto-finance — 자동차금융 거절 사유
- `230` how-down-payments-affect-auto-loan-approval — 선수금 효과
- `231` used-car-dealer-financing-what-to-watch — 딜러 금융 비용
- `232` checking-vehicle-liens-and-encumbrances — 저당권·압류 조회
- `233` korean-vehicle-inspection-schedule — 정기·종합검사
- `234` traffic-fines-and-e-fine-in-korea — 범칙금·과태료 조회·납부
- `235` hi-pass-and-korean-toll-roads — 하이패스·통행료
- `236` parking-in-korea — 거주자우선·공영·민영
- `237` what-to-do-after-a-car-accident-in-korea — 현장 대응
- `238` car-repairs-and-insurance-claims-korea — 정비소·보험수리
- `239` international-driving-permits-in-korea — IDP 사용기간·조건
- `240` leaving-korea-with-a-financed-or-leased-car — 할부·리스 정리

---

# P11 · 241–255 — Leaving Korea ★신설 (`/exit/`)

- `241` leaving-korea-financial-clearance-checklist — 출국 전 금융 정리 (필러, 250 흡수)
- `242` what-happens-when-your-arc-expires — ARC 만료 전후
- `243` keeping-korean-bank-accounts-after-departure — 출국 후 계좌 유지
- `244` sending-your-korean-savings-overseas — 예금 해외송금
- `245` sending-property-sale-proceeds-abroad — 매각대금 반출
- `246` closing-your-business-before-leaving-korea — 출국 전 폐업
- `247` final-korean-tax-filing-before-departure — 출국 전 세금 신고
- `248` appointing-a-korean-tax-representative — 납세관리인 지정
- `249` receiving-your-pension-refund-overseas — 연금 수령 계좌·환율·세금 *(대체, 충돌 3)*
- `250` retirement-pensions-db-dc-irp-for-foreigners — 퇴직연금 3종 실무 *(대체, 충돌 4)*
- `251` cancelling-nhis-after-departure — 자격상실·보험료 정산
- `252` cancelling-phone-and-utilities-korea — 통신·전기·가스·수도 해지
- `253` recovering-your-rental-deposit-before-departure — 보증금 반환
- `254` early-termination-of-a-car-lease-when-leaving — 리스 중도해지
- `255` korean-loans-and-cards-after-leaving-korea — 대출·카드 정리

---

# P12 · 256–280 — 페르소나 / 검색의도 롱테일

**별도 URL 카테고리를 만들지 않는다.** 각 글은 아래 지정된 홈 카테고리에 둔다.

- `256` first-30-days-in-korea-for-an-e-7-worker — `/visas/`
- `257` first-year-financial-roadmap-for-e-7-workers — `/banking/`
- `258` buying-a-home-in-korea-on-an-e-7-visa — `/loans/`
- `259` changing-jobs-on-e-7-visa-loan-and-credit-impact — `/loans/`
- `260` financial-setup-for-f-2-7-residents — `/banking/`
- `261` buying-property-or-starting-a-business-on-f-2 — `/business/`
- `262` financial-setup-for-f-4-overseas-koreans — `/banking/`
- `263` starting-a-sole-proprietorship-on-f-4 — `/business/`
- `264` mortgage-and-credit-guide-for-f-5-residents — `/loans/`
- `265` financial-guide-for-f-6-marriage-migrants — `/banking/`
- `266` first-90-days-for-a-d-8-founder — `/business/`
- `267` salary-dividends-and-taxes-for-d-8-ceos — `/taxes/`
- `268` financial-setup-for-d-9-traders — `/business/`
- `269` banking-cards-and-phone-setup-for-d-2-students — `/banking/`
- `270` from-d-2-student-to-d-10-and-e-7 — `/visas/`
- `271` money-guide-for-e-9-foreign-workers — `/banking/`
- `272` money-guide-for-h-2-workers — `/banking/`
- `273` financial-and-tax-guide-for-foreign-freelancers — `/taxes/`
- `274` overseas-income-while-living-in-korea — `/taxes/`
- `275` korea-digital-nomad-visa-banking-and-tax — `/visas/`
- `276` financial-setup-for-foreign-executives-in-korea — `/employment/`
- `277` moving-to-korea-with-a-family — `/cost-of-living/`
- `278` marrying-a-korean-money-property-and-tax — `/taxes/`
- `279` buying-korean-property-while-living-overseas — `/loans/`
- `280` leaving-korea-permanently-complete-exit-guide — `/exit/`
