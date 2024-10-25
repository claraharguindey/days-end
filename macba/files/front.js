jQuery(document).ready(function ($) {
  $(".coeli-result-change-display").click(function () {
    $(this).toggleClass("result-grid-display coeli-result-list-display"); // botó format resultats
    $(".coeli-result-list").toggleClass("grid list"); // Llista resultats

    if ($(this).text() == "Grid") {
      $(this).text("List");
    } else {
      $(this).text("Grid");
    }
  });

  $(".coeli-close-filters").click(function (e) {
    $(
      ".coeli-search-filters, .page-title, .button-menu, .caticat-title, html,body,.coeli-list-results"
    ).toggleClass("active-filters");
  });

  //FACETS para mobil.. añadir clase para desplegar submenu ---------------

  $("ul.facets > li").click(function () {
    $(this).toggleClass("open");
  });

  if ($("ul.facets").length > 0) {
    $(".coeli-sidebar-facets > ul.facets > li").each(function () {
      if ($(this).find("span + ul li.coeli-selected-facet").length > 0) {
        $(this).addClass("open");
      }
    });
  }

  $(".coeli-toggle-facets").click(function () {
    $(this).toggleClass("open");
    $(".facets, .coeli-num-items").toggleClass("open");

    var button = document.getElementById("coeli-toggle-facets");
    if (button.title == "Obrir menú") {
      button.title = "Tancar menú";
    } else {
      button.title = "Obrir menú";
    }
  });

  // MENUS de FILTROS PARA MOBIL ... A revisar ----------------------------------------

  $(".coeli-filter-type-title").click(function () {
    $(this).parent().addClass("active");
  });

  //OPEN-CLOSE coeli-result-filter-box---------------------------------   Errors

  $(".coeli-result-filter-box-button").click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(
      ".coeli-search-filters, .page-title, .button-menu, .caticat-title, html,body,.coeli-list-results"
    ).toggleClass("active-filters");
  });

  //inizialitem sliders d'agrupacions si n'hi ha
  $(".coeli-swiper-agrupacions").each(function (item) {
    var id = $(this).attr("id").split("-")[2];
    new Swiper(".coeli-swiper-" + id, eval("slider_args_" + id));
  });

  if ($(".coeli-advanced-wrapper-toggle").length > 0) {
    $(".coeli-toggle-advanced-search").click(function (e) {
      e.preventDefault();
      $(this).toggleClass("show-advanced");
      $(".coeli-advanced-wrapper-toggle").toggleClass("show-advanced");
      $(".coeli-search-button").toggle("fast");
      $(".coeli-search-input").keypress(function (e) {
        var key = e.keyCode || e.which;
        if (
          $(".coeli-advanced-wrapper-toggle").hasClass("show-advanced") &&
          key === 13
        ) {
          return false;
        }
      });
    });
  }
});
//inizialitem masonries d'agrupacions si n'hi ha
window.onload = function () {
  jQuery(".coeli-agrupacio-masonry").each(function (item) {
    var id = jQuery(this).attr("id").split("-")[3];
    jQuery(".coeli-ul-agrupacio-" + id).masonry({
      columnWidth: ".coeli-grid-sizer",
      itemSelector: ".grid-item",
      percentPosition: true,
    });
  });
};
