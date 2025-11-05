const scrollTop = document.querySelector('.js-scrollTop');

window.addEventListener('scroll', () => {
	if (window.scrollY > 300) {
		scrollTop.classList.add('is-show');
	} else {
		scrollTop.classList.remove('is-show');
	}
});

scrollTop.addEventListener('click', () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
});


