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
- ✅ ★ korean-limited-accounts-hando-gyejwa-explained — 법정 목적확인 의무·상황별 증빙·신원매칭 (2026-08-23 발행)
- ✅ ★ how-to-send-money-from-korea-abroad — Net Received Amount 산식·환율우대 해설·한도 3층 구조 (2026-08-23 발행)
- ✅ kakaobank-toss-bank-kbank-for-foreigners — 토스 단독 운영 현황·카뱅 4분기/케뱅 9월 계획·외화통장 함정 (2026-08-25 발행, 업데이트형)
- best-korean-banks-for-foreigners-compared — KB/신한/우리/하나 지점·앱·영어지원
- korean-check-card-vs-credit-card-for-foreigners — 체크/신용 발급 조건
- opening-a-bank-account-before-your-arc-arrives — ARC 발급 전 선택지

### Loans (P2)
- ✅ ★ korean-credit-score-for-foreigners-nice-kcb — Thin Filer 프레임·NICE/KCB 비중·속설 교정 (2026-08-23 발행)
- ✅ ★ jeonse-loan-for-foreigners-explained — SGI 보증부 경로·비자표 통념 교정·4중 한도 최솟값 (2026-08-24 발행)
- korean-mortgage-for-foreigners — LTV/DSR + 외국인 주택취득 신고
- ✅ personal-credit-loan-requirements-korea — 저축은행 실상품 근거 비자표 교정·1개월 체류 기준·DSR 기회비용 (2026-08-25 발행)
- ✅ dsr-ltv-korea-lending-rules-explained — 3중 한도 최솟값·스트레스 지역차등·역산 공식 허브 (2026-08-23 발행)
- ✅ savings-banks-and-capital-companies-korea — 저축은행/캐피탈 조달구조 구분·2025 중도상환수수료 개편·감점표 부재 교정·Exit Plan (2026-08-26 발행) — Loans 클러스터 완성
- ✅ p2p-lending-in-korea-explained — 온투업 구조, 차주/투자자 양면, 한도·세제·플랫폼 평가 (2026-08-23 발행)

### Cars (P3)
- ✅ ★ buying-a-used-car-in-korea-as-a-foreigner — 이전등록 체인·취득세·성능기록부/카히스토리·할부 심사 (2026-08-23 발행)
- ✅ car-installment-financing-halbu-korea — 할부 구조·선수금 효과·유예할부 트레이드오프·DSR 예외 이중질문 (2026-08-27 발행)
- ✅ long-term-car-rental-janggi-rent-korea — TCO 프레임·세무 한도 교정·DSR 예외 정밀화 (2026-08-23 발행)
- getting-a-korean-drivers-license-license-exchange — 면허 교환 국가·절차
- car-ownership-taxes-and-costs-korea — 취득세·자동차세·검사
- selling-or-exporting-your-car-when-leaving-korea — 출국 시 처분

### Business (P4)
- ✅ ★ freelancing-in-korea-legally — 3분리 프레임(세법/출입국/근로자성)·경비율·등록 기준 속설 교정 (2026-08-23 발행)
- ✅ ★ d-8-investor-visa-korea-requirements — FDI 자금 연속성·D-8-1 vs D-8-4·60일 등록 (2026-08-23 발행)
- sole-proprietor-vs-corporation-korea — 개인 vs 법인 심화 비교
- korean-vat-for-small-business-owners — 일반/간이, 신고 주기
- hiring-your-first-employee-in-korea — 4대보험·최저임금·근로계약
- hometax-guide-for-foreign-business-owners — 홈택스 영어 화면 기준 신고 방법

### Insurance (P5)
- ✅ ★★ nhis-korean-health-insurance-for-foreigners — 평균보험료 하한·직장전환·체납-비자 연계 (2026-08-23 발행)
- ✅ private-health-insurance-silbi-korea — 인수심사 실무·4세대 차등제·5세대 출시 반영 (2026-08-23 발행)
- travel-insurance-for-visiting-korea — 단기 방문자용
- renters-insurance-korea — 주택화재·임차인배상
- dental-and-vision-costs-korea — NHIS 적용/비적용 경계

### Cost of Living (P6)
- ✅ ★★ jeonse-vs-wolse-korean-rental-system — 보증금=신용공여 프레임, 전환율·회수위험·HUG/HF 구분 (2026-08-23 발행)
- ✅ ★ rental-deposit-protection-korea — 등기부·대항력/확정일자·126% 룰·임차권등기 (2026-08-23 발행) — Phase 1 완료, 15편 도달
- ✅ korean-phone-plans-for-foreigners — 본인인증 인프라 프레임·4대 확인조건·프로모션 24개월 평균 (2026-08-23 발행)
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

