let quotes = [];

// ✅ Load quotes from localStorage if available
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "Believe in yourself!", category: "Motivation" },
      { text: "Do or do not. There is no try.", category: "Wisdom" },
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
      { text: "You learn more from failure than from success.", category: "Learning" }
    ];
  }
}

// ✅ Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ✅ Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
}

// ✅ Create add quote form (if needed)
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// ✅ Logic to add a new quote
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    saveQuotes(); // Save to localStorage
    showRandomQuote();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// ✅ DOM is ready
window.onload = function () {
  loadQuotes();
  showRandomQuote();
  createAddQuoteForm();

  const newQuoteBtn = document.getElementById("newQuote");
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", function () {
      showRandomQuote();
      const quoteText = document.querySelector("#quoteDisplay p")?.textContent;
      const quoteCategory = document.querySelector("#quoteDisplay small")?.textContent;

      if (quoteText && quoteCategory) {
        sessionStorage.setItem("lastViewedQuote", JSON.stringify({
          text: quoteText.replace(/"/g, ''),
          category: quoteCategory.replace('— ', '')
        }));
      }
    });
  }
};
