/**
 * 批量下载文件
 *
 */
export const downFile = (url) => {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.style.height = '0';
  iframe.src = url;
  document.body.appendChild(iframe);
  setTimeout(() => {
    iframe.remove();
  }, 5 * 60 * 1000);
};

/**
 * @export
 * @param {string} url
 * @returns {Record<string,string>}
 */
export function getUrlData(url?: string): Record<string, string> {
  let match: string[] | null | string = (url || window.location.href).match(
    /\?(.*)/
  );
  const urlData: Record<string, string> = {};
  match = match && match[1];
  if (!match) {
    return urlData;
  }
  match = match.split('&');
  let strKey;
  let strVal;
  return match.reduce((data, str) => {
    const val = str.split('=');
    strKey = decodeURIComponent(val[0]);
    strVal =
      val[1] === 'null' || val[1] === null ? '' : decodeURIComponent(val[1]);
    strKey && (data[strKey] = strVal);
    return data;
  }, urlData);
}
