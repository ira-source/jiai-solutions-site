(function () {
  const nav = document.querySelector("[data-nav]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const contactModal = document.querySelector("[data-contact-modal]");
  const serviceModal = document.querySelector("[data-service-modal]");
  const contactForm = document.querySelector("[data-contact-form]");
  const statusEl = document.querySelector("[data-form-status]");

  const serviceCopy = {
    implementation: {
      kicker: "AI Implementation",
      title: "AI systems that fit your workflow.",
      body: "We identify high-value use cases, select the right tools, configure workflows, and support launch so your team gets practical results instead of another unused platform."
    },
    coaching: {
      kicker: "Coaching",
      title: "Confidence for leaders and teams.",
      body: "Our coaching helps owners, managers, and operators understand where AI belongs, how to evaluate output, and how to build useful habits into daily work."
    },
    training: {
      kicker: "Training",
      title: "Hands-on AI training people can use.",
      body: "Workshops cover prompting, workflow design, team policies, tool selection, and real use cases tailored to your business."
    }
  };

  function closeMobileNav() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function openDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-dropdown .nav-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const dropdown = event.currentTarget.closest(".nav-dropdown");
      const willOpen = !dropdown.classList.contains("open");
      document.querySelectorAll(".nav-dropdown.open").forEach((item) => {
        if (item !== dropdown) {
          item.classList.remove("open");
          item.querySelector(".nav-button")?.setAttribute("aria-expanded", "false");
        }
      });
      dropdown.classList.toggle("open", willOpen);
      event.currentTarget.setAttribute("aria-expanded", String(willOpen));
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-dropdown")) {
      document.querySelectorAll(".nav-dropdown.open").forEach((item) => {
        item.classList.remove("open");
        item.querySelector(".nav-button")?.setAttribute("aria-expanded", "false");
      });
    }
  });

  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", () => closeMobileNav());
  });

  document.querySelectorAll("[data-open-contact]").forEach((button) => {
    button.addEventListener("click", () => {
      closeDialog(serviceModal);
      openDialog(contactModal);
      closeMobileNav();
    });
  });

  document.querySelector("[data-close-modal]")?.addEventListener("click", () => closeDialog(contactModal));
  document.querySelector("[data-close-service]")?.addEventListener("click", () => closeDialog(serviceModal));

  document.querySelectorAll(".modal").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
  });

  document.querySelectorAll("[data-service]").forEach((button) => {
    button.addEventListener("click", () => {
      const details = serviceCopy[button.dataset.service];
      if (!details || !serviceModal) return;
      serviceModal.querySelector("[data-service-kicker]").textContent = details.kicker;
      serviceModal.querySelector("[data-service-title]").textContent = details.title;
      serviceModal.querySelector("[data-service-body]").textContent = details.body;
      openDialog(serviceModal);
    });
  });

  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    const config = window.JIAI_CONFIG || {};
    const endpoint = (config.formEndpoint || "").trim();
    const email = config.contactEmail || "hello@jiaisolutions.com";

    statusEl.textContent = "Sending...";

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Form endpoint returned an error.");
        contactForm.reset();
        statusEl.textContent = "Thanks. Your message has been sent.";
      } catch (error) {
        statusEl.textContent = "Something went wrong. Please email us directly.";
      }
      return;
    }

    const subject = encodeURIComponent(`Consultation request from ${data.name || "website visitor"}`);
    const body = encodeURIComponent(
      [
        `Name: ${data.name || ""}`,
        `Email: ${data.email || ""}`,
        `Company: ${data.company || ""}`,
        `Service: ${data.service || ""}`,
        "",
        data.message || ""
      ].join("\n")
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    statusEl.textContent = "Your email app should open with the message ready to send.";
  });
})();
