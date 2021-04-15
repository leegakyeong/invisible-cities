window.addEventListener('load', () => {
  const dataSilo = document.getElementsByClassName('data-silo');
  const slidedown = document.getElementsByClassName('slidedown');

  for (let i = 0; i < dataSilo.length; i++) {
    dataSilo[i].addEventListener('click', function () {
      if (slidedown[i].classList.contains('hidden')) {
        for (let k = 0; k < dataSilo.length; k++) {
          slidedown[k].classList.add('hidden');
        }
        slidedown[i].classList.remove('hidden');
      } else {
        slidedown[i].classList.add('hidden');
      }
    });
  }
});
