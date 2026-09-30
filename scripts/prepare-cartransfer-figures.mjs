/**
 * The Car365 transfer-registration (이전등록) captures.
 *
 * Two things here need masking, and neither is optional:
 *
 *   - 09 shows the real-name step with the FRONT SIX DIGITS of a resident
 *     registration number still readable. The portal dots out the back half,
 *     which is exactly the trap the site's masking rule was written for: two
 *     partial masks of the same identifier compose back into the whole. The
 *     front six are a date of birth on their own, so they go under a box.
 *   - 02 was captured in a logged-in session and carries the account holder's
 *     name in the header. The frame is drawn to exclude it, and a mask sits
 *     over it as well so a later re-crop cannot reintroduce it.
 *
 * Everything else is public guidance text on 자동차365, shown before any
 * applicant data is entered.
 *
 * Markers follow the same convention as the residence-registration figures:
 * a red numbered circle in a gutter added BESIDE the capture, never on it.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = '/tmp/cartx/';
const OUT = 'src/assets/entry/';
mkdirSync(OUT, { recursive: true });

const marker = (n, size) =>
  Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="#c1121f"/>` +
      `<text x="50%" y="50%" dy="0.35em" text-anchor="middle" fill="#fff" ` +
      `font-family="DejaVu Sans, Arial, sans-serif" font-size="${size * 0.62}" ` +
      `font-weight="bold">${n}</text></svg>`,
  );

/** A flat redaction block, drawn on the ORIGINAL before any crop. */
const box = (w, h) =>
  Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="${w}" height="${h}" fill="#3a3a3a"/></svg>`,
  );

const JOBS = [
  // The five named steps. Small, already tight, and the only figure that shows
  // the shape of the whole filing in one line.
  {
    src: '08_transfer_five_step_flow.png',
    out: 'cartx-1-five-steps.png',
    frame: [0, 0.08, 1, 1],
  },
  // The popup that answers "who actually files this". Framed to exclude the
  // logged-in account name in the header, and masked there as well.
  {
    src: '02_buyer_files_seller_econsent_popup.png',
    out: 'cartx-2-buyer-files.png',
    masks: [[0.755, 0.145, 0.825, 0.19]],
    frame: [0.318, 0.405, 0.805, 0.715],
  },
  // The dense 신청시 주의사항 block. Two lines in it decide the whole article,
  // so they are the only ones marked.
  {
    src: '03_transfer_precautions_deadlines_fees_foreigner_account.png',
    out: 'cartx-3-precautions.png',
    frame: [0.13, 0.05, 0.87, 0.81],
    markers: [
      // 외국인인 경우 채권 주소지 은행 계좌정보가 있어야만 가상계좌 발급이 가능
      [1, 0.8],
      // 이전등록 기간 + 50만원 이하의 범칙금
      [2, 0.885],
    ],
  },
  // The real-name step, with the foreigner selector open. Masked.
  {
    src: '09_nonmember_foreigner_registration_number_dropdown.png',
    out: 'cartx-4-foreigner-selector.png',
    masks: [[0.233, 0.383, 0.295, 0.435]],
    frame: [0.035, 0.07, 0.91, 0.79],
  },
  // 자동차양도증명서 terms. Article 7 is the one that reaches into the loan
  // guide, so it carries the marker.
  {
    src: '05_direct_sale_transfer_certificate_rules.png',
    out: 'cartx-5-transfer-certificate.png',
    frame: [0.06, 0.015, 0.89, 0.62],
    markers: [[1, 0.645]],
  },
];

for (const j of JOBS) {
  const m = await sharp(SRC + j.src).metadata();

  let base = sharp(SRC + j.src);
  if (j.masks) {
    base = sharp(
      await base
        .composite(
          j.masks.map(([ml, mt, mr, mb]) => {
            const w = Math.round(m.width * (mr - ml));
            const h = Math.round(m.height * (mb - mt));
            return { input: box(w, h), left: Math.round(m.width * ml), top: Math.round(m.height * mt) };
          }),
        )
        .png()
        .toBuffer(),
    );
  }

  const [fl, ft, fr, fb] = j.frame ?? [0, 0, 1, 1];
  const left = Math.round(m.width * fl);
  const top = Math.round(m.height * ft);
  const width = Math.round(m.width * fr) - left;
  const height = Math.round(m.height * fb) - top;
  let buf = await base.extract({ left, top, width, height }).png().toBuffer();

  if (j.markers) {
    const size = Math.max(18, Math.round(width * 0.035));
    const gutter = Math.round(size * 1.6);
    buf = await sharp({
      create: { width: width + gutter, height, channels: 3, background: '#ffffff' },
    })
      .composite([
        { input: buf, left: gutter, top: 0 },
        ...j.markers.map(([n, fy]) => ({
          input: marker(n, size),
          left: Math.round((gutter - size) / 2),
          top: Math.round(height * fy - size / 2),
        })),
      ])
      .png()
      .toBuffer();
  }

  await sharp(buf)
    .resize({ width: Math.min(1200, (await sharp(buf).metadata()).width), withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(OUT + j.out);
  const o = await sharp(OUT + j.out).metadata();
  console.log(j.out.padEnd(34) + `${m.width}x${m.height} → ${o.width}x${o.height}  ${(o.size / 1024).toFixed(0)}KB`);
}
