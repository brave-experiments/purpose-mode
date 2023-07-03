"use strict";

const getContainer = () => new Promise((resolve) => {
    if(currentPage == "Twitter"){
        const x = $('section[aria-labelledby]');
        if (x.length === 0 || x.find("article").length === 0) {
            setTimeout(() => { resolve(getContainer()); }, 100);
            return;
        }
        const y = x.children("div[aria-label]").first().children().first();
        resolve(y);
    }
    else if(currentPage == "Facebook"){
        // const y = $('h3:contains("News Feed posts")').parent();
        const y = $('div[role="main"]');
        if (y.length === 0) {
            setTimeout(() => { resolve(getContainer()); }, 100);
            return;
        }
        resolve(y);
    }
    else if (currentPage == "YouTube"){
        const y = $("#content");
        if (y.length === 0) {
            setTimeout(() => { resolve(getContainer()); }, 100);
            return;
        }
        resolve(y);
    }
    else if (currentPage == "LinkedIn"){
        if(isHomePage()){
            // const y = $('main[aria-label]');
            const y = $('div.application-outlet');
            if (y.length === 0) {
                setTimeout(() => { resolve(getContainer()); }, 100);
                return;
            }
            resolve(y);
        }
        else{
            const y = document;
            resolve(y);
        }
    }
    else{
        console.error("Unknown page to enable purpose mode.");
    }
});

const showMore = (container, button) => {
    feedHeight += showMoreIncrement;
    container.css("max-height", `${feedHeight}px`);
    if (currentPage == "Facebook" && parseInt(container.css('height'))<feedHeight){
        updateFacebookShowMore(container);
    }
    if(currentPage == "Twitter"){ container.css("min-height", `${feedHeight}px`);}
    button.css("top", `${feedHeight+container_top-100}px`);
    // button.css("top", `${parseInt(container.css('height'))-100}px`);
};

function removeDistractions(){
    if(currentPage == "Twitter"){
        removeTwitterDistractions();
    }
    else if(currentPage == "YouTube"){
        removeYouTubeDistractions();
    }
    else if(currentPage == "Facebook"){
        removeFacebookDistractions();
    }
    else if(currentPage == "LinkedIn"){
        removeLinkedInDistractions();
    }
}

