/**
 * 批量下载文件
 * 
 */
export const downFile = (url)=>{
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none';  
  iframe.style.height = '0';
  iframe.src = url;
  document.body.appendChild(iframe)
  setTimeout(()=>{
      iframe.remove()
  },5*60*1000);

}