function resetElemenetForHighlightJs(e) {
    delete (e.dataset.highlighted);
    e.className = e.className.replace(/language-.+/, '');
}

function processResponseBody(response) {
    if (!response.ok) {
        outputBody.display = 'none';
        document.querySelector('label[for="outputBody"]').display = 'none';
        return;
    }

    if (response.headers.get('content-type').includes('application/json')) {
        response.json().then((data) => {
            document.querySelector('label[for="outputBody"]').innerText = 'JSON';
            outputBody.innerHTML = JSON.stringify(data, null, 2);
            outputBody.classList.add('language-json');
            hljs.highlightElement(outputBody);
        }).catch((error) => {
            outputBody.innerText = error;
        });
    } else {
        response.text().then((data) => {
            dataEscaped = data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            outputBody.innerHTML = dataEscaped;

            if (response.headers.get('content-type').includes('text/html')) {
                document.querySelector('label[for="outputBody"]').innerText = 'HTML';
                outputBody.classList.add('language-html');
            }

            hljs.highlightElement(outputBody);
        });
    }
}

buttonRequest.addEventListener('click', () => {
    const url = inputUrl.value;
    sectionResponse.style.display = 'none';
    loadingAnimation.style.display = 'initial';

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        loadingAnimation.style.display = 'none';
        sectionResponse.style.display = 'block';
        resetElemenetForHighlightJs(outputHeaders);
        resetElemenetForHighlightJs(outputBody);

        outputStatus.innerText = `${response.status} ${getStatusMessage(response.status)}`;
        outputStatus.style.color = response.ok ? 'lightgreen' : 'orange';

        outputHeaders.innerHTML = JSON.stringify(Object.fromEntries(response.headers), null, 2);
        outputHeaders.classList.add('language-json');
        hljs.highlightElement(outputHeaders);

        document.querySelector('label[for="outputBody"]').display = 'block';
        processResponseBody(response);

    }).catch((error) => {
        loadingAnimation.style.display = 'none';
        sectionResponse.style.display = 'block';

        outputStatus.innerText = 'Error';
        outputStatus.style.color = 'red';
        outputBody.innerText = error;
        hljs.highlightElement(outputBody);
    });
});
