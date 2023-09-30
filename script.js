const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item))

    checkUI();
}


//adding items

function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem = itemInput.value
    // validate Input
    if (newItem === '') {
        alert('Please add an item')
        return;
    }

    //check for for edit mode 
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExist(newItem)) {
            alert('Item Already Exists');
            return;
        }
    }

    //create item DOM element
    addItemToDOM(newItem);

    //add item to storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';
}


function addItemToDOM(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-lnk text-red');
    li.appendChild(button)

    //add the li to the DOM

    itemList.appendChild(li);
}


function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = []
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage
}


function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();
    //Add new item
    itemsFromStorage.push(item);

    //convert to JSON.string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExist(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}


function setItemToEdit(item) {
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

//remove item and clear items by clickin on the x mark

function removeItem(item) {
    if (confirm('Are you sure?')) {
    
        //remove item from DOM
        item.remove();
        
        removeItemFromStorage(item.textContent);
        
        checkUI();
    }

    //remove item from storage
    
} 

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    //filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item)

    //reset to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


//remove all items with clear button


function clearItems() {
    // itemList.innerHTML = '' // easier way to do it
    if (confirm('Are you sure you want to clear all?')) {
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild);
            checkUI()
        };
    }
    

    //clear from local storage

    localStorage.removeItem('items')
};


//filter function

function filterItems(e) {
    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li')

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLocaleLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

//to remove the clear button and filter option when there's no item on the list 
function checkUI() {
    itemInput.value = '';

    const items = itemList.querySelectorAll('li')

    if (items.length === 0) {
        clearButton.style.display = 'none'
        itemFilter.style.display = 'none'
    } else {
        clearButton.style.display = 'block'
        itemFilter.style.display = 'block'
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

//initialize app

function init() {
    //event listeners 
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearButton.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems)
    document.addEventListener('DOMContentLoaded', displayItems)

    checkUI();

}

init();
