let printed = false;
export default (dom, { title = document.title } = {}) => {
  if (!dom || (dom && printed)) return;
  printed = true;
  const fragment = document.createDocumentFragment();
  const styleDom = document.querySelectorAll('style,link,meta');
  const titleDom = document.createElement('title');
  titleDom.innerText = title;
  fragment.appendChild(titleDom);
  Array.from(styleDom).forEach((item) =>
    fragment.appendChild(item.cloneNode(true))
  );
  const attrObj = {
    height: 0,
    width: 0,
    border: 0,
    vmode: 'Opaque',
  };
  const styleObj = {
    position: 'absolute',
    top: '-999px',
    left: '-999px',
  };
  const iframeDom = document.createElement('iframe');
  Object.entries(attrObj).forEach(([key, value]) =>
    iframeDom.setAttribute(key, value)
  );
  Object.entries(styleObj).forEach(
    ([key, value]) => (iframeDom.style[key] = value)
  );
  document.body.insertBefore(iframeDom.document.body.children[0]);
  const ifwin = iframeDom.contentWindow;
  const ifdoc = ifwin.document;
  ifdoc.head.appendChild(fragment);
  ifdoc.body.appendChild(dom.cloneNode(true));
  return new Promise((resove, reject) => {
    try {
      setTimeout(() => {
        ifwin.focus();
        ifwin.print();
        resove();
      }, 300);
    } catch (e) {
      reject(e);
    } finally {
      document.body.removeChild(iframeDom);
      printed = false;
    }
  });
};
