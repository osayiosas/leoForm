/**
 * leoForm - A simple, flexible form validation library
 * @version 1.0.0
 */

class LeoForm {
  constructor(formElement, options = {}) {
    this.form = typeof formElement === 'string' 
      ? document.querySelector(formElement) 
      : formElement;
    
    if (!this.form) {
      throw new Error('Form element not found');
    }

    this.options = {
      validateOnBlur: true,
      validateOnInput: false,
      showErrors: true,
      errorClass: 'error',
      successClass: 'success',
      ...options
    };

    this.validators = {};
    this.errors = {};
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    if (this.options.validateOnBlur || this.options.validateOnInput) {
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (this.options.validateOnBlur) {
          input.addEventListener('blur', () => this.validateField(input));
        }
        if (this.options.validateOnInput) {
          input.addEventListener('input', () => this.validateField(input));
        }
      });
    }
  }

  addValidator(fieldName, validatorFn, errorMessage) {
    if (!this.validators[fieldName]) {
      this.validators[fieldName] = [];
    }
    this.validators[fieldName].push({ fn: validatorFn, message: errorMessage });
  }

  validateField(field) {
    const fieldName = field.name || field.id;
    const value = field.value;
    
    if (!this.validators[fieldName]) {
      return true;
    }

    let isValid = true;
    delete this.errors[fieldName];

    for (let validator of this.validators[fieldName]) {
      if (!validator.fn(value, field)) {
        isValid = false;
        this.errors[fieldName] = validator.message;
        break;
      }
    }

    if (this.options.showErrors) {
      this.displayFieldError(field, isValid);
    }

    return isValid;
  }

  displayFieldError(field, isValid) {
    const fieldName = field.name || field.id;
    const errorElement = this.getOrCreateErrorElement(field);
    
    field.classList.remove(this.options.errorClass, this.options.successClass);
    
    if (!isValid) {
      field.classList.add(this.options.errorClass);
      errorElement.textContent = this.errors[fieldName];
      errorElement.style.display = 'block';
    } else {
      field.classList.add(this.options.successClass);
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  getOrCreateErrorElement(field) {
    const fieldName = field.name || field.id;
    let errorElement = this.form.querySelector(`[data-error-for="${fieldName}"]`);
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      errorElement.setAttribute('data-error-for', fieldName);
      errorElement.style.display = 'none';
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    return errorElement;
  }

  validateAll() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    
    inputs.forEach(input => {
      const fieldName = input.name || input.id;
      if (this.validators[fieldName]) {
        if (!this.validateField(input)) {
          isFormValid = false;
        }
      }
    });

    return isFormValid;
  }

  handleSubmit() {
    if (this.validateAll()) {
      this.onSuccess(this.getFormData());
    } else {
      this.onError(this.errors);
    }
  }

  getFormData() {
    const formData = new FormData(this.form);
    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    return data;
  }

  onSuccess(data) {
    console.log('Form submitted successfully:', data);
  }

  onError(errors) {
    console.log('Form validation errors:', errors);
  }

  reset() {
    this.form.reset();
    this.errors = {};
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.classList.remove(this.options.errorClass, this.options.successClass);
    });
    const errorElements = this.form.querySelectorAll('.form-error');
    errorElements.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }
}

// Built-in validators
LeoForm.validators = {
  required: (value) => value.trim() !== '',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: (min) => (value) => value.length >= min,
  maxLength: (max) => (value) => value.length <= max,
  pattern: (regex) => (value) => regex.test(value),
  number: (value) => !isNaN(value) && value.trim() !== '',
  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
};

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LeoForm;
}
