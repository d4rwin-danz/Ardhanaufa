document.addEventListener("DOMContentLoaded", function () {
  // Step navigation
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");
  const step4 = document.getElementById("step-4");

  const step1Indicator = document.getElementById("step-1-indicator");
  const step2Indicator = document.getElementById("step-2-indicator");
  const step3Indicator = document.getElementById("step-3-indicator");
  const step4Indicator = document.getElementById("step-4-indicator");

  // Package options
  const packageType = document.getElementById("package-type");
  const wisataOptions = document.getElementById("wisata-options");
  const kulinerOptions = document.getElementById("kuliner-options");

  // Validation regex patterns
  const patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^08[0-9]{8,11}$/,
    name: /^[a-zA-Z\s.'-]{3,50}$/
  };

  // Validation error messages
  const errorMessages = {
    required: "Field ini wajib diisi",
    name: "Masukkan nama lengkap yang valid (3-50 karakter)",
    email: "Masukkan alamat email yang valid (contoh: nama@domain.com)",
    phone: "Masukkan nomor HP yang valid (diawali 08, 10-13 digit)",
    date: "Tanggal tidak boleh kosong",
    time: "Jam tidak boleh kosong",
    people: "Jumlah orang minimal 1",
    transport: "Pilih jenis transportasi",
    package: "Pilih jenis paket"
  };

  // Function to validate form fields in a given step
  function validateStep(stepElement) {
    const requiredFields = stepElement.querySelectorAll("input[required], select[required]");
    let isValid = true;
    
    // Reset validation states
    stepElement.querySelectorAll(".input-error").forEach(el => {
      el.classList.remove("input-error");
    });
    
    // Remove any existing error messages
    stepElement.querySelectorAll(".error-message").forEach(el => {
      el.remove();
    });
    
    // Check each required field
    requiredFields.forEach(field => {
      let fieldIsValid = true;
      let errorMessage = errorMessages.required;
      
      // Check if field has a value
      if (!field.value.trim()) {
        fieldIsValid = false;
      } 
      // If field has a value, validate format based on type
      else {
        switch(field.type) {
          case 'text':
            // Assuming first text input is name
            if (!patterns.name.test(field.value)) {
              fieldIsValid = false;
              errorMessage = errorMessages.name;
            }
            break;
            
          case 'email':
            if (!patterns.email.test(field.value)) {
              fieldIsValid = false;
              errorMessage = errorMessages.email;
            }
            break;
            
          case 'tel':
            if (!patterns.phone.test(field.value)) {
              fieldIsValid = false;
              errorMessage = errorMessages.phone;
            }
            break;
            
          case 'date':
            // Additional date validation if needed
            if (!isValidDate(field.value)) {
              fieldIsValid = false;
              errorMessage = errorMessages.date;
            }
            break;
            
          case 'time':
            // Additional time validation if needed
            if (!field.value) {
              fieldIsValid = false;
              errorMessage = errorMessages.time;
            }
            break;
            
          case 'number':
            if (parseInt(field.value) < 1) {
              fieldIsValid = false;
              errorMessage = errorMessages.people;
            }
            break;
            
          case 'select-one':
            if (field.selectedIndex === 0) {
              fieldIsValid = false;
              errorMessage = field.id === "package-type" ? 
                errorMessages.package : errorMessages.transport;
            }
            break;
        }
      }
      
      if (!fieldIsValid) {
        isValid = false;
        field.classList.add("input-error");
        
        // Add error message below the field
        const errorMsg = document.createElement("p");
        errorMsg.classList.add("error-message", "text-error", "text-sm", "mt-1");
        errorMsg.textContent = errorMessage;
        
        // Insert error message after the label containing the field
        const parentLabel = field.closest(".form-control");
        parentLabel.appendChild(errorMsg);
      }
    });
    
    return isValid;
  }
  
  // Function to validate date
  function isValidDate(dateString) {
    if (!dateString) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);
    
    // Date must be today or in the future
    return selectedDate >= today;
  }

  // Clear errors when input values change
  function setupInputChangeListeners() {
    const inputs = document.querySelectorAll("input[required], select[required]");
    
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        // Remove error styling
        this.classList.remove("input-error");
        
        // Remove error message if exists
        const errorMsg = this.closest(".form-control").querySelector(".error-message");
        if (errorMsg) {
          errorMsg.remove();
        }
      });
    });
  }

  // Navigation buttons with validation
  document
    .getElementById("next-to-step-2")
    .addEventListener("click", function () {
      if (validateStep(step1)) {
        step1.classList.add("hidden");
        step2.classList.remove("hidden");
        step2Indicator.classList.add("step-primary");
      }
    });

  document
    .getElementById("back-to-step-1")
    .addEventListener("click", function () {
      step2.classList.add("hidden");
      step1.classList.remove("hidden");
      step2Indicator.classList.remove("step-primary");
    });

  document
    .getElementById("next-to-step-3")
    .addEventListener("click", function () {
      if (validateStep(step2)) {
        // Make sure date is today or in future
        const dateInput = document.querySelector("#step-2 input[type='date']");
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          dateInput.classList.add("input-error");
          
          const errorMsg = document.createElement("p");
          errorMsg.classList.add("error-message", "text-error", "text-sm", "mt-1");
          errorMsg.textContent = "Tanggal harus hari ini atau di masa depan";
          
          // Remove any existing error message first
          const existingError = dateInput.closest(".form-control").querySelector(".error-message");
          if (existingError) {
            existingError.remove();
          }
          
          dateInput.closest(".form-control").appendChild(errorMsg);
          return;
        }
        
        step2.classList.add("hidden");
        step3.classList.remove("hidden");
        step3Indicator.classList.add("step-primary");
      }
    });

  document
    .getElementById("back-to-step-2")
    .addEventListener("click", function () {
      step3.classList.add("hidden");
      step2.classList.remove("hidden");
      step3Indicator.classList.remove("step-primary");
    });

  document
    .getElementById("next-to-step-4")
    .addEventListener("click", function () {
      // First, check if package is selected
      if (!packageType.value || packageType.value === "Pilih paket wisata") {
        packageType.classList.add("input-error");
        
        // Check if an error message already exists
        const existingError = packageType.closest(".form-control").querySelector(".error-message");
        
        if (!existingError) {
          const errorMsg = document.createElement("p");
          errorMsg.classList.add("error-message", "text-error", "text-sm", "mt-1");
          errorMsg.textContent = "Harap pilih jenis paket";
          packageType.closest(".form-control").appendChild(errorMsg);
        }
        
        return;
      }
      
      // Validate selections based on package type
      let isValid = true;
      const selectedPackage = packageType.value;

      if (
        selectedPackage === "wisata" ||
        selectedPackage === "wisata-kuliner"
      ) {
        const checkedWisata = document.querySelectorAll(
          ".wisata-checkbox:checked",
        );
        if (checkedWisata.length !== 5) {
          document
            .getElementById("wisata-alert")
            .classList.remove("hidden");
          isValid = false;
        } else {
          document.getElementById("wisata-alert").classList.add("hidden");
        }
      }

      if (
        selectedPackage === "kuliner" ||
        selectedPackage === "wisata-kuliner"
      ) {
        const checkedKuliner = document.querySelectorAll(
          ".kuliner-checkbox:checked",
        );
        if (checkedKuliner.length !== 5) {
          document
            .getElementById("kuliner-alert")
            .classList.remove("hidden");
          isValid = false;
        } else {
          document
            .getElementById("kuliner-alert")
            .classList.add("hidden");
        }
      }
      

      if (isValid) {
        // Populate summary
        const nameInput = document.querySelector("#step-1 input[type='text']");
        const emailInput = document.querySelector("#step-1 input[type='email']");
        const phoneInput = document.querySelector("#step-1 input[type='tel']");
        const dateInput = document.querySelector("#step-2 input[type='date']");
        const timeInput = document.querySelector("#step-2 input[type='time']");
        const peopleInput = document.querySelector("#step-2 input[type='number']");
        const transportSelect = document.querySelector("#step-2 select");

        // Personal info
        document.getElementById("summary-name").textContent = nameInput.value;
        document.getElementById("summary-email").textContent = emailInput.value;
        document.getElementById("summary-phone").textContent = phoneInput.value;

        // Trip info
        const date = dateInput.value;
        const time = timeInput.value;
        document.getElementById("summary-datetime").textContent = `${date} ${time}`;
        document.getElementById("summary-people").textContent = peopleInput.value + " orang";

        // Transport
        const transport = transportSelect.options[transportSelect.selectedIndex].text;
        document.getElementById("summary-transport").textContent = transport;

        // Selected package
        let packageText = "";
        if (selectedPackage === "wisata") {
          packageText = "Paket Wisata";
        } else if (selectedPackage === "kuliner") {
          packageText = "Paket Kuliner";
        } else if (selectedPackage === "wisata-kuliner") {
          packageText = "Paket Wisata-Kuliner";
        }
        document.getElementById("summary-package").textContent = packageText;

        // Selected tourism locations
        if (
          selectedPackage === "wisata" ||
          selectedPackage === "wisata-kuliner"
        ) {
          document
            .getElementById("summary-wisata-container")
            .classList.remove("hidden");
          const selectedWisata = Array.from(
            document.querySelectorAll(".wisata-checkbox:checked"),
          )
            .map((checkbox) =>
              checkbox.nextElementSibling.textContent.trim(),
            )
            .join(", ");
          document.getElementById("summary-wisata").textContent = selectedWisata;
        } else {
          document
            .getElementById("summary-wisata-container")
            .classList.add("hidden");
        }

        // Selected culinary options
        if (
          selectedPackage === "kuliner" ||
          selectedPackage === "wisata-kuliner"
        ) {
          document
            .getElementById("summary-kuliner-container")
            .classList.remove("hidden");
          const selectedKuliner = Array.from(
            document.querySelectorAll(".kuliner-checkbox:checked"),
          )
            .map((checkbox) =>
              checkbox.nextElementSibling.textContent.trim(),
            )
            .join(", ");
          document.getElementById("summary-kuliner").textContent = selectedKuliner;
        } else {
          document
            .getElementById("summary-kuliner-container")
            .classList.add("hidden");
        }

        step3.classList.add("hidden");
        step4.classList.remove("hidden");
        step4Indicator.classList.add("step-primary");
      }
    });

  document
    .getElementById("back-to-step-3")
    .addEventListener("click", function () {
      step4.classList.add("hidden");
      step3.classList.remove("hidden");
      step4Indicator.classList.remove("step-primary");
    });

  // Package type change handler
  packageType.addEventListener("change", function () {
    const value = this.value;
    
    // Remove error when selection is made
    this.classList.remove("input-error");
    const errorMsg = this.closest(".form-control").querySelector(".error-message");
    if (errorMsg) {
      errorMsg.remove();
    }

    if (value === "wisata") {
      wisataOptions.classList.remove("hidden");
      kulinerOptions.classList.add("hidden");
    } else if (value === "kuliner") {
      wisataOptions.classList.add("hidden");
      kulinerOptions.classList.remove("hidden");
    } else if (value === "wisata-kuliner") {
      wisataOptions.classList.remove("hidden");
      kulinerOptions.classList.remove("hidden");
    } else {
      wisataOptions.classList.add("hidden");
      kulinerOptions.classList.add("hidden");
    }
  });

  // Limit checkbox selection to exactly 5
  document
    .querySelectorAll(".wisata-checkbox")
    .forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        const checkedBoxes = document.querySelectorAll(
          ".wisata-checkbox:checked",
        );
        if (checkedBoxes.length > 5) {
          this.checked = false;
          document
            .getElementById("wisata-alert")
            .classList.remove("hidden");
        } else {
          document.getElementById("wisata-alert").classList.add("hidden");
        }
      });
    });

  document
    .querySelectorAll(".kuliner-checkbox")
    .forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        const checkedBoxes = document.querySelectorAll(
          ".kuliner-checkbox:checked",
        );
        if (checkedBoxes.length > 5) {
          this.checked = false;
          document
            .getElementById("kuliner-alert")
            .classList.remove("hidden");
        } else {
          document
            .getElementById("kuliner-alert")
            .classList.add("hidden");
        }
      });
    });

  // Form submission
  document
    .getElementById("reservationForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Check if terms checkbox is checked
      if (!document.getElementById("terms-checkbox").checked) {
        alert(
          "Anda harus menyetujui syarat dan ketentuan terlebih dahulu.",
        );
        return;
      }

      // Show success modal
      document
        .getElementById("success-modal")
        .classList.add("modal-open");
    });

  // Close modal
  document
    .getElementById("close-modal")
    .addEventListener("click", function () {
      document
        .getElementById("success-modal")
        .classList.remove("modal-open");
    });
    
  // Add CSS for validation states
  const style = document.createElement('style');
  style.textContent = `
    .input-error {
      border-color: #f87171 !important;
    }
    .text-error {
      color: #ef4444;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #4f46e5;
    }
    .form-control {
      position: relative;
    }
    .error-message {
      margin-top: 0.25rem;
      margin-bottom: 0.5rem;
    }
  `;
  document.head.appendChild(style);
  
  // Initialize input change listeners
  setupInputChangeListeners();
});