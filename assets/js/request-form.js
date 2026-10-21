/* Labour request form: validation, category-dependent roles, submission states. */
import { REQUEST_ROLES } from "./data.js";
import { getConfig, submitLabourRequest } from "./api.js";

const form = document.getElementById("labour-request-form");
if (form) {
  const submitBtn = document.getElementById("submit-btn");
  const statusBox = document.getElementById("form-status");
  const modeBanner = document.getElementById("mode-banner");
  const roleSelect = document.getElementById("role");
  const detailsField = document.getElementById("details");
  const companyInput = document.getElementById("company-name");
  const notBusiness = document.getElementById("not-business");

  let attempted = false;
  let inFlight = false;

  /* ----- mode banner ----- */
  if (getConfig().mockMode && modeBanner) {
    modeBanner.hidden = false;
  }

  /* ----- helpers ----- */
  const setError = (field, message) => {
    const errorEl = document.getElementById(`${field.id}-error`);
    if (message) {
      field.setAttribute("aria-invalid", "true");
      if (errorEl) errorEl.textContent = message;
      return false;
    }
    field.removeAttribute("aria-invalid");
    if (errorEl) errorEl.textContent = "";
    return true;
  };

  const validateName = () => {
    const value = form.full_name.value.trim();
    return setError(form.full_name, value.length < 2 ? "Please enter the requester's full name." : "");
  };

  const validateCompany = () => {
    return setError(companyInput, "");
  };

  const validateEmail = () => {
    const value = form.email.value.trim();
    if (!value) return setError(form.email, "An email address is required.");
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    return setError(form.email, ok ? "" : "Please enter a valid email address, e.g. name@company.com.");
  };

  const validatePhone = () => {
    const value = form.phone.value.trim();
    if (!value) return setError(form.phone, "A phone number is required so GLCL can call you back.");
    if (!/^[+\d][\d\s()\-.]{5,}$/.test(value)) {
      return setError(form.phone, "Please enter a phone number using digits, spaces or + ( ) -.");
    }
    const digits = value.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) {
      return setError(form.phone, "That phone number looks the wrong length — please check it.");
    }
    return setError(form.phone, "");
  };

  const validateCategory = () => {
    const checked = form.querySelector('input[name="labour_category"]:checked');
    const errorEl = document.getElementById("category-error");
    if (errorEl) errorEl.textContent = checked ? "" : "Please choose a labour category.";
    return Boolean(checked);
  };

  const validateRole = () => {
    const value = roleSelect.value;
    return setError(roleSelect, value ? "" : "Please choose a role or gang.");
  };

  const validateDetails = () => {
    const needsDetails = /describe/i.test(roleSelect.value);
    const value = detailsField.value.trim();
    return setError(
      detailsField,
      needsDetails && !value ? "Please describe the request so GLCL understands what is needed." : ""
    );
  };

  const runValidation = () => {
    const results = [
      validateName(),
      validateCompany(),
      validateEmail(),
      validatePhone(),
      validateCategory(),
      validateRole(),
      validateDetails(),
    ];
    return results.every(Boolean);
  };

  /* ----- role dropdown dependent on category ----- */
  const refreshRoles = () => {
    const checked = form.querySelector('input[name="labour_category"]:checked');
    const previous = roleSelect.value;
    const options = ['<option value="">Select a role or gang</option>'];

    if (checked) {
      REQUEST_ROLES[checked.value].forEach((role) => {
        options.push(`<option value="${role}">${role}</option>`);
      });
    } else {
      options[0] = '<option value="">Choose a labour category first</option>';
    }

    roleSelect.innerHTML = options.join("");
    if (Array.from(roleSelect.options).some((option) => option.value === previous)) {
      roleSelect.value = previous;
    }
    if (attempted) validateRole();
  };

  form.querySelectorAll('input[name="labour_category"]').forEach((input) => {
    input.addEventListener("change", refreshRoles);
  });

  /* ----- "not a business" ----- */
  notBusiness.addEventListener("change", () => {
    if (notBusiness.checked) {
      companyInput.value = "";
      setError(companyInput, "");
      companyInput.disabled = true;
    } else {
      companyInput.disabled = false;
    }
  });

  /* ----- blur validation after first attempt ----- */
  const lazyFields = [form.full_name, form.email, form.phone, roleSelect, detailsField];
  lazyFields.forEach((field) => {
    field.addEventListener("blur", () => {
      if (!attempted) return;
      if (field === form.full_name) validateName();
      if (field === form.email) validateEmail();
      if (field === form.phone) validatePhone();
      if (field === roleSelect) validateRole();
      if (field === detailsField) validateDetails();
    });
  });

  /* ----- submit ----- */
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (inFlight) return;

    attempted = true;
    statusBox.innerHTML = "";

    if (!runValidation()) {
      statusBox.innerHTML =
        '<div class="alert alert--error"><div><h3>Check the highlighted fields</h3><p>A few details need fixing before this request can be sent.</p></div></div>';
      const firstInvalid = form.querySelector('[aria-invalid="true"], input[name="labour_category"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const category = form.querySelector('input[name="labour_category"]:checked').value;
    const payload = {
      requesterFullName: form.full_name.value.trim(),
      companyName: notBusiness.checked ? null : companyInput.value.trim() || null,
      notBusiness: notBusiness.checked,
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      labourCategory: category,
      role: roleSelect.value,
      details: detailsField.value.trim(),
      source: "getlabour.org/request.html",
      submittedAt: new Date().toISOString(),
    };

    inFlight = true;
    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="btn__spinner" aria-hidden="true"></span> Sending…';

    try {
      const result = await submitLabourRequest(payload);
      if (result.mock) {
        statusBox.innerHTML =
          '<div class="alert alert--info"><div><h3>Demo mode — nothing was sent</h3><p>Your request was validated in the browser but <strong>not transmitted</strong>, because this site is not yet connected to a backend. Connect the API (see the project README), then re-test. In live mode, GLCL reviews each request and aims to respond within 24–48 hours.</p></div></div>';
      } else {
        statusBox.innerHTML =
          '<div class="alert alert--success"><div><h3>Request received</h3><p>Thank you. GLCL will review your request and aims to respond within 24–48 hours. If your matter is urgent, call +233 303 961 288.</p></div></div>';
        form.reset();
        refreshRoles();
        attempted = false;
        companyInput.disabled = false;
      }
      statusBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (error) {
      const message =
        error && error.status
          ? `The server responded with an error (${error.status}). Your request was not accepted — please try again or call +233 303 961 288.`
          : "The request could not be delivered. Please check your connection and try again, or call +233 303 961 288.";
      statusBox.innerHTML = `<div class="alert alert--error"><div><h3>Request not sent</h3><p>${message}</p></div></div>`;
    } finally {
      inFlight = false;
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });

  refreshRoles();
}
