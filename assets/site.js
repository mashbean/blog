document.addEventListener("DOMContentLoaded", function () {
  var input = document.getElementById("sidebar-search-input");
  var status = document.getElementById("sidebar-search-status");
  var results = document.getElementById("sidebar-search-results");
  var dataNode = document.getElementById("post-search-data");
  if (!input || !status || !results || !dataNode) return;

  var posts = [];
  try {
    posts = JSON.parse(dataNode.textContent || "[]");
  } catch (err) {
    posts = [];
  }

  function render(items) {
    results.innerHTML = "";
    if (!items.length) return;
    items.slice(0, 12).forEach(function (p) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = p.url;
      a.textContent = p.title;
      var small = document.createElement("small");
      small.textContent = " (" + p.date + ")";
      li.appendChild(a);
      li.appendChild(small);
      results.appendChild(li);
    });
  }

  function runSearch() {
    var q = input.value.trim().toLowerCase();
    if (!q) {
      status.textContent = "";
      results.innerHTML = "";
      return;
    }

    var matched = posts.filter(function (p) {
      var text = (p.title + " " + p.summary).toLowerCase();
      return text.indexOf(q) !== -1;
    });

    status.textContent = "找到 " + matched.length + " 篇";
    render(matched);
  }

  input.addEventListener("input", runSearch);
});
