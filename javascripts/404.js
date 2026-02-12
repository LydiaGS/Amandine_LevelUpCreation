function goSearch(e){
      e.preventDefault();
      const q = document.getElementById('q').value.trim();
      if(!q) return false;
      // Recherche via Google (site:levelupcreation.com)
      const url = "https://www.google.com/search?q=" + encodeURIComponent("site:levelupcreation.com " + q);
      window.location.href = url;
      return false;
    }