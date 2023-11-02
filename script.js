"use strict";

if (window.location.href.includes('index.html')) {
    document.addEventListener('DOMContentLoaded', function () {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                const galleryContainer = document.querySelector('.gallery');
                document.getElementById('openModal').addEventListener('click', () =>
                    openModalWithUpdatedData(data));

                // Filtration of elements.
                function filterElements(categoryId) {
                    galleryContainer.innerHTML = ''; // Delete content.
                    data.forEach(item => {
                        if (categoryId === 'filterAll' || item.category.id.toString() === categoryId) {
                            const figure = document.createElement('figure');
                            const img = document.createElement('img');
                            img.src = item.imageUrl;
                            img.alt = item.title;
                            const figcaption = document.createElement('figcaption');
                            figcaption.textContent = item.title;
                            figure.appendChild(img);
                            figure.appendChild(figcaption);
                            galleryContainer.appendChild(figure);
                        }
                    });
                }


                // Add listener for buttons of the filtre.
                document.getElementById('filterAll').addEventListener('click', () => {
                    filterElements('filterAll');
                });

                document.getElementById('filterCategory1').addEventListener('click', () => {
                    filterElements('1');
                });

                document.getElementById('filterCategory2').addEventListener('click', () => {
                    filterElements('2');
                });

                document.getElementById('filterCategory3').addEventListener('click', () => {
                    filterElements('3');
                });
                // Display of all elements.
                filterElements('filterAll');
            })
            .catch(error => {
                console.error('was an error:', error);
            });
        let header = document.getElementById('tri');
        let btns = document.getElementsByClassName('tri-button');
        for (let i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', function () {
                let current = header.querySelector('.active');
                if (current) {
                    current.classList.remove('active');
                }
                this.classList.add('active');
            });
        }
    });


    function updateGallery(data) {
        const galleryContainer = document.querySelector('.gallery');
        // Clear the gallery before adding new elements.
        galleryContainer.innerHTML = '';

        data.forEach(item => {
            const galleryElement = createGalleryElement(item);
            galleryContainer.appendChild(galleryElement);
        });
    }

    function fetchUpdatedData() {
        return fetch('http://localhost:5678/api/works')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`Failed to fetch updated data (status: ${response.status})`);
                }
            });
    }


    function deleteWork(workId, workElement) {
        fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (response.status === 204) {
                    if (workElement) {
                        workElement.remove(); // Удаляем элемент из DOM
                    }
                    return fetchUpdatedData(); // Получаем актуальные данные после удаления
                } else {
                    throw new Error(`Failed to delete work (status: ${response.status})`);
                }
            })
            .then(updatedData => {
                updateGallery(updatedData); // Вызываем функцию обновления галереи с актуальными данными
            })
            .catch(error => {
                console.error('Error deleting work:', error);
            });
    }

    function createWorkElement(work) {
        const workElement = document.createElement('div');
        workElement.classList.add('gallery-item');
        workElement.setAttribute('data-id', work.id);
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteIcon = document.createElement('div');
        deleteIcon.classList.add('delete-icon');
        deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        deleteIcon.addEventListener('click', () => {
            const workId = work.id;
            console.log('Deleting work with ID:', workId);
            deleteWork(workId, workElement);
        });

        workElement.appendChild(deleteIcon);
        workElement.appendChild(img);
        return workElement;
    }

    function updateModalContent(data) {
        const modalContent = document.querySelector('.gallery-container');
        modalContent.innerHTML = '';

        data.forEach(work => {
            const workElement = createWorkElement(work);
            modalContent.appendChild(workElement);
        });
    }

    function openModal(data) {
        const modal = document.querySelector('.modal-content');
        const modalBackground = document.querySelector('.modal-background');
        updateModalContent(data);
        modal.classList.add('open');
        modalBackground.classList.add('open');
        modalBackground.addEventListener('click', () => {
            closeModal();
        });
    }

    function fetchDataForModal() {
        return fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .catch(error => {
                console.error('Error loading data for the modal window.:', error);
            });
    }

