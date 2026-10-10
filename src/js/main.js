const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

// Bloqueia o arraste de elementos, mantendo o comportamento solicitado para a página.
document.addEventListener("dragstart", (event) => {
  event.preventDefault();
});

// Menu compacto: mantém o estado visual e os atributos de acessibilidade sincronizados.
if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menu" : "Fechar menu");
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      siteNav.classList.remove("is-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      siteNav.classList.remove("is-open");
      menuToggle.focus();
    }
  });
}

// Filtra os cartões sem removê-los do DOM e informa quando a categoria está vazia.
const fleetFilters = document.querySelectorAll(".filter-button");
const vehicleCards = document.querySelectorAll(".vehicle-card[data-category]");
const fleetEmpty = document.querySelector("#fleet-empty");

fleetFilters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const selectedCategory = filterButton.dataset.filter;
    if (!selectedCategory) return;

    fleetFilters.forEach((button) => {
      const isActive = button === filterButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    let visibleCards = 0;
    vehicleCards.forEach((card) => {
      const isVisible = selectedCategory === "todos" || card.dataset.category === selectedCategory;
      card.hidden = !isVisible;
      if (isVisible) visibleCards += 1;
    });

    if (fleetEmpty instanceof HTMLElement) {
      fleetEmpty.hidden = visibleCards > 0;
    }
  });
});

// Os dados do veículo são inseridos na mensagem antes de abrir o WhatsApp.
document.querySelectorAll(".rent-button[data-car]").forEach((button) => {
  button.addEventListener("click", () => {
    const car = button.dataset.car;
    if (!car) return;

    const message = `Olá! Gostaria de consultar o preço e a disponibilidade do veículo ${car}. Poderiam me ajudar?`;
    window.open(
      `https://wa.me/5582999324430?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  });
});

// Usa a data local para evitar que o fuso horário altere o dia mínimo permitido.
const dateInputs = document.querySelectorAll('input[type="date"]');
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 10);

dateInputs.forEach((input) => {
  input.min = localToday;
});

const startDateInput = document.querySelector('input[name="startDate"]');
const endDateInput = document.querySelector('input[name="endDate"]');

if (startDateInput instanceof HTMLInputElement && endDateInput instanceof HTMLInputElement) {
  startDateInput.addEventListener("change", () => {
    endDateInput.min = startDateInput.value || localToday;
    if (endDateInput.value && endDateInput.value < endDateInput.min) {
      endDateInput.value = "";
    }
  });
}

// Valida o período e abre uma conversa com os dados da cotação preenchidos.
const bookingForm = document.querySelector("#booking-form");
const formMessage = document.querySelector("#form-message");

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!(bookingForm instanceof HTMLFormElement) || !(formMessage instanceof HTMLElement)) return;

  const formData = new FormData(bookingForm);
  const pickup = formData.get("pickup");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");

  if (typeof pickup !== "string" || typeof startDate !== "string" || typeof endDate !== "string" || endDate < startDate) {
    formMessage.textContent = "Confira o local e as datas da sua viagem.";
    return;
  }

  const dateFormat = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "UTC" });
  const formatDate = (value) => dateFormat.format(new Date(`${value}T12:00:00Z`));
  const message = `Olá! Gostaria de consultar a disponibilidade de um veículo.\n\nRetirada: ${pickup}\nData de retirada: ${formatDate(startDate)}\nData de devolução: ${formatDate(endDate)}`;
  window.open(`https://wa.me/5582999324430?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  formMessage.textContent = "Abrimos o WhatsApp para você continuar sua cotação.";
});

const currentYear = document.querySelector("#current-year");
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
