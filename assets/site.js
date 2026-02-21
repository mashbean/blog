document.addEventListener("DOMContentLoaded", function () {
  var progressBar = document.getElementById("reading-progress-bar");
  function updateProgress() {
    if (!progressBar) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) {
      progressBar.style.width = "0%";
      return;
    }
    var ratio = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    progressBar.style.width = ratio.toFixed(1) + "%";
  }
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  var revealNodes = document.querySelectorAll("[data-reveal]");
  if (revealNodes.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );
      revealNodes.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealNodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  var input = document.getElementById("sidebar-search-input");
  var status = document.getElementById("sidebar-search-status");
  var results = document.getElementById("sidebar-search-results");
  var dataNode = document.getElementById("post-search-data");
  var copyBtn = document.getElementById("rss-copy-btn");
  var feedUrlNode = document.getElementById("rss-feed-url");
  var copyStatus = document.getElementById("rss-copy-status");
  if (copyBtn && feedUrlNode && copyStatus) {
    copyBtn.addEventListener("click", function () {
      var text = (feedUrlNode.textContent || "").trim();
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(function () {
            copyStatus.textContent = "Feed URL 已複製";
          })
          .catch(function () {
            copyStatus.textContent = "複製失敗，請手動選取網址";
          });
      } else {
        copyStatus.textContent = "此瀏覽器不支援自動複製，請手動選取網址";
      }
    });
  }

  if (!input || !status || !results || !dataNode) return;

  var posts = [];
  try {
    posts = JSON.parse(dataNode.textContent || "[]");
  } catch (err) {
    posts = [];
  }

  function render(items) {
    results.innerHTML = "";
    if (!items.length) {
      var empty = document.createElement("li");
      empty.textContent = "沒有符合的文章";
      results.appendChild(empty);
      return;
    }
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
