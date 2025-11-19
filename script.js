document.addEventListener('DOMContentLoaded', () => {
  // ------------------ services data ------------------
  const services = [
    {
      title: "Satyanarayan Puja",
      description:
        "A Vishnu Puja performed for prosperity, good health, family peace, success in new beginnings, and protection from obstacles. Commonly done after major milestones or on Purnima.",
      img: "images/satyanarayan.jpg"
    },
    {
      title: "Griha Pravesh",
      description:
        "A home-entering ceremony including Vastu Shanti, Navagraha Puja, and Havan to purify the house, remove negative energies, and invite blessings before moving in.",
      img: "images/griha.jpg"
    },
    {
      title: "Naamkaran Ceremony",
      description:
        "The Vedic naming ceremony for newborns done to bless the child with health, longevity, good fortune, and a harmonious identity aligned with their Nakshatra.",
      img: "images/naamkaran.jpg"
    },
    {
      title: "Vivah Sanskar",
      description:
        "A complete Hindu wedding ritual including Kanyadaan, Havan, Mangal Phera, and Saptapadi to bless the couple with a harmonious, prosperous, and dharmic married life.",
      img: "images/vivah.jpg"
    },
    {
      title: "Rudrabhishek",
      description:
        "A powerful Shiva ritual where the Shivalinga is bathed with milk, curd, honey, water, and ghee, performed for removal of negativity, mental peace, health benefits, and fulfillment of desires.",
      img: "images/rudra.jpg"
    },
    {
      title: "Graha Shanti",
      description:
        "A planetary pacification puja that reduces the negative effects of malefic planets, improves health, career, relationships, and brings long-term peace and stability.",
      img: "images/graha.jpg"
    }
  ];

  // ------------------ sort alphabetically ------------------
  services.sort((a, b) => a.title.localeCompare(b.title));
  services.push({
    title: "Any Other Puja Request",
    description:
      "If you have a specific puja or ritual in mind that is not listed, please let us know. We can accommodate various Vedic ceremonies tailored to your needs.",
    img: "images/generic.jpg"
  });
  

  // ------------------ DOM references (after DOMContentLoaded) ------------------
  const servicesGrid = document.querySelector(".services-grid");
  const modal = document.getElementById("serviceModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const closeModalBtn = document.getElementById("closeModal");
  const waLink = document.getElementById("waLink");
  const serviceSelect = document.getElementById("service"); // <select>
  const requestForm = document.getElementById("requestForm");

  // ------------------ render function ------------------
  function renderServices() {
    if (!servicesGrid) {
      console.warn('No .services-grid element found in DOM. Make sure your HTML contains <div class="services-grid"></div>');
      return;
    }

    // clear existing
    servicesGrid.innerHTML = "";

    services.forEach(svc => {
      const card = document.createElement("div");
      card.className = "service-card";
      card.setAttribute("data-title", svc.title);
      card.setAttribute("data-description", svc.description);
      card.setAttribute("data-img", svc.img);

      card.innerHTML = `
        <img src="${svc.img}" alt="${escapeHtml(svc.title)}" />
        <h3>${escapeHtml(svc.title)}</h3>
      `;
      servicesGrid.appendChild(card);
    });
  }

  // small helper to avoid injection if values ever come from external source
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ------------------ open modal ------------------
  function openModal({ title = "", description = "", img = "" } = {}) {
    if (!modal) {
      console.warn('Modal element missing (id="serviceModal")');
      return;
    }

    if (modalTitle) modalTitle.textContent = title;
    if (modalDescription) modalDescription.textContent = description;
    if (modalImage) modalImage.src = img || "";

    // set dropdown value if exists (will select matching option if same text)
    if (serviceSelect) {
      const optionExists = Array.from(serviceSelect.options).some(
        (opt) => opt.value === title || opt.text === title
      );
      if (optionExists) serviceSelect.value = title;
    }

    // update modal whatsapp link
    if (waLink) {
      const msg = `Hello Panditji,%0A%0AI would like to book: ${encodeURIComponent(title)}%0A%0AName:%20%0APhone:%20%0ADate/Details:%20`;
      waLink.href = `https://wa.me/919731671105?text=${msg}`;
    }

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
  }

  // ------------------ close modal ------------------
  function closeModal() {
    if (!modal) return;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }

  // ------------------ event delegation for cards ------------------
  if (servicesGrid) {
    servicesGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".service-card");
      if (!card) return;

      const title = card.dataset.title || "";
      const description = card.dataset.description || "";
      const img = card.dataset.img || card.querySelector("img")?.src || "";

      openModal({ title, description, img });
    });
  }

  // ------------------ modal close handlers ------------------
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  // ------------------ request form submit -> whatsapp ------------------
  if (requestForm) {
    requestForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = (document.getElementById("name")?.value || "").trim();
      const phone = (document.getElementById("phone")?.value || "").trim();
      const service = (document.getElementById("service")?.value || "").trim();
      const details = (document.getElementById("details")?.value || "").trim();

      if (!name || !phone || !service) {
        alert("Please fill name, phone and service.");
        return;
      }

      const lines = [
        "New Puja Request:",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Service: ${service}`,
        `Details: ${details || "-"}`
      ];
      const message = lines.join("%0A");
      const url = `https://wa.me/919731671105?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    });
  }

  // ------------------ initial run ------------------
  renderServices();
});
