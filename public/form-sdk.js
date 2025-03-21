/**
 * Datalinc Form SDK - v1.0.0
 * A simple SDK for submitting form data to the Datalinc API
 */

(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory()
    : typeof define === 'function' && define.amd
      ? define(factory)
      : global.DatalincForm = factory();
}(this, function() {
  'use strict';

  /**
   * DatalincForm - Client-side SDK for sending form submissions
   * @param {Object} options - Configuration options
   * @param {string} options.clientId - The client ID (required)
   * @param {string} options.formType - The form type (default: 'contact')
   * @param {string} options.apiUrl - The API URL (default: 'https://datalinc.io/api/forms/submit')
   */
  function DatalincForm(options) {
    if (!options || !options.clientId) {
      throw new Error('DatalincForm: clientId is required');
    }

    this.clientId = options.clientId;
    this.formType = options.formType || 'contact';
    this.apiUrl = options.apiUrl || 'https://datalinc.io/api/forms/submit';
  }

  /**
   * Submit form data to the Datalinc API
   * @param {Object} formData - The form data to submit
   * @param {string} formData.name - The name of the sender (required)
   * @param {string} formData.email - The email of the sender (required)
   * @param {string} formData.message - The message content (required)
   * @param {string} [formData.company] - The company name (optional)
   * @param {Object} [formData.metadata] - Additional metadata (optional)
   * @returns {Promise} - A promise that resolves with the API response
   */
  DatalincForm.prototype.submit = function(formData) {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return Promise.reject(new Error('Name, email, and message are required'));
    }

    // Create payload
    const payload = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      clientId: this.clientId,
      formType: this.formType,
      company: formData.company || '',
      metadata: formData.metadata || {}
    };

    // Make API request
    return fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.error || 'Form submission failed');
        });
      }
      return response.json();
    })
    .catch(error => {
      console.error('DatalincForm error:', error);
      throw error;
    });
  };

  /**
   * Create a form handler that automatically handles form submission
   * @param {string|HTMLFormElement} formSelector - CSS selector or form element
   * @param {Object} options - Additional options
   * @param {Function} [options.onSuccess] - Success callback
   * @param {Function} [options.onError] - Error callback
   * @param {boolean} [options.resetOnSuccess] - Whether to reset the form on success
   * @returns {Object} - The form handler
   */
  DatalincForm.prototype.createFormHandler = function(formSelector, options = {}) {
    const form = typeof formSelector === 'string'
      ? document.querySelector(formSelector)
      : formSelector;

    if (!form || !(form instanceof HTMLFormElement)) {
      throw new Error('Invalid form element');
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      
      // Extract form data
      const formData = {
        name: form.elements.name?.value,
        email: form.elements.email?.value,
        message: form.elements.message?.value,
        company: form.elements.company?.value
      };

      // Get any additional fields
      const metadata = {};
      Array.from(form.elements).forEach(element => {
        if (element.name && !['name', 'email', 'message', 'company'].includes(element.name)) {
          metadata[element.name] = element.value;
        }
      });

      if (Object.keys(metadata).length > 0) {
        formData.metadata = metadata;
      }

      // Submit form
      this.submit(formData)
        .then(response => {
          if (options.onSuccess) {
            options.onSuccess(response);
          }
          if (options.resetOnSuccess !== false) {
            form.reset();
          }
        })
        .catch(error => {
          if (options.onError) {
            options.onError(error);
          }
        });
    };

    form.addEventListener('submit', handleSubmit);

    return {
      form,
      unbind: () => form.removeEventListener('submit', handleSubmit)
    };
  };

  return DatalincForm;
})); 