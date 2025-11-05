async function fetchData() {
	let productRes = await fetch('./data/products.json');
	let productsStr = await productRes.json();

	let categoryRes = await fetch('./data/categories.json');
	let categoryStr = await categoryRes.json();

	return [JSON.parse(productsStr), JSON.parse(categoryStr)];
}

fetchData().then(([products, categories]) => {
	productDOM.products = products.map((product) => {
		return new Product(
			product.category,
			product.desc,
			product.id,
			product.img,
			product.price,
			product.title
		);
	});

	productDOM.categories = categories.map((category) => {
		return new Category(category);
	});

	productDOM.renderCategoryName();
	productDOM.renderProduct();
	productDOM.addToCart();
});

class Product {
	constructor(category, desc, id, img, price, title) {
		this.category = category;
		this.desc = desc;
		this.id = id;
		this.img = img;
		this.price = price;
		this.title = title;
	}
}

class Category {
	constructor(name) {
		this.name = name;
	}
}

class ProductDOM {
	products = [];
	categories = [];
	constructor() {
		this.cart = new Cart();
	}

	getProductById(id) {
		return this.products.filter((product) => product.id == id)[0];
	}

	addToCart() {
		let cartBtnEl = document.querySelectorAll('.js-productItemButton');
		cartBtnEl.forEach((btn) => {
			btn.addEventListener('mousedown', () => {
				let productId = btn.parentElement.getAttribute('data-id');
				let product = this.getProductById(productId);

				this.cart.addToCart(product);
			});
		});
	}

	renderCategoryName() {
		let categoryContainerEl = document.querySelector(
			'.js-productCategoryContainer'
		);

		let categoryList = this.categories
			.map((category) => {
				return `<button type="button" class="product__category js-productCategory 
            ${category.name === 'all' ? 'is-active' : ''}" 
            aria-label="${category.name}" 
            data-name="${category.name}">${category.name}</button>`;
			})
			.join('');

		categoryContainerEl.innerHTML = categoryList;
		this.changeActiveCategory(categoryContainerEl);
	}

	renderProduct(category) {
		let productContainerEl = document.querySelector('.js-productContainer');

		let renderHtml = (product) => {
			return `
                    <div class="product__item js-productItem" data-id="${
						product.id
					}">
                    <img class="product__item__image" src="${
						product.img
					}" alt="${product.title}">
                    <div class="product__item__detail">
                        <div class="product__item__detail__title">${
							product.title
						}</div>
                        <div class="product__item__detail__desc">
                        ${product.desc}
                        </div>
                        <div class="product__item__detail__price js-productItemPrice">
                        ${formatUSD(product.price)}
                        </div>
                    </div>
                        <button class="button button--primary js-productItemButton" type="button" aria-label="Add to Cart">
                            Add to Cart
                        </button>
                    </div>
                    `;
		};

		let productList = this.products
			.map((product) => {
				if (
					category === 'all' ||
					category === '' ||
					category === undefined
				) {
					return renderHtml(product);
				} else {
					if (category === product.category) {
						let categoryList = document.querySelectorAll(
							'.js-productCategory'
						);

						categoryList.forEach((item) => {
							let categoryItemActive = document.querySelector(
								'.js-productCategory.is-active'
							);

							if (item.getAttribute('data-name') === category) {
								categoryItemActive.classList.remove(
									'is-active'
								);
								item.classList.add('is-active');
							}
						});
						return renderHtml(product);
					}
				}
			})
			.join('');

		productContainerEl.innerHTML = productList;
		this.eventDiscover();
	}

	changeActiveCategory(categoryContainerEl) {
		let categoryList = categoryContainerEl.querySelectorAll(
			'.js-productCategory'
		);

		categoryList.forEach((category) => {
			category.addEventListener('click', () => {
				let categoryItemActive = categoryContainerEl.querySelector(
					'.js-productCategory.is-active'
				);
				categoryItemActive.classList.remove('is-active');
				category.classList.add('is-active');
				this.renderProduct(category.getAttribute('data-name'));
			});
		});
	}

