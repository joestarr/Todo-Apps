const UNCOMPLETED_LIST_BOOK_ID = "buku-belum-dibaca";
const COMPLETED_LIST_BOOK_ID = "buku-sudah-dibaca";
const BOOK_ITEMID = "itemId";

function search() {
    const searchValue = document.querySelector("#search").value;

    let uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    let completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);

    uncompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    if (searchValue === '') {
        refreshDataFromBooks();
        return;
    }

    for (book of books) {
        if (book.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
            const searchBook = makeBook(book.title, book.author, book.year, book.isCompleted);
            searchBook[BOOK_ITEMID] = book.id;

            if (book.isCompleted) {
                completedBookList.append(searchBook);
            } else {
                uncompletedBookList.append(searchBook);
            }
        }
    }
}

function addBook() {
    let checkbox = document.querySelector("#checkbox-book");
    const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const title = document.querySelector("#title").value;
    const penulis = document.querySelector("#penulis").value;
    const tahun = document.querySelector("#tahun").value;

    let isChecked;

    if (checkbox.checked === true) {
        isChecked = true;
    } else {
        isChecked = false;
    }

    const book = makeBook(title, penulis, tahun, isChecked);
    const bookObject = composeBookObject(title, penulis, tahun, isChecked);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    if (isChecked === true) {
        completedBookList.append(book);
    } else {
        uncompletedBookList.append(book);
    }

    updateDataToStorage();
}

function makeBook(title, penulis, tahun, isCompleted) {
    const textTitle = document.createElement("h1");
    textTitle.innerText = title;
    textTitle.setAttribute("id", "titleValue");

    const labelPenulis = document.createElement("label");
    labelPenulis.setAttribute("for", "penulisValue");
    labelPenulis.innerText = "Penulis : "
    const textPenulis = document.createElement("h3");
    textPenulis.innerText = penulis;
    textPenulis.setAttribute("id", "penulisValue");

    const labelTahun = document.createElement("label");
    labelTahun.setAttribute("for", "tahunValue");
    labelTahun.innerText = "Tahun : ";
    const textTahun = document.createElement("h3");
    textTahun.innerText = tahun;
    textTahun.setAttribute("id", "tahunValue");

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle, labelPenulis, textPenulis, labelTahun, textTahun);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);
    container.style.backgroundColor = "purple";
    container.style.borderRadius = "20px";
    container.style.marginBottom = "10px";
    container.style.padding = "20px";

    if (isCompleted) {
        container.append(createUndoButton(), createTrashButton(), createEditButton());
    } else {
        container.append(createCheckButton(), createTrashButton(), createEditButton());
    }
    return container;
}

function createButton(buttonTypeClass, buttonTypeClass2, textButton, buttonColor, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass, buttonTypeClass2);
    button.style.fontSize = "24px";
    button.innerText = textButton;
    button.style.background = buttonColor;
    button.style.fontSize = "20px";
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function createUndoButton() {
    return createButton("fas", "fa-clock", "Belum selesai dibaca", "blue", function (event) {
        undoBookFromCompleted(event.target.parentElement);
    })
}

function createTrashButton() {
    return createButton("fas", "fa-trash", "Hapus buku", "red", function (event) {
        deleteBookFromCompleted(event.target.parentElement);
    })
}

function createCheckButton() {
    return createButton("fas", "fa-check", "Selesai dibaca", "green", function (event) {
        addBookToCompleted(event.target.parentElement);
    })
}

function createEditButton() {
    return createButton("fas", "fa-edit", "Edit Buku", "black", function(event) {
        editBook(event.target.parentElement);
    })
}

function undoBookFromCompleted(bookElement) {
    const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const title = bookElement.querySelector("#titleValue").innerText;
    const penulis = bookElement.querySelector("#penulisValue").innerText;
    const tahun = bookElement.querySelector("#tahunValue").innerText;

    const newBook = makeBook(title, penulis, tahun, false);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    uncompletedBookList.append(newBook);
    bookElement.remove();
    updateDataToStorage();
}

