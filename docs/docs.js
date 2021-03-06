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
