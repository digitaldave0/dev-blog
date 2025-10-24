---
layout: default
title: Tags
permalink: /tags/
---

<h1>All Tags</h1>

{% assign sorted_tags = site.tags | sort %}

{% for tag in sorted_tags %}

  <h2 id="{{ tag[0] }}">{{ tag[0] }}</h2>
  <ul>
    {% for post in tag[1] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}
