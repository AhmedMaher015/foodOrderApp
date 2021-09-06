import { elements } from './base.js';

if (!localStorage.getItem('card'))
  localStorage.setItem('card', JSON.stringify([]));
export const arrOfIDs = [];
export const addToCart = btn => {
  if (!JSON.parse(localStorage.getItem('user-logged'))) {
    elements.detailsModal.classList.remove('show');
    toggleSignModals();
  } else {
    if (!arrOfIDs.includes(btn.value)) {
      arrOfIDs.push(btn.value);
      elements.detailsModal.querySelector('.addToCart-message').textContent =
        'Added To Cart';
      localStorage.setItem('card', JSON.stringify(arrOfIDs));
    } else
      elements.detailsModal.querySelector('.addToCart-message').textContent =
        'Already in  Cart';
  }
};

export const createCarts = () => {
  const carts = JSON.parse(localStorage.getItem('card'));
  const container = elements.cartModal.querySelector('.cart-items');
  container.innerHTML = '';
  if (carts.length > 0) {
    carts.forEach(id => {
      fetch(`https://panda-restaurant.herokuapp.com/api/v1/recipes/?_id=${id}`)
        .then(res => res.json())
        .then(data => {
          const {
            data: {
              data: [recipe],
            },
          } = data;
          createCart(recipe);
        })
        .catch(err => console.log(err));
    });
  }
};
// https://panda-restaurant.herokuapp.com/api/v1/recipes/?_id=6121a4c319e88c0016df150f
export const createCart = recipe => {
  const cart = `

  <div class="row">
    <div class="col-8 cart-content">
      <h3>${recipe.name}</h3>
      <div class="summary">
        <span class="price">${recipe.price}$</span>
        <input class="amount" type="number" value="1" min="1" step="1" max="100" oninput="changeinput(this)" style="width: 50%; text-align: center">
      </div>
      <div class="hidden id">${recipe._id}</div>
      <div style="margin: 10px 0px">
        <button class="btn btn-danger btn-md remove-cart" value=${recipe._id} onClick="removeFromCart(this)">Remove</button>
      </div>
    </div>
    <div class="col-4">
      <img class="pic" src=${recipe.imageCover} />
    </div>
  </div>

  `;
  const cartItem = document.createElement('li');
  cartItem.classList.add('cart-item');
  cartItem.innerHTML = cart;
  const container = document.querySelector('.cart-items');
  container.appendChild(cartItem);
};

function openSignUModal() {
  elements.signupModal.classList.add('show__modal');
}

// for toggle signup an sign in
export function toggleSignModals() {
  if (elements.signupModal.classList.contains('show__modal')) {
    elements.signupModal.classList.remove('show__modal');
    elements.signinModal.classList.add('show__modal');
  } else {
    elements.signupModal.classList.add('show__modal');
    elements.signinModal.classList.remove('show__modal');
  }
}

window.openSignUModal = openSignUModal;
window.toggleSignModals = toggleSignModals;

const removeFromCart = btn => {
  // const arr = JSON.parse(localStorage.getItem('card'));
  if (arrOfIDs.includes(btn.value)) {
    arrOfIDs.pop(btn.value);
    localStorage.setItem('card', JSON.stringify(arrOfIDs));
    createCarts();
  }
};

window.removeFromCart = removeFromCart;
