/* 站内搜索：加载 /assets/search-index.json 并即时过滤。 */
(function () {
  'use strict';
  var input = document.getElementById('q');
  var box = document.getElementById('results');
  if (!input || !box) return;

  var KIND = { tool: '工具', news: '快讯', tut: '教程' };
  var index = null;

  function render(list, q) {
    if (!q) {
      box.innerHTML = '<p class="muted">输入关键词开始检索。共收录 ' +
        (index ? index.tools.length + index.news.length + index.tutorials.length : 0) + ' 条内容。</p>';
      return;
    }
    if (!list.length) {
      box.innerHTML = '<p class="empty">没有找到匹配「' + escapeHtml(q) + '」的内容。</p>';
      return;
    }
    box.innerHTML = list
      .map(function (it) {
        return '<div class="search-item"><h3><span class="kind">' + (KIND[it.t] || '') + '</span>' +
          '<a href="' + it.url + '">' + escapeHtml(it.title) + '</a></h3>' +
          '<p>' + escapeHtml(it.sub || '') + '</p></div>';
      })
      .join('');
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function search(q) {
    var all = [];
    for (var k in index) if (Object.prototype.hasOwnProperty.call(index, k)) all = all.concat(index[k]);
    var needle = q.toLowerCase();
    return all
      .filter(function (it) {
        return (
          (it.title || '').toLowerCase().indexOf(needle) > -1 ||
          (it.sub || '').toLowerCase().indexOf(needle) > -1 ||
          (it.tags || []).join(' ').toLowerCase().indexOf(needle) > -1
        );
      })
      .slice(0, 80);
  }

  var INDEX_URL = new URL('assets/search-index.json', document.baseURI).href;
  fetch(INDEX_URL)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      index = data;
      var params = new URLSearchParams(window.location.search);
      var q = (params.get('q') || '').trim();
      if (q) {
        input.value = q;
        render(search(q), q);
      } else {
        render([], '');
      }
    })
    .catch(function () {
      box.innerHTML = '<p class="empty">搜索索引加载失败。</p>';
    });

  var timer = null;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var q = input.value.trim();
      if (!index) return;
      render(search(q), q);
    }, 120);
  });
})();
