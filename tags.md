---
layout: page
title: 標籤
permalink: /tags/
---

<p>本站採用五大核心標籤，所有文章皆重新分類，避免標籤過度分散。</p>

<div class="tag-index">
{% for item in site.data.tag_catalog %}
  {% assign posts = site.tags[item.key] %}
  {% assign count = posts | size %}
  <a href="#{{ item.key | slugify }}">{{ item.title }} ({{ count }})</a>{% unless forloop.last %} · {% endunless %}
{% endfor %}
</div>

<hr>

{% for item in site.data.tag_catalog %}
  {% assign posts = site.tags[item.key] | sort: "date" | reverse %}
  <section id="{{ item.key | slugify }}">
    <h2>{{ item.title }} ({{ posts | size }})</h2>
    <p>{{ item.description }}</p>
    <ul>
      {% for post in posts %}
        <li>
          <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
          <small>({{ post.date | date: "%Y-%m-%d" }})</small>
        </li>
      {% endfor %}
    </ul>
  </section>
{% endfor %}
