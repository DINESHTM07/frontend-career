# JavaScript DOM Cheatsheet

---

## CONCEPT

The DOM (Document Object Model) is a tree of nodes representing the HTML page. JavaScript manipulates it to make pages interactive.

| Category        | Methods / Properties                                             |
|-----------------|------------------------------------------------------------------|
| Select          | `getElementById`, `querySelector`, `querySelectorAll`           |
| Traverse        | `parentElement`, `children`, `closest`, `nextElementSibling`    |
| Create/Modify   | `createElement`, `appendChild`, `remove`, `textContent`         |
| Events          | `addEventListener`, `removeEventListener`, event object         |
| Classes         | `classList.add/remove/toggle/contains/replace`                  |
| Data            | `dataset`, custom `data-*` attributes                           |

---

## WHY IT MATTERS

- `querySelector` is the modern way — CSS selector syntax, picks the first match
- `innerHTML` is a XSS vector — never put user input in it unsanitized; use `textContent`
- Event delegation (one listener on a parent) is better than attaching to every child
- `closest()` is the cleanest way to find a parent by selector from within an event handler
- Understanding bubbling is required for debugging events and building dropdowns/modals

---

## EXAMPLES

### 1. Selecting elements
```js
// getElementById — fastest, only by id
const header = document.getElementById("main-header");

// querySelector — first match, any CSS selector
const btn = document.querySelector(".btn-primary");
const input = document.querySelector("input[type='email']");
const firstItem = document.querySelector("ul li:first-child");

// querySelectorAll — ALL matches, returns NodeList
const allCards = document.querySelectorAll(".card");
const inputs = document.querySelectorAll("form input");

// NodeList is not an array — convert to use array methods
const cardArray = Array.from(allCards);
const cardArray2 = [...allCards]; // spread also works

// Scope querySelector to a specific element
const nav = document.querySelector("nav");
const navLinks = nav.querySelectorAll("a"); // only links inside nav
```

### 2. DOM traversal
```js
const listItem = document.querySelector("li.active");

// Parent
listItem.parentElement;           // immediate parent element
listItem.closest("ul");           // nearest ancestor matching selector
listItem.closest("[data-list]");  // nearest ancestor with data-list attr

// Children
listItem.children;                // HTMLCollection of child elements
listItem.firstElementChild;       // first child element
listItem.lastElementChild;        // last child element
listItem.childElementCount;       // number of child elements

// Siblings
listItem.nextElementSibling;      // next sibling element
listItem.previousElementSibling;  // previous sibling element

// Real-world: find the parent card of a clicked button
document.addEventListener("click", (e) => {
  if (e.target.matches(".delete-btn")) {
    const card = e.target.closest(".card");
    card.remove();
  }
});
```

### 3. createElement and building DOM nodes
```js
// Create elements
const div = document.createElement("div");
const p = document.createElement("p");
const img = document.createElement("img");

// Set attributes
img.src = "photo.jpg";
img.alt = "Profile photo";
img.className = "avatar";

// Set text safely (no XSS risk)
p.textContent = "Hello, world!";

// Append to DOM
div.appendChild(p);
div.appendChild(img);
document.body.appendChild(div);

// Modern: append multiple nodes at once
const ul = document.createElement("ul");
["Apple", "Banana", "Cherry"].forEach(text => {
  const li = document.createElement("li");
  li.textContent = text;
  ul.appendChild(li);
});

// insertAdjacentElement — insert relative to an element
const ref = document.querySelector(".card");
ref.insertAdjacentElement("beforebegin", newEl); // before ref
ref.insertAdjacentElement("afterbegin", newEl);  // first child of ref
ref.insertAdjacentElement("beforeend", newEl);   // last child of ref
ref.insertAdjacentElement("afterend", newEl);    // after ref
```

### 4. innerHTML vs textContent
```js
const div = document.querySelector(".output");
const userInput = '<img src=x onerror="alert(\'XSS\')">';

// innerHTML — parses HTML, executes scripts — DANGEROUS with user content
div.innerHTML = userInput; // XSS! the onerror fires

// textContent — treats everything as plain text — SAFE
div.textContent = userInput; // renders the literal string, no execution

// Use innerHTML ONLY for trusted static HTML you control:
div.innerHTML = `<strong>${productName}</strong> — $${price}`;

// For user-generated content, always use textContent or sanitize first
const clean = DOMPurify.sanitize(userInput); // with a sanitizer library
div.innerHTML = clean;

// Read vs write
console.log(div.textContent); // all text content, no tags
console.log(div.innerHTML);   // full HTML string including tags
```

