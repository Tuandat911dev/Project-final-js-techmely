const contactBtnEl = document.querySelectorAll('.js-contactButton');
const contactContentEl = document.querySelectorAll('.js-contactContent');

window.addEventListener('popstate', function () {
	let url = this.window.location.href;
	let id = url.split('#')[1];
	let btnIsShow = document.querySelector('.js-contactButton.is-show');

	if (id === 'reach-us' || id === 'about-us' || id === 'find-us') {
		const target = document.getElementById('contact');
		target.scrollIntoView({ behavior: 'smooth' });
	}

	contactBtnEl.forEach((btn) => {
		if (btn.getAttribute('data-name') === id) {
			btnIsShow.classList.remove('is-show');
			btn.classList.add('is-show');
		}
	});

	contactContentEl.forEach((content) => {
		let contentIsShow = document.querySelector(
			'.js-contactContent.is-show'
		);
		if (content.getAttribute('data-name') === id) {
			contentIsShow.classList.remove('is-show');
			content.classList.add('is-show');
		}
	});
});

contactBtnEl.forEach((btn) => {
	btn.addEventListener('click', () => {
		let btnIsShow = document.querySelector('.js-contactButton.is-show');
		btnIsShow.classList.remove('is-show');
		btn.classList.add('is-show');
		let contentType = btn.getAttribute('data-name');

		contactContentEl.forEach((content) => {
			let contentIsShow = document.querySelector(
				'.js-contactContent.is-show'
			);
			if (content.getAttribute('data-name') === contentType) {
				contentIsShow.classList.remove('is-show');
				content.classList.add('is-show');
			}
		});
	});
});
