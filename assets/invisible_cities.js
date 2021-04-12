// const habitantsClicker = document.getElementsByClassName('habitants-clicker')[0];
// const hexitButton = document.getElementsByClassName('hexit')[0];

// habitantsClicker.addEventListener('click', function() {
//   console.log(1);
//   const hab = document.getElementsByClassName('hwrapper')[0];
//   hab.style.display = 'flex';
//   hab.style.visibility = 'visible';
//   hab.style.zIndex = '2';
//   hab.style.position = 'relative';
//   habitantsClicker.style.zIndex = '0';
//   document.getElementsByClassName('container')[0].style.backgroundImage = 'blur(5px)';
// });

// hexitButton.addEventListener('click', function() {
//   const hab = document.getElementsByClassName('hwrapper')[0];
//   hab.style.display = 'none';
//   hab.style.visibility = 'hidden';
//   habitantsClicker.style.zIndex = '1';
// });

// const dataSiloClicker = document.getElementsByClassName('data-silo-clicker')[0];
// const dexit_button = document.getElementsByClassName('dexit')[0];

// dataSiloClicker.addEventListener('click', function() {
//   const dat = document.getElementsByClassName('dwrapper')[0];
//   dat.style.display = 'flex';
//   dat.style.visibility = 'visible';
//   dat.style.zIndex = '2';
//   dat.style.position = 'relative';
//   dataSiloClicker.style.zIndex = '0';
//   document.getElementsByClassName('container')[0].style.backgroundImage = 'blur(5px)';
// });

// dexit_button.addEventListener('click', function() {
//   const dat = document.getElementsByClassName('dwrapper')[0];
//   dat.display = 'none';
//   dat.style.visibility = 'hidden';
//   dat.style.zIndex = '-1';
// });

const slide = document.querySelector('#slide');
slide.addEventListener('click', function() {
  const slidedown = slide.nextElementSibling;

  if (slidedown.style.display == 'none') {
    slidedown.style.display = 'inline-block';
    slidedown.style.heigt = '20vh';
  } else {
    slidedown.style.display = 'none';
  }
});
