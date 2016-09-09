(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// // Menu button element
// var menu = document.getElementById('menu');

// // leftmenu element
// var leftmenu = document.getElementById('leftmenu');

// // Nav element
// var nav = document.getElementsByTagName('nav')[0]

// // Toggle class function
// function toggleClass(element, className){
//     if (!element || !className){
//         return;
//     }
//     var classString = element.className, nameIndex = classString.indexOf(className);
//     if (nameIndex == -1) {
//         classString += ' ' + className;
//     }
//     else {
//         classString = classString.substr(0, nameIndex) + classString.substr(nameIndex+className.length);
//     }
//     element.className = classString;
// }

// menu.onclick = function() {
//     toggleClass(leftmenu, 'show');
// };


const treeMenu = document.getElementById('tree-menu');
if (treeMenu) {
    treeMenu.addEventListener('click', function (e) {
        if (e.target) {
            const ref = e.target.getAttribute('data-ref');
            if (document.getElementById(ref)) {
                document.location.hash = `#${ref}`;
                e.preventDefault();
                e.stopPropagation();
            }
        }
    })
}

},{}]},{},[1]);
