(function ($) {
    $.fn.hanaHighlightAsError = function () {
        return this.each(function () {
            var element = $(this);
            if (element == null) {
                return;
            }
            if (element.hasClass('form-group')) {
                element.addClass('has-error');
                element.removeClass('has-success');
                return;
            }
            var parentFormGroupElement = element.closest('form-group');
            if (parentFormGroupElement == null) {
                return;
            }
            parentFormGroupElement.addClass('has-error');
            parentFormGroupElement.removeClass('has-success');
        });
    }
    $.fn.hanaHighlightAsSuccess = function () {
        return this.each(function () {
            var element = $(this);
            if (element == null) {
                return;
            }
            if (element.hasClass('form-group')) {
                element.addClass('has-success');
                element.removeClass('has-error');
                return;
            }
            var parentFormGroupElement = element.closest('form-group');
            if (parentFormGroupElement == null) {
                return;
            }
            parentFormGroupElement.addClass('has-success');
            parentFormGroupElement.removeClass('has-error');
        });
    }
    $.fn.hanaUnhighlight = function () {
        return this.each(function () {
            var element = $(this);
            if (element == null) {
                return;
            }
            if (element.hasClass('form-group')) {
                element.removeClass('has-success');
                element.removeClass('has-error');
                return;
            }
            var parentFormGroupElement = element.closest('form-group');
            if (parentFormGroupElement == null) {
                return;
            }
            parentFormGroupElement.removeClass('has-success');
            parentFormGroupElement.removeClass('has-error');
        });
    }
})(jQuery);
function isValidDecimalValue(valueToValidate) {
    regexPattern = /^(\d+\.?\d{0,9}|\.\d{1,3})$/
    if (valueToValidate == undefined || valueToValidate == NaN || !valueToValidate.length) {
        return false;
    }
    return valueToValidate.match(regexPattern);
}
function isValidIntegerValue(valueToValidate) {
    regexPattern = /^\d{1,}$/
    if (valueToValidate == undefined || valueToValidate == NaN || !valueToValidate.length) {
        return false;
    }
    return valueToValidate.match(regexPattern);
}