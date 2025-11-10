export function copyToClipboard(items: Array<string> | string) {
    if (Array.isArray(items)) {
        items = items.join('\t');
    }
    var ta = document.createElement('textarea');
    ta.value = items;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
}