	eventDiscover() {
		let btnDiscoverEl = document.querySelectorAll('.js-featuredItemButton');
		btnDiscoverEl.forEach((btn) => {
			btn.addEventListener('mousedown', () => {
				this.renderProduct(btn.getAttribute('data-name'));
				const target = document.getElementById('products');
				target.scrollIntoView({ behavior: 'smooth' });
			});
		});
	}
}

class ProductCart {
	constructor(product, quantity) {
		this.product = product;
		this.quantity = quantity;
		this.price = this.product.price * this.quantity;
	}
}

class Cart {
	constructor() {
		this.productCarts = JSON.parse(sessionStorage.getItem('carts')) || [];
		this.cartDOM = new CartDOM(this);
	}

	updateStorage(productCarts) {
		sessionStorage.setItem('carts', JSON.stringify(productCarts));
		this.productCarts = JSON.parse(sessionStorage.getItem('carts'));
	}

	updateTotalQuantity() {
		let quantity = this.productCarts.length;
		let cartTitleEl = document.querySelector('.js-headerCartTitle');
		cartTitleEl.innerText = `Cart(${quantity})`;
	}

	addToCart(product) {
		this.productCarts = JSON.parse(sessionStorage.getItem('carts'));
		if (this.productCarts.length === 0) {
			this.productCarts.push(new ProductCart(product, 1));
			this.updateStorage(this.productCarts);
			this.updateTotalQuantity();
			this.cartDOM.renderCart();
			return;
		}

		let currentProduct = this.productCarts.filter((productCart) => {
			return productCart.product.id === product.id;
		});

		if (currentProduct.length === 0) {
			this.productCarts.push(new ProductCart(product, 1));
			this.updateStorage(this.productCarts);
		} else {
			this.updateCart(product, 1);
		}

		this.updateTotalQuantity();
		this.cartDOM.renderCart();
	}

	updateCart(product, quantity) {
		this.productCarts = JSON.parse(sessionStorage.getItem('carts'));
		let productIndex = this.productCarts.findIndex((item) => {
			return item.product.id === product.id;
		});

		if (!(this.productCarts[productIndex].quantity <= 1 && quantity < 0)) {
			this.productCarts[productIndex].quantity += quantity;
			this.productCarts[productIndex].price =
				this.productCarts[productIndex].quantity * product.price;

			this.updateStorage(this.productCarts);
			this.updateTotalQuantity();
			this.cartDOM.renderCart();
		}
	}

	deleteToCart(product) {
		this.productCarts = JSON.parse(sessionStorage.getItem('carts'));
		let newCart = this.productCarts.filter(
			(item) => item.product.id !== product.id
		);
		this.updateStorage(newCart);
		this.updateTotalQuantity();
		this.cartDOM.renderCart();
	}
}

class CartDOM {
	constructor(cart) {
		this.cart = cart;
	}

