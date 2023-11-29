import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://mobile-shopping-list-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const groceriesInDB = ref(database, "groceries");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", () => {
  // let inputValue = inputFieldEl.value;
  let inputValue = sanitizeHTML(inputFieldEl.value);
  push(groceriesInDB, inputValue);

  clearInputFieldEl();
  // appendItemToShoppingListEl(inputValue);
});

function sanitizeHTML(str) {
  return str.replace(/javascript:/gi, "").replace(/[^\w-_. ]/gi, function (c) {
    return `&#${c.charCodeAt(0)};`;
  });
}

onValue(groceriesInDB, function (snapshot) {
  if (snapshot.exists()) {
    let groceryListItemsArray = Object.entries(snapshot.val());
    clearShoppingListEl();
    // shoppingListEl.innerHTML = "";
    for (let i = 0; i < groceryListItemsArray.length; i++) {
      // Challenge: Use the appendItemToShoppingListEl(itemValue) function inside of the for loop to append item to the shopping list element for each iteration.
      let currentItem = groceryListItemsArray[i];
      // Challenge: Make two let variables:
      // currentItemID and currentItemValue and use currentItem to set both of
      // them equal to the correct values.
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      console.log(currentItemValue);

      appendItemToShoppingListEl(currentItem);
      // console.log(groceryListItemsArray[i]);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet";
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
  // shoppingListEl.innerHTML += `<li>${itemValue}</li>`;

  let itemID = item[0];
  let itemValue = item[1];
  let newEl = document.createElement("li");
  newEl.textContent = itemValue;

  newEl.addEventListener("dblclick", function () {
    let exactLocationOfGroceryListItemInDB = ref(
      database,
      `groceries/${itemID}`
    );
    remove(exactLocationOfGroceryListItemInDB);
  });

  shoppingListEl.append(newEl);
}
