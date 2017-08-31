var candidates = [];

// pass in a string of selectors to be balanced.
// if you didnt specify any, thats ok! We'll just
// balance anything with the balance-text class
var textBalancer = function (selectors) {

    if (!selectors) {
        candidates = document.querySelectorAll('.balance-text');
    } else {
        createSelectors(selectors);
    }

    balanceText();

    var rebalanceText = debounce(function() {
        balanceText();
    }, 100);

    window.addEventListener('resize', rebalanceText);
}

// this populates our candidates array with dom objects
// that need to be balanced
var createSelectors = function(selectors) {
    var selectorArray = selectors.split(',');
    for (var i = 0; i < selectorArray.length; i += 1) {
        var currentSelectorElements = document.querySelectorAll(selectorArray[i].trim());

        for (var j = 0; j < currentSelectorElements.length; j += 1) {
            var currentSelectorElement = currentSelectorElements[j];
            candidates.push(currentSelectorElement);
        }
    }
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
var debounce = function (func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


// HELPER FUNCTION -- initializes recursive binary search
var balanceText = function () {
    var element;
    var i;

    for (i = 0; i < candidates.length; i += 1) {
        element = candidates[i];
        element.style.maxWidth = '';
        squeezeContainer(element, element.clientHeight, 0, element.clientWidth);
    }

}

// Make the element as narrow as possible while maintaining its current height (number of lines). Binary search.
var squeezeContainer = function (element, originalHeight, bottomRange, topRange) {
    var mid;
    if (bottomRange >= topRange) {
        element.style.maxWidth = topRange + 'px';
        return;
    }
    mid = (bottomRange + topRange) / 2;
    element.style.maxWidth = mid + 'px';

    if (element.clientHeight > originalHeight) {
        // we've squoze too far and element has spilled onto an additional line; recurse on wider range
        squeezeContainer(element, originalHeight, mid+1, topRange);
    } else {
        // element has not wrapped to another line; keep squeezing!
        squeezeContainer(element, originalHeight, bottomRange+1, mid);
    }
}

exports.balanceText = textBalancer;
