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
  const filteredQuotes = filterQuotesByCategory();
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
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

// ✅ Populate unique categories into filter dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const categorySelect = document.getElementById("categoryFilter");
  categorySelect.innerHTML = '<option value="">All</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// ✅ Filter quotes by selected category
function filterQuotesByCategory() {
  const selected = document.getElementById("categoryFilter")?.value;
  return selected ? quotes.filter(q => q.category === selected) : quotes;
}

// ✅ Logic to add a new quote
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText && newCategory) {
    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    showRandomQuote();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    postQuoteToServer(newQuote);
  }
}

// ✅ Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ✅ Import quotes from uploaded JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format");
      }
    } catch (err) {
      alert("Failed to import quotes.");
    }
  };
  reader.readAsText(file);
}

// ✅ Post a new quote to mock server
async function postQuoteToServer(quote) {
  try {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
    console.log('Quote posted to server');
  } catch (error) {
    console.error('Failed to post quote to server:', error);
  }
}

// ✅ Sync quotes from server
function syncQuotes() {
  fetchQuotesFromServer();
}

// ✅ Fetch quotes from mock server and resolve conflicts
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    resolveConflicts(serverQuotes);
    console.log("Quotes synced with server!");
  } catch (error) {
    console.error("Failed to fetch from server:", error);
  }
}

// ✅ Resolve conflicts by merging new quotes
function resolveConflicts(serverQuotes) {
  let added = 0;
  const merged = [...quotes];

  serverQuotes.forEach(serverQuote => {
    const exists = merged.some(localQuote =>
      localQuote.text === serverQuote.text && localQuote.category === serverQuote.category
    );
    if (!exists) {
      merged.push(serverQuote);
      added++;
    }
  });

  quotes = merged;
  saveQuotes();

  if (added > 0) {
    const notification = document.getElementById("notification");
    if (notification) {
      notification.textContent = `${added} new quote(s) synced from server.`;
      notification.style.display = "block";
      setTimeout(() => notification.style.display = "none", 5000);
    }
  }
  populateCategories();
}

// ✅ DOM is ready
window.onload = function () {
  loadQuotes();
  populateCategories();
  showRandomQuote();
  createAddQuoteForm();
  syncQuotes();
  setInterval(syncQuotes, 60000); // Sync every 60 seconds

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

  const exportBtn = document.getElementById("exportQuotes");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportToJsonFile);
  }

  const importInput = document.getElementById("importFile");
  if (importInput) {
    importInput.addEventListener("change", importFromJsonFile);
  }

  const categorySelect = document.getElementById("categoryFilter");
  if (categorySelect) {
    categorySelect.addEventListener("change", showRandomQuote);
  }
};
