/**
 * The two Car365 captures for the vehicle-registration guide.
 *
 * Nothing to mask: both are the public guidance pages of 자동차365, shown
 * before any applicant data is entered. The frames are trimmed the same way
 * as every other figure here — the page's own left and right gutters, which
 * on this portal are wide enough to shrink the table that is the whole point
 * of the figure.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = '/tmp/carreg/';
const OUT = 'src/assets/entry/';
mkdirSync(OUT, { recursive: true });

const JOBS = [
  // STEP 1: who and what can be registered online. The asterisk column is the
  // whole figure — it is the only place that says foreigners are in scope.
  { src: 'car-161523.png', out: 'carreg-1-who-can-apply-online.png', frame: [0.03, 0.14, 0.98, 1] },
  // STEP 2: the conditions, including insurance-before-application and the
  // virtual-account-only payment rule.
  { src: 'car-161710.png', out: 'carreg-2-conditions.png', frame: [0.04, 0, 0.94, 1] },
  // The non-member route's third step. Shows that an account is not the only
  // way in, and which two authentication methods the portal offers. Nothing
  // on it says whether either works with a foreign registration number, so
  // the guide reports the options and stops there.
  { src: 'car-auth.png', out: 'carreg-3-identity-step.png', frame: [0.07, 0.16, 0.90, 0.62] },
];

for (const j of JOBS) {
  const m = await sharp(SRC + j.src).metadata();
  const [fl, ft, fr, fb] = j.frame;
  const left = Math.round(m.width * fl);
  const top = Math.round(m.height * ft);
  const width = Math.round(m.width * fr) - left;
  const height = Math.round(m.height * fb) - top;
  await sharp(SRC + j.src)
    .extract({ left, top, width, height })
    .resize({ width: Math.min(1200, width), withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(OUT + j.out);
  const o = await sharp(OUT + j.out).metadata();
  console.log(j.out.padEnd(36) + `${m.width}x${m.height} → ${o.width}x${o.height}`);
}
