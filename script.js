"use strict"

fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        const galleryContainer = document.querySelector('.gallery');

        // Filtration des elements.
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

        // Ajoute listener pour buttons de filtre.
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

        // afichage des tous elements.
        filterElements('filterAll');
    })
    .catch(error => {
        console.error('was an error:', error);
    });
let header = document.getElementById('tri');
let btns = document.getElementsByClassName('tri-button');

for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function () {
        let current = header.querySelector('.active');
        if (current) {
            current.classList.remove('active');
        }

        // Ajoute classe "active".
        this.classList.add('active');
    });
}
