/*global jQuery*/
var FINN = FINN || {};
FINN.ui = FINN.ui || {};

FINN.ui.popover = (function($){
    "use strict";

    function attachListeners() {
        $("[data-popover-action='open']").on("click", openPopover);
        $("[data-popover-action='close']").on("click", closePopover);
    }

    function removeListeners() {
        $("[data-popover-action='open']").off("click", openPopover);
        $("[data-popover-action='close']").off("click", closePopover);
    }

    function openPopover(e) {
        e.preventDefault();
        $(e.target).siblings().find("[data-popover-component='content']").fadeIn("fast");
    }

    function closePopover(e) {
        e.preventDefault();
        $("[data-popover-component='content']").fadeOut("fast");
    }

    $(document).ready(attachListeners);

    return {
        initialize: attachListeners,
        _die: removeListeners
    };
