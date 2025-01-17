// whether sidebars to be shown or not
var $showLeftSide  = getCookie("showLeftSide");
var $showRightSide = getCookie("showRightSide");

// Add class to given id
function addClassToId(id, name) {
    document.getElementById(id).classList.add(name);
}

// Remove class from given id
function removeClassFromId(id, name) {
    document.getElementById(id).classList.remove(name);
}

// Set add/remove class from given id
function setStateOfClassOnId(id, add, name = 'is-active') {
    let classlist = document.getElementById(id).classList;
    add ? classlist.add(name) : classlist.remove(name);
}

// Init main position wrt sidebars
if ($showLeftSide === true) {
    addClassToId('main-container', 'has-left-sidebar');
}
if ($showRightSide === true) {
    addClassToId('main-container', 'has-right-sidebar');
}

// targets for gist of current channel
var $currentChannel;
var $gistTargets;

// Filter settings
var $filterMessagesByNick = getCookie("MessagesByNick");
var $filterMessagesByText = getCookie("MessagesByText");
var $filterExcludeByNick  = getCookie("ExcludeByNick");
var $filterExcludeByText  = getCookie("ExcludeByText");
var $showSystemMessages   = getCookie("SystemMessages");
var $hideCommitMessages   = getCookie("CommitMessages");
var $hideCameliaOutput    = getCookie("CameliaOutput");

// Generic function for setting a cookie
function setCookie(name, value) {
    document.cookie = name + "=" + value + ";path=/";
    return value;
}

// Generic function for getting a cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookies = decodedCookie.split(';');
    for(let i = 0; cookies.length > i; i++) {
        let c = cookies[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            let cookie = c.substring(name.length, c.length);
            return cookie == "true"
              ? true
              : cookie == "false"
                ? false
                : cookie;
        }
    }
    return "";
}

// Generic function to copy text to clipboard
function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text);
}

// Generic function to scroll to the bottom of the window
function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}

// Generic function to set/unset "is-primary" class of an element
function setPrimaryByElement(element, primary) {
    if (primary) {
        element.classList.remove('is-primary');
    } else {
        element.classList.add('is-primary');
    }
}

// Generic function to set/unset "is-hidden" class on an element
function setVisibilityByElement(element, visible) {
    if (visible) {
        element.classList.remove('is-hidden');
    } else {
        element.classList.add('is-hidden');
    }
}

// Generic function to set/unset "is-hidden" class on elements by class name
function setVisibilityByName(name, visible) {
    let rows = document.getElementsByClassName(name);
    for (let i = 0; rows.length > i; i++) {
        setVisibilityByElement(rows[i], visible);
    }
}

// Generic function to set/unset "is-primary" class for buttons by id
function setButtons(name, state) {
    let buttons = document.querySelectorAll('button[id=' + name + ']');
    for (let i = 0; buttons.length > i; i++) {
        setPrimaryByElement(buttons[i], state);
    }
}

// Generic function to set display state of an element by ID
function setDisplayById(id, state) {
    let style = document.getElementById(id).style;
    style.display = state ? "block" : "none";
    style.width   = state ? "300px" : "0";
}

// Generic function to set state of checkboxes by id
function setCheckboxes(name, state) {
    let boxes = document.querySelectorAll('input[id=' + name + ']');
    for (let i = 0; boxes.length > i; i++) {
        boxes[i].checked = state;
    }
}

// Toggle visibility of left sidebar
function toggleLeftSidebar() {
    $showLeftSide = setCookie('showLeftSide', !$showLeftSide);
    if ($showLeftSide === "" || !$showLeftSide) {
        document.getElementById('main-container').classList.remove('has-left-sidebar');
        document.getElementById('navbar-left-toggle').querySelectorAll('svg')[1].classList.add('fa-chevron-right');
    } else {
        document.getElementById('main-container').classList.add('has-left-sidebar');
        document.getElementById('navbar-left-toggle').querySelectorAll('svg')[1].classList.add('fa-chevron-left');
    }
    setDisplayById('left-column', $showLeftSide);
}