### 5. addEventListener and the event object
```js
const btn = document.querySelector("#submit-btn");

function handleClick(event) {
  console.log(event.type);          // "click"
  console.log(event.target);        // element that was clicked
  console.log(event.currentTarget); // element the listener is attached to
  console.log(event.clientX, event.clientY); // mouse coordinates
  console.log(event.key);           // for keyboard events: "Enter", "a", etc.
  console.log(event.shiftKey);      // modifier keys
}

btn.addEventListener("click", handleClick);

// Remove listener (must pass same function reference)
btn.removeEventListener("click", handleClick);

// Options object
btn.addEventListener("click", handleClick, {
  once: true,    // auto-removes after first call
  capture: true, // capture phase instead of bubble
  passive: true  // tells browser handler won't call preventDefault (perf boost for scroll)
});

// Common events
element.addEventListener("click", handler);
element.addEventListener("dblclick", handler);
element.addEventListener("mouseover", handler);
element.addEventListener("mouseout", handler);
element.addEventListener("keydown", handler);
element.addEventListener("keyup", handler);
element.addEventListener("input", handler);   // fires on every keystroke
element.addEventListener("change", handler);  // fires on blur + changed
element.addEventListener("submit", handler);
element.addEventListener("focus", handler);
element.addEventListener("blur", handler);
```

### 6. Event bubbling and capturing
```js
// Bubbling: event fires on target, then propagates UP through ancestors
// Capturing: event fires on document, travels DOWN to target first

// Default is bubbling (useCapture = false)
document.querySelector(".child").addEventListener("click", (e) => {
  console.log("child clicked"); // fires first
});
document.querySelector(".parent").addEventListener("click", (e) => {
  console.log("parent clicked"); // fires second (bubble)
});
document.querySelector(".grandparent").addEventListener("click", (e) => {
  console.log("grandparent clicked"); // fires third
});

// Visual: click on .child
// child → parent → grandparent → body → html → document → window

// stopPropagation — stop the bubble
element.addEventListener("click", (e) => {
  e.stopPropagation(); // parent's click handler won't fire
  doSomething();
});

// Capture phase — fires BEFORE target
document.addEventListener("click", handler, { capture: true }); // fires first
```

### 7. Event delegation — one listener for many elements
```js
// BAD — attaching listener to every item (expensive, breaks on new items)
document.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("click", handleCardClick);
});
// New cards added later won't have the listener!

// GOOD — single listener on the parent
const productList = document.querySelector(".product-list");

productList.addEventListener("click", (e) => {
  // Check which element was actually clicked
  const card = e.target.closest(".product-card");
  if (!card) return; // clicked somewhere else in the list

  const deleteBtn = e.target.closest(".delete-btn");
  const editBtn = e.target.closest(".edit-btn");

  if (deleteBtn) {
    const id = card.dataset.id;
    deleteProduct(id);
    card.remove();
    return;
  }

  if (editBtn) {
    openEditModal(card.dataset.id);
    return;
  }

  // Clicked the card itself
  showProductDetail(card.dataset.id);
});
```

### 8. preventDefault and stopPropagation
```js
// preventDefault — stop the browser's default action
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); // stops page reload
  validateAndSubmit(e.target);
});

const link = document.querySelector("a.ajax-link");
link.addEventListener("click", (e) => {
  e.preventDefault(); // stops navigation
  loadPage(link.href); // handle it ourselves
});

// For checkboxes — prevent check/uncheck
checkbox.addEventListener("click", (e) => {
  if (!canToggle) e.preventDefault();
});

// stopPropagation — stop the event from reaching parent handlers
const modal = document.querySelector(".modal");
const backdrop = document.querySelector(".backdrop");

backdrop.addEventListener("click", () => closeModal());

// Clicking inside modal shouldn't close it
modal.addEventListener("click", (e) => {
  e.stopPropagation(); // don't let it reach the backdrop
});

// stopImmediatePropagation — also stops other listeners on the SAME element
```

### 9. classList — add, remove, toggle, contains
```js
const btn = document.querySelector(".btn");

btn.classList.add("active");           // adds class
btn.classList.remove("active");        // removes class
btn.classList.toggle("active");        // adds if absent, removes if present
btn.classList.toggle("active", true);  // force add (second arg = boolean)
btn.classList.toggle("active", false); // force remove
btn.classList.contains("active");      // returns boolean
btn.classList.replace("old", "new");   // replace one class with another

// Multiple classes at once
btn.classList.add("active", "highlighted", "large");
btn.classList.remove("active", "highlighted");

// Real-world: theme toggle
const html = document.documentElement;
const toggle = document.querySelector("#theme-toggle");

toggle.addEventListener("click", () => {
  html.classList.toggle("dark");
  localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
});

// Load saved theme
const saved = localStorage.getItem("theme");
if (saved === "dark") html.classList.add("dark");
```

