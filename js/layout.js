/* LUMIÈRE MPA — layout dùng lại 100% class/css gốc (css/main.css). */
(function (root) {
'use strict';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (root.Lumiere && root.Lumiere.money) || (n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n));
const icons = {
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
  heart: '<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 0 9 8 15 8-6 12-11 8-15Z"/>',
  bag: '<path d="M5 7h14l2 15H3L5 7Z"/><path d="M8 8V5a4 4 0 0 1 8 0v3"/>',
  arrow: '<path d="M3 12h18m-6-6 6 6-6 6"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  check: '<path d="m5 12 4 4L20 5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>'
};
const icon = n => `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">${icons[n] || icons.arrow}</svg>`;
const statuses = { pending: 'Chưa xác nhận', confirmed: 'Đã xác nhận', delivered: 'Đã giao thành công', cancelled: 'Đã hủy' };
const campaigns = ['Diamond Radiance', 'Golden Heritage', 'Eternal Love', 'Rose Éclat', 'Modern Muse'];

function siteHeader(D, active) {
  const u = D.users.find(u => u.id === D.buyerId);
  const cats = (root.Lumiere ? root.Lumiere.categories : ['Nhẫn', 'Nhẫn cưới', 'Dây chuyền', 'Bông tai', 'Lắc tay']);
  const navCat = cats.map(c => `<a class="${active === 'catalog' ? 'active' : ''}" href="catalog.html">${esc(c)}</a>`).join('');
  return `<div class="topline">Vẻ đẹp vượt thời gian <span>Giao hàng tận nơi · Hộp quà tinh tế</span></div><header><div class="mast"><form id="quick-search" class="search" action="search.html" method="get"><input aria-label="Tìm trang sức" name="q" placeholder="Tìm món trang sức của bạn…"><button class="btn" type="submit">Tìm kiếm</button></form><a class="logo" href="index.html"><strong>LUMIÈRE</strong><small>J E W E L R Y</small></a><div class="header-actions"><a class="${active === 'account' ? 'active' : ''}" href="${u ? 'account.html' : 'login.html'}">${icon('user')}<span>${u ? esc(u.name.split(' ')[0]) : 'Tài khoản'}</span></a><a class="${active === 'wishlist' ? 'active' : ''}" href="wishlist.html">${icon('heart')}<span>Yêu thích</span></a><a class="${active === 'cart' ? 'active' : ''}" href="cart.html">${icon('bag')}<span>Giỏ hàng</span><b>${D.cart.reduce((n, c) => n + c.qty, 0)}</b></a><button class="icon mobile-menu" id="menu-btn" aria-label="Mở menu">${icon('menu')}</button></div></div><nav id="main-nav" aria-label="Điều hướng chính"><a href="index.html">Trang chủ</a><a href="catalog.html">Tất cả trang sức</a>${navCat}<a href="collections.html">Bộ sưu tập</a><a href="about.html">Câu chuyện LUMIÈRE</a></nav></header>`;
}
function siteFooter() {
  const up = (typeof location !== 'undefined' && /^\/(user|admin)\//.test(location.pathname.replace(/\\/g,'/'))) || (typeof document !== 'undefined' && document.querySelector('link[href^="../css/"]'));
  const adminLogin = up ? '../admin/admin-login.html' : 'admin/admin-login.html';
  return `<section class="newsletter"><div><span class="eyebrow">THƯ TỪ LUMIÈRE</span><h2>Một chút lấp lánh trong hộp thư.</h2></div><form id="newsletter" novalidate><label class="sr" for="news-email">Email</label><input id="news-email" name="email" type="email" required placeholder="Địa chỉ email của bạn"><button aria-label="Đăng ký nhận tin">${icon('arrow')}</button><small>Hãy để LUMIÈRE giúp bạn tìm ra sự phù hợp</small></form></section><footer><div><div class="logo"><strong>LUMIÈRE</strong><small>J E W E L R Y</small></div><p>Vẻ đẹp vượt thời gian.<br>Những thiết kế dành cho câu chuyện của bạn.</p></div><div><h4>Khám phá</h4><a href="catalog.html">Trang sức</a><a href="collections.html">Bộ sưu tập</a><a href="about.html">Câu chuyện thương hiệu</a></div><div><h4>Chăm sóc khách hàng</h4><a href="guide.html">Hướng dẫn chọn size</a><a href="policy.html">Giao hàng & bảo hành</a><a href="orders.html">Đơn hàng của bạn</a></div><div><h4>Không gian làm việc</h4><a href="${adminLogin}">Quản trị cửa hàng</a><p>Đồng hành cùng bạn trên hành trình của sự lựa chọn.</p></div><div class="copyright">© 2026 LUMIÈRE JEWELRY <span>Timeless Elegance</span></div></footer>`;
}
function adminShell(active, content, title) {
  const items = [['admin-dashboard.html', 'dashboard', 'Tổng quan'], ['admin-products.html', 'products', 'Sản phẩm'], ['admin-users.html', 'users', 'Khách hàng'], ['admin-orders.html', 'orders', 'Đơn hàng'], ['admin-stats.html', 'stats', 'Top 5 khách hàng']];
  return `<div class="admin-layout"><aside class="admin-sidebar"><a class="logo" href="../user/index.html"><strong>LUMIÈRE</strong><small>QUẢN TRỊ CỬA HÀNG</small></a><nav>${items.map(([href, key, label]) => `<a href="${href}" class="${active === key ? 'selected' : ''}">${label}</a>`).join('')}</nav><div><a href="../user/index.html">← Về cửa hàng</a><button data-act="admin-logout">Đăng xuất</button></div></aside><div class="admin-main" id="main" tabindex="-1"><div class="admin-top"><div><span class="eyebrow">LUMIÈRE / ADMIN</span><h1>${esc(title || 'Quản trị')}</h1></div></div>${content || '<p>Trang không tồn tại.</p>'}</div></div>`;
}
function toast(msg) { successPopup(msg, 'Thông báo'); }
/* Demo UI/UX: popup thành công góc trên bên phải, xếp chồng, tự tắt sau ~2.4s. */
function hideSuccess(id) {
  const stack = document.querySelector('#success-toast-stack');
  if (!stack) return;
  if (id) { const el = stack.querySelector(`[data-toast="${id}"]`); if (el) el.classList.remove('show'); return; }
  stack.querySelectorAll('.success-popup.show').forEach(el => el.classList.remove('show'));
}
function successPopup(msg, title) {
  let stack = document.querySelector('#success-toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.id = 'success-toast-stack';
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
    stack.addEventListener('click', e => { const btn = e.target.closest('.success-close'); if (btn) btn.closest('.success-popup')?.classList.remove('show'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hideSuccess(); });
  }
  const id = 't' + Date.now() + Math.floor(Math.random() * 1e4);
  const el = document.createElement('div');
  el.className = 'success-popup';
  el.dataset.toast = id;
  el.setAttribute('role', 'status');
  el.innerHTML = `<span class="success-tick">${icon('check')}</span><div class="success-copy"><h3></h3><p></p></div><button class="success-close icon" type="button" aria-label="Đóng thông báo">${icon('close')}</button><span class="success-bar"></span>`;
  el.querySelector('h3').textContent = title || 'Thành công';
  el.querySelector('p').textContent = msg || 'Thao tác đã hoàn tất.';
  stack.appendChild(el);
  while (stack.children.length > 4) stack.firstChild.remove();
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2400);
}
function confirmModal(html) { const d = document.querySelector('#dialog'); if (!d) return; d.innerHTML = `<button class="dialog-close icon" id="dialog-close" aria-label="Đóng">${icon('close')}</button>${html}`; if (typeof d.showModal === 'function' && !d.open) d.showModal(); const c = d.querySelector('#dialog-close'); if (c) c.onclick = () => d.close(); }
function closeModal() { const d = document.querySelector('#dialog'); if (d && d.open) d.close(); }

root.LumiereLayout = { esc, money, icon, icons, statuses, campaigns, siteHeader, siteFooter, adminShell, toast, successPopup, hideSuccess, confirmModal, closeModal };
})(typeof window === 'undefined' ? globalThis : window);
