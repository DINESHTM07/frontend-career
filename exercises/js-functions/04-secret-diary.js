// ============================================
// INTRO: What is Encapsulation and WHY it matters
// ============================================
// Encapsulation means bundling data with the functions that operate on it,
// AND hiding the data so it can't be tampered with directly.
//
// In JS, we achieve this with CLOSURES — a function that "remembers"
// the variables from the scope it was created in, even after that scope ends.
//
// WHY it matters: Public variables get accidentally overwritten. Private data
// via closures forces all mutations through your controlled interface.
// This is the foundation of modules, state management, and OOP patterns.
// Real-world examples: React's useState hook, banking systems, auth tokens.
// ============================================

// ============================================
// MENTAL MODEL: How to think about it
// ============================================
// Imagine a physical diary with a lock.
// - The diary (closure scope) holds your entries (private data).
// - The key (returned functions) is the only way to interact with it.
// - Nobody can reach inside and rip out pages directly.
// - They can only use the key: write(), read(), count().
//
// When createDiary() runs and returns, the local variables SHOULD be garbage
// collected... except they can't be, because the returned functions still
// reference them. The closure "captures" them — they live on in memory,
// accessible only through those returned functions.
// ============================================

// ============================================
// GUIDED EXERCISE: Build createDiary() step by step
// ============================================

function createDiary(ownerName) {
  // Step 1: Private data — lives inside createDiary's scope
  // Nobody outside can access 'entries' or 'locked' directly.
  const entries = [];   // private array
  let locked = false;   // private state flag

  // Step 2: Private helper — also not accessible from outside
  function timestamp() {
    return new Date().toLocaleTimeString();
  }

  // Step 3: Return the PUBLIC interface — only these functions are exposed
  return {
    // Write a new entry (only if not locked)
    write(text) {
      if (locked) {
        return `${ownerName}'s diary is locked. Cannot write.`;
      }
      // 'entries' is from the outer scope — this is the closure in action
      const entry = `[${timestamp()}] ${text}`;
      entries.push(entry);
      return `Entry added: "${entry}"`;
    },

    // Read all entries (only if not locked)
    read() {
      if (locked) {
        return `${ownerName}'s diary is locked. Cannot read.`;
      }
      if (entries.length === 0) {
        return `${ownerName}'s diary is empty.`;
      }
      return `${ownerName}'s diary:\n` + entries.map((e, i) => `  ${i + 1}. ${e}`).join("\n");
    },

    // Count entries without exposing the array itself
    count() {
      return `${ownerName} has ${entries.length} entr${entries.length === 1 ? "y" : "ies"}.`;
    },

    // Lock the diary — prevents reads and writes
    lock() {
      locked = true;
      return `${ownerName}'s diary is now locked.`;
    },

    // Unlock — controlled access
    unlock(password) {
      // In real code, you'd check a hash, not a plain string!
      if (password === "open-sesame") {
        locked = false;
        return `${ownerName}'s diary is unlocked.`;
      }
      return "Wrong password!";
    },

    // Delete last entry (demonstrating mutation of private data)
    deleteLastEntry() {
      if (locked) return `${ownerName}'s diary is locked.`;
      if (entries.length === 0) return "No entries to delete.";
      const removed = entries.pop();
      return `Deleted: "${removed}"`;
    },
  };
}

// Step 4: Test the diary
console.log("=== SECRET DIARY ===\n");

const myDiary = createDiary("Dinesh");

// Can we access entries directly? NO.
console.log("Direct access attempt:", myDiary.entries); // undefined — it's private!

// Use the public interface
console.log(myDiary.write("Today I learned about closures."));
console.log(myDiary.write("Closures are functions that remember their scope."));
console.log(myDiary.write("This is day 4 of my 90-day plan."));
console.log(myDiary.count());
console.log(myDiary.read());

// Lock it
console.log("\n" + myDiary.lock());
console.log(myDiary.write("Can I still write?")); // Should be blocked
console.log(myDiary.read());                       // Should be blocked

// Unlock
console.log("\n" + myDiary.unlock("wrong-password"));
console.log(myDiary.unlock("open-sesame"));
console.log(myDiary.write("Back to writing after unlock!"));

// Delete an entry
console.log("\n" + myDiary.deleteLastEntry());
console.log(myDiary.count());

// Multiple independent diaries — each has its OWN private scope
const friendDiary = createDiary("Priya");
console.log("\n" + friendDiary.write("Friend's diary entry"));
console.log(myDiary.count());    // Still 2 — not affected by friend's diary
console.log(friendDiary.count()); // 1

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. What is a closure?
//    Answer: A function that "closes over" variables from its outer scope,
//    keeping them alive in memory even after the outer function has returned.
//
// 2. Why can't we do myDiary.entries.push("hack") ?
//    Answer: Because 'entries' is not a property of the returned object.
//    It's a variable in createDiary's local scope — only the returned
//    functions can access it via closure.
//
// 3. If you call createDiary() twice, do they share the same 'entries' array?
//    Answer: No. Each call to createDiary() creates a new scope with its
//    own 'entries' array. They are completely independent.
//
// 4. When does 'entries' get garbage collected?
//    Answer: Only when all references to the returned diary object are
//    released (e.g., myDiary = null). Until then, the closure keeps it alive.
// ============================================

