const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Если mimeType не передано, попробуем извлечь из dataUrl
    let mimeType;

    const match = dataUrl.match(/^data:(.+);base64,/);
    if (match && match[1]) {
        mimeType = match[1];
    } else {
        mimeType = blob.type || 'application/octet-stream';
    }

    return new File([blob], filename, { type: mimeType });
}

function downloadFile(file: File | Blob, filename?: string): void {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || (file instanceof File ? file.name : 'download');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Освобождаем память
}

export { fileToDataUrl, dataUrlToFile, downloadFile };
