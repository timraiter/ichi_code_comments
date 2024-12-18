const titles = [
  "Mechanical", "Fire", "Electrical", "Plumbing", "Structural"
];

const descriptions = [
  "Provide details for the mechanical equipment anchorage to resist seismic forces. Include calculations and specifications per CBC 1613.1.",
  "Provide a fire-rated assembly detail for the wall separating the electrical room from adjacent spaces. Include UL listing or equivalent.",
  "Provide working space dimensions around electrical panels to ensure compliance.",
  "Provide a comprehensive riser diagram for the domestic water system, including pipe sizes, fixture units, and pressure calculations.",
  "Indicate the location and specifications of shear walls, including nailing patterns and hold-down details.",
  "Specify the location and type of backflow prevention devices for potable water connections.",
  "Provide the location of fire alarm pull stations and ensure required travel distances.",
  "Submit detailed mechanical ventilation calculations and equipment specifications for the parking garage exhaust system.",
  "Specify the materials and installation method for the building sewer connection.",
  "Provide structural calculations for beams supporting second-floor framing."
];

const names = ["John Smith", "Jane Doe", "Michael Brown", "Emily Davis", "David Johnson", "Sarah Wilson", "Chris Lee", "Laura White", "Tom Clark", "Jessica Martinez"];

function randomDate() {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
}

let cardsData = [];
for (let i = 0; i < 20; i++) {
  const title = titles[Math.floor(Math.random() * titles.length)];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const date = randomDate();
  cardsData.push({ title, description, name, date });
}

const container = document.querySelector('.container');
const tableContainer = document.querySelector('.table-container');
const tableBody = document.querySelector('.table-body');

let currentFilter = 'All';
let searchQuery = '';
let isSorted = false;
let isTableView = false;

function createCardHTML(cardData) {
  return `
    <div class="card">
      <div class="card-title">${cardData.title}</div>
      <div class="card-content">${cardData.description}</div>
      <div class="card-footer">
        <span class="name">${cardData.name}</span>
        <span class="date">${cardData.date}</span>
      </div>
      <div class="card-actions">
        <div class="left-actions">
          <img src="icons/copy.svg" class="action-box copy-btn" alt="Copy">
          <img src="icons/edit.svg" class="action-box edit-btn" alt="Edit">
        </div>
        <img src="icons/archive.svg" class="action-box archive-btn" alt="Archive">
      </div>
      <div class="edit-actions" style="display:none;">
        <button class="edit-button save-btn">Save</button>
        <button class="edit-button cancel-btn">Cancel</button>
      </div>
    </div>
  `;
}

function createTableRow(cardData) {
  return `
    <tr>
      <td class="title-cell">${cardData.title}</td>
      <td class="desc-cell">${cardData.description}</td>
      <td class="name-cell"><span class="name">${cardData.name}</span></td>
      <td class="date-cell"><span class="date">${cardData.date}</span></td>
      <td class="actions-cell">
        <img src="icons/copy.svg" class="icon copy-btn" alt="Copy">
        <img src="icons/edit.svg" class="icon edit-btn" alt="Edit">
        <img src="icons/archive.svg" class="icon archive-btn" alt="Archive">
      </td>
    </tr>
  `;
}

function attachCardEvents() {
  document.querySelectorAll('.card').forEach(card => {
    const editBtn = card.querySelector('.edit-btn');
    const saveBtn = card.querySelector('.save-btn');
    const cancelBtn = card.querySelector('.cancel-btn');

    editBtn.addEventListener('click', () => {
      card.classList.add('editing');
      const titleEl = card.querySelector('.card-title');
      const contentEl = card.querySelector('.card-content');
      titleEl.setAttribute('contenteditable', 'true');
      contentEl.setAttribute('contenteditable', 'true');
      card.querySelector('.edit-actions').style.display = 'flex';
    });

    saveBtn.addEventListener('click', () => {
      card.classList.remove('editing');
      const titleEl = card.querySelector('.card-title');
      const contentEl = card.querySelector('.card-content');
      titleEl.removeAttribute('contenteditable');
      contentEl.removeAttribute('contenteditable');
      card.querySelector('.edit-actions').style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
      card.classList.remove('editing');
      const titleEl = card.querySelector('.card-title');
      const contentEl = card.querySelector('.card-content');
      titleEl.removeAttribute('contenteditable');
      contentEl.removeAttribute('contenteditable');
      card.querySelector('.edit-actions').style.display = 'none';
    });
  });
}

