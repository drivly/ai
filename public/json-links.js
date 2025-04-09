(function() {
  function makeJsonLinksClickable() {
    const codeBlocks = document.querySelectorAll('pre code.language-json');
    
    codeBlocks.forEach((codeBlock) => {
      const html = codeBlock.innerHTML;
      
      const processedHtml = html.replace(
        /"(https?:\/\/[^"]+)"/g, 
        (match, url) => {
          return '"<a href="' + url + '" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:underline;cursor:pointer;pointer-events:auto;position:relative;z-index:10;">' + url + '</a>"';
        }
      );
      
      if (html !== processedHtml) {
        codeBlock.innerHTML = processedHtml;
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', makeJsonLinksClickable);
  } else {
    makeJsonLinksClickable();
  }
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        makeJsonLinksClickable();
      }
    });
  });
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