function addBookToCompleted(bookElement) {
    const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const title = bookElement.querySelector("#titleValue").innerText;
    const penulis = bookElement.querySelector("#penulisValue").innerText;
    const tahun = bookElement.querySelector("#tahunValue").innerText;

    const newBook = makeBook(title, penulis, tahun, true);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    completedBookList.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function deleteBookFromCompleted(bookElement) {

    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
}

function editBook(bookElement) {
    const exitButton = document.createElement("i");
    exitButton.classList.add("fa-solid", "fa-xmark");

    let editJudulInput = document.createElement("input");
    editJudulInput.setAttribute("id", "editJudul");
    editJudulInput.setAttribute("type", "text");
    editJudulInput.value = bookElement.querySelector("#titleValue").innerText;
    editJudulInput.style.color = "black";
    editJudulInput.style.margin = "10px";

    let editJudulLabel = document.createElement("label");
    editJudulLabel.setAttribute("for", "editJudul");
    editJudulLabel.innerText = "Judul";
    editJudulLabel.style.color = "black";

    let editPenulisInput = document.createElement("input");
    editPenulisInput.setAttribute("id", "editPenulis");
    editPenulisInput.setAttribute("type", "text");
    editPenulisInput.value = bookElement.querySelector("#penulisValue").innerText;
    editPenulisInput.style.color = "black";
    editPenulisInput.style.margin = "10px";

    let editPenulisLabel = document.createElement("label");
    editPenulisLabel.setAttribute("for", "editPenulis");
    editPenulisLabel.innerText = "Penulis";
    editPenulisLabel.style.color = "black";

    let editTahunInput = document.createElement("input");
    editTahunInput.setAttribute("id", "editTahun");
    editTahunInput.setAttribute("type", "text");
    editTahunInput.value = bookElement.querySelector("#tahunValue").innerText;
    editTahunInput.style.color = "black";
    editTahunInput.style.margin = "10px";

    let editTahunLabel = document.createElement("label");
    editTahunLabel.setAttribute("for", "editTahun");
    editTahunLabel.innerText = "Tahun";
    editTahunLabel.style.color = "black";

    const buttonSubmit = document.createElement("input");
    buttonSubmit.setAttribute("type", "submit");
    buttonSubmit.setAttribute("id", "buttonEditSubmit");
    buttonSubmit.style.background = "red";
    buttonSubmit.style.margin = "10px";
    buttonSubmit.style.color = "white";
    buttonSubmit.style.fontWeight = "bold";

    let modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    modalContent.style.fontSize = "30px";

    modalContent.style.display = "flex";
    modalContent.style.flexDirection = "column";
    modalContent.style.width = "20%";
    modalContent.append(editJudulLabel);
    modalContent.append(editJudulInput);
    modalContent.append(editPenulisLabel);
    modalContent.append(editPenulisInput);
    modalContent.append(editTahunLabel);
    modalContent.append(editTahunInput);
    modalContent.append(buttonSubmit);
    modalContent.append(exitButton);

    let modalContainer = document.createElement("div");
    modalContainer.classList.add("modal");
    modalContainer.setAttribute("id", "myModal");
    modalContainer.append(modalContent);
    modalContainer.style.textAlign = "center";
    modalContainer.style.padding = "10px";

    let kontener = document.getElementById("content");
    kontener.append(modalContainer);

    let modal = document.getElementById("myModal");
    modal.style.display = "block";

    let exit = document.getElementsByClassName("fa-xmark")[0];
    exit.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    modalContainer.remove();
  }
  buttonSubmit.addEventListener("click", function() {
    const findEditBook = findBook(bookElement[BOOK_ITEMID]);
    findEditBook.title = editJudulInput.value;
    findEditBook.author = editPenulisInput.value;
    findEditBook.year = editTahunInput.value;

    const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);

    uncompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';
    updateDataToStorage();
    refreshDataFromBooks();
    modalContainer.remove();
  })
}
}