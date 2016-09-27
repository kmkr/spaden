(function(){
   var elList, startEvt, lastMove;
   var MOVE_THRESHOLD = 10;
   var COLLAPSES_AT = 767;

   function isCollapsed () {
       return window.innerWidth <= COLLAPSES_AT;
   }

   function bind (obj, eventName, callback) {
       if (obj.addEventListener) {
           obj.addEventListener(eventName, callback, false);
       } else if (obj.attachEvent) {
           obj.attachEvent("on" + eventName, callback);
       }
   }

   function toggleMenu (ul) {
       if (ul.className.indexOf("r-tabs-open") === -1) {
           ul.className += " r-tabs-open";
       } else {
           ul.className = ul.className.replace(/r-tabs-open/, "");
       }
   }

   function touchStart (evt) {
       if (!isCollapsed()) {
           return;
       }
       startEvt = evt;
       lastMove = null;
   }

   function touchMove (evt) {
       if (!startEvt) {
           return;
       }
       lastMove = evt;
   }

   function touchEnd (evt) {
       var length;
       if (!startEvt) { return; }
       if (lastMove ) {
           var xDiff = startEvt.touches[0].clientX - lastMove.touches[0].clientX;
           var yDiff = startEvt.touches[0].clientY - lastMove.touches[0].clientY;
           length = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff,2));
       }
       if (!lastMove || length < MOVE_THRESHOLD) {
           toggleMenu(evt.target);
       }
       startEvt = null;
       lastMove = null;
   }

   function init () {
       var nodeList = document.getElementsByClassName("r-tabs");
       elList = Array.prototype.slice.call(nodeList);

       elList.forEach(function (ul) {
           bind(ul, "touchstart", touchStart);
           bind(ul, "touchmove", touchMove);
           bind(ul, "touchend", touchEnd);
       });
   }

   bind(window, "load", init);
})();
