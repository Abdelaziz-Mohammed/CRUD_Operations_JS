let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let totalPrice = document.querySelector(".total-price > .value");
let count = document.getElementById("count");
let category = document.getElementById("category");
let createBtn = document.getElementById("create");
let mood = "create";
let temp;

// calculate total
function getTotal() {
  if (price.value !== "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    totalPrice.innerHTML = result > 0 ? result : "0";
  } else {
    this.value = "0";
    price.focus();
  }
}

price.addEventListener("keyup", getTotal);
taxes.addEventListener("keyup", getTotal);
ads.addEventListener("keyup", getTotal);
discount.addEventListener("keyup", getTotal);

// create new product
let productsData;
if (localStorage.getItem("products")) {
  productsData = JSON.parse(localStorage.getItem("products"));
} else {
  productsData = [];
}

function createProduct() {
  let newProduct = {
    title: title.value,
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: totalPrice.innerHTML,
    count: count.value,
    category: category.value,
  };
  // process product's data
  function checkData() {
    if (title.value === "") {
      newProduct.title = "un known";
    }
    if (isNaN(+price.value) || +price.value <= 0) {
      newProduct.price = "0";
    }
    if (isNaN(+taxes.value) || +taxes.value <= 0) {
      newProduct.taxes = "0";
    }
    if (isNaN(+ads.value) || +ads.value <= 0) {
      newProduct.ads = "0";
    }
    if (isNaN(+discount.value) || +discount.value <= 0) {
      newProduct.discount = "0";
    }
    if (isNaN(+totalPrice.innerHTML) || +totalPrice.innerHTML <= 0) {
      newProduct.total = "0";
    }
    if (isNaN(+count.value) || +count.value <= 0) {
      newProduct.count = "1";
    }
    if (category.value === "") {
      newProduct.category = "un known";
    }
  }
  checkData();
  if (mood === "create") {
    // push them into products array if mood is create
    for (let i = 0; i < +newProduct.count; i++) {
      productsData.push(newProduct);
    }
  }
  if (mood === "update") {
    // update the old data to new one
    productsData[temp] = newProduct;
    // return mood to 'create'
    createBtn.innerHTML = "create";
    mood = "create";
    count.style.display = "block";
  }
  // save to local storage
  localStorage.setItem("products", JSON.stringify(productsData));
  // clear inputs
  function clearInputs() {
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    totalPrice.innerHTML = "0";
    count.value = "";
    category.value = "";
  }
  clearInputs();
}

createBtn.addEventListener("click", createProduct);

// show data into table
function showData() {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";
  for (let i = 0; i < productsData.length; i++) {
    tableBody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${productsData[i].title}</td>
        <td>${productsData[i].price}</td>
        <td>${productsData[i].taxes}</td>
        <td>${productsData[i].ads}</td>
        <td>${productsData[i].discount}</td>
        <td>${productsData[i].total}</td>
        <td>${productsData[i].category}</td>
        <td><button type="button" id="update" onclick='updateProduct(${i})'>update</button></td>
        <td><button type="button" id="delete" onclick='deleteProduct(${i})'>delete</button></td>
      </tr>
    `;
  }
  showDeleteAllBtn();
}

createBtn.addEventListener("click", showData);
window.addEventListener("load", showData);

// delete product
function deleteProduct(i) {
  // delete from array
  productsData.splice(i, 1);
  // update local storage
  localStorage.products = JSON.stringify(productsData);
  // show updated data
  showData();
}

// show delete-all button if more than one product exists
// call this function at show data function
function showDeleteAllBtn() {
  const deleteAllBtn = document.getElementById("delete-all");
  if (productsData.length > 0) {
    deleteAllBtn.style.display = "block";
  } else {
    deleteAllBtn.style.display = "none";
  }
}

// delete all products if more than one exists
function deleteAll() {
  if (productsData.length > 0) {
    productsData = [];
    localStorage.products = JSON.stringify(productsData);
    document.querySelector("tbody").innerHTML = "";
    document.getElementById("delete-all").style.display = "none";
  }
}

// update
function updateProduct(i) {
  title.value = productsData[i].title;
  price.value = productsData[i].price;
  taxes.value = productsData[i].taxes;
  ads.value = productsData[i].ads;
  discount.value = productsData[i].discount;
  totalPrice.innerHTML = productsData[i].total;
  count.style.display = "none";
  category.value = productsData[i].category;
  createBtn.innerHTML = "update";
  mood = "update";
  window.scrollTo({ top: 0, behavior: "smooth" });
  temp = i;
}

// search
let searchMood = "title";
const searchBox = document.getElementById("search");
const searchByTitle = document.getElementById("search-by-title");
const searchByCategory = document.getElementById("search-by-category");

searchByTitle.addEventListener("click", () => {
  searchMood = "title";
  searchBox.placeholder = "Search by title";
  if (searchBox.value.length > 0) {
    searchBox.value = "";
    showData();
  }
  searchBox.focus();
});

searchByCategory.addEventListener("click", () => {
  searchMood = "category";
  searchBox.placeholder = "Search by category";
  if (searchBox.value.length > 0) {
    searchBox.value = "";
    showData();
  }
  searchBox.focus();
});

searchBox.addEventListener("keyup", search);

function search() {
  if (searchMood === "title") {
    let productsDataFilteredByTitle = [];
    productsDataFilteredByTitle = productsData.filter((product) =>
      product.title.toLowerCase().includes(searchBox.value.toLowerCase())
    );
    // show filtered data
    document.getElementById("table-body").innerHTML = "";
    for (let i = 0; i < productsDataFilteredByTitle.length; i++) {
      document.getElementById("table-body").innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${productsDataFilteredByTitle[i].title}</td>
          <td>${productsDataFilteredByTitle[i].price}</td>
          <td>${productsDataFilteredByTitle[i].taxes}</td>
          <td>${productsDataFilteredByTitle[i].ads}</td>
          <td>${productsDataFilteredByTitle[i].discount}</td>
          <td>${productsDataFilteredByTitle[i].total}</td>
          <td>${productsDataFilteredByTitle[i].category}</td>
          <td><button type="button" id="update" onclick='updateProduct(${i})'>update</button></td>
          <td><button type="button" id="delete" onclick='deleteProduct(${i})'>delete</button></td>
        </tr>
      `;
    }
  }
  if (searchMood === "category") {
    let productsDataFilteredByCategory = [];
    productsDataFilteredByCategory = productsData.filter((product) =>
      product.category.toLowerCase().includes(searchBox.value.toLowerCase())
    );
    // show filtered data
    document.getElementById("table-body").innerHTML = "";
    for (let i = 0; i < productsDataFilteredByCategory.length; i++) {
      document.getElementById("table-body").innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${productsDataFilteredByCategory[i].title}</td>
          <td>${productsDataFilteredByCategory[i].price}</td>
          <td>${productsDataFilteredByCategory[i].taxes}</td>
          <td>${productsDataFilteredByCategory[i].ads}</td>
          <td>${productsDataFilteredByCategory[i].discount}</td>
          <td>${productsDataFilteredByCategory[i].total}</td>
          <td>${productsDataFilteredByCategory[i].category}</td>
          <td><button type="button" id="update" onclick='updateProduct(${i})'>update</button></td>
          <td><button type="button" id="delete" onclick='deleteProduct(${i})'>delete</button></td>
        </tr>
      `;
    }
  }
  console.log(productsData);
}
