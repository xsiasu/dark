document.addEventListener("DOMContentLoaded", () => {
  const initializeEmbla = (selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const emblaNode = element;
      const viewportNode = emblaNode.querySelector(".embla__viewport");
      const prevBtnNode = emblaNode.querySelector(".embla__button--prev");
      const nextBtnNode = emblaNode.querySelector(".embla__button--next");
      const dotsNode = emblaNode.querySelector(".embla__pagination");

      // Get options from the element
      const options = JSON.parse(
        emblaNode.getAttribute("data-options") || "{}"
      );

      const emblaApi = EmblaCarousel(viewportNode, options);

      const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
        emblaApi,
        prevBtnNode,
        nextBtnNode
      );
      const removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(
        emblaApi,
        dotsNode
      );

      emblaApi.on("destroy", removePrevNextBtnsClickHandlers);
      emblaApi.on("destroy", removeDotBtnsAndClickHandlers);

      function addTogglePrevNextBtnsActive(emblaApi, prevBtnNode, nextBtnNode) {
        function togglePrevNextBtnsState() {
          if (emblaApi.canScrollPrev()) prevBtnNode.removeAttribute("disabled");
          else prevBtnNode.setAttribute("disabled", "disabled");

          if (emblaApi.canScrollNext()) nextBtnNode.removeAttribute("disabled");
          else nextBtnNode.setAttribute("disabled", "disabled");
        }

        emblaApi
          .on("select", togglePrevNextBtnsState)
          .on("init", togglePrevNextBtnsState)
          .on("reInit", togglePrevNextBtnsState);

        return function removeTogglePrevNextBtnsActive() {
          prevBtnNode.removeAttribute("disabled");
          nextBtnNode.removeAttribute("disabled");
        };
      }

      function addPrevNextBtnsClickHandlers(
        emblaApi,
        prevBtnNode,
        nextBtnNode
      ) {
        function scrollPrev() {
          emblaApi.scrollPrev();
        }

        function scrollNext() {
          emblaApi.scrollNext();
        }

        prevBtnNode.addEventListener("click", scrollPrev, false);
        nextBtnNode.addEventListener("click", scrollNext, false);

        const removeTogglePrevNextBtnsActive = addTogglePrevNextBtnsActive(
          emblaApi,
          prevBtnNode,
          nextBtnNode
        );

        return () => {
          removeTogglePrevNextBtnsActive();
          prevBtnNode.removeEventListener("click", scrollPrev, false);
          nextBtnNode.removeEventListener("click", scrollNext, false);
        };
      }

      function addDotBtnsAndClickHandlers(emblaApi, dotsNode) {
        let dotNodes = [];

        function generateDots() {
          const slideCount = emblaApi.scrollSnapList().length;
          dotsNode.innerHTML = ""; // Clear any existing dots
          for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement("span");
            dot.classList.add("embla__dot");
            if (i === emblaApi.selectedScrollSnap()) {
              dot.classList.add("embla__dot--selected");
            }
            dotsNode.appendChild(dot);
          }
        }

        function addDotBtnsWithClickHandlers() {
          generateDots();
          dotNodes = Array.from(dotsNode.querySelectorAll(".embla__dot"));
          dotNodes.forEach((dotNode, index) => {
            dotNode.addEventListener(
              "click",
              () => emblaApi.scrollTo(index),
              false
            );
          });
        }

        function toggleDotBtnsActive() {
          const previous = emblaApi.previousScrollSnap();
          const selected = emblaApi.selectedScrollSnap();
          dotNodes[previous].classList.remove("embla__dot--selected");
          dotNodes[selected].classList.add("embla__dot--selected");
        }

        emblaApi
          .on("init", addDotBtnsWithClickHandlers)
          .on("reInit", addDotBtnsWithClickHandlers)
          .on("init", toggleDotBtnsActive)
          .on("reInit", toggleDotBtnsActive)
          .on("select", toggleDotBtnsActive);

        return function removeDotBtnsAndClickHandlers() {
          dotsNode.innerHTML = "";
        };
      }
    });
  };

  // Initialize Embla carousel on all .embla-kim elements
  initializeEmbla(".embla-kim");
});
