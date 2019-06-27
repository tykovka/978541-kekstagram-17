'use strict';

var commentVariations = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var names = ['Артем', 'Саша', 'Кристина', 'rose555', 'Сережа', 'Света', 'fox777', 'Коля', 'Петя'];
var objectsQuantity = 25;

var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
var picturesElement = document.querySelector('.pictures');
var fragment = document.createDocumentFragment();

function getRandomIntegerFromInterval(min, max) {
  return Math.round(Math.random() * (max - min + 1) + min);
}

function getRandomComment(quantity) {
  var comments = [];
  for (var i = 0; i < quantity; i++) {
    comments[i] = {
      avatar: 'image/avatar-' + getRandomIntegerFromInterval(1, 6) + '.svg',
      message: commentVariations[getRandomIntegerFromInterval(0, commentVariations.length - 1)],
      name: names[getRandomIntegerFromInterval(0, names.length)]
    };
  }

  return comments;
}

function cteateObjectPhoto(number) {
  var photo;
  photo = {
    url: 'photos/' + (number) + '.jpg',
    likes: getRandomIntegerFromInterval(15, 250),
    comments: getRandomComment(getRandomIntegerFromInterval(1, 5))
  };
  return photo;
}

function createPicturesDOM(image) {
  var picture = pictureTemplate.cloneNode(true);
  picture.querySelector('.picture__img').src = image.url;
  picture.querySelector('.picture__comments').textContent = image.comments.length;
  picture.querySelector('.picture__likes').textContent = image.likes;

  return picture;
}

for (var i = 1; i <= objectsQuantity; i++) {
  fragment.appendChild(createPicturesDOM(cteateObjectPhoto(i)));
}

picturesElement.appendChild(fragment);

var uploadInputFile = document.querySelector('#upload-file');
var uploadOverlay = document.querySelector('.img-upload__overlay');
uploadInputFile.addEventListener('change', function () {
  uploadOverlay.classList.remove('hidden');
});
