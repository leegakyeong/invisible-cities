document.addEventListener('DOMContentLoaded', () => {
  const items = document.getElementsByClassName('list-item');
  const slidedown = document.getElementsByClassName('slidedown');

  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener('click', function() {
      if (slidedown[i].classList.contains('hidden')) {
        for (let k = 0; k < items.length; k++) {
          slidedown[k].classList.add('hidden');
        }
        slidedown[i].classList.remove('hidden');
      } else {
        slidedown[i].classList.add('hidden');
      }
    });
  }
});
