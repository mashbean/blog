---
layout: page
title: 標籤
permalink: /tags/
---

<p>本站採用六大核心標籤，讓主題分類更集中、也更容易探索。</p>

<div class="tag-filter-grid">
  {% for item in site.data.tag_catalog %}
    {% assign posts = site.tags[item.key] %}
    {% assign count = posts | size %}
    <a class="tag-filter-chip" href="#{{ item.key | slugify }}">
      <span class="tag-chip-icon" aria-hidden="true">{{ item.icon | default: "🏷" }}</span>
      <span>{{ item.title }}</span>
      <strong>{{ count }}</strong>
    </a>
  {% endfor %}
</div>

<hr>

{% for item in site.data.tag_catalog %}
  {% assign posts = site.tags[item.key] | sort: "date" | reverse %}
  <section id="{{ item.key | slugify }}" class="tag-section">
    <h2>
      <span class="tag-chip-icon" aria-hidden="true">{{ item.icon | default: "🏷" }}</span>
      {{ item.title }} ({{ posts | size }})
    </h2>
    <p>{{ item.description }}</p>
    <ul>
      {% for post in posts %}
        <li>
          <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
          <small>({{ post.date | date: "%Y-%m-%d" }})</small>
          {% include tag-chips.html tags=post.tags %}
        </li>
      {% endfor %}
    </ul>
  </section>
{% endfor %}
