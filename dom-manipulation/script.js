const quotes = [
  { text: "Believe in yourself!", category: "Motivation" },
  { text: "Do or do not. There is no try.", category: "Wisdom" }
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (text && category) {
    quotes.push({ text, category });
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('New quote added!');
  } else {
    alert('Please fill both fields');
  }
}

document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
