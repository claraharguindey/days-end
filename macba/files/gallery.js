jQuery(document).ready(function ($) {
  /*gal.leria fitxa*/
  if ($(".coeli-gallery-thumbs").length > 0) {
    var gallery_thumbs = new Swiper(".coeli-gallery-thumbs", {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      navigation: {
        nextEl: ".swiper-thumbs-button-next",
        prevEl: ".swiper-thumbs-button-prev",
      },
    });
    var galleryMain = new Swiper(".coeli-gallery-main", {
      watchOverflow: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      preventInteractionOnTransition: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: gallery_thumbs,
      },
    });
    $(".coeli-gallery-wrapper").addClass("coeli-gallery-loaded");
  }
});