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
var ESC_CODE = 27;
var ZOOM_IN = 'zoomIn';
var ZOOM_OUT = 'zoomOut';
var FILTER_VALUE_DEFAULT = 100;
var SCALE_VALUE_DEFAULT = 100;
var Scale = {
  STEP: 25,
  MAX: 100,
  MIN: 25
};
var ChromeEffect = {
  MIN: 0,
  MAX: 1
};
var SepiaEffect = {
  MIN: 0,
  MAX: 1
};
var MarvinEffect = {
  MIN: 0,
  MAX: 100
};
var FhobosEffect = {
  MIN: 0,
  MAX: 3
};
var HeatEffect = {
  MIN: 1,
  MAX: 3
};

var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
var picturesElement = document.querySelector('.pictures');
var fragment = document.createDocumentFragment();

var uploadInputFile = document.querySelector('#upload-file');
var uploadFormOverlay = document.querySelector('.img-upload__overlay');
var uploadCancelFormOverlay = document.querySelector('.img-upload__cancel');
var scaleControlSmallerElement = document.querySelector('.scale__control--smaller');
var scaleControlBiggerElement = document.querySelector('.scale__control--bigger');
var scaleControlValueElement = document.querySelector('.scale__control--value');
var effectsList = document.querySelector('.effects__list');
var effectLevelElement = document.querySelector('.effect-level__pin');
var effectLevelInputElement = document.querySelector('.effect-level__value');
var imgPreviewElement = document.querySelector('.img-upload__preview');
var imgUploadSliderElement = document.querySelector('.img-upload__effect-level');
var uploadPhotoCommentElement = document.querySelector('.text__description');
var uploadSubmitButtonElement = document.querySelector('.img-upload__submit');
var textHashtagsElement = document.querySelector('.text__hashtags');
var EffectsInterval = {
  chrome: ChromeEffect.MAX - ChromeEffect.MIN,
  sepia: SepiaEffect.MAX - SepiaEffect.MIN,
  marvin: MarvinEffect.MAX - MarvinEffect.MIN,
  phobos: FhobosEffect.MAX - FhobosEffect.MIN,
  heat: HeatEffect.MAX - HeatEffect.MIN
};


function openPopup() {
  var checkedFilterType = effectsList.querySelector('input:checked').value;

  uploadFormOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscKeydown);
  uploadSubmitButtonElement.addEventListener('click', onUploadSubmitButtonClick);
  scaleControlBiggerElement.addEventListener('click', onScaleBiggerClick);
  scaleControlSmallerElement.addEventListener('click', onScaleSmallerClick);
  effectsList.addEventListener('change', onFilterChange);
  effectLevelElement.addEventListener('mouseup', onPinMouseUp);
  uploadPhotoCommentElement.addEventListener('focus', onPhotoCommentFocus);
  uploadPhotoCommentElement.addEventListener('blur', onPhotoCommentBlur);
  uploadSubmitButtonElement.addEventListener('click', onUploadSubmitButtonClick);
  effectLevelElement.addEventListener('mouseup', onPinMouseUp);
  setFilter(checkedFilterType, FILTER_VALUE_DEFAULT);
  setControlElementValue(SCALE_VALUE_DEFAULT);
}

function closePopup() {
  setFormInputResetState();
  uploadFormOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscKeydown);
  uploadSubmitButtonElement.removeEventListener('click', onUploadSubmitButtonClick);
  scaleControlBiggerElement.removeEventListener('click', onScaleBiggerClick);
  scaleControlSmallerElement.removeEventListener('click', onScaleSmallerClick);
  effectsList.removeEventListener('change', onFilterChange);
  effectLevelElement.removeEventListener('mouseup', onPinMouseUp);
  uploadPhotoCommentElement.removeEventListener('focus', onPhotoCommentFocus);
  uploadPhotoCommentElement.removeEventListener('blur', onPhotoCommentBlur);
  uploadSubmitButtonElement.removeEventListener('click', onUploadSubmitButtonClick);
  effectLevelElement.removeEventListener('mouseup', onPinMouseUp);
}

function onPopupEscKeydown(evt) {
  if (evt.keyCode === ESC_CODE) {
    closePopup();
  }
}


