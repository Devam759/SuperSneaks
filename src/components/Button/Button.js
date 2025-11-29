// src/components/Button/Button.js
// Button Component Logic
(function () {
  window.Components = window.Components || {};
  // Define Button component behavior
  window.Components.Button = function Button() {
    // Find all elements with data-component="Button"
    document.querySelectorAll('[data-component="Button"]').forEach(function (el) {
      // Add click event listener for loading effect
      el.addEventListener('click', function () {
        el.classList.add('is-loading');
        // Simulate async action
        setTimeout(function () { el.classList.remove('is-loading'); alert('Action completed'); }, 800);
      });
    });
  };
})();
