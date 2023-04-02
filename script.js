const autoCompleteInputTag =
  document.getElementsByClassName("autoCompleteInput")[0];

let products;
const url = "https://fakestoreapi.com/products";
fetch(url)
  .then((response) => {
    const responseData = response.json();
    return responseData;
  })
  .then((productDataFromServer) => {
    products = productDataFromServer;
    console.log("products: ", products);
    autoCompleteInputTag.disabled = false;
  })
  .catch((error) => {
    console.log("Inside catch: ", error);
  });

const resultContainerTag =
  document.getElementsByClassName("resultContainer")[0];

let filteredProducts = [];

autoCompleteInputTag.addEventListener("keyup", (event) => {
  if (
    event.key === "ArrowDown" ||
    event.key === "ArrowUp" ||
    event.key === "Enter"
  ) {
    navigateAndSelectProduct(event.key);
    return;
  }

  resultContainerTag.innerHTML = "";
  const searchText = event.target.value.toLowerCase();
  if (searchText.length === 0) {
    return;
  }
  filteredProducts = products.filter((product) => {
    return product.title.toLowerCase().includes(searchText);
  });

  const hasProductsToShow = filteredProducts.length > 0;
  if (hasProductsToShow) {
    for (let i = 0; i < filteredProducts.length; i++) {
      const productItemContainer = document.createElement("div");
      productItemContainer.id = filteredProducts[i].id;
      productItemContainer.classList.add("productItemContainer");

      const productName = document.createElement("div");
      productName.classList.add("productName");
      productName.append(filteredProducts[i].title);

      const productImage = document.createElement("img");
      productImage.classList.add("productImage");
      productImage.src = filteredProducts[i].image;

      productItemContainer.append(productName, productImage);
      resultContainerTag.append(productItemContainer);
    }
  }
});

let indexToSelect = -1;
const navigateAndSelectProduct = (key) => {
  if (key === "ArrowDown") {
    if (indexToSelect === filteredProducts.length - 1) {
      indexToSelect = -1;
      deselectProduct();
      return;
    }
    indexToSelect += 1;
    const productItemContainerToSelect = selectProduct(indexToSelect);
    if (indexToSelect > 0) {
      deselectProduct();
    }
    productItemContainerToSelect.classList.add("selected");
  } else if (key === "ArrowUp") {
    if (indexToSelect === -1) {
      return;
    }

    if (indexToSelect === 0) {
      deselectProduct();
      indexToSelect = -1;
      return;
    }
    indexToSelect -= 1;
    deselectProduct();
    const productItemContainerToSelect = selectProduct(indexToSelect);
    productItemContainerToSelect.classList.add("selected");
  } else {
    const enteredProduct = selectProduct(indexToSelect);
    console.log("Entered product: ", enteredProduct);
  }
};

const selectProduct = (index) => {
  const productIdToSelect = filteredProducts[index].id.toString();
  const productItemContainerToSelect =
    document.getElementById(productIdToSelect);
  productItemContainerToSelect.style.backgroundColor = "#237BFF";
  productItemContainerToSelect.firstChild.style.color = "white";
  return productItemContainerToSelect;
};

const deselectProduct = () => {
  const productToDeselect = document.getElementsByClassName("selected")[0];
  productToDeselect.style.backgroundColor = "white";
  productToDeselect.firstChild.style.color = "black";
  productToDeselect.classList.remove("selected");
};
