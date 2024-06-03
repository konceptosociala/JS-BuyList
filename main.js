class NameEdit {
  constructor(name /*String*/) {
    this.name = name;
  }

  intoView(index /*Number*/) {
    return `
      <input class="name-edit" data-product-index="${index}" value="${this.name}"/>
    `;
  }
}

class ProductBadge {
  constructor(product /*Product*/) {
    this.name /*String*/ = product.name;
    this.amount /*Number*/ = product.amount;
  }

  intoView(index /*Number*/) {
    return `
      <div class="item" data-product-index="${index}">
        ${this.name} <div class="item-badge">${this.amount}</div>
      </div>
    `;
  }
}

class Product {
  constructor(name /*String*/) {
    this.name /*String*/ = name;
    this.amount /*Number*/ = 1;
    this.bought /*Boolean*/ = false;
  }

  intoView(index /*Number*/) {
    if (!this.bought) {
      return `
        <div class="product subcontainer" data-product-index="${index}">
          <h3 class="product-title" data-product-index="${index}">${this.name}</h3>
          <div class="amount-control">
            <button data-tooltip="Зменшити кількість" data-product-index="${index}" class="amount-control-btn amount-dec disabled">-</button>
            <div class="amount">${this.amount}</div>
            <button data-tooltip="Збільшити кількість" data-product-index="${index}" class="amount-control-btn amount-inc">+</button>
          </div>
          <div class="product-control">
            <button data-tooltip="Позначити як куплене" class="product-control-btn add-to-cart" data-product-index="${index}">Куплено</button>
            <button data-tooltip="Видалити товар" class="product-remove-btn" data-product-index="${index}">✖</button>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="product subcontainer" data-product-index="${index}">
          <h3 class="product-title bought" data-product-index="${index}">${this.name}</h3>
          <div class="amount-control">
            <div class="amount fixed">${this.amount}</div>
          </div>
          <div class="product-control">
            <button data-tooltip="Видалити з куплених" data-product-index="${index}" class="product-control-btn remove-from-cart">Не куплено</button>
          </div>
        </div>
      `;
    }
  }
}

(function (f) {

  f(window.jQuery, window, document);

}(function ($, window, document) {

  $(function () {
    // Model
    let products /*List<Product>*/ = [
      new Product('Помідори'),
      new Product('Яйця'),
      new Product('Сир')
    ];

    // View
    let addProduct_btn = $('.add-field-button');
    let addProduct_input = $('.add-field-input');

    let productsDiv = $('.control');
    let remainsDiv = $('.remains-container');

    let addToCart_btn = $('.add-to-cart');
    let removeFromCart_btn = $('.remove-from-cart');

    // Init products
    for (let i = 0; i < products.length; i++) { 
      let product = products[i];
      productsDiv.append(product.intoView(i));
      let badge = new ProductBadge(product);
      remainsDiv.append(badge.intoView(i));
    }

    // Add product
    addProduct_btn.on("click", function () {
      addProduct();
    });

    addProduct_input.on("keydown", function (e) {
      if (e.key === 'Enter') {
        addProduct();
      }
    });

    // Remove product
    $('body').on("click", ".product-remove-btn", function () {
      let index /*Number*/ = $(this).data("productIndex");
      products[index] = new Product('');

      let badge = $(`.item[data-product-index="${index}"]`);
      badge.remove();

      $(`.product[data-product-index=${index}]`).remove();
    });

    // Increase amount
    $('body').on("click", ".amount-inc", function () {
      let index /*Number*/ = $(this).data("productIndex");
      let product = products[index];
      product.amount++;

      if (product.amount == 2) {
        $(`.amount-dec[data-product-index=${index}]`).removeClass('disabled');
      }

      $(`.product[data-product-index=${index}] .amount`).html(product.amount);
      $(`.item[data-product-index=${index}] .item-badge`).html(product.amount);
    });

    // Decrease amount
    $('body').on("click", ".amount-dec", function () {
      let index /*Number*/ = $(this).data("productIndex");
      let product = products[index];
      if (product.amount > 1) {
        product.amount--;
      }

      if (product.amount == 1) {
        $(this).addClass('disabled');
      }

      $(`.product[data-product-index=${index}] .amount`).html(product.amount);
      $(`.item[data-product-index=${index}] .item-badge`).html(product.amount);
    });

    // Add to cart
    $('body').on("click", ".add-to-cart", function () {
      let index /*Number*/ = $(this).data("productIndex");
      let productPanel = $(`.product[data-product-index=${index}]`);

      let product = products[index];
      product.bought = true;
      productPanel.replaceWith(product.intoView(index));

      let productBadge = $(`.item[data-product-index=${index}]`);
      productBadge.detach().appendTo('.bought-container').addClass('bought');
    });

    // Remove from cart
    $('body').on("click", ".remove-from-cart", function () {
      let index /*Number*/ = $(this).data("productIndex");
      let productPanel = $(`.product[data-product-index=${index}]`);

      let product = products[index];
      product.bought = false;
      productPanel.replaceWith(product.intoView(index));

      let productBadge = $(`.item[data-product-index=${index}]`);
      productBadge.detach().appendTo('.remains-container').removeClass('bought');
    });

    // Edit name
    $('body').on("blur", ".name-edit", function() {
      let index /*Number*/ = $(this).data("productIndex"); 
      let name /*String*/ = $(this).val();

      let product = products[index];
      if (name != null && name.trim() != '') {
        product.name = name;
      } else {
        alert("Wrong product name!");
      }

      let badge = new ProductBadge(product);

      $(`.product[data-product-index=${index}]`).replaceWith(product.intoView(index));
      $(`.item[data-product-index="${index}"]`).replaceWith(badge.intoView(index));
    });

    $('body').on("click", ".product-title", function () {
      let index /*Number*/ = $(this).data("productIndex"); 
      let product = products[index];
      let nameEdit = new NameEdit(product.name);
      let nameEditElement = $(nameEdit.intoView(index));
      $(this).replaceWith(nameEditElement);
      nameEditElement.focus();
    });

    function addProduct() {
      let productName = addProduct_input.val();
        addProduct_input.val('');
        addProduct_input.focus();
        if (productName != "" && productName != null) {
          if (products.some((p) => p.name === productName)) {
            alert("Product with such name already exists!");
            return;
          }
  
          let product = new Product(productName);
          productsDiv.append(product.intoView(products.length));
  
          let badge = new ProductBadge(product);
          remainsDiv.append(badge.intoView(products.length));
  
          products.push(product);
  
        } else {
          alert("Enter a valid product name!");
        }
    }

  });

}));