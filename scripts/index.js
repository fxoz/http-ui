function resetElemenetForHighlightJs(e) {
    delete (e.dataset.highlighted);
    e.className = e.className.replace(/language-.+/, '');
}

let currentResponse = null;

function showLatency() {
    fetchEndTime = performance.now();
    durationMs = fetchEndTime - fetchStartTime;

    outputLatency.innerText = `${durationMs.toFixed(2)} ms`;
    outputLatency.style.color = durationMs < 50 ? 'lightblue' : durationMs < 200 ? 'lightgreen' : durationMs < 400 ? 'lime' : durationMs < 800 ? 'yellow' : 'pink';
}

buttonRequest.addEventListener('click', () => {
    let url = inputUrl.value;
    corsProxy = inputCorsProxy.value;

    url = rewriteUrl(corsProxy, url);

    sectionResponse.style.display = 'none';
    loadingAnimation.style.display = 'initial';

    fetchStartTime = performance.now();

    headers = new Headers();
    headers.append('X-Requested-With', 'XMLHttpRequest');

    if (inputToggleJson.checked) {
        headers.append('Content-Type', 'application/json');
    }

    fetch(url, {
        method: inputMethod.value,
        headers: headers,
    }).then((response) => {
        showLatency();
        approxResponseSizeKb = response.headers.get('content-length') / 1024;
        outputSize.innerText = `${approxResponseSizeKb.toFixed(2)} KB`;

        hiddenIfError.style.display = 'block';
        loadingAnimation.style.display = 'none';
        sectionResponse.style.display = 'block';
        resetElemenetForHighlightJs(outputHeaders);
        resetElemenetForHighlightJs(outputBody);

        outputUrl.innerText = response.url + (response.redirected ? ' (Redirected)' : '');

        outputStatus.innerText = `${response.status} ${getStatusMessage(response.status)}`;
        outputStatus.style.color = response.ok ? 'lightgreen' : 'orange';

        outputHeaders.innerHTML = JSON.stringify(Object.fromEntries(response.headers), null, 2);
        outputHeaders.classList.add('language-json');
        hljs.highlightElement(outputHeaders);

        document.querySelector('label[for="outputBody"]').display = 'block';
        currentResponse = response;
        processResponseBody(response);

    }).catch((error) => {
        hiddenIfError.style.display = 'none';
        loadingAnimation.style.display = 'none';
        sectionResponse.style.display = 'block';

        outputStatus.innerText = 'Error';
        outputStatus.style.color = 'pink';
        outputBody.innerText = error;
        hljs.highlightElement(outputBody);
    });
});
