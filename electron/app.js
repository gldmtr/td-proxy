window.addEventListener('load', function () {
    const doc = document;
    const h1 = doc.createElement('h1');
    h1.textContent = 'Hello DOM: ';
    doc.body.appendChild(h1);
}, false);
