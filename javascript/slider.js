const data = [
	{
		img: '../images/slider-1.png',
		url: '!#',
	},
	{
		img: '../images/slider-2.png',
		url: '!#',
	},
	{
		img: '../images/slider-3.png',
		url: '!#',
	},
];

class Slide {
	constructor(img, url) {
		(this.img = img), (this.url = url);
	}
}

class Carousel {
	constructor() {
		let slides = data.map((item) => new Slide(item.img, item.url));
		if (slides.length === 2) {
			slides.push(slides[0], slides[1]);
		}

		this.slides = slides;
		this.carouselContainer = document.querySelector(
			'.js-sliderItemContainer'
		);
	}

	init() {
		let slideHtml = this.slides
			.map((slide, index) => {
				let status = '';
				if (this.slides.length <= 1) {
					status = 'active';
				} else {
					if (index === 0) {
						status = 'last';
					} else if (index === 1) {
						status = 'active';
					} else if (index === 2) {
						status = 'next';
					} else {
						status = '';
					}
				}

				return `<a href="${slide.url}" class="slider__item js-sliderItem ${status}">
                  		<img class="slider__item__image" src="${slide.img}" alt="Shopping">
                	</a>`;
			})
			.join('');

		this.carouselContainer.innerHTML = slideHtml;

		let btnPrev = document.querySelector('.js-btnPrev');
		let btnNext = document.querySelector('.js-btnNext');

		btnPrev.addEventListener('mousedown', () => {
			if (this.slides.length <= 1) return;
			this.changeSlide('prev');
		});

		btnNext.addEventListener('mousedown', () => {
			if (this.slides.length <= 1) return;
			this.changeSlide('next');
		});

		[btnPrev, btnNext].forEach((btn) => {
			btn.addEventListener("mousedown", stopCarousel);
			btn.addEventListener("mouseup", startCarousel);
			btn.addEventListener("mouseout", startCarousel);
		})
	}

	changeSlide(direction) {
		// get dom
		let lastSlide = document.querySelector('.js-sliderItem.last');
		let activeSlide = document.querySelector('.js-sliderItem.active');
		let nextSlide = document.querySelector('.js-sliderItem.next');

		// Remove old status
		lastSlide.classList.remove('last');
		activeSlide.classList.remove('active');
		nextSlide.classList.remove('next');

		// change status when click next
		if (direction === 'next') {
			lastSlide.nextElementSibling === null
				? this.carouselContainer.firstElementChild.classList.add('last')
				: lastSlide.nextElementSibling.classList.add('last');

			activeSlide.nextElementSibling === null
				? this.carouselContainer.firstElementChild.classList.add(
						'active'
				  )
				: activeSlide.nextElementSibling.classList.add('active');

			nextSlide.nextElementSibling === null
				? this.carouselContainer.firstElementChild.classList.add('next')
				: nextSlide.nextElementSibling.classList.add('next');
		}

		// change status when click prev
		if (direction === 'prev') {
			lastSlide.previousElementSibling === null
				? this.carouselContainer.lastElementChild.classList.add('last')
				: lastSlide.previousElementSibling.classList.add('last');

			activeSlide.previousElementSibling === null
				? this.carouselContainer.lastElementChild.classList.add(
						'active'
				  )
				: activeSlide.previousElementSibling.classList.add('active');

			nextSlide.previousElementSibling === null
				? this.carouselContainer.lastElementChild.classList.add('next')
				: nextSlide.previousElementSibling.classList.add('next');
		}
	}
}

const carousel = new Carousel();
carousel.init();

let intervalId = null;
function startCarousel() {
	if (intervalId !== null) return;
	intervalId = setInterval(() => {
		carousel.changeSlide('next');
	}, 4000);
}

function stopCarousel() {
	clearInterval(intervalId);
	intervalId = null;
}

startCarousel();
