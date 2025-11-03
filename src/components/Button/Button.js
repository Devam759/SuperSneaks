(function(){
  window.Components = window.Components || {};
  window.Components.Button = function Button(){
    document.querySelectorAll('[data-component="Button"]').forEach(function(el){
      el.addEventListener('click', function(){
        el.classList.add('is-loading');
        setTimeout(function(){ el.classList.remove('is-loading'); alert('Action completed'); }, 800);
      });
    });
  };
})();
