---
layout: page
title: 標籤
permalink: /tags/
---

<div class="tag-index">
{% assign sorted_tags = site.tags | sort %}
{% for tag in sorted_tags %}
  <a href="#{{ tag[0] | slugify }}">{{ tag[0] }} ({{ tag[1].size }})</a>{% unless forloop.last %} · {% endunless %}
{% endfor %}
</div>

<hr>

{% for tag in sorted_tags %}
  <h2 id="{{ tag[0] | slugify }}">{{ tag[0] }}</h2>
  <ul>
  {% assign posts = tag[1] | sort: "date" | reverse %}
  {% for post in posts %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
      <small>({{ post.date | date: "%Y-%m-%d" }})</small>
    </li>
  {% endfor %}
  </ul>
{% endfor %}