// Toggle visibility of right sidebar
function toggleRightSidebar() {
    $showRightSide = setCookie('showRightSide', !$showRightSide);
    if ($showRightSide === "" || !$showRightSide) {
        document.getElementById('main-container').classList.remove('has-right-sidebar');
        document.getElementById('navbar-right-toggle').querySelectorAll('svg')[0].classList.add('fa-chevron-left');
    } else {
        document.getElementById('main-container').classList.add('has-right-sidebar');
        document.getElementById('navbar-right-toggle').querySelectorAll('svg')[0].classList.add('fa-chevron-right');
    }
    setDisplayById('right-column', $showRightSide);
}

// Toggle currently opened tab in a mobile filter/search menu
function switchMobileTab(num) {
    setStateOfClassOnId('filter-mobile-switch', num == 0);
    setStateOfClassOnId('search-mobile-switch', num == 1);
    setStateOfClassOnId('tab-filter', num == 0);
    setStateOfClassOnId('tab-search', num == 1);
}

// Submit search if Enter was pressed and all requirements are met
function submitSearchIfEnter() {
    if (event.keyCode == 13 && okToSubmitSearch()) {
        document.getElementById('Search').submit();
    }
}

// Submit search with current parameters on given channel
function submitSearchOnChannel(channel) {
    document.getElementById('SearchChannel').value = channel;
    document.getElementById('Search').submit();
}

// Return whether it is ok to submit a search request
function okToSubmitSearch() {
    return document.getElementById('SearchChannel').value;
}

// Check search form, highlight part(s) that are not ok if not ok
function checkSearchParameters() {
    if (okToSubmitSearch()) {
        return true;
    }
    document.getElementById('SearchChannel').focus();
    return false;
}

// Get the gist targets for a channel
function getGistTargets(channel = $currentChannel) {
    return getCookie(channel + "Targets");
}

// Set gist targets in cookie and set the Gist link with those targets
function setGistTargets(targets = $gistTargets) {
    $gistTargets = setCookie($currentChannel + 'Targets', targets);
    document.getElementById('Gist').href =
      '/' + $currentChannel + '/gist.html?' + targets;
}

// Get the element that has a "target" attribute in the given element
function elementOfTarget(element, target) {
    return document.querySelector(element + '[target="' + target + '"]');
}

// Reset all gist targets for the current channel, update messages accordingly
function clearGistTargets() {
    setGistTargets("");
    markSelected();
}

// Add visible messages' targets to the gist targets of current channel
function addVisibleTargets() {
    let newTargets = $gistTargets.split(',');;
    let haystack   = $gistTargets + ',';
    let trs = document.querySelectorAll('tr[target]');
    for (let i = 0; trs.length > i; i++) {
        let tr = trs[i];
        if (!tr.classList.contains('is-hidden')) {
            let target = tr.getAttribute('target');
            if (!haystack.includes(target + ',')) {
                setTargetSelectionState(target, true);
                newTargets.push(target);
            }
        }
    }
    setGistTargets(newTargets.sort().join(','));
}

// Hide channels from channel pulldown that don't have gist targets
function hideChannelsWithoutGistTargets() {
    let items = document.querySelectorAll('li[id]');
    for (let i = 0; items.length > i; i++) {
        let item = items[i];
        if (!getGistTargets(item.getAttribute('id'))) {
            item.classList.add('is-hidden');
        }
    }
}

// Remove targets of visible messages from the gist targets of current channel
function removeVisibleTargets() {
    let currentTargets = $gistTargets.split(",");
    let newTargets = [];
    for (let i = 0; currentTargets.length > i; i++) {
        let target = currentTargets[i];
        let tr     = elementOfTarget('tr', target);
        if (tr) {
            if (tr.classList.contains('is-hidden')) {
                newTargets.push(target);
            } else {
                setTargetSelectionState(target, false);
            }
        }
    }
    setGistTargets(newTargets.sort().join(','));
}

