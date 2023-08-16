const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearBtn = document.getElementById('clear')
const itemFilter = document.getElementById('filter')
const formBtn = itemForm.querySelector('button')
let isEditMode = false


// To display all items in the storage and display them !! 
function displayItems() {
    // Get titems from storage 
    const itemsFromStorage = getItemsfromStorage()
    // To add them to DOM 
    // Loop thoutght items from storage, and for eatch item add them to dom
    itemsFromStorage.forEach(item => addItemToDOM(item))
    // Check UI again to get filter and button
    checkUI()
}


function onAddItemSubmit(e) {
    e.preventDefault()

  const newItem = itemInput.value;

  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

// Check for Edit mode
if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode')

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
}

    // Create item DOM element
addItemToDOM(newItem) 

// Add item to local storage
addItemToStorage(newItem)


   checkUI()

   itemInput.value = ''
}

// Function to add item to the DOM
function addItemToDOM (item) {
    // Create list item
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item))
 
 
    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button)
 
 //    Add li to the DOM
    itemList.appendChild(li)
}




function createButton(classes) {
    const button = document.createElement('button')
    button.className = classes
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button
}

function createIcon(classes) {
    const icon = document.createElement('i')
    icon.className = classes
    return icon

}

// Function to add items to the array 
function addItemToStorage(item) {
    // To check if we have items in the storage !!!
    const itemsFromStorage = getItemsfromStorage()

    // // check storage for 'items' and if null then nothing is there 
    // if(localStorage.getItem('items') === null) {
    //     // Then set items from storage to empty Array [] !! 
    //     itemsFromStorage = []
    //     // But if there is somethin then add items to Array [] !! 
    // } else {
    //     // get items and gives uz a string but to put it in Array we need to JSON.parse() !!! 
    //     itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    // }

    // To add items and add the to array using push method !! 
    itemsFromStorage.push(item)

    // Convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}





// To get items from storage !!! 
function getItemsfromStorage() {
    let itemsFromStorage

    // check storage for 'items' and if null then nothing is there 
    if(localStorage.getItem('items') === null) {
        // Then set items from storage to empty Array [] !! 
        itemsFromStorage = []
        // But if there is somethin then add items to Array [] !! 
    } else {
        // get items and gives uz a string but to put it in Array we need to JSON.parse() !!! 
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    return itemsFromStorage
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

    function checkIfItemExists(item) {
        const itemsFromStorage = getItemsfromStorage()
        return itemsFromStorage.includes(item)
    }


// Function to change button to Edit Mode !!!
function setItemToEdit(item) {
    isEditMode = true

    // Removes edit mode from all other elements !! 
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'))

    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent
}

// With event deligationtarget specific red cross to delete all section ! 
function removeItem(item) {
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsfromStorage()

    // Filter out items to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i!== item)
    // Reset to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function clearItems() {
    // one way to delete items 
    // itemList.innerHTML = ''

    // Harder way to delete all
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild)

        // Clear from local storage
        localStorage.removeItem('items')
    }
    // Check UI again to hide filter and clear btn
    checkUI()
}

function filterItems(e) {
    // Make sure filter checks only lower case .toLoverCase()
    const text = e.target.value.toLowerCase()
    const items = itemList.querySelectorAll('li')

    items.forEach((item) => {
        // targeting firstChild with is the name in li !!!! 
        const itemName = item.firstChild.textContent.toLowerCase()

        // check item name with indexOf(text) != -1 because if indexOf does not find a match it will give out -1 !!! so we say (if text is not -1 then display 'flex' else 'none')
        if (itemName.indexOf(text) != -1) {
            // we say 'flex' and not 'block' because its set flex by default !!!! 
            item.style.display = 'flex'
        } else {
            item.style.display = 'none'
        }
        })
    }


// Check UI if there is any items !!!  and dont display filter and Clear all btn!!! 
function checkUI() {
    // to Clear UI when checked 
    itemInput.value = ''
    // Adding const items here so that everytime function runs if else its adds li  !!! 
    const items = itemList.querySelectorAll('li')
    if (items.length === 0) {
        console.log(items);
        clearBtn.style.display = 'none'
        itemFilter.style.display = 'none'
        // To bring them back if items appear BUT we need to check UI right after we add item !!! so write code after Create List Item Code !!!! 
    } else {
        clearBtn.style.display = 'block'
        itemFilter.style.display = 'block'
    }

    formBtn.innerHTML = '<i class ="fa-solid fa-plus"></i> Add Item'
    formBtn.style.backgroundColor = '#333'

    isEditMode = false
}

// Initialize app so that wen the page loads it will init this function 
function init() {
// Event Listeners
itemForm.addEventListener('submit', onAddItemSubmit)
itemList.addEventListener('click', onClickItem)
clearBtn.addEventListener('click', clearItems)
itemFilter.addEventListener('input', filterItems)

document.addEventListener('DOMContentLoaded', displayItems)

checkUI()
}

init()


// LocalStorage test !! 
// localStorage.setItem('name', 'Brad')

//  console.log(localStorage.getItem('name'));
// //  localStorage.removeItem('name')
// localStorage.clear()

// Add items to Local Storage
