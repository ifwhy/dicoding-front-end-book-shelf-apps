let books = []

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const section2 = document.getElementById('section-2');
    const saveBookButton = document.getElementById('save-book');
    const belumDibacaContainer = document.querySelector('.belum-dibaca');
    const sudahDibacaContainer = document.querySelector('.sudah-dibaca');

    const BOOKS_KEY = 'BOOKSHELF_APPS';

    let books = JSON.parse(localStorage.getItem(BOOKS_KEY)) || [];

    const renderBooks = (booksToRender = books) => {
        belumDibacaContainer.innerHTML = '';
        sudahDibacaContainer.innerHTML = '';

        const belumDibacaTable = createTable();
        const sudahDibacaTable = createTable();

        booksToRender.forEach(book => {
            const bookRow = createBookRow(book);
            if (book.isComplete) {
                sudahDibacaTable.querySelector('tbody').appendChild(bookRow);
            } else {
                belumDibacaTable.querySelector('tbody').appendChild(bookRow);
            }
        });

        if (belumDibacaTable.querySelector('tbody').hasChildNodes()) {
            belumDibacaContainer.appendChild(belumDibacaTable);
        }

        if (sudahDibacaTable.querySelector('tbody').hasChildNodes()) {
            sudahDibacaContainer.appendChild(sudahDibacaTable);
        }
    };

    const createTable = () => {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        thead.innerHTML = `
            <tr>
                <th>Judul</th>
                <th>Penulis</th>
                <th>Tahun</th>
                <th id="aksi">Aksi</th>
            </tr>
        `;

        table.appendChild(thead);
        table.appendChild(tbody);

        return table;
    };

    const createBookRow = book => {
        const bookRow = document.createElement('tr');
        bookRow.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td class="year-column">${book.year}</td>
            <td class="action">
                <button class="edit" data-id="${book.id}">Edit</button>
                <button class="delete" data-id="${book.id}">Hapus</button>
                <button class="toggle-read" data-id="${book.id}">${book.isComplete ? 'Belum Selesai' : 'Selesai'}</button>
            </td>
        `;

        bookRow.querySelector('.edit').addEventListener('click', handleEditBook);
        bookRow.querySelector('.delete').addEventListener('click', handleDeleteBook);
        bookRow.querySelector('.toggle-read').addEventListener('click', handleToggleReadStatus);

        return bookRow;
    };

    const saveBooks = () => {
        localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    };

    const handleSaveBook = event => {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const year = parseInt(document.getElementById('year').value.trim());
        const isComplete = document.getElementById('isComplete').checked;

        if (!title || !author || !year) {
            showNotification('Semua field harus diisi!', 'error');
            return;
        }

        const newBook = {
            id: +new Date(),
            title,
            author,
            year,
            isComplete
        };

        books.push(newBook);
        saveBooks();
        renderBooks();

        form.reset();
        section2.classList.add('hide-container');
        showNotification('Buku berhasil ditambahkan!', 'success');
    };

    const loadBooksFromLocalStorage = () => {
        const storedBooks = JSON.parse(localStorage.getItem(BOOKS_KEY));
        if (storedBooks) {
            books = storedBooks;
            renderBooks(); 
        }
    };

    const handleEditBook = event => {
        const bookId = Number(event.target.dataset.id);
        const bookToEdit = books.find(book => book.id === bookId);

        document.getElementById('title').value = bookToEdit.title;
        document.getElementById('author').value = bookToEdit.author;
        document.getElementById('year').value = bookToEdit.year;
        document.getElementById('isComplete').checked = bookToEdit.isComplete;

        saveBookButton.removeEventListener('click', handleSaveBook);
        saveBookButton.addEventListener('click', event => handleUpdateBook(event, bookId));
        section2.classList.remove('hide-container');
    };

    const handleUpdateBook = (event, bookId) => {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const year = document.getElementById('year').value.trim();
        const isComplete = document.getElementById('isComplete').checked;

        if (!title || !author || !year) {
            showNotification('Semua field harus diisi!', 'error');
            return;
        }

        const bookIndex = books.findIndex(book => book.id === bookId);
        books[bookIndex] = {
            ...books[bookIndex],
            title,
            author,
            year,
            isComplete
        };

        saveBooks();
        renderBooks();

        form.reset();
        saveBookButton.addEventListener('click', handleSaveBook);
        section2.classList.add('hide-container');
        showNotification('Buku berhasil diperbarui!', 'success');
    };

    const handleDeleteBook = event => {
        const bookId = Number(event.target.dataset.id);
        const book = books.find(book => book.id === bookId);

        if (confirm(`Apakah Anda yakin ingin menghapus buku "${book.title}"?`)) {
            books = books.filter(book => book.id !== bookId);
            saveBooks();
            renderBooks();
            showNotification('Buku berhasil dihapus!', 'success');
        }
    };

    const handleToggleReadStatus = event => {
        const bookId = Number(event.target.dataset.id);
        const book = books.find(book => book.id === bookId);
        book.isComplete = !book.isComplete;

        saveBooks();
        renderBooks();
    };

    const showNotification = (message) => {
        alert(message);
    };

    saveBookButton.addEventListener('click', handleSaveBook);
    document.addEventListener('load', loadBooksFromLocalStorage);

    renderBooks();
});
