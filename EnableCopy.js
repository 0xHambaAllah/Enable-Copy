javascript:(function(){
  try{
    function safe(fn){ try{ fn(); }catch(e){} }

    // 1. Hentikan anti-copy event
    safe(function(){
      const events = ["copy","cut","paste","contextmenu","selectstart","mousedown","mouseup","keydown"];
      const allow = e => { e.stopImmediatePropagation(); return true; };
      events.forEach(ev => {
        document.addEventListener(ev, allow, true);
      });
      document.oncopy = null;
      document.oncut = null;
      document.onpaste = null;
      document.oncontextmenu = null;
      document.onselectstart = null;
    });

    // 2. Paksa CSS agar bisa dipilih tanpa merusak tampilan
    safe(function(){
      let s = document.getElementById("__copy_restyle");
      if(!s){
        s = document.createElement("style");
        s.id = "__copy_restyle";
        s.innerHTML = `
          * {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
          }
        `;
        document.head.appendChild(s);
      }
    });

    // 3. Nonaktifkan overlay anti-copy hanya jika overlay benar-benar memblokir
    safe(function(){
      const els = document.querySelectorAll("*");
      els.forEach(el=>{
        try{
          if(getComputedStyle(el).pointerEvents === "none") return;
          if(el.className && typeof el.className === "string" &&
             (el.className.includes("overlay") || el.className.includes("block"))) {
            el.style.pointerEvents = "auto";
          }
        }catch(_){}
      })
    });

    window.__EXT_LAST_INJECT = Date.now();
  }catch(err){
    console.warn("inject error", err);
  }
})();
