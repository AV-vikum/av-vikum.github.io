(function ($) {
  "use strict";

  const servicelist = {
    0: {
      title: "Designing",
    },
    1: {
      title: "Knitting",
    },
    2: {
      title: "Sewing",
    },
    3: {
      title: "Embroidery",
    },
    4: {
      title: "Sublimation Printing",
    },
    5: {
      title: "Screen Printing",
    },
  };

  function serviceChange(index) {
    $(".owl-service").trigger("to.owl.carousel", index);
  }

  $(".serviceBtn").click(function () {
    var $this = $(this);
    var index = $this.attr("data-of-index");
    serviceChange(index);
    // console.log("clicked: ", index);
  });
  // var index = $("this").attr("index-data");

  var owl = $(".owl-service");
  owl.on("changed.owl.carousel", function (e) {
    // console.log("current: ", e.relatedTarget.current());
    // console.log("current: ", e.item.index - 3); //same
    var index = e.item.index - 3;
    $(".serviceD-titile").html(servicelist[index].title);
    // console.log("total: ", e.item.count); //total
  });
  // then init
  //   owl.owlCarousel({ settings });
})(jQuery);
