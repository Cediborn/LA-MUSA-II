/* Worker registration: live declaration, validation, PDF generation/download. */
import { buildRegistrationPdf, registrationPdfFilename } from "./pdf.js";

const form = document.getElementById("registration-form");

if (form) {
  const generateBtn = document.getElementById("generate-btn");
  const downloadBtn = document.getElementById("download-btn");
  const statusBox = document.getElementById("form-status");
  const previewBox = document.getElementById("pdf-preview");
  const frame = document.getElementById("pdf-frame");
  const filenameLabel = document.getElementById("pdf-filename-label");
  const downloadLink = document.getElementById("download-link");
  const declarationName = document.getElementById("declaration-name");

  const FIELD_IDS = [
    "surname",
    "firstName",
    "otherNames",
    "dateOfBirth",
    "gender",
    "nationality",
    "homeTown",
    "profession",
    "phoneNumber",
    "staffId",
    "ssnitNumber",
    "ghanaCardNo",
    "residentialAddress",
    "spouseName",
    "fathersName",
    "mothersName",
    "nextOfKin",
    "nextOfKinContact",
    "emergencyContactPerson",
    "emergencyContactPhone",
  ];

  const REQUIRED_IDS = [
    "surname",
    "firstName",
    "dateOfBirth",
    "gender",
    "nationality",
    "phoneNumber",
    "residentialAddress",
    "nextOfKin",
    "nextOfKinContact",
    "emergencyContactPerson",
    "emergencyContactPhone",
  ];

  let attempted = false;
  let generating = false;
  let objectUrl = null;
  let currentFilename = "";

  /* ----- auto-uppercase for typed text ----- */
  form.querySelectorAll('input[type="text"], input[type="tel"]').forEach((input) => {
    input.addEventListener("input", () => {
      const start = input.selectionStart;
      input.value = input.value.toUpperCase();
      if (start !== null && input.type !== "date") {
        try {
          input.setSelectionRange(start, start);
        } catch (err) {
          /* selection not supported on this input type */
        }
      }
    });
  });

  const setFieldError = (input, message) => {
    const errorEl = document.getElementById(`${input.id}-error`);
    if (message) {
      input.setAttribute("aria-invalid", "true");
      if (errorEl) errorEl.textContent = message;
      return false;
    }
    input.removeAttribute("aria-invalid");
    if (errorEl) errorEl.textContent = "";
    return true;
  };

  const validateField = (input) => {
    const value = input.value.trim();
    if (REQUIRED_IDS.includes(input.id) && !value) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      const name = label ? label.textContent.replace("*", "").trim().toLowerCase() : "this field";
      return setFieldError(input, `Please enter ${name}.`);
    }
    if (input.id === "phoneNumber" || input.id === "nextOfKinContact" || input.id === "emergencyContactPhone") {
      if (!value) return setFieldError(input, "");
      if (!/^[+\d][\d\s()\-.]{5,}$/.test(value)) {
        return setFieldError(input, "Use digits, spaces or + ( ) - only.");
      }
      const digits = value.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) {
        return setFieldError(input, "That phone number looks the wrong length.");
      }
    }
    return setFieldError(input, "");
  };

  const validateAll = () => {
    let ok = true;
    FIELD_IDS.forEach((id) => {
      const input = document.getElementById(id);
      if (!validateField(input)) ok = false;
    });
    return ok;
  };

  /* ----- live declaration preview ----- */
  const fullNameOf = () => {
    const parts = ["surname", "firstName", "otherNames"]
      .map((id) => document.getElementById(id).value.trim())
      .filter(Boolean);
    return parts.join(" ").toUpperCase();
  };

  const updateDeclaration = () => {
    const name = fullNameOf();
    declarationName.textContent = name || "……………………………";
  };

  /* ----- stale preview invalidation ----- */
  const clearPreview = () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
    frame.removeAttribute("src");
    previewBox.hidden = true;
    downloadBtn.hidden = true;
    filenameLabel.textContent = "";
    currentFilename = "";
  };

  form.addEventListener("input", (event) => {
    updateDeclaration();
    if (attempted && event.target.id) validateField(event.target);
    if (!previewBox.hidden) {
      clearPreview();
      statusBox.innerHTML =
        '<div class="alert alert--info"><div><p>The form changed — generate the PDF again to refresh the preview.</p></div></div>';
    }
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      FIELD_IDS.forEach((id) => setFieldError(document.getElementById(id), ""));
      attempted = false;
      clearPreview();
      updateDeclaration();
      statusBox.innerHTML = "";
      generateBtn.disabled = false;
    }, 0);
  });

  /* ----- generate ----- */
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (generating) return;

    attempted = true;
    statusBox.innerHTML = "";

    if (!validateAll()) {
      statusBox.innerHTML =
        '<div class="alert alert--error"><div><h3>Check the highlighted fields</h3><p>Some required details are missing or need fixing before the PDF can be generated.</p></div></div>';
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const values = {};
    FIELD_IDS.forEach((id) => {
      values[id] = document.getElementById(id).value.trim();
    });

    /* Date of birth: format for the printed form. */
    if (values.dateOfBirth) {
      const [year, month, day] = values.dateOfBirth.split("-");
      if (year && month && day) values.dateOfBirth = `${day}/${month}/${year}`;
    }

    generating = true;
    generateBtn.disabled = true;
    const originalLabel = generateBtn.textContent;
    generateBtn.innerHTML = '<span class="btn__spinner" aria-hidden="true"></span> Generating…';

    try {
      const doc = await buildRegistrationPdf(values);
      const blob = doc.output("blob");
      clearPreview();
      objectUrl = URL.createObjectURL(blob);
      currentFilename = registrationPdfFilename(values);

      frame.src = `${objectUrl}#toolbar=1&view=FitH`;
      previewBox.hidden = false;
      filenameLabel.textContent = currentFilename;
      downloadLink.href = objectUrl;
      downloadLink.setAttribute("download", currentFilename);
      downloadBtn.hidden = false;
      downloadBtn.onclick = () => {
        const anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = currentFilename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      };

      statusBox.innerHTML =
        '<div class="alert alert--success"><div><h3>PDF ready</h3><p>Check the preview below, then download the file and <strong>print TWO copies</strong> — one for your personal records and one to submit at GLCL’s main office on Meridian Road, Tema. Sign and date both copies by hand.</p></div></div>';
      previewBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (error) {
      statusBox.innerHTML =
        '<div class="alert alert--error"><div><h3>Could not generate the PDF</h3><p>The form image or the PDF library failed to load. Refresh the page and try again, or complete a paper form at the GLCL office.</p></div></div>';
    } finally {
      generating = false;
      generateBtn.disabled = false;
      generateBtn.textContent = originalLabel;
    }
  });

  updateDeclaration();
}
