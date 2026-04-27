(function () {
	const USERS_KEY = "fitness-tracker-users";
	const SESSION_KEY = "fitness-tracker-session";
	const PROFILE_PAGE = "page-5.html";
	const WARNING_BANNER_ID = "auth-warning-banner";

	function normalizeUsername(username) {
		return String(username || "").trim().toLowerCase();
	}

	function readUsers() {
		try {
			const parsed = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
			if (parsed && typeof parsed === "object") {
				return parsed;
			}
			return {};
		} catch {
			return {};
		}
	}

	function writeUsers(users) {
		localStorage.setItem(USERS_KEY, JSON.stringify(users));
	}

	function getSession() {
		try {
			const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
			if (parsed && parsed.username) {
				return parsed;
			}
			return null;
		} catch {
			return null;
		}
	}

	function setSession(username) {
		const session = {
			username,
			startedAt: new Date().toISOString()
		};
		localStorage.setItem(SESSION_KEY, JSON.stringify(session));
		return session;
	}

	function clearSession() {
		localStorage.removeItem(SESSION_KEY);
	}

	function registerUser(username, pin) {
		const normalized = normalizeUsername(username);
		const safePin = String(pin || "").trim();

		if (normalized.length < 3) {
			return { ok: false, message: "Username must be at least 3 characters." };
		}

		if (!/^\d{4,8}$/.test(safePin)) {
			return { ok: false, message: "PIN must be 4 to 8 digits." };
		}

		const users = readUsers();
		if (users[normalized]) {
			return { ok: false, message: "That username already exists. Please log in." };
		}

		users[normalized] = {
			pin: safePin,
			createdAt: new Date().toISOString()
		};
		writeUsers(users);
		setSession(normalized);
		return { ok: true, message: "Account created and signed in.", username: normalized };
	}

	function loginUser(username, pin) {
		const normalized = normalizeUsername(username);
		const safePin = String(pin || "").trim();
		const users = readUsers();

		if (!users[normalized]) {
			return { ok: false, message: "No account found for that username." };
		}

		if (users[normalized].pin !== safePin) {
			return { ok: false, message: "Incorrect PIN." };
		}

		setSession(normalized);
		return { ok: true, message: "Logged in successfully.", username: normalized };
	}

	function getUserKey(baseKey) {
		const session = getSession();
		if (!session) {
			return null;
		}
		return `fitness:${session.username}:${baseKey}`;
	}

	function injectWarningBanner(message) {
		if (!document.body || document.getElementById(WARNING_BANNER_ID)) {
			return;
		}

		const banner = document.createElement("div");
		banner.id = WARNING_BANNER_ID;
		banner.className = "auth-warning-banner";
		banner.setAttribute("role", "alert");
		banner.setAttribute("aria-live", "assertive");
		banner.innerHTML = `${message} <a href="${PROFILE_PAGE}">Log in on Profile</a>`;

		const firstChild = document.body.firstElementChild;
		if (firstChild) {
			firstChild.insertAdjacentElement("beforebegin", banner);
		} else {
			document.body.appendChild(banner);
		}
	}

	function enforceAuthRules() {
		const hasSession = Boolean(getSession());
		if (hasSession) {
			return;
		}

		injectWarningBanner("Please log in to save and access account data.");
	}

	window.FitnessAuth = {
		registerUser,
		loginUser,
		logout: clearSession,
		getSession,
		getUserKey
	};

	document.addEventListener("DOMContentLoaded", enforceAuthRules);
})();