# ExpatWon 콘텐츠 클러스터 설계 (v1 — 2026-08-23)

검색 유입 전용 사이트이므로 디자인보다 이 문서가 성패를 가른다.
목표: **필러 6편 + 지원 글 33편 = 39편**을 클러스터 단위로 발행.

## 운영 원칙

1. **얇은 SEO 글 금지.** 필러는 1,500~2,500단어, 지원 글은 800~1,500단어.
   800단어 미만 글은 발행하지 않는다 (중간 광고 조건과도 일치).
2. **모든 수치는 공식 출처 링크 필수** (frontmatter `sources`). 출처 없는
   금액·금리·기간은 쓰지 않는다. 연도 명시 ("as of 2026").
3. **클러스터 내부링크**: 지원 글은 반드시 자기 필러로 링크, 필러는 지원 글
   전체로 링크. 계산기가 있는 주제는 계산기로도 링크 (관련 글 5개 자동 노출과 별개로 본문 내 링크).
4. **톤**: "how it works / what it costs". 추천·권유 표현 대신 조건·비용·절차.
5. **발행 순서**: 클러스터를 하나씩 완성한다. 한 클러스터에 필러 + 지원 2~3편이
   모이기 전에 다음 클러스터로 넘어가지 않는다 (topical authority).
6. 발행 후 갱신: 금리·정책 글은 6개월마다 `updatedDate` 재검증.

## Phase 0 — 기존 5편을 필러로 완성 (최우선)

현재 개요 상태인 5편을 각 클러스터의 필러 문서로 완성 + cost-of-living 필러 1편 신규.

| # | 필러 (slug) | 클러스터 | 상태 |
|---|---|---|---|
| P1 | how-to-open-a-bank-account-in-korea-as-a-foreigner | banking | ✅ 2026-08-23 (~3,000w) |
| P2 | can-foreigners-get-a-loan-in-korea | loans | ✅ 2026-08-23 (~2,100w) |
| P3 | car-lease-in-korea-for-foreigners-real-cost | cars | ✅ 2026-08-23 (~2,400w) |
| P4 | registering-a-business-in-korea-as-a-foreigner | business | ✅ 2026-08-23 (~2,200w) |
| P5 | korean-car-insurance-for-expats-explained | insurance | ✅ 2026-08-23 (~2,200w) |
| P6 | managing-money-in-korea-fx-remittance-cards (머니플로우 앵글로 확정) | cost-of-living | ✅ 2026-08-23 (~2,400w) |

**Phase 0 완료 (2026-08-23).** 다음: Phase 1 — 각 클러스터 ★ 지원 글.
P6가 외환·송금·카드 중심이 되었으므로 "실측 생활비 숫자" 글
(cost-of-living-in-korea-real-numbers)은 cost-of-living 지원 글로 이동.

## 클러스터별 지원 글

★ = 검색수요 대비 영어 콘텐츠 공백이 커서 우선 발행.

### Banking (P1)
- ★ korean-limited-accounts-hando-gyejwa-explained — 한도계좌·20일 규칙 (모든 신규 입국자가 부딪히는 문제)
- ✅ ★ how-to-send-money-from-korea-abroad — Net Received Amount 산식·환율우대 해설·한도 3층 구조 (2026-08-23 발행)
- kakaobank-toss-bank-kbank-for-foreigners — 인터넷은행 ARC 요건 비교
- best-korean-banks-for-foreigners-compared — KB/신한/우리/하나 지점·앱·영어지원
- korean-check-card-vs-credit-card-for-foreigners — 체크/신용 발급 조건
- opening-a-bank-account-before-your-arc-arrives — ARC 발급 전 선택지

