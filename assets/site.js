document.addEventListener("DOMContentLoaded", function () {
  // Highlight current nav item
  var currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  var navLinks = document.querySelectorAll(".site-nav .page-link");
  navLinks.forEach(function (link) {
    var href = (link.getAttribute("href") || "").replace(/\/+$/, "") || "/";
    if (href === currentPath) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Homepage post search
  var input = document.getElementById("post-search");
  var list = document.getElementById("post-list");
  var status = document.getElementById("search-status");
  if (!input || !list || !status) return;

  var items = Array.prototype.slice.call(list.querySelectorAll(".post-item"));
  var total = items.length;
  status.textContent = "顯示 " + total + " 篇";

  function update() {
    var q = input.value.trim().toLowerCase();
    var shown = 0;
    items.forEach(function (item) {
      var text = item.textContent.toLowerCase();
      var visible = !q || text.indexOf(q) !== -1;
      item.style.display = visible ? "" : "none";
      if (visible) shown += 1;
    });
    status.textContent = q ? "找到 " + shown + " / " + total + " 篇" : "顯示 " + total + " 篇";
  }

  input.addEventListener("input", update);
});
