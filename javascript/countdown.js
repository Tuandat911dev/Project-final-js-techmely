const endDateEl = document.querySelector('.js-endDate time');
const countdownEl = document.querySelector('.js-countdown');
const countdownValEl = document.querySelectorAll('.js-countdownValue');

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const weeks = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];

const numberOfSaleDay = 10;
const currentDate = new Date();
const endDate = new Date(
	currentDate.getFullYear(),
	currentDate.getMonth(),
	currentDate.getDate() + numberOfSaleDay,
	9,
	11,
	0
);

endDateEl.innerHTML = `${weeks[endDate.getDay()]}, ${endDate.getDate()} 
                       ${months[endDate.getMonth()]} ${endDate.getFullYear()} 
                       ${endDate.getHours()}:${endDate.getMinutes()}`;

const runCountdown = setInterval(() => {
	let currentTime = new Date().getTime();
	let endTime = endDate.getTime();
	let remainingTime = endTime - currentTime;
	let oneSecond = 1000;
	let oneMinute = 60 * oneSecond;
	let oneHour = 60 * oneMinute;
	let oneDay = 24 * oneHour;

	let days = Math.floor(remainingTime / oneDay);
	let hours = Math.floor((remainingTime % oneDay) / oneHour);
	let minutes = Math.floor((remainingTime % oneHour) / oneMinute);
	let seconds = Math.floor((remainingTime % oneMinute) / oneSecond);
	let end = [days, hours, minutes, seconds];
	let format = (number) => {
		return number >= 10 ? number : `0${number}`;
	};

	countdownValEl.forEach((item, index) => {
		item.innerText = `${format(end[index])}`;
	});

	if (remainingTime <= 0) {
		countdownValEl.forEach((item, index) => {
			item.innerText = '00';
		});
        clearInterval(runCountdown);
	}
}, 1000);