### Loans (P2)
- ✅ ★ korean-credit-score-for-foreigners-nice-kcb — Thin Filer 프레임·NICE/KCB 비중·속설 교정 (2026-08-23 발행)
- ★ jeonse-loan-for-foreigners-explained — 전세대출 자격·보증기관
- korean-mortgage-for-foreigners — LTV/DSR + 외국인 주택취득 신고
- personal-credit-loan-requirements-korea — 신용대출 소득·재직 요건
- dsr-ltv-korea-lending-rules-explained — 용어·규제 해설 (다른 글이 전부 여기로 링크)
- savings-banks-and-capital-companies-korea — 2금융권의 실제 비용 (경고 톤)
- ✅ p2p-lending-in-korea-explained — 온투업 구조, 차주/투자자 양면, 한도·세제·플랫폼 평가 (2026-08-23 발행)

### Cars (P3)
- ★ buying-a-used-car-in-korea-as-a-foreigner — 이전등록·성능기록부·엔카/KB차차차
- car-installment-financing-halbu-korea — 할부 구조, 리스와 총비용 비교 → 계산기 링크
- long-term-car-rental-janggi-rent-korea — 장기렌트 vs 리스 (허/하/호 번호판)
- getting-a-korean-drivers-license-license-exchange — 면허 교환 국가·절차
- car-ownership-taxes-and-costs-korea — 취득세·자동차세·검사
- selling-or-exporting-your-car-when-leaving-korea — 출국 시 처분

### Business (P4)
- ★ freelancing-in-korea-legally — 3.3% 원천징수, 사업자 없이 일하기의 경계
- ★ d-8-investor-visa-korea-requirements — 투자금 기준·FDI 신고 흐름
- sole-proprietor-vs-corporation-korea — 개인 vs 법인 심화 비교
- korean-vat-for-small-business-owners — 일반/간이, 신고 주기
- hiring-your-first-employee-in-korea — 4대보험·최저임금·근로계약
- hometax-guide-for-foreign-business-owners — 홈택스 영어 화면 기준 신고 방법

### Insurance (P5)
- ✅ ★★ nhis-korean-health-insurance-for-foreigners — 평균보험료 하한·직장전환·체납-비자 연계 (2026-08-23 발행)
- private-health-insurance-silbi-korea — 실비보험 가입 가능 여부·구조
- travel-insurance-for-visiting-korea — 단기 방문자용
- renters-insurance-korea — 주택화재·임차인배상
- dental-and-vision-costs-korea — NHIS 적용/비적용 경계

### Cost of Living (P6)
- ✅ ★★ jeonse-vs-wolse-korean-rental-system — 보증금=신용공여 프레임, 전환율·회수위험·HUG/HF 구분 (2026-08-23 발행)
- ★ rental-deposit-protection-korea — 보증금 보호·전세보증보험 (시의성 높음)
- korean-phone-plans-for-foreigners — 통신 3사 vs 알뜰폰(MVNO)
- utilities-and-maintenance-fees-korea — 공과금·관리비 구조
- seoul-vs-busan-vs-smaller-cities-costs — 도시별 비교 → 생활비 계산기 링크
- monthly-budget-single-expat-seoul — 실계산 예시 → 생활비 계산기 링크

## 발행 로드맵

| 단계 | 내용 | 누적 |
|---|---|---|
| Phase 0 | 필러 6편 완성 (개요→본문) | 6 |
| Phase 1 | 각 클러스터 ★ 글 (9편) | 15 |
| Phase 2 | 나머지 지원 글 1차 (12편) | 27 |
| Phase 3 | 나머지 지원 글 2차 (12편) | 39 |

Phase 1까지(15편)가 애드센스 신청 최소선. 신청은 전 글이 "개요"가 아닌
완성 본문일 때만.

## 새 글 발행 체크리스트

- [ ] title ≤60자, description 50~155자 (`npm run lint:seo`)
- [ ] 모든 수치에 공식 출처 + frontmatter `sources` 등록
- [ ] 필러 ↔ 지원 글 내부링크, 해당되면 계산기 링크
- [ ] FAQ 3개 이상 (FAQPage 스키마 자동 생성)
- [ ] 800단어 이상 (필러는 1,500+)
- [ ] `npm run build` 통과 후 push
