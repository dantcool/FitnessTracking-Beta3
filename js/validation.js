(function () {
	const numberTolerance = 0.0000001;

	function validateNumberField(field) {
		if (!field.value) {
			field.setCustomValidity("");
			return;
		}

		const value = Number(field.value);
		if (Number.isNaN(value)) {
			field.setCustomValidity("Enter a valid number.");
			return;
		}

		const minAttr = field.getAttribute("min");
		if (minAttr !== null && value < Number(minAttr)) {
			field.setCustomValidity(`Value must be at least ${minAttr}.`);
			return;
		}

		const maxAttr = field.getAttribute("max");
		if (maxAttr !== null && value > Number(maxAttr)) {
			field.setCustomValidity(`Value must be ${maxAttr} or less.`);
			return;
		}

		const stepAttr = field.getAttribute("step");
		if (stepAttr && stepAttr !== "any") {
			const step = Number(stepAttr);
			const base = minAttr !== null ? Number(minAttr) : 0;
			const ratio = (value - base) / step;
			if (Math.abs(ratio - Math.round(ratio)) > numberTolerance) {
				field.setCustomValidity("Use a valid increment for this field.");
				return;
			}
		}

		field.setCustomValidity("");
	}

	function validateDateField(field) {
		if (!field.value) {
			field.setCustomValidity("");
			return;
		}

		const valueDate = new Date(`${field.value}T00:00:00`);
		if (Number.isNaN(valueDate.getTime())) {
			field.setCustomValidity("Enter a valid date.");
			return;
		}

		if (field.max) {
			const maxDate = new Date(`${field.max}T00:00:00`);
			if (valueDate > maxDate) {
				field.setCustomValidity("Date cannot be in the future.");
				return;
			}
		}

		field.setCustomValidity("");
	}

	function validateEmailField(field) {
		if (!field.value) {
			field.setCustomValidity("");
			return;
		}

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailPattern.test(field.value.trim())) {
			field.setCustomValidity("Enter a valid email address.");
			return;
		}

		field.setCustomValidity("");
	}

	function setDateMaximums() {
		const today = new Date();
		const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
		document.querySelectorAll('input[type="date"]').forEach((field) => {
			if (field.dataset.allowFuture === "true") {
				return;
			}

			if (!field.max) {
				field.max = todayISO;
			}
		});
	}

	function wireValidation() {
		document.querySelectorAll('input[type="number"]').forEach((field) => {
			field.addEventListener("input", () => validateNumberField(field));
			field.addEventListener("blur", () => validateNumberField(field));
			field.addEventListener("invalid", () => validateNumberField(field));
		});

		document.querySelectorAll('input[type="date"]').forEach((field) => {
			field.addEventListener("input", () => validateDateField(field));
			field.addEventListener("blur", () => validateDateField(field));
			field.addEventListener("invalid", () => validateDateField(field));
		});

		document.querySelectorAll('input[type="email"]').forEach((field) => {
			field.addEventListener("input", () => validateEmailField(field));
			field.addEventListener("blur", () => validateEmailField(field));
			field.addEventListener("invalid", () => validateEmailField(field));
		});

		document.querySelectorAll("form").forEach((form) => {
			form.addEventListener("submit", (event) => {
				if (!form.checkValidity()) {
					event.preventDefault();
					form.reportValidity();
				}
			});
		});
	}

	document.addEventListener("DOMContentLoaded", () => {
		setDateMaximums();
		wireValidation();
	});
})();
