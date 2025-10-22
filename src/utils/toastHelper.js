import { toast } from "react-toastify";

/**
 * Show validation errors from API response
 * @param {Object} errors - Validation errors object from API
 */
export const showValidationErrors = (errors) => {
  if (!errors || typeof errors !== 'object') return;
  
  Object.entries(errors).forEach(([field, messages]) => {
    if (Array.isArray(messages)) {
      messages.forEach(msg => toast.error(msg));
    } else if (typeof messages === 'string') {
      toast.error(messages);
    }
  });
};

/**
 * Show error message
 * @param {string|Object} error - Error message or error object
 */
export const showError = (error) => {
  if (typeof error === 'string') {
    toast.error(error);
  } else if (error?.response?.data?.message) {
    toast.error(error.response.data.message);
  } else if (error?.message) {
    toast.error(error.message);
  } else {
    toast.error('An error occurred');
  }
};

/**
 * Show success message
 * @param {string} message - Success message
 */
export const showSuccess = (message) => {
  toast.success(message);
};

/**
 * Handle API error with validation support
 * @param {Object} error - Axios error object
 * @param {Function} setFieldErrors - Optional function to set field errors state
 */
export const handleApiError = (error, setFieldErrors = null) => {
  if (error?.response?.data?.errors) {
    showValidationErrors(error.response.data.errors);
    if (setFieldErrors) {
      setFieldErrors(error.response.data.errors);
    }
  } else {
    showError(error);
  }
};

