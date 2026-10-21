/* Builds the NON-PERMANENT STAFF REGISTRATION FORM PDF.
   --------------------------------------------------------------------------
   The supplied paper form (assets/images/forms/staff-registration-form.png)
   is used as the page background so borders, branding, spacing and typography
   match the original exactly. Entered values are overlaid at measured field
   coordinates, and the Section 5 declaration line receives the applicant's
   uppercase full name.

   Layout maths (form PNG is 996 x 1578 px):
     - page: A4 portrait (595.28 x 841.89 pt)
     - the PNG is scaled to full page height and centred horizontally
     - pxToPt(px) = px * (841.89 / 1578)
*/

const FORM_IMAGE = "assets/images/forms/staff-registration-form.png";
const PNG_W = 996;
const PNG_H = 1578;

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const SCALE = PAGE_H / PNG_H;
const IMG_W = PNG_W * SCALE;
const X0 = (PAGE_W - IMG_W) / 2;

const VALUE_PAD = 13; // px — padding to the right of each section's divider
const VALUE_MAX_X = 908; // px — right padding inside the box
const BASELINE_OFFSET = 6; // px — moves the baseline to the optical centre of a row
const FONT_SIZE = 9.4; // pt — matches the original label scale

/* Label/value divider (px) measured per section of the original form PNG. */
const DIVIDERS = {
  s1: 277.5,
  s2: 283.5,
  s3: 290.5,
  s4: 328.5,
};

/* Row centres measured from the original form PNG (px). */
const FIELDS = [
  { key: "surname", y: 334.5, div: "s1" },
  { key: "firstName", y: 374.5, div: "s1" },
  { key: "otherNames", y: 411, div: "s1" },
  { key: "dateOfBirth", y: 448, div: "s1" },
  { key: "gender", y: 485, div: "s1" },
  { key: "nationality", y: 522.5, div: "s1" },
  { key: "homeTown", y: 560, div: "s1" },
  { key: "profession", y: 600, div: "s1" },
  { key: "phoneNumber", y: 689, div: "s2" },
  { key: "staffId", y: 731.5, div: "s2" },
  { key: "ssnitNumber", y: 771.5, div: "s2" },
  { key: "ghanaCardNo", y: 812.5, div: "s2" },
  { key: "residentialAddress", y: 917.5, div: "s3", wrap: true },
  { key: "spouseName", y: 975.5, div: "s3" },
  { key: "fathersName", y: 1014.5, div: "s3" },
  { key: "mothersName", y: 1056, div: "s3" },
  { key: "nextOfKin", y: 1145, div: "s4" },
  { key: "nextOfKinContact", y: 1185, div: "s4" },
  { key: "emergencyContactPerson", y: 1222, div: "s4" },
  { key: "emergencyContactPhone", y: 1258, div: "s4" },
];

/* Declaration dotted-line band (px). */
const DECLARATION = {
  coverFromX: 100,
  textX: 105,
  textBaseline: 1350,
  coverTop: 1333,
  coverBottom: 1354,
  maxWidthX: 908,
};

const pxX = (px) => X0 + px * SCALE;
const pxY = (py) => py * SCALE;

function loadFormImage() {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("The registration form image could not be loaded."));
    img.src = FORM_IMAGE;
  });
}

function fitText(doc, text, maxWidth, startSize, minSize) {
  let size = startSize;
  doc.setFontSize(size);
  while (doc.getTextWidth(text) > maxWidth && size > minSize) {
    size -= 0.25;
    doc.setFontSize(size);
  }
  return size;
}

function wrapText(doc, text, maxWidth, startSize, minSize, maxLines) {
  let size = startSize;
  doc.setFontSize(size);
  let lines = doc.splitTextToSize(text, maxWidth);
  while (lines.length > maxLines && size > minSize) {
    size -= 0.25;
    doc.setFontSize(size);
    lines = doc.splitTextToSize(text, maxWidth);
  }
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const last = lines[maxLines - 1];
    lines[maxLines - 1] = `${last.slice(0, Math.max(0, last.length - 1))}…`;
  }
  return { lines, size };
}

export function buildRegistrationPdf(values) {
  return loadFormImage().then((formImage) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

    doc.addImage(formImage, "PNG", X0, 0, IMG_W, PAGE_H, undefined, "FAST");
    doc.setTextColor(22, 24, 34);
    doc.setFont("helvetica", "normal");

    FIELDS.forEach((field) => {
      const raw = (values[field.key] || "").trim();
      if (!raw) return;

      const valueX = DIVIDERS[field.div] + VALUE_PAD;
      const maxWidth = (VALUE_MAX_X - valueX) * SCALE;
      const x = pxX(valueX);
      const baseline = pxY(field.y + BASELINE_OFFSET);

      if (field.wrap) {
        const { lines, size } = wrapText(doc, raw, maxWidth, FONT_SIZE, 6.5, 2);
        doc.setFontSize(size);
        lines.forEach((line, index) => {
          doc.text(line, x, baseline - (lines.length - 1 - index) * (size * 1.18));
        });
      } else {
        fitText(doc, raw, maxWidth, FONT_SIZE, 6.5);
        doc.text(raw, x, baseline);
        doc.setFontSize(FONT_SIZE);
      }
    });

    /* Section 5 — dynamic uppercase declaration on the dotted line. */
    const fullName = [values.surname, values.firstName, values.otherNames]
      .map((part) => (part || "").trim())
      .filter(Boolean)
      .join(" ")
      .toUpperCase();

    if (fullName) {
      const rectX = pxX(DECLARATION.coverFromX);
      const rectY = pxY(DECLARATION.coverTop);
      const rectW = pxX(DECLARATION.maxWidthX) - rectX;
      const rectH = pxY(DECLARATION.coverBottom) - rectY;

      doc.setFillColor(249, 252, 250);
      doc.rect(rectX, rectY, rectW, rectH, "F");

      const maxWidth = pxX(DECLARATION.maxWidthX) - pxX(DECLARATION.textX);
      fitText(doc, fullName, maxWidth, FONT_SIZE, 5.5);
      doc.text(fullName, pxX(DECLARATION.textX), pxY(DECLARATION.textBaseline));
      doc.setFontSize(FONT_SIZE);
    }

    return doc;
  });
}

export function registrationPdfFilename(values) {
  const parts = [values.surname, values.firstName, values.otherNames]
    .map((part) => (part || "").trim().toUpperCase())
    .filter(Boolean);
  const base = parts.length ? parts.join(" ") : "APPLICANT";
  const cleaned = base
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return `${cleaned || "APPLICANT"}'s STAFF REGISTRATION FORM.pdf`;
}