function attachTableEvents() {
  document.querySelectorAll('.data-table .edit-btn').forEach(editBtn => {
    editBtn.addEventListener('click', () => {
      const row = editBtn.closest('tr');
      row.classList.add('editing');
      const titleCell = row.querySelector('.title-cell');
      const descCell = row.querySelector('.desc-cell');
      titleCell.setAttribute('contenteditable', 'true');
      descCell.setAttribute('contenteditable', 'true');

      const actionsCell = row.querySelector('.actions-cell');
      actionsCell.innerHTML = `
        <button class="edit-button save-btn">Save</button>
        <button class="edit-button cancel-btn">Cancel</button>
      `;

      actionsCell.querySelector('.save-btn').addEventListener('click', () => {
        row.classList.remove('editing');
        titleCell.removeAttribute('contenteditable');
        descCell.removeAttribute('contenteditable');
        restoreRowActions(actionsCell, row);
      });

      actionsCell.querySelector('.cancel-btn').addEventListener('click', () => {
        row.classList.remove('editing');
        titleCell.removeAttribute('contenteditable');
        descCell.removeAttribute('contenteditable');
        restoreRowActions(actionsCell, row);
      });
    });
  });
}

function restoreRowActions(actionsCell, row) {
  const cardData = {
    title: row.querySelector('.title-cell').innerText,
    description: row.querySelector('.desc-cell').innerText,
    name: row.querySelector('.name-cell').innerText,
    date: row.querySelector('.date-cell').innerText
  };
  actionsCell.innerHTML = `
    <img src="icons/copy.svg" class="icon copy-btn" alt="Copy">
    <img src="icons/edit.svg" class="icon edit-btn" alt="Edit">
    <img src="icons/archive.svg" class="icon archive-btn" alt="Archive">
  `;
  attachTableEvents(); 
}

function renderCards(data) {
  container.innerHTML = data.map(d => createCardHTML(d)).join('');
  attachCardEvents();
}

function renderTable(data) {
  tableBody.innerHTML = data.map(d => createTableRow(d)).join('');
  attachTableEvents();
}

function applyFilter(data, discipline) {
  if (discipline === 'All') return data;
  return data.filter(d => d.title === discipline);
}

function applySearch(data, query) {
  if (!query) return data;
  return data.filter(d =>
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.description.toLowerCase().includes(query.toLowerCase())
  );
}

function applySort(data) {
  if (!isSorted) return data;
  return [...data].sort((a, b) => a.title.localeCompare(b.title));
}

function updateDisplay() {
  let filtered = applyFilter(cardsData, currentFilter);
  filtered = applySearch(filtered, searchQuery);
  filtered = applySort(filtered);

  if (isTableView) {
    container.style.display = 'none';
    tableContainer.style.display = 'block';
    renderTable(filtered);
  } else {
    tableContainer.style.display = 'none';
    container.style.display = 'block';
    renderCards(filtered);
  }
}

updateDisplay();

const uniqueDisciplines = [...new Set(cardsData.map(c => c.title))].sort();
const filterSelect = document.querySelector('.filter-select');
uniqueDisciplines.forEach(d => {
  const option = document.createElement('option');
  option.value = d;
  option.textContent = d;
  filterSelect.appendChild(option);
});

const sortIcon = document.querySelector('.sort-icon');
const filterIcon = document.querySelector('.filter-icon');
const filterDropdown = document.querySelector('.filter-dropdown');
const searchContainer = document.querySelector('.search-container');
const searchIcon = document.querySelector('.search-icon');
const searchInput = document.querySelector('.search-input');
const searchClose = document.querySelector('.search-close');
const gridViewIcon = document.querySelector('.grid-view-icon');
const listViewIcon = document.querySelector('.list-view-icon');

filterSelect.addEventListener('change', () => {
  currentFilter = filterSelect.value;
  updateDisplay();
});

sortIcon.addEventListener('click', () => {
  isSorted = !isSorted;
  updateDisplay();
});

filterIcon.addEventListener('click', () => {
  filterDropdown.style.display = filterDropdown.style.display === 'block' ? 'none' : 'block';
});

searchIcon.addEventListener('click', () => {
  if (!searchContainer.classList.contains('search-active')) {
    searchContainer.classList.add('search-active');
    searchInput.focus();
  }
});

searchClose.addEventListener('click', () => {
  closeSearch();
});

document.addEventListener('keydown', (e) => {
  if (e.key === "Escape" && searchContainer.classList.contains('search-active')) {
    closeSearch();
  }
});

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  updateDisplay();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.filter-icon') && !e.target.closest('.filter-dropdown')) {
    filterDropdown.style.display = 'none';
  }
});

gridViewIcon.addEventListener('click', () => {
  isTableView = false;
  updateDisplay();
});

listViewIcon.addEventListener('click', () => {
  isTableView = true;
  updateDisplay();
});

function closeSearch() {
  searchInput.value = '';
  searchQuery = '';
  updateDisplay();
  searchContainer.classList.remove('search-active');
}