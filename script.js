// ============================================================
//  Live Search Filter — script.js
//  Pure JavaScript (DOM Manipulation) — No libraries used
// ============================================================

// --- Element References ---
const searchInput  = document.getElementById('searchInput');
const clearBtn     = document.getElementById('clearBtn');
const itemList     = document.getElementById('itemList');
const noResults    = document.getElementById('noResults');
const resultCount  = document.getElementById('resultCount');
const searchedTerm = document.getElementById('searchedTerm');

// --- Grab all list items once ---
const allItems = Array.from(itemList.querySelectorAll('li'));
const totalItems = allItems.length;

// Store original text for each item (used for highlight restore)
allItems.forEach(item => {
  item.dataset.original = item.textContent;
});

// ============================================================
//  Core Filter Function
// ============================================================
function filterItems() {
  const query = searchInput.value.trim();

  // Show / hide clear button
  if (query.length > 0) {
    clearBtn.classList.add('visible');
  } else {
    clearBtn.classList.remove('visible');
  }

  let matchCount = 0;

  allItems.forEach(item => {
    const originalText = item.dataset.original;
    const lowerText    = originalText.toLowerCase();
    const lowerQuery   = query.toLowerCase();

    if (query === '' || lowerText.includes(lowerQuery)) {
      // Show item
      item.classList.remove('hidden');
      matchCount++;

      // Highlight matched portion (only when there's a query)
      if (query !== '') {
        item.innerHTML = highlightMatch(originalText, query);
      } else {
        item.textContent = originalText;
      }
    } else {
      // Hide item
      item.classList.add('hidden');
      item.textContent = originalText; // restore clean text
    }
  });

  updateUI(matchCount, query);
}

// ============================================================
//  Highlight matched text without innerHTML injection risks
// ============================================================
function highlightMatch(text, query) {
  // Case-insensitive search; escape special regex chars in query
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex   = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// ============================================================
//  Update result count + no-results panel
// ============================================================
function updateUI(matchCount, query) {
  if (matchCount === 0) {
    // No matches
    noResults.classList.add('visible');
    searchedTerm.textContent = `"${query}"`;
    resultCount.textContent  = '0 items found';
  } else {
    noResults.classList.remove('visible');
    if (query === '') {
      resultCount.textContent = `Showing ${totalItems} of ${totalItems} items`;
    } else {
      resultCount.textContent = `Showing ${matchCount} of ${totalItems} items`;
    }
  }
}

// ============================================================
//  Clear Button
// ============================================================
function clearSearch() {
  searchInput.value = '';
  searchInput.focus();
  filterItems();
}

// ============================================================
//  Event Listeners
// ============================================================
searchInput.addEventListener('input', filterItems);
clearBtn.addEventListener('click', clearSearch);

// Allow Escape key to clear search
searchInput.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') clearSearch();
});

// ============================================================
//  Init
// ============================================================
filterItems(); // run once on page load to set count label
