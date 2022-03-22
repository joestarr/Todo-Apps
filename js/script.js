document.addEventListener("DOMContentLoaded", function () {

    const submitForm /* HTMLFormElement */ = document.getElementById("form");
    const searchInput = document.querySelector("#search-input");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    searchInput.addEventListener("submit", function (event) {
        event.preventDefault();
        search();
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan");
})

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
})