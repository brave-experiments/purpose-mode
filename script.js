console.log("This is Purpose Mode's content script.");
const image_size_threshold = 65 // image height threashold for image blurring 

function initialUpdates() {
  console.log("Applying custom style to existing img tags.");
  blur_img(document)
  // const elements = document.getElementsByTagName("img");
  stop_video_autoplay(document);
}

function blur_img(document_query){
  var current_webpage_url = window.top.location.href;
  if (current_webpage_url.includes("twitter")){
    twitter_blur_img(document_query);
  }
  else{
    facebook_blur_img(document_query);
  }
}

function facebook_blur_img(document_query){
  const elements = document_query.querySelectorAll("image,img");
  [...elements].forEach(e => {
    if(e.clientWidth>image_size_threshold){
      e.style = "filter: grayscale(100%) blur(5px);";
      e.style.zIndex = "1";
      e.addEventListener("mouseenter", (elem) => {
        e.style.filter = "grayscale(0%) blur(0px)";
        console.log(e.className);
      });
      e.addEventListener("mouseleave", (elem) => {
        e.style.filter = "grayscale(100%) blur(5px)";
        console.log(e.className);
      });
    }
  });
}

function twitter_blur_img(document_query){
  // twitter custom style
  const twitter_elements = document_query.querySelectorAll("div[style^='background-image:']");
  [...twitter_elements].forEach(e => {
    if(e.clientWidth>image_size_threshold){
      e.style.filter = "grayscale(100%) blur(5px)";
      e.style.zIndex = "1";
      e.addEventListener("mouseenter", (elem) => {
        e.style.filter = "grayscale(0%) blur(0px)";
        console.log(e.className);
      });
      e.addEventListener("mouseleave", (elem) => {
        e.style.filter = "grayscale(100%) blur(5px)";
        console.log(e.className);
      });
    }
  });
}

// remove auto play
/*
function stop_video_autoplay(document_query){
  document_query.querySelectorAll("video").forEach(function(elem) {
    elem.pause();
    // console.log("remove auto play");
    // console.log("remove auto play", elem);
    // elem.removeAttribute("autoplay");
    // elem.setAttribute("autostart","false");
    // Disable vidoe auto play.
    // elem.setAttribute("preload","none");
    // elem.setAttribute("height","50px");
    // elem.autoplay = false;
  }); 
}
*/

// document.querySelectorAll("video").forEach(function(elem) {
//   console.log("remove auto play");
//   console.log(elem);
//   // Disable vidoe auto play.
//   // elem.setAttribute("preload","none");
//   // elem.setAttribute("height","50px");
//   elem.removeAttribute("autoplay");
// });

// document.getElementsByTagName('video')[0].removeAttribute('autoplay');

var mutationObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
      // console.log(mutation);
      if(mutation.type != "characterData"){
        // console.log(mutation);
        blur_img(mutation.target);
        stop_video_autoplay(mutation.target);
      }
  });
});

// Starts listening for changes in the root HTML element of the page.
mutationObserver.observe(document.documentElement, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true
});
// Takes all changes which haven’t been fired so far.
var changes = mutationObserver.takeRecords();

// main
initialUpdates();