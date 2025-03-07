function setProtocolDisplay(text) {
    document.querySelector('#inputProtocol option').innerText = text;
}

inputUrl.addEventListener('input', () => {
    console.log('inputUrl change event');
    inputUrl.value = inputUrl.value.trim();

    if ((!inputUrl.value.includes('://')) || (inputUrl.value === '://')) {
        setProtocolDisplay('Detect');
        return;
    }

    protocol = inputUrl.value.split('://')[0].toUpperCase();

    if (protocol === 'HTTP' || protocol === 'HTTPS') {
        setProtocolDisplay(protocol);
        return;
    }

    setProtocolDisplay('Unsupported!');
});