// Set gist selection state of given target, update highlight and pulldown menu
function setTargetSelectionState(target, on) {
    let tr = elementOfTarget('tr', target);
    if (tr) {
        if (on) {
            tr.classList.add('special-selected');
        } else {
            tr.classList.remove('special-selected');
        }
    }
    let option = elementOfTarget('a', target);
    if (option) {
        if (on) {
            option.classList.add('is-hidden');
            option.nextSibling.classList.remove('is-hidden');
        } else {
            option.classList.remove('is-hidden');
            option.nextSibling.classList.add('is-hidden');
        }
    }
}

// Toggle target, update status, visibility and cookie
function toggleTargetFromGist(target) {
    let currentTargets = $gistTargets.split(',');
    let newTargets = [];
    let mustAdd = true;
    for (let i = 0; currentTargets.length > i; i++) {
        let current = currentTargets[i];
        if (current == target) {
            setTargetSelectionState(target, false);
            mustAdd = false;
        } else {
            newTargets.push(current);
        }
    }
    if (mustAdd) {
        setTargetSelectionState(target, true);
        newTargets.push(target);
    }
    setGistTargets(newTargets.sort().join(','));
}

// Remove target, update status, visibility and cookie
function removeTargetFromGist(target) {
    let currentTargets = $gistTargets.split(',');
    let newTargets = [];
    let remove = false;
    for (let i = 0; currentTargets.length > i; i++) {
        let current = currentTargets[i];
        if (current) {
            if (current == target) {
                remove = true;
            } else {
                newTargets.push(current);
            }
        }
    }
    if (remove) {
        setTargetSelectionState(target, false);
    }
    setGistTargets(newTargets.sort().join(','));
}

// Add target, update status, visibility and cookie
function addTargetToGist(target) {
    let currentTargets = $gistTargets.split(',');
    let newTargets = [];
    let add = true;
    for (let i = 0; currentTargets.length > i; i++) {
        let current = currentTargets[i];
        if (current) {
            if (current == target) {
                add = false;
            } else {
                newTargets.push(current);
            }
        }
    }
    if (add) {
        setTargetSelectionState(target, true);
        newTargets.push(target);
    }
    setGistTargets(newTargets.sort().join(','));
}

// Update visibility / menu of all messages of the current gist targets
function markSelected() {
    let links = document.querySelectorAll('a[target]');
    let haystack = $gistTargets + ',';
    for (let i = 0; links.length > i; i++) {
        let target = links[i].getAttribute('target');
        setTargetSelectionState(target, haystack.includes(target + ','));
    }
}

// Show/hide system messages, sets global flag and cookie unless inhibited
function visibilitySystemMessages(
  show = $showSystemMessages,
  global = true  // by default, set checkboxes + cookie as well
) {
    if (global) {
        $showSystemMessages = setCookie('SystemMessages', !!show);
        setCheckboxes('SystemMessages', $showSystemMessages);
    }
    setVisibilityByName("special-system", $showSystemMessages)
}

// Show/hide commit messages, sets global flag and cookie
function visibilityCommitMessages(hidden = $hideCommitMessages) {
    $hideCommitMessages = setCookie('CommitMessages', !!hidden);
    setCheckboxes('CommitMessages', $hideCommitMessages);
    setVisibilityByName("special-commit", !$hideCommitMessages)
}

// Show/hide Camelia output messages, sets global flag and cookie
function visibilityCameliaOutput(hidden = $hideCameliaOutput) {
    $hideCameliaOutput = setCookie('CameliaOutput', !!hidden);
    setCheckboxes('CameliaOutput', $hideCameliaOutput);
    setVisibilityByName("special-camelia", !$hideCameliaOutput)
}

// Update input filter fields by ID and set associated cookie
function updateFilter(name, value) {
    let inputs = document.querySelectorAll('input[id=' + name + ']');
    for (let i = 0; inputs.length > i; i++) {
        inputs[i].value = value;
    }
    return setCookie(name, value);
}

// Return true if any of the lowercase needles is found in the given haystack
function containsAnyTexts(haystack, needles) {
    for (let i = 0; needles.length > i; i++) {
        let needle = needles[i].trim();
        if (needle) {
            if (haystack.toLowerCase().indexOf(needle) != -1) {
                return true;
            }
        } else {
            return true;
        }
    }
    return false;
}