## 확장 로드맵 (v1.1 — 2026-08-23 확정)

**운영 리듬**: 원고는 몰아서 받아도 발행은 하루 1편 (draft: true 로 쌓아두고
매일 1편씩 draft 해제 + 그날 날짜로 발행). 작성 리듬과 발행 리듬을 분리한다.

**연간 목표는 편수(500 같은)가 아니라 "이 주제의 영어권 1등 사이트"** — 편수로는
150~200편이면 실재하는 키워드 공간을 거의 덮는다. 신규 발행 여력의 일부는
기존 글 재검증·확장에 쓴다 (금융 수치는 6개월마다 갱신 — YMYL 유지비).

### 수익 우선순위 (RPM 기준)

1. **보험·대출** — 애드센스 RPM 최상위. 가장 깊게 팔 클러스터
2. **송금·환전** — RPM + 제휴 (Wise·WireBarley 등 어필리에이트, 트래픽 확보 후 신청)
3. **자동차·사업** — 중간 RPM, 저경쟁
4. **생활비** — 저RPM이지만 유입 깔때기 입구

### 확장 축 (순서대로)

1. **깊이**: 6개 클러스터 39편 완성 (진행 중)
2. **페르소나 확장** (v2 플랜에서 상세화): 유학생(D-2 아르바이트·송금한도),
   취업비자(E-7·E-9 퇴직금·출국만기보험), 결혼/F비자(가족 금융),
   단기 방문객(환전·트래블카드). 전부 "돈" 주제 유지 + 검색 인구만 확장
3. **계산기 추가**: NHIS 보험료 / 퇴직금 / 전월세 전환율 / 환전수수료 비교
   — 체류시간·재방문·백링크 자산
4. **다국어**: 애드센스 승인 + 트래픽 검증 후 (한 언어씩, 선별 번역)

39편 완성 시점에 GSC 실측 데이터로 페르소나 확장판 콘텐츠 플랜 v2 작성.
이후 3개월마다 데이터 기반으로 클러스터 확대/축소 조정.

## 갱신 정책 (v1.2 — 2026-08-26 확정)

**원칙: 수치를 조용히 덮어쓰지 않는다.** 무엇이 언제 왜 바뀌었는지 기록으로
남긴다. 10년 문서와 3년 뒤 낡는 문서를 가르는 지점.

### 3종 세트 (수치·규정이 바뀌면 반드시 함께)

1. 본문 수정
2. `updatedDate` 갱신
3. `revisions` 항목 추가 — `date` / `change` / `source`(선택)

### 무엇을 기록하는가

- ✅ 금리·한도·세율·요율 변경, 법령/제도 변경, 사실관계 교정
- ❌ 오타, 문장 다듬기, 내부링크 추가 (노이즈 방지 — 기록 안 함)
- 6개월 재검증 후 바뀐 게 없으면 → `updatedDate`만 갱신 (revisions 항목 없음)

### 자동 점검

```bash
npm run audit            # 기한 도래(182일)·임박(152일) 글 목록
npm run audit -- --all   # 전체 글 나이순
npm run audit -- --json  # 스케줄러 연동용
```

각 글의 **재검증할 수치(금액·%·날짜)** 와 **확인할 공식 출처 URL**을 자동
추출한다. **탐지는 자동, 판단·수정은 사람** — 공식 사이트 구조 변경이나
파싱 오류로 틀린 수치가 자동 반영되면 YMYL 사이트에 치명적이므로 완전
자동화하지 않는다.

### 공개 페이지

- 글 하단: `Revision history` (해당 글의 이력, 최신순)
- `/updates/`: 전 사이트 개정 이력 타임라인 (월별, NEW/REVISED 구분)
- 글 상단 `Last verified` 배지 → 클릭 시 해당 글 이력으로 이동

## 새 글 발행 체크리스트

- [ ] title ≤60자, description 50~155자 (`npm run lint:seo`)
- [ ] 모든 수치에 공식 출처 + frontmatter `sources` 등록
- [ ] 필러 ↔ 지원 글 내부링크, 해당되면 계산기 링크
- [ ] FAQ 3개 이상 (FAQPage 스키마 자동 생성)
- [ ] 800단어 이상 (필러는 1,500+)
- [ ] `npm run build` 통과 후 push
