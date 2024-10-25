jQuery(document).ready(function ($) {
  if (window.sessionStorage) {
    if ($("[data-navigation]").length > 0) {
      var links = {};
      $("[data-navigation]").each((i, item) => {
        links = $(item)
          .find("li a:not(.veure)")
          .get()
          .map(function (o) {
            o.href =
              o.href +
              "?p=" +
              window.location.pathname +
              "&i=" +
              $(item).data("navigation");
            return o.href;
          });
        //remove duplicates
        links = [...new Set(links)].join(";");
        sessionStorage.setItem(
          window.location.pathname + ":" + $(item).data("navigation"),
          links
        );
      });
    }

    var is_search = sessionStorage.getItem("coeli-is-search");

    var resulset = sessionStorage.getItem("resulset");
    var page_search = sessionStorage.getItem("coeli-page-search");

    const urlWithoutParams =
      location.protocol + "//" + location.host + location.pathname;

    let slug =
      urlWithoutParams[urlWithoutParams.length - 1] === "/"
        ? urlWithoutParams.slice(0, -1)
        : urlWithoutParams;
    slug = slug.split("/");

    const queryString = window.location.search;

    if (queryString) {
      const urlParams = new URLSearchParams(queryString);
      const page_base = urlParams.get("p");
      if (page_base) {
        const coleccio = urlParams.get("i");
        resulset = sessionStorage.getItem(page_base + ":" + coleccio);
        is_search = 1;
        page_search = page_base;
      }
    }

    slug = Array.isArray(slug) ? "#" + slug[slug.length - 1] : "";

    //mirem si no s'ha passat un param extra que no interesa. (Lliure)
    slug = slug.indexOf("?") > 0 ? slug.split("?")[0] : slug;
    var is_in_the_search = false;
    if (location.href.indexOf("?rel") > 0) {
      //si es relacionat no volem navegar
    } else {
      if (is_search == 1 && resulset) {
        if (resulset.indexOf("{") >= 0) {
          //es un object venim d'agrupacions
          resulset = JSON.parse(resulset);
          var temp_resulset;
          for (const prop in resulset) {
            if (!is_in_the_search) {
              for (i = 0; i < resulset[prop].length; i++) {
                if (location.href === resulset[prop][i]) {
                  is_in_the_search = true;
                  temp_resulset = resulset[prop];
                  break;
                }
              }
            }
          }
          resulset = temp_resulset;
        } else {
          resulset = resulset.split(";");
          //remove duplicates
          resulset = [...new Set(resulset)];
          for (var i = 0; i < resulset.length; i++) {
            if (location.href === resulset[i]) {
              is_in_the_search = true;
              break;
            }
          }
        }
        if (is_in_the_search) {
          if (resulset.length == 1) {
            jQuery(".coeli-prev-fitxa").hide();
            jQuery(".coeli-next-fitxa").hide();
          } else if (i == 0) {
            jQuery(".coeli-prev-fitxa").hide();
            jQuery(".coeli-next-fitxa").attr("href", resulset[i + 1]);
          } else if (i == resulset.length - 1) {
            jQuery(".coeli-prev-fitxa").attr("href", resulset[i - 1]);
            jQuery(".coeli-next-fitxa").hide();
          } else {
            jQuery(".coeli-prev-fitxa").attr("href", resulset[i - 1]);
            jQuery(".coeli-next-fitxa").attr("href", resulset[i + 1]);
          }
          jQuery(".coeli-torna-cerca").attr("href", page_search + slug);
          //jQuery(".coeli-torna-cerca").attr("href", page_search);
          jQuery("header,.coeli-nav-fitxes").addClass("coeli-from-list");
        }
      }
    }
  }
});
