jQuery(document).ready(function ($) {
  if (typeof related_cat !== "undefined") {
    $.ajax({
      method: "POST",
      url: my_ajax_object.ajax_url,
      data: {
        action: "getrelated",
        nonce: my_ajax_object.nonce,
        cat: related_cat,
        endpoint: endpoint,
      },
    }).done(function (list) {
      $("#coeli-related-objects").append(list);
    });

    $(document).on("click", ".grid-item a", function (e) {
      e.preventDefault();
      location.href = $(this).attr("href") + "?rel";
    });
  }
});