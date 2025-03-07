outputDownload.addEventListener('click', async () => {
    if (!currentResponse) {
        console.error('No response available to download.');
        return;
    }

    try {
        const clonedResponse = currentResponse.clone();
        const blob = await clonedResponse.blob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const contentDisposition = clonedResponse.headers.get('content-disposition');
        let filename = 'response';
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+?)"/);
            if (match) filename = match[1];
        }

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        alert('Failed to download response body.');
    }
});