### 10. Dataset attributes
```js
// HTML: <div class="product-card" data-id="42" data-price="29.99" data-in-stock="true">
const card = document.querySelector(".product-card");

// Read data attributes
card.dataset.id;       // "42" — always a string
card.dataset.price;    // "29.99"
card.dataset.inStock;  // "true" — note: camelCase in JS, kebab-case in HTML

// Write data attributes
card.dataset.id = "99";
card.dataset.lastUpdated = new Date().toISOString(); // creates data-last-updated

// Delete
delete card.dataset.price;

// Convert types as needed
const id    = Number(card.dataset.id);
const price = parseFloat(card.dataset.price);
const inStock = card.dataset.inStock === "true"; // string to boolean

// Event delegation with dataset — very clean pattern
document.querySelector(".list").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const { action, id } = btn.dataset;
  if (action === "delete") deleteItem(id);
  if (action === "edit")   editItem(id);
  if (action === "view")   viewItem(id);
});
```

### 11. Creating elements dynamically in a loop
```js
// Render a product list from data
const products = [
  { id: 1, name: "Shirt",  price: 29, category: "clothing" },
  { id: 2, name: "Shoes",  price: 89, category: "footwear" },
  { id: 3, name: "Hat",    price: 19, category: "clothing" },
];

const container = document.querySelector("#product-grid");

// Use DocumentFragment to batch DOM updates (better performance)
const fragment = document.createDocumentFragment();

products.forEach(product => {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.id = product.id;
  card.dataset.category = product.category;

  const name = document.createElement("h3");
  name.textContent = product.name;  // safe — no XSS

  const price = document.createElement("p");
  price.className = "price";
  price.textContent = `$${product.price}`;

  const btn = document.createElement("button");
  btn.className = "add-to-cart";
  btn.textContent = "Add to Cart";
  btn.dataset.action = "add-to-cart";
  btn.dataset.id = product.id;

  card.appendChild(name);
  card.appendChild(price);
  card.appendChild(btn);
  fragment.appendChild(card); // append to fragment, not DOM
});

container.appendChild(fragment); // single DOM update
```

---

## COMMON MISTAKES

### Mistake 1: innerHTML with user data (XSS)
```js
// NEVER do this with user-controlled strings
searchOutput.innerHTML = `Results for: ${userQuery}`; // XSS risk

// Safe alternatives
const span = document.createElement("span");
span.textContent = userQuery;  // escaped automatically
searchOutput.appendChild(span);
```

### Mistake 2: Querying before DOM is ready
```js
// WRONG — script in <head>, DOM not parsed yet
const btn = document.querySelector("#btn"); // null!
btn.addEventListener("click", handler); // TypeError

// RIGHT option 1: script at bottom of body
// RIGHT option 2: DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#btn");
  btn.addEventListener("click", handler);
});
// RIGHT option 3: <script defer src="...">
```

### Mistake 3: Event listener not removed (memory leak)
```js
// WRONG — anonymous function can't be removed
element.addEventListener("click", () => doThing());
element.removeEventListener("click", () => doThing()); // FAILS — different reference

// RIGHT — named function reference
const handler = () => doThing();
element.addEventListener("click", handler);
element.removeEventListener("click", handler); // works
```

### Mistake 4: forEach on NodeList (not always available)
```js
// querySelectorAll returns a NodeList — forEach works in modern browsers
// but other array methods don't
document.querySelectorAll(".item").map(el => el.textContent); // TypeError!

// Convert first
[...document.querySelectorAll(".item")].map(el => el.textContent); // works
```

---

## INTERVIEW TIP

> **"What is event delegation and why use it?"**
>
> Answer: Event delegation means attaching one listener to a parent element instead of many listeners to individual children. It works because events bubble up. Benefits: fewer listeners = less memory, works for dynamically added children, and centralizes event logic. Pattern: listen on parent, check `e.target.closest(".selector")` to identify the actual source.

> **"What's the difference between e.target and e.currentTarget?"**
>
> Answer: `e.target` is the element that was actually clicked (the source of the event). `e.currentTarget` is the element the listener is attached to. When using event delegation, `currentTarget` is the parent and `target` is the child that was clicked.

> **"Why use textContent instead of innerHTML?"**
>
> Answer: `innerHTML` parses the string as HTML and can execute embedded scripts — inserting user input via `innerHTML` is a cross-site scripting (XSS) vulnerability. `textContent` treats the string as plain text and escapes all HTML characters automatically. Use `textContent` for any user-provided content; use `innerHTML` only for trusted static markup.
