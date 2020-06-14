// storage controller

//item controller
const ItemCtrl = (function() {
  //Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Structure / State
  const data = {
    items: [
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 0, name: 'Cookie', calories: 400},
      // {id: 0, name: 'Eggs', calories: 300}
    ],
    currentItem: null,
    totalCalories: 0
  }

  // Public Methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      // Create ID
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0
      }

      // Calories to number
      calories = parseInt(calories);

      //Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    getItemById: function(id) {
      let found = null;
      //Loop through items
      data.items.forEach(function(item) {
        if(item.id === id){
          found = item;
        }
      })

      return found;
    },
    updateItem: function(name, calories) {
      // calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item) {
        if(item.id === data.currentItem.id)
        item.name = name;
        item.calories = calories;
        found = item;
      });
      return found;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      data.items.forEach(function(item) {
        total += item.calories;
      });
      // Set total calories in data structure
      data.totalCalories = total;

      // Return total 
      return data.totalCalories;
    },

    logData: function() {
      return data;
    }
  }
})();

//ui controller 
const UICtrl = (function() {

  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }
  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>
      </li>`
      });

      //Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>`;

      // Insert item

      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Loop through nodes - convert to array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');
        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>`;
        }
      });
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function() {
      return UISelectors;
    }
  }
})();

//app controleer
const App = (function(ItemCtrl, UICtrl) {

  // Load Event Listeners
  const loadEventListeners = function() {
    //Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // update Event item
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //Disable submit on enter
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13 || e.wich === 13){
        e.preventDefault();
        return false;
      }
    })
  }

  // Add Item Submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
    //Check for input
    if(input.name !== '' && input.calories !== '') {
      // Add Item 
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI List
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  //Update item submit

  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')){
      // Get list item id
      const listID = e.target.parentNode.parentNode.id;

      //Break into an array
      const listIDArray = listID.split('-');

      // Get the actual id
      const id = parseInt(listIDArray[1]);
      
      //Get item  
      const itemToEdit = ItemCtrl.getItemById(id);

      //set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }
  // Update item submit
  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();
    //Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }
  // Public Methods
  return {
    init: function() {
      // Clear edit state. set initial state
      UICtrl.clearEditState();
      //Fetch Items from Data Structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length === 0) {
        UICtrl.hideList();

      } else {
        //Polpulate list with items
        UICtrl.populateItemList(items)
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load Event Listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, UICtrl);

// Initialise App
App.init();