// Return true if lowercase needle is found in the given haystack
function containsText(haystack, text) {
    let needle = text.trim();
    return needle
      ? haystack.toLowerCase().indexOf(needle) != -1
      : true;
}

// Set visibility of messages depending on the filter settings
function filterMessages(
  nick = $filterMessagesByNick,
  text = $filterMessagesByText
) {
    let columns = document.querySelectorAll('td[nick]');

    $filterMessagesByNick = updateFilter("MessagesByNick", nick);
    $filterMessagesByText = updateFilter("MessagesByText", text);
    setButtons('ExcludeByNick', $filterExcludeByNick);
    setButtons('ExcludeByText', $filterExcludeByText);

    if (nick || text) {
        visibilitySystemMessages(false, false);

        let lcNicks = nick.toLowerCase().split(',');
        let lcText  = text.toLowerCase();

        for (let i = 0; columns.length > i; i++) {
            let column = columns[i];
            let parent = column.parentElement;

            let nickOK = nick
              && containsAnyTexts(column.getAttribute("nick"),lcNicks)
                   == $filterExcludeByNick;
            let textOK = text
              && containsText(parent.cells[1].textContent, lcText)
                   == $filterExcludeByText;

            setVisibilityByElement(
              parent,
              (nick && text && nickOK && textOK)
                || (!nick && textOK)
                || (!text && nickOK)
            )
        }
    } else {
        for (let i = 0; columns.length > i; i++) {
            setVisibilityByElement(columns[i].parentElement, true)
        }
        visibilitySystemMessages();
        visibilityCommitMessages();
        visibilityCameliaOutput();
    }
}

function filterMessagesByNick(nick) {
    filterMessages(nick);
}

function filterMessagesByText(text) {
    filterMessages($filterMessagesByNick, text);
}

function filterExcludeByNick(button) {
    $filterExcludeByNick = setCookie(
      'ExcludeByNick',
      !!button.classList.contains('is-primary')
    );
    filterMessages();
}
function filterExcludeByText(button) {
    $filterExcludeByText = setCookie(
      'ExcludeByText',
      !!button.classList.contains('is-primary')
    );
    filterMessages();
}

// fetch additional HTML and call callback when done
function additionalHTML(url, whenReady) {
    let xhr = new XMLHttpRequest();
    xhr.ontimeout = function () {
        console.error("The request for " + url + " timed out.");
    }
    xhr.onload = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                whenReady.apply(xhr);
            } else if (xhr.status = 204) {
                // no action needed
            } else {
                console.error('The request for '
                  + url
                  + ' failed: '
                  + xhr.statusText
                );
            }
        }
    }
    xhr.open("GET", url, true);
    xhr.timeout = 5000;
    xhr.send(null);
}

// scroll up the given channel/target for given number of entries
// returns the new target to look for
function scrollup(channel, entries) {
    let target = document.querySelector("tbody").children[1].getAttribute("target");
    additionalHTML(
      "/" + channel + "/scroll-up.html?target=" + target + "&entries=" + entries,
      function() {
        let topElement = document.querySelector("tr[target='" + target + "']");
        if (topElement) {
            topElement.previousSibling.previousSibling.remove();
            topElement.previousSibling.remove();
            topElement.remove();
        }

        let tbodyElem = document.querySelector("tbody");
        tbodyElem.innerHTML = this.responseText + tbodyElem.innerHTML;
        filterMessages();
      }
    );
}

// scroll down the given channel/target (finding all newest messages)
function scrolldown(channel) {
    let target = document.querySelector("tbody").lastElementChild.getAttribute("target");
    additionalHTML(
      url = "/" + channel + "/scroll-down.html?target=" + target,
      function () {
          let tbodyEl = document.querySelector("tbody");
          tbodyEl.innerHTML = tbodyEl.innerHTML + this.responseText;
          filterMessages();
      }
    );
}
