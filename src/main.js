"use strict";

function verticalMotionWithSpin3D(tagSelector) {
  const movingText = document.querySelector(tagSelector);

  function readTags(tag) {
    return Array.from(document.querySelectorAll(`${tag}>a`)).map((element) => {
      return { content: element.innerHTML, href: element.getAttribute("href") };
    });
  }

  function createTags(tagsArray) {
    for (let i = 0; i < tagsArray.length; i++) {
      const anchor = document.createElement("a");
      anchor.className = `text${i + 1}`;
      anchor.innerHTML = tagsArray[i].content;
      anchor.href = tagsArray[i].href;
      anchor.rel = "noopener";
      anchor.style.visibility = "hidden";
      movingText.appendChild(anchor);
    }
  }

  function animationEnded(tag) {
    tag.style.visibility = "visible";
    tag.style.animation = "";
    tag.removeEventListener("animationend", () => {
      animationEnded(text);
    });
  }

  function addAnimation(tags, duration, delay) {
    for (let i = 1; i <= tags.length; i++) {
      const text = document.querySelector(`.text${i}`);
      const itemDelay = delay * (tags.length - i);
      text.style.animation = `${duration}ms cubic-bezier(0.075, 0.82, 0.165, 1) ${itemDelay}ms 1 normal forwards moveDown`;
      text.style.transformOrigin = "right center";

      // removing animation when is finished.
      text.addEventListener("animationend", () => {
        animationEnded(text);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const sideMenuTags = readTags(tagSelector);
    movingText.innerHTML = "";
    createTags(sideMenuTags);
    addAnimation(sideMenuTags, 700, 75);
  });
}

function verticalScroll(tagSelector) {
  // Get the element
  const sideMenu = document.querySelector(tagSelector);

  // Function to update translateY based on scroll
  function updateTranslateY(event) {
    event.preventDefault();
    const content = sideMenu.style.transform;
    // const currentScroll = window.scrollY;

    const ini = content.indexOf("translateY(") + 11;
    const end = content.indexOf("px)");
    const value = Number(content.slice(ini, end));

    // scroll inc of 200 units (px)
    let translateYValue = value + 200 * (event.deltaY < 0 ? -1 : 1);
    if (translateYValue > 0) {
      translateYValue = 0;
    } else if (translateYValue < -200) {
      translateYValue = -200;
    }
    // window.scrollTo(0, currentScroll);

    // apply transition to smooth the scroll movement.
    sideMenu.style.transition = "transform 1.2s ease-in-out";
    sideMenu.style.transform =
      "rotateY(-45deg) translateY(" + translateYValue + "px)";
  }

  // Listen for the scroll event --> passive false to allow use event.preventDefault();
  window.addEventListener("wheel", updateTranslateY, { passive: false });

  // // Listen for the transition end event to reset transition property
  // sideMenu.addEventListener("transitionend", resetTransition);
}

function mobilePannel() {
  const sideMenu = document.querySelector(".motion-side-menu");
  sideMenu.style.transform = "rotateY(-45deg) translateY(0px)";
  const userInterface = document.querySelector(".ui");

  if (sideMenu.style.display === "block") {
    sideMenu.style.display = "none";
    sideMenu.style.zIndex = "-100";
    userInterface.style.display = "flex";
    userInterface.style.zIndex = "200";
  } else {
    sideMenu.style.display = "none";
    sideMenu.style.zIndex = "-100";
    userInterface.style.zIndex = "2";
    location.reload();
  }
  const mediaQuery = window.matchMedia("(max-width: 900px)");
  mediaQuery.addEventListener("change", handleMediaQuery);
}

function mobilePannelListener() {
  const button = document.querySelector("#hamburger");
  console.log("click");
  button.addEventListener("click", mobilePannel);
}

function handleMediaQuery(event) {
  const stage = document.querySelector(".stage");
  const tag = document.querySelector(".motion-side-menu");
  const userInterface = document.querySelector(".ui");
  if (!event.matches && document.documentElement.clientHeight > 550) {
    // The media query doesn't match (viewport width is greater than 690px)
    tag.style.display = "block";
    userInterface.style.display === "flex";
    removeEventListener("change", handleMediaQuery);
  } else {
    if (
      userInterface.style.display === "flex" &&
      tag.style.display === "block"
    ) {
      tag.style.display = "none";
      stage.style.zIndex = "-100";
    }
  }
}
function main() {
  verticalMotionWithSpin3D(".motion-side-menu");
  verticalScroll(".motion-side-menu");
  mobilePannelListener();
}

main();
