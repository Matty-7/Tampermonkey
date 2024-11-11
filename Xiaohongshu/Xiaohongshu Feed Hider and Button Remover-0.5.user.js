// ==UserScript==
// @name         Xiaohongshu Feed Hider and Button Remover
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Hide feed on homepage, keep search results, and remove specific button globally
// @match        https://www.xiaohongshu.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide specific containers on the homepage
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

    // Function to hide specific elements globally
    function hideButtonGlobally() {
        // Hide the button with class .text.large.channel-btn.reds-button-new
        const targetButton = document.querySelector('.text.large.channel-btn.reds-button-new');
        if (targetButton) {
            targetButton.style.display = 'none';
        }

        // Hide the element with class .mask-paper > .right
        const maskPaperRight = document.querySelector('.mask-paper > .right');
        if (maskPaperRight) {
            maskPaperRight.style.display = 'none';
        }

        // Hide the sidebar with class .side-bar
        const sidebar = document.querySelector('.side-bar');
        if (sidebar) {
            sidebar.style.display = 'none';
        }
    }

    // Run hideFeed and hideButtonGlobally immediately when the script loads
    hideFeed();
    hideButtonGlobally();

    // Also set intervals to check repeatedly in case elements load with delay
    const feedCheckInterval = setInterval(hideFeed, 500); // Check every 500 ms on homepage
    const buttonCheckInterval = setInterval(hideButtonGlobally, 500); // Check every 500 ms globally

    // Stop the intervals once DOM is fully loaded and we ensure elements are hidden
    document.addEventListener("DOMContentLoaded", () => {
        hideFeed();
        hideButtonGlobally();
        clearInterval(feedCheckInterval);
        clearInterval(buttonCheckInterval);
    });
})();