// ============================================
// YOUR TURN: Build createBankAccount() with private balance
// ============================================
// Build a function createBankAccount(ownerName, initialBalance) that returns
// an object with these methods:
//
//   deposit(amount)
//     - Adds amount to balance
//     - Validates: amount must be a positive number
//     - Returns: "Deposited $X. New balance: $Y"
//
//   withdraw(amount)
//     - Subtracts amount from balance
//     - Validates: amount must be positive AND not exceed current balance
//     - Returns: "Withdrew $X. New balance: $Y"
//     - On insufficient funds: "Insufficient funds. Balance: $Y"
//
//   getBalance()
//     - Returns current balance WITHOUT exposing the variable directly
//     - Returns: "Balance for [owner]: $Y"
//
//   getStatement()
//     - Returns a list of all transactions (deposits and withdrawals)
//     - Format: "[+/-$amount] [timestamp] → balance: $Y"
//
//   freeze() / unfreeze(pin)
//     - freeze() blocks all transactions
//     - unfreeze(pin) only works with the correct pin (set at creation via a parameter)
//
// Usage:
//   const account = createBankAccount("Dinesh", 1000, "1234");
//   account.deposit(500)     → "Deposited $500. New balance: $1500"
//   account.withdraw(200)    → "Withdrew $200. New balance: $1300"
//   account.withdraw(9999)   → "Insufficient funds. Balance: $1300"
//   account.getBalance()     → "Balance for Dinesh: $1300"
//   account.balance          → undefined (private!)
//   account.freeze()
//   account.deposit(100)     → "Account is frozen."
//   account.unfreeze("wrong")→ "Wrong PIN."
//   account.unfreeze("1234") → "Account unfrozen."

function createBankAccount(ownerName, initialBalance, pin) {
  // YOUR CODE HERE
}

// Test your bank account:
console.log("\n=== YOUR TURN: Bank Account ===\n");
const account = createBankAccount("Dinesh", 1000, "1234");

console.log(account.deposit(500));
console.log(account.withdraw(200));
console.log(account.withdraw(9999));
console.log(account.getBalance());
console.log("Direct access:", account.balance); // Should be undefined

account.freeze();
console.log(account.deposit(100));
console.log(account.unfreeze("wrong"));
console.log(account.unfreeze("1234"));
console.log(account.deposit(100));
console.log(account.getStatement());

// ============================================
// BOSS CHALLENGE: Module pattern + factory
// ============================================
// Build a createUserSession(userId) factory that manages a login session.
// Private state:
//   - sessionToken (generate with Math.random().toString(36))
//   - loginTime (Date.now() at creation)
//   - actionsLog (array of strings)
//   - isActive (boolean)
//
// Public interface:
//   getToken()       → returns token ONLY if session is active, else "Session expired"
//   logAction(desc)  → appends to actionsLog with timestamp, returns "Logged: [desc]"
//   getReport()      → returns summary: userId, duration (ms since login), all actions
//   expire()         → sets isActive = false, logs "Session ended"
//   isValid()        → returns true/false based on isActive
//
// EXTRA: Create a SessionManager object (not a function — a singleton) that:
//   - Stores multiple sessions in a private Map
//   - Has: create(userId), get(userId), expireAll()
//   - Uses createUserSession internally

function createUserSession(userId) {
  // YOUR CODE HERE
}

const SessionManager = (() => {
  // Private Map — immediately invoked to create singleton
  const sessions = new Map();

  return {
    create(userId) {
      // YOUR CODE HERE
    },
    get(userId) {
      // YOUR CODE HERE
    },
    expireAll() {
      // YOUR CODE HERE
    },
  };
})();

console.log("\n=== BOSS CHALLENGE: Session Manager ===\n");
SessionManager.create("user_001");
SessionManager.create("user_002");
const session = SessionManager.get("user_001");
console.log(session.getToken());
console.log(session.logAction("Viewed dashboard"));
console.log(session.logAction("Updated profile"));
console.log(session.isValid());
console.log(session.getReport());
SessionManager.expireAll();
console.log(session.isValid());      // false
console.log(session.getToken());     // "Session expired"

// ============================================
// PATTERN LEARNED: Encapsulation
// ============================================
// PATTERN NAME: Closure-Based Encapsulation (Module Pattern)
// WHEN YOU SEE: Data that should not be directly accessible from outside
// USE THIS: Create a function that has private variables + returns public methods
//
// TEMPLATE:
//   function createThing(initialState) {
//     let privateState = initialState;          // hidden
//
//     function privateHelper() { ... }          // hidden
//
//     return {
//       publicMethod() { /* uses privateState */ },
//     };
//   }
//
// REAL-WORLD USES:
//   - React's useState (returns [value, setter], hides internal state)
//   - Express middleware (closes over config)
//   - Database connection pools
//   - Auth token management
//
// KEY INSIGHT: The returned object is just a key ring. The real data
// lives in the closure scope, invisible to the outside world.
// ============================================
