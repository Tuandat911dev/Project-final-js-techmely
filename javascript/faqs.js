const fagQuestionEls = document.querySelectorAll('.js-faqsQuestion');
const fagQuestionWrapper = document.querySelectorAll('.js-faqsWrapper');

fagQuestionEls.forEach((fag) => {
	fag.addEventListener('click', () => {
		let currentWrapper = fag.parentElement;
		currentWrapper.classList.toggle('is-show');

		fagQuestionWrapper.forEach((item) => {
			if (item !== currentWrapper) {
				item.classList.remove('is-show');
			}
		});
	});
});
