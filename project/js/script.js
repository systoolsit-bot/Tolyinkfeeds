(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};
  var ENQUIRY_TABLE = "enquiries";

  document.documentElement.classList.add("js");

  function fillCompanyDetails() {
    document.querySelectorAll("[data-company-name]").forEach(function (el) {
      el.textContent = config.companyName;
    });
    document.querySelectorAll("[data-phone]").forEach(function (el) {
      el.textContent = config.phoneDisplay;
    });
    document.querySelectorAll("[data-phone-link]").forEach(function (el) {
      el.setAttribute("href", "tel:+" + config.phoneNumber);
    });
    document.querySelectorAll("[data-email]").forEach(function (el) {
      el.textContent = config.email;
      el.setAttribute("href", "mailto:" + config.email);
    });
    document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
      var message = el.getAttribute("data-whatsapp-message");
      var url = "https://wa.me/" + config.whatsappNumber;
      if (message) {
        url += "?text=" + encodeURIComponent(message);
      }
      el.setAttribute("href", url);
    });
  }

  function setupHeader() {
    var header = document.querySelector(".site-header");
    if (!header) {
      return;
    }
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setupMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("primary-nav");
    if (!toggle || !menu) {
      return;
    }

    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    window.matchMedia("(min-width: 1181px)").addEventListener("change", function (event) {
      if (event.matches) {
        setOpen(false);
      }
    });
  }

  function setupReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function setupBackToTop() {
    var button = document.querySelector(".back-to-top");
    if (!button) {
      return;
    }
    var onScroll = function () {
      button.classList.toggle("is-visible", window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setupCatalogue() {
    var catalogue = document.querySelector("[data-catalogue]");
    if (!catalogue) {
      return;
    }
    var sections = Array.prototype.slice.call(catalogue.querySelectorAll(".catalog-section"));
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
    var input = document.getElementById("product-search");
    var empty = document.getElementById("catalog-empty");
    var state = { filter: "all", query: "" };

    var searchText = function (item) {
      var title = item.querySelector("h3");
      var description = item.querySelector(".catalog-item__description");
      return [
        title ? title.textContent : "",
        description ? description.textContent : "",
        item.getAttribute("data-keywords") || ""
      ].join(" ").toLowerCase();
    };

    var applyFilters = function () {
      var query = state.query.trim().toLowerCase();
      var totalVisible = 0;

      sections.forEach(function (section) {
        var visible = 0;
        section.querySelectorAll(".catalog-item").forEach(function (item) {
          var matchesFilter = state.filter === "all" || item.getAttribute("data-category") === state.filter;
          var matchesQuery = !query || searchText(item).indexOf(query) !== -1;
          var show = matchesFilter && matchesQuery;
          item.classList.toggle("is-hidden", !show);
          if (show) {
            visible += 1;
          }
        });
        section.classList.toggle("is-hidden", visible === 0);
        var count = section.querySelector("[data-count]");
        if (count) {
          count.textContent = "Showing " + visible + (visible === 1 ? " product" : " products");
        }
        totalVisible += visible;
      });

      if (empty) {
        empty.classList.toggle("is-visible", totalVisible === 0);
      }
    };

    var setFilter = function (value) {
      state.filter = value;
      buttons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.getAttribute("data-filter") === value));
      });
      applyFilters();
    };

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        setFilter(button.getAttribute("data-filter"));
      });
    });

    if (input) {
      input.addEventListener("input", function () {
        state.query = input.value;
        applyFilters();
      });
    }

    var requested = new URLSearchParams(window.location.search).get("filter");
    var known = buttons.some(function (button) {
      return button.getAttribute("data-filter") === requested;
    });
    setFilter(known ? requested : "all");
  }

  function setupEnquiryForm() {
    var form = document.getElementById("enquiry-form");
    if (!form) {
      return;
    }
    var status = document.getElementById("form-status");
    var submitButton = form.querySelector('button[type="submit"]');
    var submitLabel = submitButton.textContent;
    var params = new URLSearchParams(window.location.search);

    var product = params.get("product");
    if (product) {
      form.elements.product_interest.value = product.slice(0, 160);
    }
    var category = params.get("category");
    if (category) {
      var option = Array.prototype.find.call(form.elements.category.options, function (opt) {
        return opt.value === category;
      });
      if (option) {
        form.elements.category.value = category;
      }
    }

    var rules = {
      full_name: function (v) {
        if (!v) return "Please enter your full name.";
        if (v.length < 2 || v.length > 120) return "Your name should be between 2 and 120 characters.";
        return "";
      },
      company_name: function (v) {
        return v.length > 160 ? "Company or farm name is too long." : "";
      },
      phone: function (v) {
        if (!v) return "Please enter a phone number.";
        if (!/^\+?[0-9\s()-]+$/.test(v) || v.replace(/\D/g, "").length < 7) {
          return "Please enter a valid phone number.";
        }
        return "";
      },
      email: function (v) {
        if (!v) return "Please enter your email address.";
        if (v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          return "Please enter a valid email address.";
        }
        return "";
      },
      category: function (v) {
        return v ? "" : "Please choose an enquiry category.";
      },
      product_interest: function (v) {
        return v.length > 160 ? "Product name is too long." : "";
      },
      quantity: function (v) {
        return v.length > 120 ? "Quantity description is too long." : "";
      },
      message: function (v) {
        if (!v) return "Please tell us a little about your requirement.";
        if (v.length < 10) return "Your message should be at least 10 characters.";
        if (v.length > 2000) return "Your message should be under 2000 characters.";
        return "";
      }
    };

    var readValues = function () {
      var values = {};
      Object.keys(rules).forEach(function (name) {
        values[name] = form.elements[name].value.trim();
      });
      return values;
    };

    var setFieldError = function (name, message) {
      var field = form.elements[name];
      var wrapper = field.closest(".form-field");
      var errorEl = wrapper.querySelector(".field-error");
      wrapper.classList.toggle("has-error", Boolean(message));
      field.setAttribute("aria-invalid", String(Boolean(message)));
      errorEl.textContent = message;
    };

    var validate = function (values) {
      var firstInvalid = null;
      Object.keys(rules).forEach(function (name) {
        var message = rules[name](values[name]);
        setFieldError(name, message);
        if (message && !firstInvalid) {
          firstInvalid = form.elements[name];
        }
      });
      return firstInvalid;
    };

    var showStatus = function (type, message) {
      status.className = "form-status is-visible form-status--" + type;
      status.textContent = message;
      status.setAttribute("role", type === "error" ? "alert" : "status");
    };

    var hideStatus = function () {
      status.className = "form-status";
      status.textContent = "";
    };

    var setSubmitting = function (busy) {
      submitButton.disabled = busy;
      submitButton.textContent = busy ? "Sending..." : submitLabel;
    };

    Object.keys(rules).forEach(function (name) {
      form.elements[name].addEventListener("blur", function () {
        var value = form.elements[name].value.trim();
        if (value || form.elements[name].required) {
          setFieldError(name, rules[name](value));
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      hideStatus();

      if (form.elements.website.value) {
        form.reset();
        showStatus("success", "Thank you. Your enquiry has been received.");
        return;
      }

      var values = readValues();
      var firstInvalid = validate(values);
      if (firstInvalid) {
        firstInvalid.focus();
        showStatus("error", "Please correct the highlighted fields and try again.");
        return;
      }

      var supabaseUrl = (config.supabaseUrl || "").replace(/\/+$/, "");
      var anonKey = config.supabaseAnonKey;
      if (!supabaseUrl || !anonKey) {
        showStatus(
          "error",
          "Our online enquiry form is not available at the moment. Please contact us by phone or on WhatsApp."
        );
        return;
      }

      var payload = {
        full_name: values.full_name,
        company_name: values.company_name || null,
        phone: values.phone,
        email: values.email,
        category: values.category,
        product_interest: values.product_interest || null,
        quantity: values.quantity || null,
        message: values.message
      };

      setSubmitting(true);
      fetch(supabaseUrl + "/rest/v1/" + ENQUIRY_TABLE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: "Bearer " + anonKey,
          Prefer: "return=minimal"
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Enquiry request failed with status " + response.status);
          }
          form.reset();
          showStatus(
            "success",
            "Thank you. Your enquiry has been received and our sales team will contact you shortly."
          );
        })
        .catch(function () {
          showStatus(
            "error",
            "We could not send your enquiry. Please check your connection and try again, or contact us on WhatsApp."
          );
        })
        .then(function () {
          setSubmitting(false);
        });
    });
  }

  fillCompanyDetails();
  setupHeader();
  setupMobileNav();
  setupReveal();
  setupBackToTop();
  setupCatalogue();
  setupEnquiryForm();
})();
