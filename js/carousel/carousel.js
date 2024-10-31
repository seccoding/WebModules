function carousel(element, option = {}) {
  if (element) {
    option = getCompletedDefaultOption(option);

    const carouselElement = document.querySelectorAll(element);
    let autoStart = {};

    for (const each of carouselElement) {
      const wrapDiv = wrapCarousel(each);
      wrapDiv.dataset.id = Math.random();

      clearUlStyle(each);
      makeBackgroudImageUseImg(each);

      const arrows = makeArrows(wrapDiv);
      makeArrowEvents(each, arrows.left, "to-left", option.rolling);
      makeArrowEvents(each, arrows.right, "to-right", option.rolling);
      if (!option.showArrows) {
        arrows.left.style.display = "none";
        arrows.right.style.display = "none";
      }

      const dots = makeItemDot(each);
      makeDotClickEvent(dots);
      if (!option.showDots) {
        dots.style.display = "none";
      }

      if (option.autoStart.start) {
        startCarousel(autoStart, wrapDiv, arrows);

        wrapDiv.addEventListener("mouseenter", function () {
          clearTimeout(autoStart[wrapDiv.dataset.id]);
        });
        dots.addEventListener("mouseenter", function () {
          clearTimeout(autoStart[wrapDiv.dataset.id]);
        });

        wrapDiv.addEventListener("mouseleave", function () {
          startCarousel(autoStart, wrapDiv, arrows);
        });
        dots.addEventListener("mouseleave", function () {
          startCarousel(autoStart, wrapDiv, arrows);
        });
      }
    }
  }

  function getCompletedDefaultOption(option) {
    var defaultOption = {
      rolling: "repeat", // start-end, repeat
      autoStart: { start: true, interval: 5000 },
      showDots: true,
      showArrows: true,
    };

    if (option.autoStart) {
      option.autoStart = {
        ...defaultOption.autoStart,
        ...option.autoStart,
      };
    }
    return { ...defaultOption, ...option };
  }

  function wrapCarousel(each) {
    var eachParent = each.parentElement;

    var wrapDiv = document.createElement("div");
    wrapDiv.setAttribute("class", "carousel-wrapper");
    wrapDiv.dataset.index = 0;

    eachParent.append(wrapDiv);
    wrapDiv.append(each);

    return wrapDiv;
  }

  function clearUlStyle(each) {
    if (each.tagName === "UL") {
      each.style.listStyleType = "none";
      each.style.padding = 0;
      each.style.margin = 0;
    }
  }

  function makeBackgroudImageUseImg(each) {
    var imgs = each.querySelectorAll("img");
    for (const img of imgs) {
      var src = img.getAttribute("src");
      var parent = img.parentElement;

      parent.style.backgroundImage = `url(${src})`;
      img.remove();
    }
  }

  function makeArrows(each) {
    var leftArrow = document.createElement("div");
    leftArrow.setAttribute("class", "left-arrow");
    each.append(leftArrow);

    var rightArrow = document.createElement("div");
    rightArrow.setAttribute("class", "right-arrow");
    each.append(rightArrow);

    return {
      left: leftArrow,
      right: rightArrow,
    };
  }

  function makeArrowEvents(item, arrow, behavior, rolling) {
    var carouselContainer = item.parentElement.parentElement;

    if (behavior === "to-left") {
      arrow.addEventListener("click", function () {
        var carouselContainerWidth =
          carouselContainer.getBoundingClientRect().width;

        let index = item.parentElement.dataset.index;
        index--;

        if (index < 0 && rolling === "start-end") {
          index = 0;
        } else if (index < 0 && rolling === "repeat") {
          index = item.children.length - 1;
        }

        item.style.left = -carouselContainerWidth * index + "px";
        item.parentElement.dataset.index = index;
        activeDot(item.parentElement.nextSibling, index);
      });
    } else if (behavior === "to-right") {
      arrow.addEventListener("click", function () {
        var carouselContainerWidth =
          carouselContainer.getBoundingClientRect().width;

        let index = item.parentElement.dataset.index;
        index++;

        if (index > item.children.length - 1 && rolling === "start-end") {
          index = item.children.length - 1;
        } else if (index > item.children.length - 1 && rolling === "repeat") {
          index = 0;
        }

        item.style.left = -carouselContainerWidth * index + "px";
        item.parentElement.dataset.index = index;
        activeDot(item.parentElement.nextSibling, index);
      });
    }
  }

  function makeItemDot(each) {
    var wrapDiv = each.parentElement;

    var dots = document.createElement("ul");
    dots.setAttribute("class", "carousel-dots");

    for (let i = 0; i < each.children.length; i++) {
      var dot = document.createElement("li");
      if (i === 0) {
        dot.setAttribute("class", "active");
      }
      dot.dataset.index = i;
      dots.append(dot);
    }
    wrapDiv.parentNode.insertBefore(dots, wrapDiv.nextSibling);

    return dots;
  }

  function makeDotClickEvent(dots) {
    const carouselWrapper = dots.previousSibling;
    const carousel = carouselWrapper.querySelector(".carousel");
    for (const dot of dots.children) {
      dot.addEventListener("click", function () {
        const index = this.dataset.index;
        activeDot(dots, index);

        var carouselContainerWidth =
          carouselWrapper.parentElement.getBoundingClientRect().width;

        carousel.style.left = -carouselContainerWidth * index + "px";
        carouselWrapper.dataset.index = index;
      });
    }
  }

  function activeDot(dots, index) {
    for (const eachDot of dots.children) {
      eachDot.setAttribute("class", "");
    }

    dots
      .querySelector(`li[data-index="${index}"]`)
      .setAttribute("class", "active");
  }

  function startCarousel(autoStart, wrapDiv, arrows) {
    autoStart[wrapDiv.dataset.id] = setTimeout(function showNextImage() {
      arrows.right.click();

      autoStart[wrapDiv.dataset.id] = setTimeout(function () {
        showNextImage();
      }, option.autoStart.interval);
    }, option.autoStart.interval);
  }
}
