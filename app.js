function getElement(selection) {
	const element = document.querySelector(selection);
	if (element) {
		return element;
	}
	throw new Error(
		`Please check "${selection}" selector, no such element exists`
	);
}

function Gallery(element) {
	this.container = element;
	this.list = element.querySelectorAll('.img');
	// use spread operator to convert nodelist returned by queryselectorall into array
	// we want an array because we want to use the map method, which doesn't work with nodelist
	this.list = [...element.querySelectorAll('.img')];

	//target
	// searching the document rather than the element
	this.modal = getElement('.modal');
	this.modalImg = getElement('.main-img');
	this.imageName = getElement('.image-name');
	this.modalImages = getElement('.modal-images');
	this.closeBtn = getElement('.close-btn');
	this.nextBtn = getElement('.next-btn');
	this.prevBtn = getElement('.prev-btn');

	//bind functions

	this.closeModal = this.closeModal.bind(this);
	this.nextImage = this.nextImage.bind(this);
	this.prevImage = this.prevImage.bind(this);
	this.chooseImage = this.chooseImage.bind(this);

	//container event

	// if you don't bind this.openModal to this, it will point to the container in eventListener instead of the gallery
	// however, this is not necessary after you add the anonymous function, so below is commented out
	// this.openModal = this.openModal.bind(this);
	// likewise, if you add the anonymous function, this will point to the container instead of the gallery
	// function is needed as you need to pass in the event (the image being clicked on), and a list
	this.container.addEventListener(
		'click',
		function (e) {
			if (e.target.classList.contains('img')) {
				this.openModal(e.target, this.list);
			}
		}.bind(this)
	);

	//can also do get around the fact that "this" will point to container by doing the following
	// 	let self = this;
	// 	this.container.addEventListener('click', function (e) {
	// 		self.openModal();
	// 	});
}

Gallery.prototype.openModal = function (selectedImage, list) {
	// console.log(selectedImage, list);
	this.setMainImage(selectedImage);
	this.modalImages.innerHTML = list
		.map(function (image) {
			// console.log(image);
			return `<img src="${
				image.src
			}" title="${image.title}" data-id="${image.dataset.id}" class="${selectedImage.dataset.id === image.dataset.id ? 'modal-img selected' : 'modal-img'}"/>`;
		})
		.join('');
	this.modal.classList.add('open');
	this.closeBtn.addEventListener('click', this.closeModal);
	this.nextBtn.addEventListener('click', this.nextImage);
	this.prevBtn.addEventListener('click', this.prevImage);
	this.modalImages.addEventListener('click', this.chooseImage);
};

Gallery.prototype.setMainImage = function (selectedImage) {
	this.modalImg.src = selectedImage.src;
	this.imageName.textContent = selectedImage.title;
};

Gallery.prototype.closeModal = function () {
	this.modal.classList.remove('open');
	this.closeBtn.removeEventListener('click', this.closeModal);
	this.nextBtn.removeEventListener('click', this.nextImage);
	this.prevBtn.removeEventListener('click', this.prevImage);
	this.modalImages.removeEventListener('click', this.chooseImage);
};

Gallery.prototype.nextImage = function () {
	const selected = this.modalImages.querySelector('.selected');
	const next =
		selected.nextElementSibling || this.modalImages.firstElementChild;
	selected.classList.remove('selected');
	next.classList.add('selected');
	this.setMainImage(next);
};
Gallery.prototype.prevImage = function () {
	const selected = this.modalImages.querySelector('.selected');
	const prev =
		selected.previousElementSibling || this.modalImages.lastElementChild;
	selected.classList.remove('selected');
	prev.classList.add('selected');
	this.setMainImage(prev);
};
Gallery.prototype.chooseImage = function (e) {
	if (e.target.classList.contains('modal-img')) {
		const selected = this.modalImages.querySelector('.selected');
		selected.classList.remove('selected');
		this.setMainImage(e.target);
		e.target.classList.add('selected');
	}
};

const nature = new Gallery(getElement('.nature'));
const city = new Gallery(getElement('.city'));
