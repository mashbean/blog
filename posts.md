---
layout: page
title: 文章列表
permalink: /posts/
---

<p>共 {{ site.posts | size }} 篇文章，依日期由新到舊排列。</p>

<ul class="post-list-compact">
  {% for post in site.posts %}
    <li class="post-list-compact-item" data-reveal>
      <a class="post-list-compact-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
      <small class="post-list-compact-date">({{ post.date | date: "%Y-%m-%d" }})</small>
    </li>
  {% endfor %}
</ul>
