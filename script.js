document.addEventListener("DOMContentLoaded", function () {
	// Chart.js Initialization
	const ctx = document.getElementById("eventChart");
	if (ctx) {
		const eventChart = new Chart(ctx, {
			type: "bar",
			data: {
				labels: [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				],
				datasets: [
					{
						label: "Event Registrations",
						data: [650, 900, 790, 1000, 400, 800, 700, 850, 300, 850, 900, 590],
						backgroundColor: "#8576FF",
						borderColor: "rgba(124, 58, 237, 1)",
						borderWidth: 1,
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
				responsive: false,
				maintainAspectRatio: true,
			},
		});
	}

	const sidebar = document.querySelector(".sidebar");
	const sidebarToggle = document.getElementById("sidebarToggle");
	const darkModeToggle = document.getElementById("darkModeToggle");
	const mainContent = document.querySelector(".main-content");
	const mobileMenuToggle = document.getElementById("mobileMenuToggle");
	const mobileNav = document.getElementById("mobileNav");
	const mobileNavCloseBtn = mobileNav.querySelector("img[alt='close']");

	// Sidebar toggle functionality
	function toggleSidebar() {
		sidebar.classList.toggle("collapsed");
		mainContent.classList.toggle("expanded");

		const isCollapsed = sidebar.classList.contains("collapsed");
		const spans = sidebar.querySelectorAll(
			"li:not(.sidebar-toggle) span, .user-info, h2"
		);
		spans.forEach((span) => {
			span.classList.toggle("sr-only", isCollapsed);
		});

		const collapseText = sidebarToggle.querySelector("span");
		const darkModeToggleButton = document.querySelector(".dark-mode-toggle");
		if (collapseText) collapseText.classList.toggle("sr-only", isCollapsed);
		if (darkModeToggleButton)
			darkModeToggleButton.classList.toggle("sr-only", isCollapsed);

		// Show/hide notification dot based on sidebar state
		const notificationDot = document.querySelector(".notification-dot");
		if (notificationDot) {
			notificationDot.style.display = isCollapsed ? "inline-block" : "none";
		}
	}

	sidebarToggle.addEventListener("click", toggleSidebar);

	// This is for the Mobile menu toggle functionality
	function toggleMobileMenu() {
		mobileNav.classList.toggle("open");
		document.body.classList.toggle("mobile-menu-open");
	}

	mobileMenuToggle.addEventListener("click", toggleMobileMenu);
	mobileNavCloseBtn.addEventListener("click", toggleMobileMenu);

	// This is for the  Dark mode toggle functionality

	const mobileDarkModeToggle = document.getElementById("mobileDarkModeToggle");

	function toggleDarkMode() {
		document.body.classList.toggle("dark-mode");
		const isDarkMode = document.body.classList.contains("dark-mode");
		localStorage.setItem("darkMode", isDarkMode);
		darkModeToggle
			.querySelector(".toggle-button")
			.classList.toggle("active", isDarkMode);
		mobileDarkModeToggle.classList.toggle("active", isDarkMode);
	}

	darkModeToggle.addEventListener("click", toggleDarkMode);
	mobileDarkModeToggle.addEventListener("click", toggleDarkMode);

	// This is to Check for saved dark mode preference
	if (localStorage.getItem("darkMode") === "true") {
		toggleDarkMode();
	}
	// This is for the image Slider
	const carousel = document.querySelector(".carousel");
	const slides = Array.from(carousel.querySelectorAll(".carousel-item"));
	const prevBtn = document.querySelector(".carousel-control.prev");
	const nextBtn = document.querySelector(".carousel-control.next");
	const indicators = Array.from(
		document.querySelectorAll(".carousel-indicator")
	);
	let currentIndex = 0;
	let isTransitioning = false;
	let touchStartX = 0;
	let touchEndX = 0;
	function showSlide(index) {
		if (isTransitioning) return;
		isTransitioning = true;
		const currentSlide = slides[currentIndex];
		const nextSlide = slides[index];
		currentSlide.style.transition =
			"transform 1s ease-in-out, opacity 0.5s ease-in-out";
		nextSlide.style.transition =
			"transform 0.8 ease-in-out, opacity 0.5s ease-in-out";
		currentSlide.style.transform =
			index > currentIndex ? "translateX(-100%)" : "translateX(100%)";
		currentSlide.style.opacity = "0";
		nextSlide.style.transform = "translateX(0)";
		nextSlide.style.opacity = "1";
		indicators[currentIndex].classList.remove("active");
		indicators[index].classList.add("active");
		currentIndex = index;
		setTimeout(() => {
			currentSlide.classList.remove("active");
			nextSlide.classList.add("active");
			isTransitioning = false;
		}, 500);
	}
	function nextSlide() {
		showSlide((currentIndex + 1) % slides.length);
	}
	function prevSlide() {
		showSlide((currentIndex - 1 + slides.length) % slides.length);
	}
	// Navigation buttons
	nextBtn.addEventListener("click", nextSlide);
	prevBtn.addEventListener("click", prevSlide);
	// Indicators
	indicators.forEach((indicator, index) => {
		indicator.addEventListener("click", () => showSlide(index));
	});
	// Keyboard navigation
	document.addEventListener("keydown", (e) => {
		if (e.key === "ArrowRight") nextSlide();
		if (e.key === "ArrowLeft") prevSlide();
	});
	// Touch events for mobile
	carousel.addEventListener("touchstart", (e) => {
		touchStartX = e.changedTouches[0].screenX;
	});
	carousel.addEventListener("touchend", (e) => {
		touchEndX = e.changedTouches[0].screenX;
		if (touchStartX - touchEndX > 50) nextSlide();
		if (touchEndX - touchStartX > 50) prevSlide();
	});
	// Auto-advance slides
	let intervalId = setInterval(nextSlide, 6000);
	// Pause auto-advance on hover
	carousel.addEventListener("mouseenter", () => {
		clearInterval(intervalId);
	});
	carousel.addEventListener("mouseleave", () => {
		intervalId = setInterval(nextSlide, 5000);
	});
	// Preload images for smooth transitions
	slides.forEach((slide) => {
		const img = new Image();
		img.src = slide.querySelector("img").src;
	});
	// Initialize first slide
	slides[0].classList.add("active");
	// Modal functionality
	const modal = document.getElementById("eventModal");
	const closeBtn = modal.querySelector(".close");
	function openModal(index) {
		const event = filteredEvents[index];
		document.getElementById("modalEventName").textContent = event.name;
		document.getElementById("modalEventDate").textContent = event.date;
		document.getElementById("modalEventDescription").textContent =
			"Event description goes here.";

		document.getElementById("modalAttendees").textContent = "300 Attendees";
		modal.style.display = "block";
	}
	closeBtn.onclick = function () {
		modal.style.display = "none";
	};
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};

	// Events table functionality
	const events = [
		{
			name: "Cloud Innovation Summit",
			date: "2024-10-15",
			speaker: "Jane Doe",
			status: "Completed",
		},
		{
			name: "Blockchain Revolution Conference",
			date: "2024-11-05",
			speaker: "Dr. Peter Smith",
			status: "In Progress",
		},
		{
			name: "AI in Healthcare Symposium",
			date: "2024-12-01",
			speaker: "Dr. Aisha Malik",
			status: "Completed",
		},
		{
			name: "Future of Fintech Forum",
			date: "2024-10-25",
			speaker: "John Lee",
			status: "Completed",
		},
		{
			name: "Data Analytics in Business",
			date: "2024-11-12",
			speaker: "Rachel Moore",
			status: "Completed",
		},
		{
			name: "Sustainable Energy Expo",
			date: "2024-09-28",
			speaker: "Prof. Alan Green",
			status: "Completed",
		},
		{
			name: "Web3 Interfaces Workshop",
			date: "2024-10-10",
			speaker: "Kevin Adams",
			status: "In Progress",
		},
		{
			name: "Cybersecurity for Startups",
			date: "2024-11-18",
			speaker: "Lisa Chen",
			status: "Completed",
		},
		{
			name: "Smart Cities Forum",
			date: "2024-12-05",
			speaker: "Dr. Michael Brown",
			status: "In Progress",
		},
		{
			name: "Tech Ethics Mixer",
			date: "2024-10-30",
			speaker: "Sarah Johnson",
			status: "Completed",
		},
	];

	let filteredEvents = [...events];
	let currentPage = 1;
	let rowsPerPage = 10;

	function populateMobileEventList() {
		const mobileEventList = document.getElementById("mobileEventList");
		mobileEventList.innerHTML = "";

		filteredEvents.forEach((event) => {
			const eventItem = document.createElement("div");
			eventItem.className = "mobile-event-item";
			eventItem.innerHTML = `
				<div class="mobile-event-header">
					<span class="chevron">›</span>
					<span class="event-name">${event.name}</span>
					<span class="mobile-event-status ${event.status
						.toLowerCase()
						.replace(" ", "-")}">${event.status}</span>
				</div>
				<div class="mobile-event-details">
					<p>${event.speaker}</p>
					<p>${event.date}</p>
				</div>
			`;

			const header = eventItem.querySelector(".mobile-event-header");
			const details = eventItem.querySelector(".mobile-event-details");
			const events = eventItem.querySelector(".mobile-event-item");
			const chevron = eventItem.querySelector(".chevron");

			header.addEventListener("click", function () {
				details.classList.toggle("expanded");

				chevron.classList.toggle("expanded");
				chevron.textContent = details.classList.contains("expanded")
					? "⌄"
					: "›";
				header.classList.toggle(
					"expanded",
					details.classList.contains("expanded")
				);
			});

			mobileEventList.appendChild(eventItem);
		});
	}

	function populateEventsTable() {
		const tableBody = document.getElementById("eventsTableBody");
		if (!tableBody) return;

		tableBody.innerHTML = "";
		const start = (currentPage - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		const paginatedEvents = filteredEvents.slice(start, end);

		paginatedEvents.forEach((event, index) => {
			const row = document.createElement("tr");
			row.innerHTML = `
				<td>${event.name}</td>
				<td>${event.date}</td>
				<td>${event.speaker}</td>
				<td><span class="status ${event.status.toLowerCase().replace(" ", "-")}">
					<span class="status-dot ${event.status.toLowerCase()}"></span>${event.status}
				</span></td>
			`;
			row.addEventListener("click", () => openModal(start + index));
			tableBody.appendChild(row);
		});

		populateMobileEventList();
	}
	function updatePagination() {
		const totalPages = Math.ceil(filteredEvents.length / rowsPerPage);
		const pagination = document.querySelector(".pagination");
		pagination.innerHTML = `
            <button class="prev-page">&lt;</button>
            ${Array.from(
							{ length: totalPages },
							(_, i) =>
								`<button class="${i + 1 === currentPage ? "active" : ""}">${
									i + 1
								}</button>`
						).join("")}
            <button class="next-page">&gt;</button>
        `;
	}

	function filterEvents() {
		const searchTerm = document
			.getElementById("searchInput")
			.value.toLowerCase();
		const statusFilter = document
			.getElementById("statusFilter")
			.value.toLowerCase();
		const dateFilter = document.getElementById("dateFilter").value;
		const nameFilter = document.getElementById("nameFilter").value;

		filteredEvents = events.filter((event) => {
			const matchesSearch =
				event.name.toLowerCase().includes(searchTerm) ||
				event.speaker.toLowerCase().includes(searchTerm);
			const matchesStatus =
				statusFilter === "" || event.status.toLowerCase() === statusFilter;
			return matchesSearch && matchesStatus;
		});

		if (dateFilter === "newest") {
			filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
		} else if (dateFilter === "oldest") {
			filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
		}

		if (nameFilter === "asc") {
			filteredEvents.sort((a, b) => a.name.localeCompare(b.name));
		} else if (nameFilter === "desc") {
			filteredEvents.sort((a, b) => b.name.localeCompare(a.name));
		}

		currentPage = 1;
		populateEventsTable();
	}

	document
		.getElementById("searchInput")
		.addEventListener("input", filterEvents);
	document
		.getElementById("statusFilter")
		.addEventListener("change", filterEvents);
	document
		.getElementById("dateFilter")
		.addEventListener("change", filterEvents);
	document
		.getElementById("nameFilter")
		.addEventListener("change", filterEvents);

	document.querySelector(".pagination").addEventListener("click", function (e) {
		if (e.target.tagName === "BUTTON") {
			if (e.target.classList.contains("prev-page")) {
				currentPage = Math.max(1, currentPage - 1);
			} else if (e.target.classList.contains("next-page")) {
				currentPage = Math.min(
					Math.ceil(filteredEvents.length / rowsPerPage),
					currentPage + 1
				);
			} else {
				currentPage = parseInt(e.target.textContent);
			}
			populateEventsTable();
		}
	});

	populateEventsTable();

	// Responsive behavior
	function handleResponsive() {
		const chartContainer = document.querySelector(".chart-container");
		const newsContainer = document.querySelector(".news-container");
		if (window.innerWidth <= 768) {
			newsContainer.style.width = "100%";
		} else {
			chartContainer.style.width = "";
			newsContainer.style.width = "";
		}
	}

	window.addEventListener("resize", handleResponsive);
	handleResponsive();
});