// A function to open a modal window with up-to-date data.
    function openModalWithUpdatedData() {
        fetchDataForModal()
            .then(data => {
                openModal(data);
            });
    }


    function closeModal() {
        const modal = document.querySelector('.modal-content');
        const modalBackground = document.querySelector('.modal-background');
        modal.classList.remove('open');
        modalBackground.classList.remove('open');
    }


    document.getElementById('closeModal').addEventListener('click', closeModal);

    function updateInterface() {
        const loginLink = document.getElementById('loginLink');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        console.log('updateInterface called. isLoggedIn:', isLoggedIn);
        if (isLoggedIn === 'true') {
            // If user  status login change text for "logout"
            loginLink.textContent = 'logout';
            //Cache buttons filters and add icon 'Modifier'
            document.getElementById('tri').style.display = 'none';
            const iconModifier = document.getElementById('iconModifier');
            iconModifier.style.display = 'flex';
        } else {
        }
    }

    function clearForm() {
        const uploadForm = document.getElementById('upload-form');
        uploadForm.reset();

        // Restoring elements related to the preview.
        const formP = document.querySelector('form p');
        const customFileUpload = document.querySelector('#custom-file-upload');
        const formContainerImg = document.querySelector('.form-container img');
        formP.style.display = 'block';
        customFileUpload.style.display = 'block';
        formContainerImg.style.display = 'block';

        // Clear the preview.
        const preview = document.getElementById("preview");
        preview.innerHTML = ''; // Удалить изображение из предпросмотра

        // Clear the fields in the second modal window.
        const secondModal = document.querySelector('.modal-content2');
        const inputs = secondModal.querySelectorAll('input, select');

        inputs.forEach(input => {
            if (input.type === 'file' || input.tagName === 'SELECT') {
                input.value = '';
            } else {
                input.value = '';
            }
        });
        validerButton.classList.remove('valid');
    }

    //seconde modale
    document.getElementById('openModal2').addEventListener('click', () => {
        // Close first window modale
        document.querySelector('.modal-content').classList.remove('open');
        document.querySelector('.modal-background').classList.remove('open');

        // Open second window modale
        document.querySelector('.modal-content2').classList.add('open');
        document.querySelector('.modal-background2').classList.add('open');
    });

    document.getElementById('openModal1').addEventListener('click', () => {
        // Close second window modale
        clearForm();
        document.querySelector('.modal-content2').classList.remove('open');
        document.querySelector('.modal-background2').classList.remove('open');

        // Open first window modale
        document.querySelector('.modal-content').classList.add('open');
        document.querySelector('.modal-background').classList.add('open');
    });

    document.getElementById('closeModal').addEventListener('click', () => {
        // Close first window modale
        clearForm();
        document.querySelector('.modal-content').classList.remove('open');
        document.querySelector('.modal-background').classList.remove('open');
    });

    document.getElementById('closeModal2').addEventListener('click', () => {
        // Close second window modale
        clearForm();
        document.querySelector('.modal-content2').classList.remove('open');
        document.querySelector('.modal-background2').classList.remove('open');
    });
    document.querySelector('.modal-background2').addEventListener('click', () => {

        // Close second window modale
        clearForm();
        document.querySelector('.modal-content2').classList.remove('open');
        document.querySelector('.modal-background2').classList.remove('open');
    });


//Get categories of works
    async function fetchCategories() {
        try {
            const response = await fetch('http://localhost:5678/api/categories');
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Error of getting categories');
            }
        } catch (error) {
            console.error('Error of getting categories:', error);
            return [];
        }
    }

//A request to the server for categories and the addition of an empty category.
    document.addEventListener('DOMContentLoaded', async function () {
        const categories = await fetchCategories();
        const categorySelect = document.getElementById('category');

        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '';
        categorySelect.appendChild(emptyOption);

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    });

    // Finde button  "Télécharger" with TAG
    const downloadButton = document.querySelector('form button[type="submit"]');
// Finde button "Valider" with ID
    const validerButton = document.getElementById('buttonValider');
// Cache button "Télécharger"
    downloadButton.style.display = 'none';