	renderCart() {
		let productCarts = JSON.parse(sessionStorage.getItem('carts'));
		let cartContainerEl = document.querySelector(
			'.js-cartProductContainer'
		);
		let cartTotalPriceEl = document.querySelector('.cart__total__price');
		let cartTotalProductEl = document.querySelector(
			'.cart__total__quantity'
		);
		let totalPrice = 0;
		let totalProduct = 0;

		if (productCarts.length === 0) {
			cartContainerEl.innerHTML = `<div class="cart__empty js-cartEmpty">
                                            There is nothing added in your cart.
                                        </div>`;
			cartTotalPriceEl.innerText = `$0`;
			cartTotalProductEl.innerText = `0 products`;
		} else {
			let cartList = productCarts
				.map((item) => {
					totalPrice += item.price;
					totalProduct++;
					return `
                    <div class="cart__product js-cartProduct" data-id="${
						item.product.id
					}">
                        <div class="cart__product-top-wrapper">
                        <figure>
                            <img src="${item.product.img}" alt="${
						item.product.title
					}" class="cart__product__image">
                        </figure>
                        <div class="cart__product__content">
                            <div class="cart__product__content__title">${
								item.product.title
							}</div>
                            <div class="cart__product__content__desc">${
								item.product.desc
							}</div>
                            <div class="product__quantity">
                            <button type="button" aria-label="Product Decrease" class="product__quantity__item product__quantity__item--decrease js-quantityButton js-quantityDecreaseButton">
                                <svg class="icon icon-minus">
                                <use xlink:href="#icon-minus"></use>
                                </svg>
                            </button>
                            <input type="number" class="product__quantity__item product__quantity__item--input js-quantityInput" max="7" value="${
								item.quantity
							}">
                            <button type="button" aria-label="Product Increase" class="product__quantity__item product__quantity__item--increase js-quantityButton js-quantityIncreaseButton">
                                <svg class="icon icon-plus">
                                <use xlink:href="#icon-plus"></use>
                                </svg>
                            </button>
                            </div>
                        </div>
                        </div>
                        	<div class="cart__product__price__wrapper">
                                <div
                                    class="cart__product__price js-cartProductPrice"
                                >
                                    ${formatUSD(item.price)}
                                </div>

                                <img
                                    src="./images/trash.svg"
                                    alt="trash"
                                    class="cart__product__trash"
                                    data-id="${item.product.id}"
                                />
						    </div>
                    </div>
                `;
				})
				.join('');

			cartTotalPriceEl.innerText = `${formatUSD(totalPrice)}`;
			cartTotalProductEl.innerText = `${totalProduct} products`;
			cartContainerEl.innerHTML = cartList;
			this.eventUpdateCart();
			this.eventDeleteCart();
		}
	}

	eventUpdateCart() {
		let decreaseBtnEl = document.querySelectorAll(
			'.js-quantityDecreaseButton'
		);

		let increaseBtnEl = document.querySelectorAll(
			'.js-quantityIncreaseButton'
		);

		let productCarts = JSON.parse(sessionStorage.getItem('carts'));

		decreaseBtnEl.forEach((btn) => {
			btn.addEventListener('mousedown', () => {
				let productId = btn
					.closest('.js-cartProduct')
					.getAttribute('data-id');

				let product = productCarts.filter(
					(item) => item.product.id == productId
				)[0].product;

				this.cart.updateCart(product, -1);
			});
		});

		increaseBtnEl.forEach((btn) => {
			btn.addEventListener('mousedown', () => {
				let productId = btn
					.closest('.js-cartProduct')
					.getAttribute('data-id');

				let product = productCarts.filter(
					(item) => item.product.id == productId
				)[0].product;

				this.cart.updateCart(product, 1);
			});
		});
	}

	eventDeleteCart() {
		let productCarts = JSON.parse(sessionStorage.getItem('carts'));
		let deleteCartBtn = document.querySelectorAll('.cart__product__trash');
		deleteCartBtn.forEach((btn) => {
			btn.addEventListener('mousedown', () => {
				let productId = btn.getAttribute('data-id');
				let product = productCarts.filter(
					(item) => item.product.id == productId
				)[0].product;

				this.cart.deleteToCart(product);
			});
		});
	}

	openCart() {
		let cartBtnEl = document.querySelector('.header__button-container');
		let cartPanelEl = document.querySelector('.js-cart');
		cartBtnEl.addEventListener('mousedown', () => {
			cartPanelEl.style.transform = 'translateX(0%)';

			this.renderCart();
		});

		this.closeCart(cartPanelEl);
	}

	closeCart(cartPanelEl) {
		let closeCartBtnEl = document.querySelector('.js-cartCloseButton');
		closeCartBtnEl.addEventListener('click', () => {
			cartPanelEl.style.transform = 'translateX(100%)';
		});
	}
}

if (sessionStorage.getItem('carts') === null) {
	sessionStorage.setItem('carts', JSON.stringify([]));
}

const productDOM = new ProductDOM();
const cart = new Cart();
const cartDOM = new CartDOM(cart);

cart.updateTotalQuantity();
cartDOM.openCart();

function formatUSD(price) {
	let USDollar = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

	return USDollar.format(price);
}