const removeYouTubeDistractions= () => {

    /* De-cluttered UI */
    // Hamburger menu removal
    const hamburgerUI = $('div#guide-content');
    hamburgerUI.css({
        "display": "none",
        "visibility": "hidden"
    });

    /* Notifications removal */
    const updateNotification = $("div.yt-spec-icon-badge-shape__badge");
        if(updateNotification){
        updateNotification.css({
            "display": "none",
            "visibility": "hidden"
        });
    }

    /* Recommendation removal */
    const currentPage = window.top.location.href;
    if(currentPage === "https://www.youtube.com/"){ // home page-only recommendations
        
        // recommendation tags on top of the page
        const recc_tag = $('div#scroll-container');
            if(recc_tag){
            recc_tag.css({
                "display": "none",
                "visibility": "hidden"
            });
        }
        // "Next" button of the recommendation tags
        const nextReccTag = $('button[aria-label="Next"]');
        if(nextReccTag){
            nextReccTag.css({
                "display": "none",
                "visibility": "hidden"
            });
        }
        // video ad on the home page
        const home_page_video_ad = $('div#masthead-ad');
        if(home_page_video_ad){
            home_page_video_ad.css({
                "display": "none",
                "visibility": "hidden"
            });
        }
        // shorts
        const shorts = $('ytd-rich-shelf-renderer[is-shorts]');
        if(shorts){
            shorts.css({
                "display": "none",
                "visibility": "hidden"
            });
        }
        // Recommended Primetime movies
        const primetimeMovie = $('a[title="Recommended Primetime movies"]');
        if(primetimeMovie){
            primetimeMovie.closest('ytd-rich-section-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
        }
        // Top news
        const topNews = $('span[id="title"]:contains("Top news")');
        if(topNews){
            topNews.closest('ytd-rich-section-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
        }
        // Breaking news
        const breakingNews = $('span[id="title"]:contains("Breaking news")');
        if(breakingNews){
            breakingNews.closest('ytd-rich-section-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
        }
        // Latest YouTube posts
        const latestPosts = $('span[id="title"]:contains("Latest YouTube posts")');
        if(latestPosts){
            latestPosts.closest('ytd-rich-section-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
        }
        // Discover your next favorite movie
        const nextFavoriteMovie = $('yt-formatted-string[id="item-title"]:contains("Discover your next favorite movie")');
        if(nextFavoriteMovie){
            nextFavoriteMovie.closest('ytd-rich-section-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
        }

        // YouTube premium event
        const premiumEvent = $('yt-formatted-string[id="subtitle"]:contains("Premium membership")');
        if(premiumEvent){
            premiumEvent.closest('ytd-rich-section-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
        }
    }
    else if (currentPage.includes("www.youtube.com/watch?")){ // Watch page-only recommendations
        // video recommendation
        const relatedVideos = $('div#secondary-inner');
        if(relatedVideos){
            relatedVideos.css({
                "display": "none",
                "visibility": "hidden"
            });
        }
        // comments
        const comments = $("ytd-comments#comments");
        if(comments){
            comments.css({
                "display": "none",
                "visibility": "hidden"
            });
        }
    }
    else if (window.top.location.href.includes("results?search_query")){ // Search page-only recommendations
        // "People also watched"
        const peopleAlsoWatched = $('span[id="title"]:contains("People also watched")');
        if(peopleAlsoWatched){
            peopleAlsoWatched.closest('ytd-shelf-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
        }
        // shorts
        /*
        const shorts = $('span[id="title"]:contains("Shorts")');
        // console.log(notifications);
        if (shorts){
            [...shorts].forEach(n => {
                n.closest('ytd-shelf-renderer').css({
                    "display": "none",
                    "visibility": "hidden"
                });
            });
            console.log("removed shorts");
        }
        */
        // const shorts = $('span[id="title"]:contains("Shorts")').get(0);
        // shorts.closest('ytd-shelf-renderer').remove();

        // "Channels new to you"
        const channelsNewToYou = $('span[id="title"]:contains("Channels new to you")');
        if(channelsNewToYou){
            channelsNewToYou.closest('ytd-shelf-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
        }
        // "For you"
        const forYou = $('span[id="title"]:contains("For you")');
        if(forYou){
            forYou.closest('ytd-shelf-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
            // console.log("removed For you");
        }
        // "Previously watched"
        const perviouslyWatched = $('span[id="title"]:contains("Previously watched")');
        if(perviouslyWatched){
            perviouslyWatched.closest('ytd-shelf-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
        }
        // "From related searches"
        const relatedSearch = $('span[id="title"]:contains("From related searches")');
        if(relatedSearch){
            relatedSearch.closest('ytd-shelf-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
        }
    }
}

const removeTwitterDistractions = () => {
    /*Clean feed view*/
    // "What's happening" column on the right.
    const col_what = $('div[aria-label="Timeline: Trending now"]');
    col_what.css({
        "display": "none",
        "visibility": "hidden"
    });
    // "Who to follow" column on the right.
    const col_who = $('div:has(> div > aside[aria-label="Who to follow"])');
    col_who.css({
        "display": "none",
        "visibility": "hidden"
    });
    // ToS, privacy policy, etc.
    const col_footer = $('nav[aria-label="Footer"]');
    col_footer.css({
        "display": "none",
        "visibility": "hidden"
    });
    // "Get Verified" promotion
    const col_verify = $('div:has(> aside[aria-label="Get Verified"])');
    col_verify.css({
        "display": "none",
        "visibility": "hidden"
    });
    // DM
    const DM = $('div[data-testid="DMDrawer"]');
    DM.css({
        "display": "none",
        "visibility": "hidden"
    });
    
    /* Notifications removal */
    // Blue notification circle, e.g., on top of home icon.
    const home_notification = $('div[aria-label="undefined unread items"]');
    home_notification.css({
        "display": "none",
        "visibility": "hidden"
    });
    // Blue button that promotes new tweets, i.e., on top of the page
    const tweet_notification = $('div[aria-label="New Tweets are available. Push the period key to go to the them."]');
    tweet_notification.css({
        "display": "none",
        "visibility": "hidden"
    });
    // notifications
    const notifications = $('div[aria-label*="unread"]');
    if (notifications){
        [...notifications].forEach(n => {
            n.style.display = "none";
            n.style.visibility = "hidden";
        });
    } 
}

const removeLinkedInDistractions = () => {
    /* Notification removal */
    // "red dot" notifications
    $('span.notification-badge--show').each(function() {
        $( this ).css({
            "display": "none",
            "visibility": "hidden"
        });
    });

    /* De-cluttered UI */
    // Messaging
    const messaging = $('aside#msg-overlay');
    messaging.css({
        "display": "none",
        "visibility": "hidden"
    });
    // Left column profile and links
    const infoClumn = $('div.scaffold-layout__sidebar');
    infoClumn.css({
        "display": "none",
        "visibility": "hidden"
    });
    // LinkedIn Premium ads (upper right)
    const premuimAdRight = $('div.premium-upsell-link').parent();
    if(premuimAdRight){
        premuimAdRight.css({
            "display": "none",
            "visibility": "hidden"
        });
    }
    // "For Business" button
    const forBusinessButton = $('li.global-nav__primary-item:has(> button > span[title="For Business"])')
    if(forBusinessButton){
        forBusinessButton.css({
            "display": "none",
            "visibility": "hidden"
        });
    }

    /* Recommendation removal */
    // LinkedIn News
    const newsColumn = $('aside[aria-label="LinkedIn News"]');
    if(newsColumn){
        newsColumn.css({
            "display": "none",
            "visibility": "hidden"
        });
    }

    if(!isHomePage()){ // remove recommendations on the right column of the profile page
        const profileRecommendations = $('aside.scaffold-layout__aside');
        if(profileRecommendations){
            profileRecommendations.css({
                "display": "none",
                "visibility": "hidden"
            });
        }
    }
}

const removeFacebookDistractions = () => {
    /* Notifications removal */
    // "red dot" update notifications
    const updateNotification = $('div[aria-label*="Notifications"][tabindex="-1"]');
    updateNotification.css({
        "display": "none",
        "visibility": "hidden"
    });
    // "New posts" push notification
    const newPostsNotification = $('button:has(> div > span:contains("New posts"))');
    if(newPostsNotification){
        newPostsNotification.css({
            "display": "none",
            "visibility": "hidden"
        });
    }

    // "red dot" notifications for Messenger
    const messengerNotification = $('div[aria-label*="Messenger"][tabindex="-1"]');
    messengerNotification.css({
        "display": "none",
        "visibility": "hidden"
    });

    /* Recommendation removal */
    // “Stories” and “Reels” videos on the top
    const storiesBar = $('div[aria-label="Stories"]').parent().parent().parent();
    if(storiesBar){
        storiesBar.css({
            "display": "none",
            "visibility": "hidden"
        });
    }
    // Reels and short video recommendations
    const reels = $('div[aria-label="Reels"]').parent().parent().parent().parent();
    if(reels){
        reels.css({
            "display": "none",
            "visibility": "hidden"
        });
    }
    // "People You May Know"
    const friendRec = $('span:contains("People You May Know")').parent().parent().parent().parent().parent();
    friendRec.css({
        "display": "none",
        "visibility": "hidden"
    });
    // Suggested groups
    const groupRec = $('span:contains("Suggested groups")').parent().parent();
    if(groupRec){
        groupRec.css({
            "display": "none",
            "visibility": "hidden"
        });
    }

    /* De-cluttered UI */
    // the whole right column, e.g., your pages and profiles, contacts etc.
    const rightColum = $('div[role="complementary"]');
    if(rightColum){
        rightColum.css({
            "display": "none",
            "visibility": "hidden"
        });
    }
    // hamburger menu on the left
    const leftColum = $('div[role="navigation"]:has(> div > div > div > h2:contains("Facebook Menu"))');
    if(leftColum){
        leftColum.css({
            "display": "none",
            "visibility": "hidden"
        });
    }
    // Buttons on top of the page
    // const homeButton = $('a[aria-label="Home"]').parent().parent().parent(); // home button
    const homeButton = $('li > span > div > a[aria-label="Home"]');
    if(homeButton){
        homeButton.css({
            "display": "none",
            "visibility": "hidden"
        });
    }
    // const watchButton = $('a[aria-label="Watch"]').parent().parent().parent(); // watch button
    const watchButton = $('li > span > div > a[aria-label="Watch"]');
    if(watchButton){
        watchButton.css({
            "display": "none",
            "visibility": "hidden"
        });
    }
    // const marketButton = $('a[aria-label="Marketplace"]').parent().parent().parent(); // marketplace button
    const marketButton = $('li > span > div > a[aria-label="Marketplace"]');
    if(marketButton){
        marketButton.css({
            "display": "none",
            "visibility": "hidden"
        });
    }
    // const groupsButton = $('a[aria-label="Groups"]').parent().parent().parent(); // groups button
    const groupsButton = $('li > span > div > a[aria-label="Groups"]');
    if(groupsButton){
        groupsButton.css({
            "display": "none",
            "visibility": "hidden"
        });
    }
    // const gameButton = $('a[aria-label="Gaming"]').parent().parent().parent(); // gaming button
    const gameButton = $('li > span > div > a[aria-label="Gaming"]');
    if(gameButton){
        gameButton.css({
            "display": "none",
            "visibility": "hidden"
        });
    }

    // messenger boxes
    $('div[aria-label*="Open chat"').each(function() { // normal boxes
        $( this ).css({
            "display": "none",
            "visibility": "hidden"
        });
    });
    const additionalMessage = $('div[aria-label*="additional chats"'); // additional chat boxes
    if(additionalMessage){
        additionalMessage.css({
            "display": "none",
            "visibility": "hidden"
        });
    }
    const newMessage = $('div[aria-label="New message"'); // edit new message box
    if(newMessage){
        newMessage.css({
            "display": "none",
            "visibility": "hidden"
        });
    }
}

const removeInfiniteScrolling = (container) => {
    container.css({
        "max-height": `${feedHeight}px`,
        overflow: "hidden",
        // "margin-bottom": "200px"
    });
    if(currentPage == "Twitter"){ container.css("min-height", `${feedHeight}px`); }

    const button = $(`
        <div id="tisd-show-more">
            <button type="button">Show more</button>
        </div>
    `);
    button.css({
        width: container.width(),
        top: `${feedHeight+container_top-100}px`
        // top: `${parseInt(container.css('height'))-100}px`
    });
    container.prepend(button);

    if (checkBackgroundColorDark()){
        button.children("button").css({"color": "rgb(255, 255, 255)", "background-color": "rgba(0 , 0, 0, 0.7)"});
    }
    else{
        button.children("button").css({"color": "rgb(0, 0, 0)", "background-color": "rgba(255 , 255, 255, 0.7)"});
    }

    button.click(() => showMore(container, button));
}

const resetInfiniteScrolling = (container) => {
    container.css({
        "max-height": "none",
        "min-height": "auto",
        overflow: "auto"
    });

    const button = $("#tisd-show-more");
    if(button){
        button.remove();
    }
    feedHeight = 2500;
}

const isAlreadyManipulated = (container) => {
    const button = $("#tisd-show-more");
    return !!button.length;
};

const updateFacebookShowMore = (container) => {
    const button = $("#tisd-show-more");
    feedHeight = parseInt(container.css('height'));
    container.css("max-height", `${feedHeight}px`);
    button.css("top", `${feedHeight+container_top-100}px`);
}

const getCurrentPage = () => {
    const currentWindowURL = window.location.href;
    console.log("current url", currentWindowURL);
    if (currentWindowURL.includes("twitter.com")){
        return "Twitter";
    }
    else if(currentWindowURL.includes("facebook.com")){
        return "Facebook";
    }
    else if(currentWindowURL.includes("youtube.com")){
        return "YouTube";
    }
    else if(currentWindowURL.includes("linkedin.com")){
        return "LinkedIn";
    }
    else{
        return "NA";
    } 
}

const isHomePage = () => {
    const currentWindowURL = window.location.href;
    if (currentWindowURL.includes("https://twitter.com/home") || 
        currentWindowURL === "https://www.facebook.com/" || 
        currentWindowURL === "https://www.youtube.com/" || 
        currentWindowURL === "https://www.linkedin.com/feed/"){
        return true;
    }
    else{
        return false;
    }
}

const checkBackgroundColorDark = () => {
    if(currentPage == "Twitter"){
        const bgColor = $("body").css("background-color");
        if (bgColor === "rgb(21, 32, 43)" || bgColor === "rgb(0, 0, 0)") {
            return true;
        }
        else{
            return false;
        }
    }
    else if(currentPage == "Facebook"){
        const bgColor = $("body").css("background-color");
        if (bgColor === "rgb(24, 25, 26)") {
            return true;
        }
        else{
            return false;
        }
    }
    else if (currentPage == "YouTube"){
        const bgColor = $("ytd-app").css("background");
        if (bgColor.includes("rgb(15, 15, 15)")) {
            return true;
        }
        else{
            return false;
        }
    }
    else if (currentPage == "LinkedIn"){
        const bgColor = $("body").css("background-color");
        if (bgColor.includes("rgb(0, 0, 0)")){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        console.error("Unknown page to enable purpose mode!");
    }
}

function spoofWindowSize() {
    console.log("Monkey patching 'window' and 'document' properties.");
    const width = Math.min(document.documentElement.offsetWidth || 800, 800)
    if (window.innerWidth === width && document.documentElement.clientWidth === width) {
        return
    }
    window.__defineGetter__('innerWidth', () => width);
    document.documentElement.__defineGetter__('clientWidth', () => width)
    // Object.defineProperty(window,'innerWidth', width);
    // Object.defineProperty(document.documentElement,'clientWidth', width);
    window.dispatchEvent(new Event('resize'));
}

/* comment out to replace blur with saturate
function initialUpdates() {
    console.log("Applying custom style to existing img tags.");
    blur_img(document);
}
*/

function desaturate(){
    let e = $("html");
    e.css({"filter": "saturate(10%)"});
}
  
function blur_img(document_query){
    // blur image only run on home page
    // var current_webpage_url = window.top.location.href;
    // if (current_webpage_url === "https://twitter.com/home"){
    if (currentPage == "Twitter"){
        twitter_blur_img(document_query);
    }
    // else if(current_webpage_url === "https://www.facebook.com/"){
    else if(currentPage == "Facebook"){
        facebook_blur_img(document_query);
    }
    // else if(current_webpage_url === "https://www.youtube.com/"){
    else if(currentPage == "YouTube"){
        youtube_blur_img(document_query);
    }
    // else if(current_webpage_url === "https://www.linkedin.com/feed/"){
        else if(currentPage == "LinkedIn"){
        linkedin_blur_img(document_query);
    }
}
  
function facebook_blur_img(document_query){
    const elements = document_query.querySelectorAll("image,img");
    [...elements].forEach(e => {
        if(e.clientWidth>image_size_threshold && e.clientHeight>image_size_threshold){
        e.style.filter = "grayscale(100%) blur(5px)";
        e.style.zIndex = "1";
        // some facebook imagse are not the top elements; attach the event listener to the top elements
        var siblingNode = e.nextElementSibling;
        var siblingLink = e.parentElement.parentElement.getElementsByTagName("a")[0];
        var siblingLink_con2 = e.parentElement.parentElement.parentElement.getElementsByTagName("a")[0];
        var siblingLink_con3 = e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("a")[0];
        if(siblingNode && (siblingNode.nodeName == "DIV" || siblingNode.nodeName == "SPAN")){
            var sibling_e = e.nextElementSibling;
            sibling_e.style.zIndex = "1";
            sibling_e.addEventListener("mouseenter", (elem) => {
            e.style.filter = "grayscale(0%) blur(0px)";
            e.style.transition = "0.5s filter linear";
            // console.log(e.className);
            });
            sibling_e.addEventListener("mouseleave", (elem) => {
            e.style.filter = "grayscale(100%) blur(5px)";
            e.style.transition = "0.5s filter linear";
            // console.log(e.className);
            });
        }
        // check if the image is embeded with a link
        if(siblingLink){
            siblingLink.addEventListener("mouseenter", (elem) => {
            e.style.filter = "grayscale(0%) blur(0px)";
            e.style.transition = "0.5s filter linear";
            // console.log(e.className);
            });
            siblingLink.addEventListener("mouseleave", (elem) => {
            e.style.filter = "grayscale(100%) blur(5px)";
            e.style.transition = "0.5s filter linear";
            // console.log(e.className);
            });
        }
        else if(siblingLink_con2){
            siblingLink_con2.addEventListener("mouseenter", (elem) => {
            e.style.filter = "grayscale(0%) blur(0px)";
            e.style.transition = "0.5s filter linear";
            // console.log(e.className);
            });
            siblingLink_con2.addEventListener("mouseleave", (elem) => {
            e.style.filter = "grayscale(100%) blur(5px)";
            e.style.transition = "0.5s filter linear";
            // console.log(e.className);
            });
        }
        else if(siblingLink_con3 && e.clientWidth < 200 && e.clientHeight < 200){
            siblingLink_con3.addEventListener("mouseenter", (elem) => {
            e.style.filter = "grayscale(0%) blur(0px)";
            e.style.transition = "0.5s filter linear";
            // console.log(e.className);
            });
            siblingLink_con3.addEventListener("mouseleave", (elem) => {
            e.style.filter = "grayscale(100%) blur(5px)";
            e.style.transition = "0.5s filter linear";
            // console.log(e.className);
            });
        }

        e.addEventListener("mouseenter", (elem) => {
            e.style.filter = "grayscale(0%) blur(0px)";
            e.style.transition = "0.5s filter linear";
            // console.log(e.className);
        });
        e.addEventListener("mouseleave", (elem) => {
            e.style.filter = "grayscale(100%) blur(5px)";
            e.style.transition = "0.5s filter linear";
            // console.log(e.className);
        });
        }
    });
}
  
function youtube_blur_img(document_query){
    const elements = document_query.querySelectorAll("image,img");
    [...elements].forEach(e => {
        if(e.clientWidth>image_size_threshold){
            e.style.filter = "grayscale(100%) blur(5px)";
            e.style.zIndex = "1";
            if(e.clientWidth <= e.clientHeight){ // don't unblur for video preview teaser
                e.addEventListener("mouseenter", (elem) => {
                e.style.filter = "grayscale(0%) blur(0px)";
                e.style.transition = "0.5s filter linear";
                // console.log(e.className);
                });
                e.addEventListener("mouseleave", (elem) => {
                e.style.filter = "grayscale(100%) blur(5px)";
                e.style.transition = "0.5s filter linear";
                // console.log(e.className);
                });
            }
        }
    });
}

function youtube_unblur_img(document_query){
    const elements = document_query.querySelectorAll("image,img");
    [...elements].forEach(e => {
        if(e.clientWidth>image_size_threshold){
            e.style.filter = "grayscale(0%) blur(0px)";
            e.style.zIndex = "1";
            if(e.clientWidth <= e.clientHeight){
                e.addEventListener("mouseenter", (elem) => {
                e.style.filter = "grayscale(0%) blur(0px)";
                e.style.transition = "";
                // console.log(e.className);
                });
                e.addEventListener("mouseleave", (elem) => {
                e.style.filter = "grayscale(0%) blur(0px)";
                e.style.transition = "";
                // console.log(e.className);
                });
            }
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

            // for images that are embeded with a link
            var playNote = e.parentElement.parentElement.parentElement.parentElement.querySelector('div[aria-label="Play"]');
            if(playNote){
                playNote.parentElement.addEventListener("mouseenter", (elem) => {
                e.style.filter = "grayscale(0%) blur(0px)";
                e.style.transition = "0.5s filter linear";
                // console.log("IN:",e.className);
                });
                playNote.parentElement.addEventListener("mouseleave", (elem) => {
                e.style.filter = "grayscale(100%) blur(5px)";
                e.style.transition = "0.5s filter linear";
                // console.log("OUT:",e.className);
                });
            }
            e.addEventListener("mouseenter", (elem) => {
                e.style.filter = "grayscale(0%) blur(0px)";
                e.style.transition = "0.5s filter linear";
                // console.log("IN:",e.className);
            });
            e.addEventListener("mouseleave", (elem) => {
                e.style.filter = "grayscale(100%) blur(5px)";
                e.style.transition = "0.5s filter linear";
                // console.log("OUT:",e.className);
            });
        }
    });
}
  
function linkedin_blur_img(document_query){
    const elements = document_query.querySelectorAll("image,img,div[style^='background-image:']");
    [...elements].forEach(e => {
        if(e.clientWidth>image_size_threshold && e.clientHeight>image_size_threshold){
            e.style.filter = "grayscale(100%) blur(5px)";
            // e.style.zIndex = "1";
            var parentNode = e.parentElement.parentElement.parentElement;
            var siblingNode = e.parentElement.parentElement.parentNode.parentNode.getElementsByTagName('button')[0];
            // check if the figures are embeded with a button or a link
            if (parentNode.nodeName == "A" || parentNode.nodeName == "BUTTON"){
                parentNode.addEventListener("mouseenter", (elem) => {
                e.style.filter = "grayscale(0%) blur(0px)";
                e.style.transition = "0.5s filter linear";
                // console.log(e.className);
                });
                parentNode.addEventListener("mouseleave", (elem) => {
                e.style.filter = "grayscale(100%) blur(5px)";
                e.style.transition = "0.5s filter linear";
                // console.log(e.className);
                });
            }
            else if(siblingNode){
                siblingNode.addEventListener("mouseenter", (elem) => {
                e.style.filter = "grayscale(0%) blur(0px)";
                e.style.transition = "0.5s filter linear";
                // console.log(e.className);
                });
                siblingNode.addEventListener("mouseleave", (elem) => {
                e.style.filter = "grayscale(100%) blur(5px)";
                e.style.transition = "0.5s filter linear";
                // console.log(e.className);
                });
            }
            else{
                e.addEventListener("mouseenter", (elem) => {
                e.style.filter = "grayscale(0%) blur(0px)";
                e.style.transition = "0.5s filter linear";
                // console.log(e.className);
                });
                e.addEventListener("mouseleave", (elem) => {
                e.style.filter = "grayscale(100%) blur(5px)";
                e.style.transition = "0.5s filter linear";
                // console.log(e.className);
                });
            }
        }
    });
}

const run = () => getContainer()
    .then(container => {

        // remove distracting contents
        removeDistractions();

        // desaturate page view
        desaturate();
        
        // remove inifite scrolling only on home page
        if(isHomePage()){
            // console.log("current page is home page");
            if(currentPage == "Twitter"){ container.css("min-height", `${feedHeight}px`); }
            container.css("max-height", `${feedHeight}px`);
            if (currentPage == "Facebook" && parseInt(container.css('height'))<feedHeight){
                updateFacebookShowMore(container);
            }
            container_top = 0;
            if(container){
                var position = container.position();
                if (position){container_top = position.top;}
            }

            // console.log('Min:', container.css('min-height'));
            // console.log('Max:', container.css('max-height'));
            // console.log('current height:', container.css('height'));
            if (!isAlreadyManipulated(container)) {
                // console.log("remove INfinite scrolling!");
                removeInfiniteScrolling(container);
            }
        }
        else{
            // console.log("current page is NOT YouTube home page!");
            if(currentPage == "YouTube" && isAlreadyManipulated(container)){
                // console.log("remove YouTube FInite scrolling!");
                resetInfiniteScrolling(container); 
                // youtube_unblur_img(container); 
            }
        }
        // Keep running in case user leaves feed but returns later and we have
        // to reinsert the show more button
        setTimeout(run, 100);
    });

let feedHeight = 2500;
let container_top = 0;
const showMoreIncrement = 2500;
const currentPage = getCurrentPage();

if(currentPage == "Twitter"){
    window.addEventListener('load', spoofWindowSize)
    window.addEventListener('resize', spoofWindowSize)
    document.addEventListener('visibilitychange', spoofWindowSize)
    spoofWindowSize();
}

// content removing and finite scrolling
run();

/* comment out to replace blur with saturate

// blur & nblur images and remove dynamic distracting content update on pages
const image_size_threshold = 65; // image height threashold (px) for image blurring 

// Listen to page change based on sites
var mutationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        blur_img(mutation.target);
        // removeDynamicContentUpdate(mutation.target);
    });
});
  
// Starts listening for changes in the root HTML element of the page.
mutationObserver.observe(document.documentElement, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true,
    // attributeOldValue: true,
    // characterDataOldValue: true
});

// Takes all changes which haven’t been fired so far.
var changes = mutationObserver.takeRecords();
*/

// main
// initialUpdates();