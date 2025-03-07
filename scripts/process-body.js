function setLabelText(text) {
    document.querySelector('label[for="outputBody"]').innerText = text;
}

function processResponseBody(response) {
    if (!response.ok) {
        outputBody.style.display = 'none';
        document.querySelector('label[for="outputBody"]').display = 'none';
        return;
    }

    if (response.headers.get('content-type').includes('application/json')) {
        response.json().then((data) => {
            setLabelText('JSON');
            outputBody.style.display = 'block';
            outputBody.innerHTML = JSON.stringify(data, null, 2);
            outputBody.classList.add('language-json');
            hljs.highlightElement(outputBody);
        }).catch((error) => {
            outputBody.innerText = error;
        });

        return;
    }

    if (response.headers.get('content-type').startsWith('image/')) {
        setLabelText('Image');
        outputBody.style.display = 'none';
        outputImage.style.display = 'block';
        outputImage.src = response.url;
        return;
    }

    response.text().then((data) => {
        setLabelText('Text');
        outputBody.style.display = 'block';
        dataEscaped = data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        outputBody.innerHTML = dataEscaped;

        if (response.headers.get('content-type').includes('text/html')) {
            setLabelText('HTML');
            outputBody.classList.add('language-html');
        }

        hljs.highlightElement(outputBody);
    });
}