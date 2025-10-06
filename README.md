# leoForm

A simple, flexible JavaScript form validation library with no dependencies.

## Features

- ✨ Easy to use and lightweight
- 🎯 Flexible validation rules
- 🎨 Customizable error messages
- 📱 Works with any HTML form
- 🚀 No dependencies
- ✅ Built-in common validators

## Installation

Simply include the JavaScript and CSS files in your HTML:

```html
<link rel="stylesheet" href="leoForm.css">
<script src="leoForm.js"></script>
```

## Quick Start

### HTML
```html
<form id="myForm" class="leo-form">
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email">
  </div>
  <button type="submit" class="form-submit">Submit</button>
</form>
```

### JavaScript
```javascript
// Initialize the form
const myForm = new LeoForm('#myForm');

// Add validators
myForm.addValidator('email', LeoForm.validators.required, 'Email is required');
myForm.addValidator('email', LeoForm.validators.email, 'Please enter a valid email');

// Handle success
myForm.onSuccess = function(data) {
  console.log('Form submitted:', data);
};

// Handle errors
myForm.onError = function(errors) {
  console.log('Validation failed:', errors);
};
```

## API Reference

### Constructor

```javascript
new LeoForm(formElement, options)
```

**Parameters:**
- `formElement` (string|HTMLElement): Form selector or element
- `options` (object): Configuration options
  - `validateOnBlur` (boolean): Validate on field blur (default: `true`)
  - `validateOnInput` (boolean): Validate on field input (default: `false`)
  - `showErrors` (boolean): Show error messages (default: `true`)
  - `errorClass` (string): CSS class for error state (default: `'error'`)
  - `successClass` (string): CSS class for success state (default: `'success'`)

### Methods

#### `addValidator(fieldName, validatorFn, errorMessage)`
Add a validation rule to a form field.

**Parameters:**
- `fieldName` (string): Name or ID of the field
- `validatorFn` (function): Validator function that returns true/false
- `errorMessage` (string): Error message to display

#### `validateField(field)`
Validate a single field.

#### `validateAll()`
Validate all fields in the form. Returns `true` if valid, `false` otherwise.

#### `reset()`
Reset the form and clear all errors.

#### `getFormData()`
Get form data as an object.

### Built-in Validators

```javascript
LeoForm.validators.required      // Field is required
LeoForm.validators.email         // Valid email format
LeoForm.validators.number        // Valid number
LeoForm.validators.url           // Valid URL
LeoForm.validators.minLength(n)  // Minimum length
LeoForm.validators.maxLength(n)  // Maximum length
LeoForm.validators.pattern(regex) // Custom regex pattern
```

## Examples

### Basic Form with Validation

```javascript
const form = new LeoForm('#contactForm');

form.addValidator('name', LeoForm.validators.required, 'Name is required');
form.addValidator('name', LeoForm.validators.minLength(2), 'Name must be at least 2 characters');

form.addValidator('email', LeoForm.validators.required, 'Email is required');
form.addValidator('email', LeoForm.validators.email, 'Invalid email format');

form.onSuccess = function(data) {
  alert('Form submitted successfully!');
};
```

### Custom Validator

```javascript
// Add a custom validator
form.addValidator('age', (value) => {
  return value >= 18 && value <= 100;
}, 'Age must be between 18 and 100');
```

### Conditional Validation

```javascript
// Validate only if field has value (optional field)
form.addValidator('website', (value) => {
  if (value === '') return true;
  return LeoForm.validators.url(value);
}, 'Please enter a valid URL');
```

## Demo

Open `example.html` in your browser to see a working demo.

## License

MIT