// Click on "Valider" button
    validerButton.style.display = 'block';
    validerButton.addEventListener('click', function () {
    });
    const customFileUpload = document.getElementById("custom-file-upload");
    const imageInput = document.getElementById("image-input");
    const preview = document.getElementById("preview");
    const uploadForm = document.getElementById('upload-form');
    const captionInput = document.getElementById('caption');
    const categorySelect = document.getElementById('category');
    customFileUpload.addEventListener("click", function () {
        imageInput.click();
    });
    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`;
                //Cashe elements for Image Preview
                const formP = document.querySelector('form p');
                const customFileUpload = document.querySelector('#custom-file-upload');
                const formContainerImg = document.querySelector('.form-container img');
                formP.style.display = 'none';
                customFileUpload.style.display = 'none';
                formContainerImg.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    //Check the form for completion.
    function isFormValid() {
        return captionInput.value.trim() !== '' && categorySelect.value !== '' && imageInput.files.length > 0;
    }

    function updateValiderButtonStyle() {
        if (isFormValid()) {
            validerButton.classList.add('valid'); // Add a style for a valid form.
        } else {
            validerButton.classList.remove('valid'); // Delete a style for a valid form.
        }
    }

// Event listeners for form fields.
    captionInput.addEventListener('input', updateValiderButtonStyle);
    categorySelect.addEventListener('change', updateValiderButtonStyle);
    imageInput.addEventListener('change', updateValiderButtonStyle);

// Initial check on page load.
    updateValiderButtonStyle();


    let data = [];

    // Define a function to create a gallery element.
    function createGalleryElement(item) {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = item.title;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = item.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        return figure;
    }

    const galleryContainer = document.querySelector('.gallery');
    validerButton.addEventListener('click', function () {
        const formData = new FormData(uploadForm);
        formData.append('title', captionInput.value);
        formData.append('category', categorySelect.value);
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (response.status === 201) {
                    console.log('post OK');
                    uploadForm.reset();
                    captionInput.value = '';
                    preview.innerHTML = '';
                    const formP = document.querySelector('form p');
                    const customFileUpload = document.querySelector('#custom-file-upload');
                    const formContainerImg = document.querySelector('.form-container img');
                    formP.style.display = 'block';
                    customFileUpload.style.display = 'block';
                    formContainerImg.style.display = 'block';
                    // After successfully creating a new element, add it to the gallery.
                    fetch('http://localhost:5678/api/works')
                        .then(response => response.json())
                        .then(newData => {
                            data = newData;
                            updateModalContent(newData);
                            const galleryElement = createGalleryElement(newData[newData.length - 1]);
                            galleryContainer.appendChild(galleryElement);
                            clearForm();
                        })
                        .catch(error => {
                            console.error('Error loading data:', error);
                        });
                } else {
                    alert('Erreur de saisie du formulaire');
                }
            })
            .catch(error => {
                console.error('Error sending data to the server.', error);
            });
    });


//Function Login-Logout
    document.addEventListener('DOMContentLoaded', function () {
        const loginLink = document.getElementById('loginLink');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        updateInterface();
        loginLink.addEventListener('click', function (e) {
            e.preventDefault();
            if (isLoggedIn === 'true') {
                //If user login status --> Logout
                localStorage.setItem('isLoggedIn', 'false');
                loginLink.textContent = 'login';
                window.location.href = 'index.html';
                //Show buttons filter and hide icon "Modifier"
                document.getElementById('iconModifier').style.display = 'none';
                document.getElementById('tri').style.display = 'flex';
            } else {
                // If user not login send on first page
                window.location.href = 'login.html';
            }
            updateInterface();
        });
    });
}
//Login.html
if (window.location.href.includes('login.html')) {
    document.getElementById('login-form').addEventListener('submit', function (e) {
        e.preventDefault();
        // Receive form data.
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const data = {
            email: email,
            password: password
        };
        // URL of request
        const url = 'http://localhost:5678/api/users/login';
        // Options request
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Change to JSON.
        };
        // Fetch request
        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                //"Check Login Status OK"
                if (data.userId && data.token) {
                    //After Log In
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    window.location.href = 'index.html';
                    updateInterface();
                } else {
                    alert('Erreur dans l’identifiant ou le mot de passe');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}





