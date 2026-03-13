# JavaScript Quick Notes

## 1. What is the difference between var, let, and const?

### The difference between var, let, and const

- `var` is **function/global scoped**, **hoisted**, and **re-declarable**. Its values are **reassignable**.
- `let` and `const` are **block scoped** and **not re-declarable**.
  - `let` values can be **changed**.
  - `const` values **cannot be changed**.

---

## 2. What is the spread operator (...)?

### The spread operator (`...`) takes all items from an array or object and puts them somewhere else.

- Example: `[...arr, 4]` adds everything from `arr` into a new array with `4` at the end.

---

## 3. What is the difference between map(), filter(), and forEach()?

### `map()`, `filter()`, `forEach()` are all used for looping over arrays/objects, but with different purposes:

- `map()` – transforms each element of an array into a **new array**.
- `filter()` – selects elements that meet a specific condition and creates a **new array**.
- `forEach()` – executes a function for each element. It’s like `map()`, but **doesn’t return anything**.

---

## 4. What is an arrow function?

### An arrow function is a **short way to write a function**.

- Use `=>` instead of the `function` keyword.

---

## 5. What are template literals?

### In JS, template literals are **ES6 string literals** that allow:

- **Embedded expressions**
- **Multi-line strings**
- **String interpolation**
