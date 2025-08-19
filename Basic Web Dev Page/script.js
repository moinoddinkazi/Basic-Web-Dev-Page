// Helper: currency
const currencyFormatter = new Intl.NumberFormat(undefined, {
	style: 'currency',
	currency: 'INR',
});

// State
let selectedModel = '';
let basePricePerHour = 0;

// DOM
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll reveal intersection observer
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
	const io = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('revealed');
				io.unobserve(entry.target);
			}
		});
	}, { threshold: 0.15 });
	revealEls.forEach((el) => io.observe(el));
} else {
	revealEls.forEach((el) => el.classList.add('revealed'));
}

// Hook up book buttons
const bookButtons = document.querySelectorAll('.book-btn');
const modalCarModel = document.getElementById('modalCarModel');
const modalBaseEl = document.getElementById('modalBase');
const modalHoursEl = document.getElementById('modalHours');
const totalEl = document.getElementById('total');
const hoursInput = document.getElementById('hours');
const extrasInputs = document.querySelectorAll('.extra');

bookButtons.forEach((btn) => {
	btn.addEventListener('click', (e) => {
		const model = e.currentTarget.getAttribute('data-model') || '';
		const price = Number(e.currentTarget.getAttribute('data-price') || '0');
		selectedModel = model;
		basePricePerHour = price;
		if (modalCarModel) modalCarModel.textContent = model;
		if (modalBaseEl) modalBaseEl.textContent = currencyFormatter.format(price);
		updateTotal();
	});
});

// Update total price
function updateTotal() {
	const hours = Number(hoursInput?.value || 0);
	let extras = 0;
	extrasInputs.forEach((el) => {
		if (el instanceof HTMLInputElement && el.checked) {
			extras += Number(el.value || 0);
		}
	});
	const base = basePricePerHour * Math.max(0, hours);
	const total = base + extras;
	if (modalHoursEl) modalHoursEl.textContent = String(hours || 0);
	if (totalEl) totalEl.textContent = String(Number(total.toFixed(2)));
}

if (hoursInput) hoursInput.addEventListener('input', updateTotal);
extrasInputs.forEach((el) => el.addEventListener('change', updateTotal));

// Form validation + submission
const bookingForm = document.getElementById('bookingForm');
const toastEl = document.getElementById('toast');

if (bookingForm) {
	bookingForm.addEventListener('submit', (event) => {
		if (!bookingForm.checkValidity()) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			event.preventDefault();
			// Simulate booking submission
			if (toastEl) {
				const toast = new bootstrap.Toast(toastEl);
				toast.show();
			}
			const modalEl = document.getElementById('bookingModal');
			if (modalEl) {
				const instance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
				instance.hide();
			}
			bookingForm.reset();
		}
		bookingForm.classList.add('was-validated');
	});
}


