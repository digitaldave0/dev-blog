---
layout: default
---

<section class="post-list">
  {% for post in site.posts %}
    <article class="post-preview">
      <header>
        <h2 class="post-title">
          <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
        </h2>
      </header>

      <div class="post-excerpt">
        {{ post.excerpt }}
      </div>

      <footer>
        <a href="{{ site.baseurl }}{{ post.url }}" class="read-more">Read More →</a>
      </footer>
    </article>
  {% endfor %}
</section>