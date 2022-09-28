const allBook = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const input_book = document.getElementById("input_book");
  input_book.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataStorage();
  }
});

function addBook() {
  function idGenerate() {
    return +new Date();
  }

  function dataStore(id, judul, penulis, tahun, complete) {
    return {
      id,
      judul,
      penulis,
      tahun,
      complete,
    };
  }
  const status = document.getElementById("status_buku");
  let statusB = false;
  if (status.checked) {
    statusB = true;
  }
  const idBuku = idGenerate();
  const judul = document.getElementById("judul_buku").value;
  const penulis = document.getElementById("penulis_buku").value;
  const tahun = document.getElementById("tahun_buku").value;
  const dataWarehouse = dataStore(idBuku, judul, penulis, tahun, statusB);

  allBook.push(dataWarehouse);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeBook(bookItem) {
  const artikel = document.createElement("article");
  artikel.className = "book_item";

  const h3 = document.createElement("h3");
  h3.innerText = bookItem.judul;

  const p1 = document.createElement("p");
  p1.innerText = `Penulis : ${bookItem.penulis}`;

  const p2 = document.createElement("p");
  p2.innerText = `Tahun : ${bookItem.tahun}`;

  const div = document.createElement("div");
  div.className = "action";

  if (!bookItem.complete) {
    const btn1 = document.createElement("button");
    btn1.className = "green";
    btn1.innerText = "Selesai dibaca";

    const btn2 = document.createElement("button");
    btn2.className = "red";
    btn2.innerText = "Hapus buku";

    btn1.addEventListener("click", () => {
      addTaskComplete(bookItem.id);
    });

    btn2.addEventListener("click", () => {
      deleteBook(bookItem.id);
    });

    div.append(btn1, btn2);
  } else {
    const btn1 = document.createElement("button");
    btn1.className = "green";
    btn1.innerText = "Belum selesai dibaca";

    const btn2 = document.createElement("button");
    btn2.className = "red";
    btn2.innerText = "Hapus buku";

    btn1.addEventListener("click", (e) => {
      undoTaskComplete(bookItem.id);
    });

    btn2.addEventListener("click", () => {
      deleteBook(bookItem.id);
    });

    div.append(btn1, btn2);
  }

  artikel.setAttribute("id", `todo-${bookItem.id}`);

  artikel.append(h3, p1, p2, div);
  return artikel;
}

// fungsi render
document.addEventListener(RENDER_EVENT, () => {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";

  const uncompleteBookshelfList = document.getElementById(
    "uncompleteBookshelfList"
  );
  uncompleteBookshelfList.innerHTML = "";

  for (let book of allBook) {
    let ibook = makeBook(book);
    if (!book.complete) incompleteBookshelfList.append(ibook);
    else uncompleteBookshelfList.append(ibook);
  }
});

function findBook(bookId) {
  for (const book of allBook) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in allBook) {
    if (allBook[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  allBook.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskComplete(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.complete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.complete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

const STORAGE_KEY = "book_app";
const SAVED_EVENT = "saved_app";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung storage");
    return false;
  }

  return true;
}

function saveData() {
  if (isStorageExist()) {
    let parsed = JSON.stringify(allBook);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataStorage() {
  const dataStore = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(dataStore);

  if (data !== null) {
    for (const book of data) {
      allBook.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, (e) => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  console.log(data);
});

function searchBook(judul) {
  const dataMentah = JSON.parse(localStorage.getItem(STORAGE_KEY));
  for (const data of dataMentah) {
    if (data.judul == judul) {
      return data;
    }
  }
  return null;
}

const EVENT_SEARCH = "search_book";
const search = document.getElementById("searchSubmit");

search.addEventListener("click", (e) => {
  e.preventDefault();
  document.dispatchEvent(new Event(EVENT_SEARCH));
});

document.addEventListener(EVENT_SEARCH, (e) => {
  const title = document.getElementById("searchBookTitle").value;
  let judulCari = searchBook(title);

  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";

  const uncompleteBookshelfList = document.getElementById(
    "uncompleteBookshelfList"
  );
  uncompleteBookshelfList.innerHTML = "";

  if (judulCari !== null) {
    let sjudul = makeBook(judulCari);
    if (!judulCari.complete) incompleteBookshelfList.append(sjudul);
    else uncompleteBookshelfList.append(sjudul);
  } else {
    alert("Buku tidak ada");
    return;
  }
});
