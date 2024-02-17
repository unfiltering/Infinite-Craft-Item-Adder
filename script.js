// ==UserScript==
// @name         Neal.Fun Item Adder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds buttons to add and remove items from the list
// @author       You
// @icon         https://www.google.com/s2/favicons?domain=neal.fun/infinite-craft/&sz=64
// @match        *://neal.fun/infinite-craft/
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function addItem() {
        var itemName = prompt("What's the name of the element?");
        if (itemName === null) {
            return; // Cancelled, do nothing
        }
        var itemEmoji = prompt("What's the emoji for " + itemName + "?");
        if (itemEmoji === null) {
            return; // Cancelled, do nothing
        }

        // Function to capitalize first letter of each word, including specified exceptions
        function capitalizeName(name) {
            var exceptions = ["or", "the", "and", "of", "as"];
            var words = name.toLowerCase().split(' ');
            for (var i = 0; i < words.length; i++) {
                if (i === 0 || !exceptions.includes(words[i])) {
                    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
                }
            }
            return words.join(' ');
        }

        itemName = capitalizeName(itemName);

        try {
            var storedData = localStorage.getItem('infinite-craft-data');
            var data = storedData ? JSON.parse(storedData) : {"elements": []};
        } catch (error) {
            console.error("Error parsing JSON data from localStorage:", error);
            return;
        }

        var existingItemIndex = data.elements.findIndex(function(element) {
            return element.text.toLowerCase() === itemName.toLowerCase();
        });

        var isDiscovered = false; // Default to not discovered

        if (existingItemIndex === -1) {
            // Item is being added for the first time
            var discoveryConfirmation = confirm("Is this the first time discovering " + itemName + "? (cancel for no)");
            if (discoveryConfirmation) {
                isDiscovered = true;
            }
        } else {
            // Item already exists, no need to mark as discovered again
            isDiscovered = data.elements[existingItemIndex].discovered;
        }

        data.elements.push({"text": itemName, "emoji": itemEmoji, "discovered": isDiscovered});

        localStorage.setItem('infinite-craft-data', JSON.stringify(data));
        window.location.reload();
        console.log('Created item ' + itemEmoji + ' ' + itemName + '.');
    }

    function removeItem() {
        var itemNameToRemove = prompt("What's the name of the element you want to remove?");
        if (itemNameToRemove === null) {
            return; // Cancelled, do nothing
        }
        // Convert input name to lowercase
        itemNameToRemove = itemNameToRemove.toLowerCase();
        try {
            var storedData = localStorage.getItem('infinite-craft-data');
            var data = storedData ? JSON.parse(storedData) : {"elements": []};
        } catch (error) {
            console.error("Error parsing JSON data from localStorage:", error);
            return;
        }

        var indexToRemove = data.elements.findIndex(function(element) {
            // Convert stored item name to lowercase for comparison
            return element.text.toLowerCase() === itemNameToRemove;
        });

        if (indexToRemove !== -1) {
            data.elements.splice(indexToRemove, 1);
            localStorage.setItem('infinite-craft-data', JSON.stringify(data));
            window.location.reload();
            console.log('Removed item ' + itemNameToRemove + '.');
        } else {
            console.log('Item ' + itemNameToRemove + ' not found.');
        }
    }

    function resetData() {
        if (confirm("Are you sure you want to reset to default?")) {
            var defaultData = {
                "elements": [
                    {"text": "Water", "emoji": "💧", "discovered": false},
                    {"text": "Fire", "emoji": "🔥", "discovered": false},
                    {"text": "Wind", "emoji": "🌬️", "discovered": false},
                    {"text": "Earth", "emoji": "🌍", "discovered": false}
                ]
            };
            localStorage.setItem('infinite-craft-data', JSON.stringify(defaultData));
            window.location.reload();
            console.log("Data reset!")
        }
    }

    function addButton() {
        var addButtonContainer = document.querySelector('.add-item-button-container');
        if (!addButtonContainer) {
            addButtonContainer = document.createElement('div');
            addButtonContainer.className = 'add-item-button-container';
            addButtonContainer.style.position = 'fixed';
            addButtonContainer.style.bottom = '10px';
            addButtonContainer.style.left = '10px';
            document.body.appendChild(addButtonContainer);
        }

        var addButton = document.createElement('button');
        addButton.textContent = 'Add Item';
        addButton.style.marginRight = '5px';
        addButton.addEventListener('click', addItem);
        addButtonContainer.appendChild(addButton);

        var removeButton = document.createElement('button');
        removeButton.textContent = 'Remove Item';
        removeButton.style.marginRight = '5px';
        removeButton.addEventListener('click', removeItem);
        addButtonContainer.appendChild(removeButton);

        var resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.style.marginRight = '5px';
        resetButton.addEventListener('click', resetData);
        addButtonContainer.appendChild(resetButton);
    }

    addButton();
    console.log("[Neal.fun Item Adder]: Thanks for using!");
})();
