/* 全站交互脚本：主题切换、移动端菜单、搜索建议。 */
(function () {
  'use strict';

  // 主题切换
  var themeBtn = document.getElementById('theme-btn');
  function syncThemeBtn() {
    if (!themeBtn) return;
    var dark = document.documentElement.classList.contains('dark');
    themeBtn.textContent = dark ? '☀️' : '🌙';
    themeBtn.title = dark ? '切换为浅色模式' : '切换为深色模式';
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var dark = document.documentElement.classList.contains('dark');
      if (dark) document.documentElement.classList.remove('dark');
      else document.documentElement.classList.add('dark');
      try { localStorage.setItem('gth-theme', dark ? 'light' : 'dark'); } catch (e) {}
      syncThemeBtn();
    });
  }
  syncThemeBtn();

  // 移动端侧边栏
  var menuBtn = document.getElementById('menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      document.body.classList.toggle('sidebar-open');
    });
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('sidebar-open')) return;
      if (e.target.closest('#sidebar') || e.target.closest('#menu-btn')) return;
      document.body.classList.remove('sidebar-open');
    });
  }

  // 顶部搜索：回车/点击跳转搜索页
  var searchInput = document.getElementById('header-search');
  var BASE = window.GTH_BASE || '/';
  if (searchInput) {
    var form = searchInput.closest('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        var q = (searchInput.value || '').trim();
        if (!q) { e.preventDefault(); return; }
        window.location.href = BASE + 'search.html?q=' + encodeURIComponent(q);
        e.preventDefault();
      });
    }
  }

  // 工具卡片补 data-cat（供筛选使用）
  var cards = document.querySelectorAll('.tool-grid-all .tool-card');
  if (cards.length) {
    // 卡片内已含分类信息的场景不做处理，保持零额外请求。
  }
})();
