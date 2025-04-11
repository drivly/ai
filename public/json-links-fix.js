(function() {
  function makeJsonLinksClickable() {
    const codeBlocks = document.querySelectorAll('pre code.language-json');
    
    codeBlocks.forEach((codeBlock) => {
      if (codeBlock.getAttribute('data-links-processed') === 'true') return;
      
      const html = codeBlock.innerHTML;
      
      const processedHtml = html.replace(
        /"(https?:\/\/[^"]+)"/g, 
        (match, url) => {
          return `"<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:underline;cursor:pointer;pointer-events:auto;position:relative;z-index:10;">${url}</a>"`;
        }
      );
      
      if (html !== processedHtml) {
        codeBlock.innerHTML = processedHtml;
        codeBlock.setAttribute('data-links-processed', 'true');
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      makeJsonLinksClickable();
      setTimeout(makeJsonLinksClickable, 500);
      setTimeout(makeJsonLinksClickable, 1500);
    });
  } else {
    makeJsonLinksClickable();
    setTimeout(makeJsonLinksClickable, 500);
    setTimeout(makeJsonLinksClickable, 1500);
  }
  
  const observer = new MutationObserver(function() {
    makeJsonLinksClickable();
  });
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
