// ==UserScript==
// @name         Xiaohongshu Feed Hider and Button Remover
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Hide feed on homepage, keep search results, and remove specific buttons globally
// @match        https://www.xiaohongshu.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Variable to store the style element used for hiding the feed
    let feedStyleElement = null;

    // Function: Check if we are currently on the homepage
    function isHomePage() {
        // The homepage path is usually '/', or starts with '/explore'
        return window.location.pathname === '/' || window.location.pathname.startsWith('/explore');
    }

    // Function: Inject global CSS styles
    function injectGlobalCSS() {
        const css = `
        /* Globally hidden elements */
        .side-bar,
        .mask-paper > .right,
        button[class*="channel-btn"] {
            display: none !important;
        }
        `;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'globalHideStyle';
        style.appendChild(document.createTextNode(css));

        document.head.appendChild(style);
    }

    // Function: Dynamically add or remove CSS to hide the feed based on the current page
    function updateFeedHidingCSS() {
        if (isHomePage()) {
            if (!feedStyleElement) {
                const homePageCSS = `
                /* Hide feed elements only on the homepage */
                .feeds-container,
                .channel-scroll-container {
                    display: none !important;
                }
                `;
                feedStyleElement = document.createElement('style');
                feedStyleElement.type = 'text/css';
                feedStyleElement.id = 'feedHideStyle';
                feedStyleElement.appendChild(document.createTextNode(homePageCSS));
                document.head.appendChild(feedStyleElement);
            }
        } else {
            if (feedStyleElement) {
                feedStyleElement.parentNode.removeChild(feedStyleElement);
                feedStyleElement = null;
            }
        }
    }

    // Function: Observe DOM changes
    function observeDOM() {
        const observer = new MutationObserver(() => {
            // When the DOM changes, update the feed hiding status and hide global elements
            updateFeedHidingCSS();
            hideGlobalElements();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function: Hide global elements
    function hideGlobalElements() {
        const globalSelectors = [
            '.side-bar',
            '.mask-paper > .right',
            'button[class*="channel-btn"]'
        ];

        globalSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.style.display !== 'none') {
                    element.style.display = 'none';
                }
            });
        });
    }

    // Initial execution
    injectGlobalCSS();
    updateFeedHidingCSS();
    hideGlobalElements();
    observeDOM();

    // Listen for URL changes
    function onUrlChange() {
        updateFeedHidingCSS();
    }

    // Override history.pushState and history.replaceState to detect in-site navigation
    (function(history){
        const pushState = history.pushState;
        history.pushState = function(state) {
            const ret = pushState.apply(history, arguments);
            onUrlChange();
            return ret;
        };
        const replaceState = history.replaceState;
        history.replaceState = function(state) {
            const ret = replaceState.apply(history, arguments);
            onUrlChange();
            return ret;
        };
    })(window.history);

    // Listen for the popstate event (for handling browser forward and back buttons)
    window.addEventListener('popstate', function() {
        onUrlChange();
    });

})();