function onPhotoCommentFocus() {
  document.removeEventListener('keydown', onPopupEscKeydown);
}


function onPhotoCommentBlur() {
  document.addEventListener('keydown', onPopupEscKeydown);
}

function setFormInputResetState() {
  uploadInputFile.value = '';
  uploadPhotoCommentElement.value = '';
  textHashtagsElement.value = '';
}

function onScaleBiggerClick() {
  setScaleValue(ZOOM_IN);
}

function onScaleSmallerClick() {
  setScaleValue(ZOOM_OUT);
}

function onUploadSubmitButtonClick(evt) {
  evt.preventDefault();
  closePopup();
}

function setControlElementValue(value) {
  scaleControlValueElement.value = value + '%';
}

function getBiggerScaleStep(value) {
  value = value + Scale.STEP;
  if (value > Scale.MAX) {
    value = Scale.MAX;
  }
  return value;
}

function getSmallerScaleStep(value) {
  value -= Scale.STEP;
  if (value < Scale.MIN) {
    value = Scale.MIN;
  }
  return value;
}

function setScaleValue(flag) {
  var scaleValue = Number(scaleControlValueElement.value.substring(0, scaleControlValueElement.value.length - 1));
  if (flag === ZOOM_IN) {
    scaleValue = getBiggerScaleStep(scaleValue);
  } else if (flag === ZOOM_OUT) {
    scaleValue = getSmallerScaleStep(scaleValue);
  }
  setControlElementValue(scaleValue);
  imgPreviewElement.style = 'transform: scale(' + scaleValue / Scale.MAX + ');';
}

function toggleRangeElementVisibility(filterValue) {
  if (filterValue === 'none') {
    imgUploadSliderElement.classList.add('hidden');
  } else {
    imgUploadSliderElement.classList.remove('hidden');
  }
}

function addFilterClassname(filterType) {
  imgPreviewElement.className = 'img-upload__preview';

  switch (filterType) {
    case 'chrome':
      imgPreviewElement.classList.add('effects__preview--chrome');
      break;
    case 'sepia':
      imgPreviewElement.classList.add('effects__preview--sepia');
      break;
    case 'marvin':
      imgPreviewElement.classList.add('effects__preview--blur');
      break;
    case 'phobos':
      imgPreviewElement.classList.add('effects__preview--phobos');
      break;
    case 'heat':
      imgPreviewElement.classList.add('effects__preview--heat');
      break;
  }
}

function setFilterEffectStyle(filterType, pinValue) {
  effectLevelInputElement.value = pinValue;

  switch (filterType) {
    case 'chrome':
      imgPreviewElement.style = 'filter: grayscale(' + pinValue / FILTER_VALUE_DEFAULT * EffectsInterval.chrome + ')';
      break;
    case 'sepia':
      imgPreviewElement.style = 'filter: sepia(' + pinValue / FILTER_VALUE_DEFAULT * EffectsInterval.sepia + ')';
      break;
    case 'marvin':
      imgPreviewElement.style = 'filter: invert(' + pinValue / FILTER_VALUE_DEFAULT * EffectsInterval.marvin + '%)';
      break;
    case 'phobos':
      imgPreviewElement.style = 'filter: blur(' + pinValue / FILTER_VALUE_DEFAULT * EffectsInterval.phobos + 'px)';
      break;
    case 'heat':
      imgPreviewElement.style = 'filter: brightness(' + pinValue / FILTER_VALUE_DEFAULT * EffectsInterval.heat + ')';
      break;
    default:
      imgPreviewElement.style = '';
      break;
  }
}

function setFilter(type, value) {
  toggleRangeElementVisibility(type);
  addFilterClassname(type);
  setFilterEffectStyle(type, value);
}

function onFilterChange(evt) {
  setFilter(evt.target.value, FILTER_VALUE_DEFAULT);
}

function onPinMouseUp() {
  var checkedFilterType = effectsList.querySelector('input:checked').value;
  setFilterEffectStyle(checkedFilterType, 60);
}


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

uploadInputFile.addEventListener('change', function () {
  openPopup();
});

uploadCancelFormOverlay.addEventListener('click', function () {
  closePopup();
});
