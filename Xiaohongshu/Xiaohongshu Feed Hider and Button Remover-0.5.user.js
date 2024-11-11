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

    // 变量用于存储用于隐藏 feed 的样式元素
    let feedStyleElement = null;

    // 函数：检查当前是否在主页
    function isHomePage() {
        // 主页的路径通常是 '/'，或者以 '/explore' 开头
        return window.location.pathname === '/' || window.location.pathname.startsWith('/explore');
    }

    // 函数：注入全局 CSS 样式
    function injectGlobalCSS() {
        const css = `
        /* 全局隐藏的元素 */
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

    // 函数：根据当前页面动态添加或移除用于隐藏 feed 的 CSS
    function updateFeedHidingCSS() {
        if (isHomePage()) {
            if (!feedStyleElement) {
                const homePageCSS = `
                /* 仅在主页隐藏 feed 元素 */
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

    // 函数：观察 DOM 变化
    function observeDOM() {
        const observer = new MutationObserver(() => {
            // 当 DOM 发生变化时，更新 feed 隐藏状态并隐藏全局元素
            updateFeedHidingCSS();
            hideGlobalElements();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 函数：隐藏全局元素
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

    // 初始执行
    injectGlobalCSS();
    updateFeedHidingCSS();
    hideGlobalElements();
    observeDOM();

    // 监听 URL 变化
    function onUrlChange() {
        updateFeedHidingCSS();
    }

    // 重写 history.pushState 和 history.replaceState，以检测站内导航
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

    // 监听 popstate 事件（用于处理浏览器的前进和后退）
    window.addEventListener('popstate', function() {
        onUrlChange();
    });

})();