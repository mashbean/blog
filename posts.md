---
layout: page
title: 文章列表
permalink: /posts/
---

<p>共 {{ site.posts | size }} 篇文章，依日期由新到舊排列。</p>

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
      <small>({{ post.date | date: "%Y-%m-%d" }})</small>
    </li>
  {% endfor %}
</ul>
