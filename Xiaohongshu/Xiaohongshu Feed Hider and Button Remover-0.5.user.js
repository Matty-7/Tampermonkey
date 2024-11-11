// ==UserScript==
// @name         Xiaohongshu Feed Hider and Button Remover
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Hide feed on homepage, keep search results, and remove specific button globally
// @match        https://www.xiaohongshu.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide feed container on homepage
    function hideFeed() {
        if (window.location.href.includes("homefeed_recommend")) {
            const feedContainer = document.querySelector('.feeds-container');
            const scrollContainer = document.querySelector('.channel-scroll-container.scroll-container');

            if (feedContainer) {
                feedContainer.style.display = 'none';
            }
            if (scrollContainer) {
                scrollContainer.style.display = 'none';
            }
        }
    }

    // Function to hide the specific buttons globally
    function hideButtonGlobally() {
        // Hide the specific button with class .text.large.channel-btn.reds-button-new
        const targetButton = document.querySelector('.text.large.channel-btn.reds-button-new');
        if (targetButton) {
            targetButton.style.display = 'none';
        }

        // Hide the element with class .mask-paper > .right
        const maskPaperRight = document.querySelector('.mask-paper > .right');
        if (maskPaperRight) {
            maskPaperRight.style.display = 'none';
        }
    }

    // Set up MutationObserver to dynamically hide elements as they load
    const observer = new MutationObserver(() => {
        hideFeed(); // Hide the feed container on homepage
        hideButtonGlobally(); // Hide the specific buttons globally
    });

    // Start observing changes to the entire document body
    observer.observe(document.body, {
        childList: true, // Watch for new elements added
        subtree: true // Include all descendants
    });

    // Run immediately on page load to hide elements that are already present
    hideFeed();
    hideButtonGlobally();

    // Stop observing after page fully loads
    window.addEventListener("load", () => {
        hideFeed();
        hideButtonGlobally();
        observer.disconnect(); // Stop observing once elements are hidden
    });
})();