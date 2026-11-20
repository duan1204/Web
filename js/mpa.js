/* LUMIERE MPA — logic giong TCG: nhieu trang tinh, khong popup xem/sua, giu nguyen class CSS goc. */
(function () {
'use strict';
/* LUMIERE MPA — giu don/gio qua chuyen trang bang sessionStorage (dong tab la reset). */
const S = Lumiere.createStore({ storage: (() => { try { return sessionStorage; } catch { return null; } })() });
const D = S.db;
const L = window.LumiereLayout;
const esc = L.esc, money = L.money, icon = L.icon, statuses = L.statuses, campaigns = L.campaigns;
const $ = s => document.querySelector(s);
const q = new URLSearchParams(location.search);
let PAGE_IS_ADMIN = (document.body.dataset.page || '').startsWith('admin-');
const ASSET_BASE = PAGE_IS_ADMIN ? '../' : '';
const asset = p => { if (!p) return p; if (/^(data:|https?:\/\/|\/)/.test(p)) return p; if (p.startsWith('../')) return p; if (PAGE_IS_ADMIN && p.startsWith('assets/')) return '../' + p; return p; };
const A = (href, label, cls) => `<a class="${cls || ''}" href="${href}">${label}</a>`;
const opt = (values, selected, blank) => (blank ? `<option value="">${blank}</option>` : '') + values.map(v => `<option value="${esc(v)}" ${v === selected ? 'selected' : ''}>${esc(v)}</option>`).join('');
const field = (label, name, value, type, extra) => `<label>${label}<input name="${name}" type="${type || 'text'}" value="${esc(value ?? '')}" ${extra || ''}></label>`;
const empty = (title, desc, action) => `<div class="empty"><span class="eyebrow">LUMIÈRE JEWELRY</span><h2>${title}</h2><p>${desc}</p>${action || A('catalog.html', 'Khám phá trang sức', 'btn')}</div>`;
const toast = L.toast;
const success = (msg, title) => { try { L.successPopup(msg, title || 'Thành công'); } catch { toast(msg); } };
const flash = (msg, title) => { try { sessionStorage.setItem('lumiere_success', msg); sessionStorage.setItem('lumiere_success_title', title || 'Thành công'); } catch {} };
let uploadImage = '', uploadVersion = 0, pendingCart = null;
function qrSVG(total){let seed=(+total||0)%233280+12345;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280;};const n=25,s=180/n;let cells='';for(let y=0;y<n;y++)for(let x=0;x<n;x++){const inFinder=(x<7&&y<7)||(x>=n-7&&y<7)||(x<7&&y>=n-7);if(inFinder)continue;if(rnd()>0.5)cells+=`<rect x="${(x*s).toFixed(1)}" y="${(y*s).toFixed(1)}" width="${(s+.4).toFixed(1)}" height="${(s+.4).toFixed(1)}"/>`;}const finder=(ox,oy)=>`<rect x="${ox*s}" y="${oy*s}" width="${7*s}" height="${7*s}" fill="#fff" stroke="currentColor" stroke-width="${s}"/><rect x="${(ox+2)*s}" y="${(oy+2)*s}" width="${3*s}" height="${3*s}"/>`;return `<svg class="qr-img" viewBox="0 0 180 180" role="img" aria-label="Mã QR thanh toán demo" style="width:180px;height:180px;background:#fff;padding:8px;border:1px solid var(--line)"><rect width="180" height="180" fill="#fff"/><g fill="currentColor">${cells}${finder(0,0)}${finder(n-7,0)}${finder(0,n-7)}</g><text x="90" y="172" text-anchor="middle" font-size="9">LUMIÈRE · DEMO</text></svg>`;}

function card(p) {
  return `<article class="product"><div class="product-image">${A('product.html?id=' + p.id, `<img src="${esc(asset(p.image))}" alt="${esc(p.name)}" loading="lazy">`)}<span class="tag">${p.isNew ? 'MỚI · ' : ''}${esc(p.collection)}</span><button class="favorite ${D.favorites.includes(p.id) ? 'active' : ''}" aria-pressed="${D.favorites.includes(p.id)}" data-act="favorite" data-id="${p.id}" aria-label="${D.favorites.includes(p.id) ? 'Bỏ' : 'Thêm'} yêu thích ${esc(p.name)}">${icon('heart')}</button><button class="quick-add" data-act="quick-add" data-id="${p.id}">Khám phá thiết kế ${icon('arrow')}</button></div><small>${esc(p.material)}</small><h3>${A('product.html?id=' + p.id, esc(p.name))}</h3><div class="price">${money(p.price)}</div></article>`;
}
const grid = ps => `<div class="products">${ps.map(card).join('')}</div>`;
const section = (title, subtitle, ps, url) => `<section class="section"><div class="section-heading"><div><span class="eyebrow">${subtitle}</span><h2>${title}</h2></div>${A(url || 'catalog.html', 'Khám phá tất cả ' + icon('arrow'), 'text-link')}</div>${grid(ps)}</section>`;
function bestSellers(ps) { const sold = {}; for (const o of D.orders.filter(o => o.status !== 'cancelled')) for (const i of o.items) sold[i.productId] = (sold[i.productId] || 0) + i.qty; return ps.filter(p => sold[p.id]).sort((a, b) => sold[b.id] - sold[a.id]).slice(0, 4); }
const collectionCard = i => A('catalog.html', `<img src="${ASSET_BASE}assets/banners/b0${i + 1}.png" alt="${campaigns[i]}"><div><small>THE COLLECTION</small><h3>${campaigns[i]}</h3><span>Khám phá ${icon('arrow')}</span></div>`, 'collection-card');
function orderDetail(o) {
  return `<div class="order-head"><div><span class="eyebrow">ĐƠN HÀNG</span><h2>${o.id}</h2></div><span class="status ${o.status}">${statuses[o.status]}</span></div><p>Ngày đặt: ${new Date(o.date).toLocaleString('vi-VN')}</p><p><strong>${esc(o.name)}</strong> · ${esc(o.phone)} · ${esc(o.email || '')}<br>${esc(o.address)}, ${esc(o.region)}</p><p>Chi trả: ${o.payment === 'qr' ? 'Quét mã QR (mô phỏng, chưa có giao dịch ngân hàng)' : 'Tiền mặt khi nhận hàng'}</p>${o.items.map(c => `<div class="cart-row"><img src="${esc(asset(c.image))}" alt="${esc(c.name)}"><div><h3>${esc(c.name)}</h3><small>Size ${esc(c.size)} · ${c.qty} × ${money(c.price)}</small></div><strong>${money(c.qty * c.price)}</strong></div>`).join('')}<div class="total">Tổng giá trị <b>${money(o.total)}</b></div>`;
}
function orderTable(list) {
  return `<div class="table-wrap"><table><thead><tr><th>Mã đơn / ngày</th><th>Khách hàng</th><th>Khu vực</th><th>Tổng tiền</th><th>Trạng thái</th><th>Chi tiết</th></tr></thead><tbody>${list.map(o => `<tr><td>${o.id}<small>${new Date(o.date).toLocaleDateString('vi-VN')}</small></td><td>${esc(o.name)}</td><td>${esc(o.region)}</td><td>${money(o.total)}</td><td><span class="status ${o.status}">${statuses[o.status]}</span></td><td>${A('admin-order-detail.html?id=' + encodeURIComponent(o.id), 'Xem đơn →')}</td></tr>`).join('')}</tbody></table>${!list.length ? '<p class="empty">Không có đơn hàng phù hợp.</p>' : ''}</div>`;
}

/* ---------- storefront pages ---------- */
function homeHTML() {
  const ps = S.filterProducts();
  return `<section class="hero" aria-label="Bộ sưu tập nổi bật">${campaigns.map((c, i) => `<div class="slide ${i === 0 ? 'active' : ''} ${i === 4 ? 'dark' : ''}"><img src="${ASSET_BASE}assets/banners/b0${i + 1}.png" alt="Chiến dịch ${c}"><div class="hero-copy"><span class="eyebrow">LUMIÈRE COLLECTION · 2026</span><h1>${['Ánh sáng <br> của riêng bạn', 'Dấu ấn vàng <br> Khẳng định vẻ đẹp', 'Một lời hẹn <br> Một đời bên nhau', 'Dịu dàng <br> theo cách riêng', 'Sắc màu tinh hoa <br> Nâng tầm chiều sâu'][i]}</h1><p>${['Vẻ đẹp thuần khiết bằng những đường nét <br> vượt thời gian', 'Những đường cong điêu khắc dành cho phong cách không thể trộn lẫn', 'Gửi lời yêu vào đôi nhẫn cùng lưu giữ <br> khoảnh khắc chung đôi.', 'Sắc vàng hồng cùng đường nét tự do <br> dành riêng cho bạn.', 'Rực rỡ - Đương đại - Đầy cuốn hút.'][i]}</p>${A('catalog.html', 'Khám phá bộ sưu tập ' + icon('arrow'), 'btn')}</div></div>`).join('')}</section><div class="promises"><span>Chế tác tinh xảo</span><span>Thiết kế mang dấu ấn riêng</span><span>Gói quà đầy trân trọng</span><span>Đồng hành cùng khoảnh khắc</span></div><section class="section categories"><div class="center"><span class="eyebrow">TÌM THẤY ĐIỀU BẠN MONG MUỐN</span><h2>Mỗi món trang sức là một câu chuyện</h2></div><div class="category-grid">${S.categories.map((c) => { const p = D.products.find(p => p.category === c); return A('catalog.html', `<img src="${esc(asset(p ? p.image : 'assets/products/p01.png'))}" alt="${c}"><span>${c} ${icon('arrow')}</span>`); }).join('')}</div></section>${section('Những thiết kế được yêu thích', 'THE LUMIÈRE EDIT', ps.slice(0, 4))}${section('Thiết kế bán chạy', 'CÁC ĐƠN HÀNG', bestSellers(ps))}<section class="editorial"><img src="${ASSET_BASE}assets/banners/b03.png" alt="Cặp nhẫn cưới trên lụa"><div><span class="eyebrow">ETERNAL LOVE</span><h2>Một lời hẹn <br> Một đời bên nhau</h2><p>Không chỉ là một đôi nhẫn. <br> Đó là lời hứa được trao đi về hành trình bắt đầu từ hai trái tim.</p>${A('catalog.html', 'Khám phá trang sức cưới ' + icon('arrow'), 'btn light')}</div></section>${section('Vẻ đẹp vừa chạm ngõ', 'THIẾT KẾ MỚI', ps.slice(-4), 'catalog.html')}<section class="section"><div class="section-heading"><div><span class="eyebrow">NĂM SẮC THÁI - MỘT TINH THẦN</span><h2>Thế giới LUMIÈRE</h2></div>${A('collections.html', 'Tất cả bộ sưu tập ' + icon('arrow'), 'text-link')}</div><div class="collection-grid">${[1, 3, 4].map(collectionCard).join('')}</div></section>${section('Ánh vàng lưu dấu', 'GOLDEN HERITAGE', ps.filter(p => p.material === 'Vàng vàng 18K').slice(0, 4), 'catalog.html')}${section('Lấp lánh từng khoảnh khắc', 'DIAMOND RADIANCE', ps.filter(p => p.collection === 'Diamond Radiance').slice(0, 4), 'catalog.html')}`;
}
function catalogHTML() {
  const f = Object.fromEntries(q), page = Math.max(1, +f.page || 1);
  if (f.min && f.max && +f.min > +f.max) return empty('Khoảng giá chưa hợp lệ', 'Giá tối thiểu không được lớn hơn giá tối đa.', A('catalog.html', 'Đặt lại bộ lọc', 'btn'));
  const ps = S.filterProducts({ ...f, q: '' }), pages = Math.max(1, Math.ceil(ps.length / 8)), actual = 1;
  const qs = extra => { const nq = new URLSearchParams(q); for (const k in extra) nq.set(k, extra[k]); return 'catalog.html?' + nq; };
  return `<section class="page"><div class="page-title"><span class="eyebrow">THE JEWELRY COLLECTION</span><h1>${esc(f.category || f.collection || 'Trang sức LUMIÈRE')}</h1><p>Chọn một thiết kế - Kể câu chuyện của riêng bạn</p></div><form id="filters" class="filters" method="get" action="search.html">${field('Tìm theo tên', 'q', f.q || '', 'search')}<label>Phân loại<select name="category">${opt(S.categories, f.category, 'Tất cả danh mục')}</select></label>${field('Giá từ (₫)', 'min', f.min || '', 'number', 'min="0"')}${field('Đến (₫)', 'max', f.max || '', 'number', 'min="0"')}<label>Sắp xếp<select name="sort"><option value="">Nổi bật</option><option value="asc" ${f.sort === 'asc' ? 'selected' : ''}>Giá tăng dần</option><option value="desc" ${f.sort === 'desc' ? 'selected' : ''}>Giá giảm dần</option><option value="new" ${f.sort === 'new' ? 'selected' : ''}>Mới nhất</option></select></label><input type="hidden" name="collection" value="${esc(f.collection || '')}"><button class="btn">Áp dụng</button>${A('catalog.html', 'Xóa bộ lọc', 'text-link')}</form><div class="results">${ps.length} thiết kế ${f.collection ? '· ' + esc(f.collection) : ''}</div>${ps.length ? grid(ps.slice((actual - 1) * 8, actual * 8)) : empty('Chưa tìm thấy thiết kế phù hợp', 'Hãy thử từ khóa ngắn hơn hoặc mở rộng khoảng giá.')}<div class="pagination">${Array.from({ length: pages }, (_, i) => A(qs({ page: i + 1 }), i + 1, i + 1 === actual ? 'active' : '')).join('')}</div></section>`;
}
function searchHTML() {
  const f = Object.fromEntries(q), page = Math.max(1, +f.page || 1);
  if (f.min && f.max && +f.min > +f.max) return empty('Khoảng giá chưa hợp lệ', 'Giá tối thiểu không được lớn hơn giá tối đa.', A('search.html', 'Đặt lại bộ lọc', 'btn'));
  const searchQ = String(f.q || '').trim();
  const ps = S.filterProducts({ ...f, q: '' }), pages = Math.max(1, Math.ceil(ps.length / 8)), actual = 1;
  const searchNotice = searchQ ? `<p class="note success-note">Tìm kiếm thành công cho từ khóa “${esc(searchQ)}”.</p>` : `<p class="note">Nhập tên sản phẩm để tìm kiếm.</p>`;
  const qs = extra => { const nq = new URLSearchParams(q); for (const k in extra) nq.set(k, extra[k]); return 'search.html?' + nq; };
  return `<section class="page"><div class="page-title"><span class="eyebrow">KẾT QUẢ TÌM KIẾM</span><h1>Tìm kiếm sản phẩm</h1><p>Khám phá thiết kế dành cho bạn</p></div>${searchNotice}<form id="search-filters" class="filters" method="get" action="search.html">${field('Tìm theo tên', 'q', f.q || '', 'search')}<label>Phân loại<select name="category">${opt(S.categories, f.category, 'Tất cả danh mục')}</select></label>${field('Giá từ (₫)', 'min', f.min || '', 'number', 'min="0"')}${field('Đến (₫)', 'max', f.max || '', 'number', 'min="0"')}<label>Sắp xếp<select name="sort"><option value="">Nổi bật</option><option value="asc" ${f.sort === 'asc' ? 'selected' : ''}>Giá tăng dần</option><option value="desc" ${f.sort === 'desc' ? 'selected' : ''}>Giá giảm dần</option><option value="new" ${f.sort === 'new' ? 'selected' : ''}>Mới nhất</option></select></label><input type="hidden" name="collection" value="${esc(f.collection || '')}"><button class="btn">Tìm kiếm</button>${A('search.html', 'Xóa bộ lọc', 'text-link')}</form><div class="results">${ps.length} thiết kế ${f.collection ? '· ' + esc(f.collection) : ''}</div>${ps.length ? grid(ps.slice((actual - 1) * 8, actual * 8)) : empty('Chưa tìm thấy thiết kế phù hợp', 'Hãy thử từ khóa ngắn hơn hoặc mở rộng khoảng giá.')}<div class="pagination">${Array.from({ length: pages }, (_, i) => A(qs({ page: i + 1 }), i + 1, i + 1 === actual ? 'active' : '')).join('')}</div></section>`;
}
function productHTML() {
  const p = D.products.find(p => !p.hidden);
  if (!p) return empty('Thiết kế không còn được bán', 'Bạn có thể khám phá những thiết kế khác.');
  return `<section class="page"><div class="breadcrumb">${A('index.html', 'Trang chủ')} / ${A('catalog.html', esc(p.category))} / LM-${String(p.id).padStart(4, '0')}</div><div class="detail"><div class="gallery"><button class="main-image" data-act="zoom" data-id="${p.id}" aria-label="Phóng to ảnh"><img src="${esc(asset(p.image))}" alt="${esc(p.name)}"></button><small>Nhấn ảnh để xem lớn</small></div><div class="detail-copy"><span class="eyebrow">${esc(p.collection)}</span><h1>${esc(p.name)}</h1><small>Mã sản phẩm LM-${String(p.id).padStart(4, '0')}</small><p class="detail-price">${money(p.price)}</p><p>${esc(p.description)}</p><dl><dt>Chất liệu</dt><dd>${esc(p.material)}</dd><dt>Tình trạng</dt><dd>${p.stock > 0 ? 'Còn ' + p.stock + ' sản phẩm' : 'Tạm hết hàng'}</dd></dl><form id="add-cart" novalidate><input type="hidden" name="id" value="${p.id}"><div class="form-row"><label>Kích cỡ<select name="size">${opt(p.sizes)}</select></label>${field('Số lượng', 'qty', 1, 'number', `min="1" max="${p.stock}" required`)}</div>${p.category.includes('Nhẫn') ? A('guide.html', 'Hướng dẫn chọn size', 'text-link') : ''}<div class="buy-actions"><button class="btn" ${p.stock < 1 ? 'disabled' : ''}>Thêm vào giỏ ${icon('bag')}</button><button class="btn outline" name="buy" value="now" ${p.stock < 1 ? 'disabled' : ''}>Mua ngay</button></div></form><button class="text-link favorite-detail ${D.favorites.includes(p.id) ? 'active' : ''}" data-act="favorite" data-id="${p.id}">${icon('heart')} ${D.favorites.includes(p.id) ? 'Đã lưu yêu thích' : 'Lưu vào yêu thích'}</button><div class="detail-perks">Hộp quà đi kèm · Giao hàng tận nơi<br>${A('policy.html', 'Thông tin bảo hành & giao hàng')}</div></div></div><div class="details-info"><h2>Vẻ đẹp trong từng chi tiết</h2><p>${esc(p.description)} Bộ sưu tập ${esc(p.collection)} thể hiện tinh thần thanh lịch và cá tính của LUMIÈRE.</p></div>${section('Có thể bạn cũng yêu thích', 'A PERFECT MATCH', S.filterProducts({ category: p.category }).filter(x => x.id !== p.id).slice(0, 4))}</section>`;
}
function authHTML(isRegister, isAdmin) {
  return `<section class="auth"><div class="auth-art"><img src="${ASSET_BASE}assets/banners/b05.png" alt="Trang sức đá quý"><div class="logo"><strong>LUMIÈRE</strong><small>VẺ ĐẸP VƯỢT THỜI GIAN</small></div></div><div class="auth-form"><span class="eyebrow">${isAdmin ? 'KHÔNG GIAN QUẢN TRỊ' : 'CHÀO MỪNG ĐẾN LUMIÈRE'}</span><h1>${isRegister ? 'Bắt đầu câu chuyện của bạn' : isAdmin ? 'Đăng nhập quản trị' : 'Thật vui khi gặp lại bạn.'}</h1><form id="${isRegister ? 'register' : isAdmin ? 'admin-login' : 'login'}" novalidate>${isRegister ? field('Họ và tên', 'name', '', 'text', 'maxlength="80"') : ''}${field('Email hoặc tên đăng nhập', 'email', '', 'text', 'autocomplete="username"')}${field('Mật khẩu', 'password', '', 'password', 'autocomplete="' + (isRegister ? 'new-password' : 'current-password') + '"')}${isRegister ? field('Số điện thoại', 'phone', '', 'tel', '') + field('Địa chỉ', 'address', '', 'text', '') + field('Quận / huyện, tỉnh / thành phố', 'region', '', 'text', '') : ''}<p class="form-error" role="alert"></p><button class="btn">${isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</button></form>${!isAdmin ? `<p>${isRegister ? 'Bạn đã có tài khoản? ' + A('login.html', 'Đăng nhập') : 'Chưa có tài khoản? ' + A('register.html', 'Đăng ký ngay')}</p>` : ''}<details class="demo-help"><summary>Tài khoản</summary><p>${isAdmin ? 'admin@lumiere.vn / Admin123' : 'khach@lumiere.vn / Lumiere123'}</p><p>Chế độ demo: để trống hay nhập bất cứ gì cũng thành công.</p></details></div></section>`;
}
function accountHTML() {
  let u; try { u = S.buyer(); } catch { location.replace('login.html?redirect=' + encodeURIComponent(location.pathname.split('/').pop() + location.search)); return ''; }
  return `<section class="page narrow"><div class="page-title"><h1>Chào ${esc(u.name)}.</h1><p>${esc(u.email)}</p></div><div class="order-card"><h2>Thông tin cá nhân</h2>${A('account-edit.html', 'Chỉnh sửa hồ sơ', 'text-link')}<p>${esc(u.phone)}<br>${esc(u.address)}, ${esc(u.region)}</p><div class="actions">${A('orders.html', 'Lịch sử mua hàng', 'btn')}${A('wishlist.html', 'Thiết kế yêu thích', 'btn outline')}<button class="text-link" data-act="logout">Đăng xuất</button></div></div></section>`;
}
function accountEditHTML() {
  let u; try { u = S.buyer(); } catch { location.replace('login.html?redirect=account-edit.html'); return ''; }
  return `<section class="page narrow"><div class="page-title"><span class="eyebrow">YOUR PROFILE</span><h1>Chỉnh sửa hồ sơ</h1></div><div class="order-card"><form id="profile-form" novalidate>${field('Họ và tên', 'name', u.name, 'text', 'required maxlength="80"')}${field('Email hoặc tên đăng nhập', 'email', u.email, 'text', 'required')}${field('Số điện thoại', 'phone', u.phone, 'tel', 'required pattern="0[0-9]{9}"')}${field('Địa chỉ', 'address', u.address, 'text', 'required')}${field('Quận / huyện, tỉnh / thành phố', 'region', u.region, 'text', 'required')}<p class="form-error" role="alert"></p><div class="actions"><button class="btn">Lưu thay đổi</button>${A('account.html', 'Quay lại', 'btn outline')}</div></form></div></section>`;
}
function cartHTML() {
  if (!D.buyerId) { location.replace('login.html?redirect=cart.html'); return ''; }
  const lines = S.cartLines();
  return `<section class="page narrow"><div class="page-title"><span class="eyebrow">YOUR SELECTION</span><h1>Giỏ trang sức của bạn</h1></div>${A('catalog.html', 'Tiếp tục mua sắm', 'text-link')}${lines.length ? `<div class="cart-layout"><div>${lines.map((c, i) => `<div class="cart-row"><img src="${esc(asset(c.image))}" alt="${esc(c.name)}"><div><h3>${esc(c.name)}</h3><small>Size: ${esc(c.size)} · ${money(c.price)}</small>${!c.available ? '<p class="form-error">Sản phẩm không còn được bán. Vui lòng xóa khỏi giỏ.</p>' : ''}<div class="quantity"><button data-act="qty" data-id="${i}" data-value="${c.qty - 1}">−</button><span>${c.qty}</span><button data-act="qty" data-id="${i}" data-value="${c.qty + 1}">+</button><button class="remove" data-act="remove-cart" data-id="${i}">Xóa</button></div></div><strong>${money(c.price * c.qty)}</strong></div>`).join('')}</div><aside class="summary"><h2>Tóm tắt đơn hàng</h2><p>Tạm tính <b>${money(lines.reduce((s, c) => s + c.qty * c.price, 0))}</b></p><p>Giao hàng <b>Miễn phí</b></p><div class="total">Tổng cộng <b>${money(lines.reduce((s, c) => s + c.qty * c.price, 0))}</b></div>${A('checkout.html', 'Tiến hành đặt hàng ' + icon('arrow'), 'btn')}</aside></div>` : empty('Giỏ hàng đang chờ bạn', 'Một thiết kế đặc biệt đang đợi được khám phá')}</section>`;
}
function checkoutHTML() {
  let u; try { u = S.buyer(); } catch { location.replace('login.html?redirect=checkout.html' + encodeURIComponent(location.search)); return ''; }
  const buyNow = q.get('mode') === 'buy-now';
  let lines = [];
  if (buyNow) { try { const sel = JSON.parse(sessionStorage.getItem('lumiere_buy_now') || 'null'); if (sel && sel.userId === D.buyerId) lines = S.cartLines(sel.items); } catch {} }
  else lines = S.cartLines();
  if (!lines.length) return `<section class="page narrow">${empty('Giỏ hàng đang trống', 'Hãy chọn thiết kế trước khi đặt hàng.', A('catalog.html', 'Khám phá trang sức', 'btn'))}</section>`;
  const total = lines.reduce((s, c) => s + c.qty * c.price, 0);
  return `<section class="page narrow"><div class="page-title"><span class="eyebrow">GIỎ HÀNG / THÔNG TIN / HOÀN TẤT</span><h1>Hoàn thiện lời trao gửi</h1></div><form id="checkout" class="checkout" novalidate data-buynow="${buyNow ? '1' : ''}"><div><h2>Thông tin nhận hàng</h2><p>Đang mua với tài khoản <strong>${esc(u.name)}</strong> · ${esc(u.email)}</p><label>Địa chỉ giao hàng<select id="address-choice"><option value="saved">Dùng địa chỉ tài khoản</option><option value="new">Nhập địa chỉ mới</option></select></label><div class="form-row">${field('Người nhận', 'name', u.name, 'text', 'required maxlength="80" disabled')}${field('Điện thoại', 'phone', u.phone, 'tel', 'required pattern="0[0-9]{9}" disabled')}</div>${field('Email', 'email', u.email, 'email', 'required disabled')}${field('Số nhà, tên đường', 'address', u.address, 'text', 'required maxlength="200" disabled')}${field('Quận / huyện, tỉnh / thành phố', 'region', u.region, 'text', 'required maxlength="100" disabled')}<h2>Phương thức chi trả</h2><label class="radio"><input type="radio" name="payment" value="cash" checked> Tiền mặt khi nhận hàng</label><label class="radio"><input type="radio" name="payment" value="qr"> Quét mã QR (MoMo / ZaloPay / VietQR)</label><div class="qr-box" id="qr-box" hidden>${qrSVG(total)}<p><strong>Quét mã để thanh toán ${money(total)}</strong></p><p class="muted">Mã QR ảo demo — không phát sinh giao dịch thật.</p></div><p class="muted">Không nhập thông tin ngân hàng. Chọn quét mã chỉ ghi nhận lựa chọn, không xác nhận đã thanh toán.</p><p class="form-error" role="alert"></p></div><aside class="summary"><h2>Đơn hàng của bạn</h2>${lines.map(c => `<p>${esc(c.name)} × ${c.qty}<b>${money(c.qty * c.price)}</b></p>`).join('')}<div class="total">Tổng cộng <b>${money(total)}</b></div><button class="btn">Xác nhận đặt hàng ${icon('arrow')}</button><small>Thông tin đơn được lưu cục bộ trong trình duyệt.</small></aside></form></section>`;
}
function ordersHTML() {
  let u; try { u = S.buyer(); } catch { location.replace('login.html?redirect=orders.html'); return ''; }
  const id = q.get('id');
  const list = D.orders.filter(o => o.userId === u.id).slice().reverse();
  if (id) { const o = list.find(o => o.id === id); return `<section class="page narrow">${o ? orderDetail(o) + (o.status === 'pending' ? `<button class="btn outline" data-act="cancel-order" data-id="${esc(o.id)}">Hủy đơn hàng</button>` : '') + A('orders.html', 'Xem lịch sử mua hàng', 'btn outline') : empty('Không tìm thấy đơn hàng', 'Đơn này không thuộc tài khoản hiện tại.')}</section>`; }
  return `<section class="page narrow"><div class="page-title"><span class="eyebrow">YOUR LUMIÈRE JOURNEY</span><h1>Lịch sử mua hàng</h1></div>${list.length ? list.map(o => `<article class="order-card"><div class="order-head"><strong>${o.id} · ${new Date(o.date).toLocaleDateString('vi-VN')}</strong><span class="status ${o.status}">${statuses[o.status]}</span></div><p>${o.items.map(i => esc(i.name) + ' × ' + i.qty).join('<br>')}</p><div class="order-head"><b>${money(o.total)}</b>${A('order.html?id=' + encodeURIComponent(o.id), 'Xem chi tiết ' + icon('arrow'), 'text-link')}</div></article>`).join('') : empty('Chưa có đơn hàng', 'Hãy bắt đầu từ những lựa chọn của bạn ')}</section>`;
}
function successHTML() {
  let u; try { u = S.buyer(); } catch { location.replace('login.html'); return ''; }
  let o = D.orders.find(o => o.id === q.get('id') && o.userId === u.id);
  if (!o) { try { const last = JSON.parse(sessionStorage.getItem('lumiere_last_order') || 'null'); if (last && last.id === q.get('id') && last.userId === u.id) o = last; } catch {} }
  if (!o) return `<section class="page narrow">${empty('Không tìm thấy đơn hàng', 'Đơn này không thuộc tài khoản hiện tại.')}</section>`;
  return `<section class="page narrow"><div class="success"><span>${icon('check')}</span><h1>Chúc mừng quý khách đặt hàng thành công,</h1><p>LUMIERE-JEWELRY xin cảm ơn quý khách đã tin tưởng</p></div>${orderDetail(o)}${A('orders.html', 'Xem chi tiết đơn hàng', 'btn')}</section>`;
}
function wishlistHTML() {
  if (!D.buyerId) { location.replace('login.html?redirect=wishlist.html'); return ''; }
  const favIds = D.favorites.length ? D.favorites : [1];
  const ps = S.filterProducts().filter(p => favIds.includes(p.id));
  return `<section class="page"><div class="page-title"><h1>Những thiết kế bạn yêu thích</h1></div>${ps.length ? grid(ps) : empty('Chưa có thiết kế yêu thích', 'Chạm vào trái tim trên mỗi sản phẩm để lưu vào bộ sưu tập của bạn')}</section>`;
}
function collectionsHTML() { return `<section class="page"><div class="page-title"><span class="eyebrow">THE COLLECTIONS</span><h1>Năm sắc thái của vẻ đẹp.</h1></div><div class="collection-grid all">${campaigns.map((_, i) => collectionCard(i)).join('')}</div></section>`; }
function infoHTML(type) {
  const data = {
    about: ['Câu chuyện LUMIÈRE', 'Vẻ đẹp thuộc về bạn.', 'LUMIÈRE mang ý nghĩa “ánh sáng” — nguồn cảm hứng cho những thiết kế đề cao vẻ đẹp riêng của mỗi người. Chúng tôi kết hợp đường nét đương đại với tinh thần thanh lịch vượt thời gian.', '<h2>Từ ý tưởng đến chi tiết</h2><p>Mỗi bộ sưu tập bắt đầu bằng một cảm hứng.</p><p class="note">LUMIÈRE là thương hiệu bởi Liam Triệu.</p>'],
    guide: ['Cẩm nang chọn size', 'Vừa vặn để luôn thoải mái', 'Dùng một dải giấy mảnh quấn quanh ngón tay, đo chiều dài bằng milimét.', '<table><thead><tr><th>Size minh họa</th><th>Chu vi tham khảo</th></tr></thead><tbody><tr><td>10</td><td>50 mm</td></tr><tr><td>12</td><td>52 mm</td></tr><tr><td>14</td><td>54 mm</td></tr></tbody></table>'],
    policy: ['Dịch vụ LUMIÈRE', 'Trân trọng từng trải nghiệm', 'Các chính sách dựa theo bộ quy tắc LUMIÈRE.', '<h2>Giao hàng</h2><p>Miễn phí giao hàng, dự kiến 3–5 ngày làm việc.</p><h2>Bảo hành</h2><p>Hỗ trợ kiểm tra và làm sạch trong 12 tháng.</p>']
  };
  const d = data[type] || data.about;
  return `<section class="info-page"><img src="${ASSET_BASE}assets/banners/b02.png" alt="Thiết kế vàng LUMIÈRE"><article><span class="eyebrow">${d[0]}</span><h1>${d[1]}</h1><p class="lead">${d[2]}</p>${d[3]}${A('catalog.html', 'Khám phá trang sức', 'btn')}</article></section>`;
}

/* ---------- admin pages ---------- */
function needAdmin() { try { S.admin(); return true; } catch { location.replace('admin-login.html'); return false; } }
function adminProductsHTML() {
  const kw = q.get('q') || '';
  const searchQ = String(kw).trim();
  const ps = D.products;
  const searchNotice = searchQ ? `<p class="note success-note">Tìm kiếm thành công cho từ khóa “${esc(searchQ)}”.</p>` : '';
  return `<div class="toolbar"><form id="admin-search" method="get" action="admin-products.html">${field('Tìm sản phẩm', 'q', kw, 'search')}<button class="btn">Tìm</button></form>${A('admin-product-form.html', '+ Thêm sản phẩm', 'btn')}</div>${searchNotice}<div class="table-wrap"><table><thead><tr><th>Sản phẩm</th><th>Phân loại</th><th>Giá</th><th>Tồn kho</th><th>Hiển thị</th><th>Thao tác</th></tr></thead><tbody>${ps.map(p => `<tr><td><div class="table-product"><img src="${esc(asset(p.image))}" alt="${esc(p.name)}"><span>${esc(p.name)}<small>LM-${p.id}</small></span></div></td><td>${esc(p.category)}</td><td>${money(p.price)}</td><td>${p.stock}</td><td>${p.hidden ? 'Đã ẩn' : 'Đang bán'}</td><td><div class="actions">${A('admin-product-detail.html?id=' + p.id, 'Xem')}${A('admin-product-form.html?id=' + p.id, 'Sửa')}${p.hidden ? `<button data-act="show-product" data-id="${p.id}">Hiện lại</button>` : `<button data-act="hide-product" data-id="${p.id}">Ẩn</button><button data-act="delete-product" data-id="${p.id}">Xóa</button>`}</div></td></tr>`).join('')}</tbody></table>${!ps.length ? '<p>Không có sản phẩm phù hợp.</p>' : ''}</div>`;
}
function adminProductDetailHTML() {
  const p = D.products.find(p => !p.hidden) || D.products[0];
  if (!p) return empty('Không tìm thấy thiết kế', 'Kiểm tra lại mã sản phẩm.', A('admin-products.html', 'Danh sách thiết kế', 'btn'));
  return `<div class="admin-panel">${A('admin-products.html', '← Quay lại danh sách thiết kế', 'text-link')}<div class="order-head"><div><span class="eyebrow">THIẾT KẾ ${p.hidden ? '· ĐÃ ẨN' : '· ĐANG BÁN'}</span><h2>${esc(p.name)}</h2></div><span class="status ${p.hidden ? 'cancelled' : 'delivered'}">${p.hidden ? 'Đã ẩn' : 'Đang bán'}</span></div><div class="detail"><div class="gallery"><span class="main-image"><img src="${esc(asset(p.image))}" alt="${esc(p.name)}"></span></div><div class="detail-copy"><small>Mã sản phẩm LM-${p.id} · SKU ${esc(p.sku || ('LM-' + String(p.id).padStart(4, '0')))}</small><p class="detail-price">${money(p.price)}</p><p>${esc(p.description || '')}</p><dl><dt>Phân loại</dt><dd>${esc(p.category)}</dd><dt>Bộ sưu tập</dt><dd>${esc(p.collection || '')}</dd><dt>Chất liệu</dt><dd>${esc(p.material || '')}</dd><dt>Tồn kho</dt><dd>${p.stock}</dd></dl><div class="actions">${A('admin-product-form.html?id=' + p.id, 'Sửa thiết kế', 'btn')}${p.hidden ? `<button data-act="show-product" data-id="${p.id}">Hiện lại</button>` : `<button data-act="hide-product" data-id="${p.id}">Ẩn</button><button class="btn outline" data-act="delete-product" data-id="${p.id}">Xóa</button>`}</div></div></div></div>`;
}
function adminProductFormHTML() {
  const id = q.get('id'), p = id ? D.products.find(p => p.id === +id) || {} : {};
  if (id && !p.id) return empty('Không tìm thấy thiết kế', 'Kiểm tra lại mã sản phẩm.', A('admin-products.html', 'Danh sách thiết kế', 'btn'));
  uploadImage = p.image || ''; uploadVersion++;
  return `<div class="admin-panel">${A('admin-products.html', '← Quay lại danh sách thiết kế', 'text-link')}<h2>${p.id ? 'Sửa thiết kế' : 'Thêm thiết kế mới'}</h2><form id="product-form" novalidate><input type="hidden" name="id" value="${p.id || ''}">${field('Tên sản phẩm', 'name', p.name || '', 'text', 'required maxlength="120"')}<div class="form-row"><label>Phân loại<select name="category">${opt(S.categories, p.category)}</select></label><label>Bộ sưu tập<select name="collection">${opt(campaigns, p.collection)}</select></label></div><div class="form-row">${field('Giá bán (₫)', 'price', p.price || '', 'number', 'required min="1" step="1"')}${field('Tồn kho', 'stock', p.stock ?? 10, 'number', 'required min="0" step="1"')}</div>${field('Chất liệu', 'material', p.material || '', 'text', 'required')}<label>Mô tả<textarea name="description" required maxlength="800">${esc(p.description || '')}</textarea></label><label>Ảnh sản phẩm (PNG, JPEG hoặc WebP · tối đa 8 MB)<input id="product-upload" type="file" accept="image/png,image/jpeg,image/webp" ${p.id ? '' : 'required'}></label><div id="upload-preview">${p.image ? `<img src="${esc(asset(p.image))}" alt="Ảnh hiện tại">` : 'Chọn ảnh để xem trước'}</div><p class="form-error" role="alert"></p><div class="actions"><button class="btn">${p.id ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button>${A(p.id ? 'admin-product-detail.html?id=' + p.id : 'admin-products.html', 'Quay lại', 'btn outline')}</div></form></div>`;
}
function adminUsersHTML() {
  const kw = q.get('q') || '';
  const searchQ = String(kw).trim();
  const customers = D.users.filter(u => u.role === 'customer');
  const searchNotice = searchQ ? `<p class="note success-note">Tìm kiếm thành công cho từ khóa “${esc(searchQ)}”.</p>` : '';
  return `<div class="toolbar"><form id="admin-user-search" method="get" action="admin-users.html">${field('Tìm khách hàng', 'q', kw, 'search')}<button class="btn">Tìm</button></form>${A('admin-user-form.html', '+ Thêm khách hàng', 'btn')}</div>${searchNotice}<p>${customers.length} tài khoản khách hàng</p><div class="table-wrap"><table><thead><tr><th>Khách hàng</th><th>Email</th><th>Điện thoại</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${customers.map(u => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.phone)}</td><td><span class="status ${u.locked ? 'cancelled' : 'delivered'}">${u.locked ? 'Đã khóa' : 'Hoạt động'}</span></td><td><div class="actions">${A('admin-user-detail.html?id=' + u.id, 'Xem')}${A('admin-user-form.html?id=' + u.id, 'Sửa')}<button data-act="lock-user" data-id="${u.id}">${u.locked ? 'Mở khóa' : 'Khóa'}</button></div></td></tr>`).join('')}</tbody></table></div>`;
}
function adminUserDetailHTML() {
  const u = D.users.find(u => u.id === +q.get('id') && u.role === 'customer');
  if (!u) return empty('Không tìm thấy khách hàng', 'Kiểm tra lại tài khoản.', A('admin-users.html', 'Danh sách khách hàng', 'btn'));
  const list = D.orders.filter(o => o.userId === u.id).slice().reverse();
  return `<div class="admin-panel">${A('admin-users.html', '← Quay lại danh sách khách hàng', 'text-link')}<div class="order-head"><div><span class="eyebrow">KHÁCH HÀNG</span><h2>${esc(u.name)}</h2></div><span class="status ${u.locked ? 'cancelled' : 'delivered'}">${u.locked ? 'Đã khóa' : 'Hoạt động'}</span></div><p><strong>${esc(u.email)}</strong> · ${esc(u.phone || '')}</p><p>${esc(u.address || '')}${u.address && u.region ? ', ' : ''}${esc(u.region || '')}</p><div class="actions">${A('admin-user-form.html?id=' + u.id, 'Sửa khách hàng', 'btn')}<button class="btn ${u.locked ? '' : 'outline'}" data-act="lock-user" data-id="${u.id}">${u.locked ? 'Mở khóa' : 'Khóa'}</button></div></div><div class="admin-panel"><h2>Lịch sử đơn hàng</h2>${orderTable(list)}</div>`;
}
function adminUserFormHTML() {
  const id = q.get('id'), u = id ? D.users.find(u => u.id === +id) || {} : {};
  if (id && !u.id) return empty('Không tìm thấy khách hàng', 'Kiểm tra lại tài khoản.', A('admin-users.html', 'Danh sách khách hàng', 'btn'));
  return `<div class="admin-panel">${A('admin-users.html', '← Quay lại danh sách khách hàng', 'text-link')}<h2>${u.id ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng'}</h2><form id="user-form" novalidate><input type="hidden" name="id" value="${u.id || ''}">${field('Họ và tên', 'name', u.name || '', 'text', 'required')}${field('Email hoặc tên đăng nhập', 'email', u.email || '', 'text', 'required')}${field(u.id ? 'Mật khẩu mới (bỏ trống để giữ nguyên)' : 'Mật khẩu', 'password', '', 'password', u.id ? '' : 'required')}${field('Số điện thoại', 'phone', u.phone || '', 'tel', 'required pattern="0[0-9]{9}"')}${field('Địa chỉ', 'address', u.address || '')}${field('Quận / huyện, tỉnh / thành phố', 'region', u.region || '')}<p class="form-error" role="alert"></p><div class="actions"><button class="btn">Lưu tài khoản</button>${A(u.id ? 'admin-user-detail.html?id=' + u.id : 'admin-users.html', 'Quay lại', 'btn outline')}</div></form></div>`;
}
function adminDashboardHTML() {
  const valid = D.orders.filter(o => o.status !== 'cancelled');
  return `<div class="metrics"><article><small>GIÁ TRỊ ĐƠN KHÔNG HỦY</small><h2>${money(valid.reduce((s, o) => s + o.total, 0))}</h2></article><article><small>ĐƠN HÀNG</small><h2>${D.orders.length}</h2></article><article><small>KHÁCH HÀNG</small><h2>${D.users.filter(u => u.role === 'customer').length}</h2></article><article><small>THIẾT KẾ ĐANG BÁN</small><h2>${S.filterProducts().length}</h2></article></div><div class="admin-panel"><h2>Đơn hàng gần đây</h2>${orderTable(D.orders.slice().reverse().slice(0, 6))}</div>`;
}
function adminOrdersHTML() {
  const id = q.get('id');
  if (id) { const o = D.orders.find(o => o.id === id); return o ? `<div class="admin-panel">${orderDetail(o)}<div class="actions">${S.transitions[o.status].map(st => `<button class="btn ${st === 'cancelled' ? 'outline' : ''}" data-act="status" data-id="${o.id}" data-value="${st}">${statuses[st]}</button>`).join('')}${!S.transitions[o.status].length ? '<p>Đơn đã kết thúc, không thể chuyển trạng thái.</p>' : ''}</div></div>` : empty('Không tìm thấy đơn', 'Kiểm tra lại mã đơn.', A('admin-orders.html', 'Danh sách đơn', 'btn')); }
  const f = Object.fromEntries(q); const list = D.orders;
  return `<form id="order-filter" class="filters" method="get" action="admin-orders.html"><label>Trạng thái<select name="status"><option value="">Tất cả</option>${Object.entries(statuses).map(([v, t]) => `<option value="${v}" ${f.status === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>${field('Từ ngày', 'from', f.from || '', 'date')}${field('Đến ngày', 'to', f.to || '', 'date')}${field('Quận / huyện / thành phố', 'region', f.region || '')}<button class="btn">Lọc đơn</button>${A('admin-orders.html', 'Đặt lại')}</form>${orderTable(list.slice().reverse())}`;
}
function adminStatsHTML() {
  const f = Object.fromEntries(q); let top = [];
  try { top = S.topCustomers({}); } catch (e) { top = []; }
  return `<form id="stats-filter" class="filters" method="get" action="admin-stats.html">${field('Từ ngày', 'from', f.from || '', 'date')}${field('Đến ngày', 'to', f.to || '', 'date')}<button class="btn">Xem thống kê</button>${A('admin-stats.html', 'Tất cả thời gian')}</form><p class="note">Danh sách dựa trên tiêu chí: Tổng mức chi cao nhất của khách hàng.</p>${top.length ? top.map((r, i) => `<article class="admin-panel"><div class="order-head"><h2><small>0${i + 1}</small> ${esc(r.user.name)}</h2><strong class="detail-price">${money(r.total)}</strong></div><p>${esc(r.user.email)} · ${r.orders.length} đơn hàng</p>${orderTable(r.orders)}</article>`).join('') : empty('Không có dữ liệu thống kê', 'Thử chọn khoảng thời gian có đơn hàng.', A('admin-stats.html', 'Xóa khoảng ngày', 'btn'))}`;
}

/* ---------- boot ---------- */
const PAGES = {
  home: { active: '', html: homeHTML }, catalog: { active: 'catalog', html: catalogHTML }, search: { active: 'search', html: searchHTML }, product: { active: 'catalog', html: productHTML },
  login: { html: () => authHTML(false, false) }, register: { html: () => authHTML(true, false) },
  account: { active: 'account', html: accountHTML }, 'account-edit': { active: 'account', html: accountEditHTML },
  cart: { active: 'cart', html: cartHTML }, checkout: { active: 'cart', html: checkoutHTML },
  orders: { html: ordersHTML }, order: { html: ordersHTML }, success: { html: successHTML }, wishlist: { active: 'wishlist', html: wishlistHTML },
  collections: { html: collectionsHTML }, about: { html: () => infoHTML('about') }, guide: { html: () => infoHTML('guide') }, policy: { html: () => infoHTML('policy') },
  'admin-login': { admin: true, html: () => authHTML(false, true) }, 'admin-dashboard': { admin: true, key: 'dashboard', title: 'Tổng quan', html: adminDashboardHTML },
  'admin-products': { admin: true, key: 'products', title: 'Sản phẩm', html: adminProductsHTML }, 'admin-product-detail': { admin: true, key: 'products', title: 'Sản phẩm', html: adminProductDetailHTML }, 'admin-product-form': { admin: true, key: 'products', title: 'Sản phẩm', html: adminProductFormHTML },
  'admin-users': { admin: true, key: 'users', title: 'Khách hàng', html: adminUsersHTML }, 'admin-user-detail': { admin: true, key: 'users', title: 'Khách hàng', html: adminUserDetailHTML }, 'admin-user-form': { admin: true, key: 'users', title: 'Khách hàng', html: adminUserFormHTML },
  'admin-orders': { admin: true, key: 'orders', title: 'Đơn hàng', html: adminOrdersHTML }, 'admin-order-detail': { admin: true, key: 'orders', title: 'Đơn hàng', html: adminOrdersHTML },
  'admin-stats': { admin: true, key: 'stats', title: 'Top 5 khách hàng', html: adminStatsHTML }
};
function boot() {
  const page = document.body.dataset.page || 'home';
  const def = PAGES[page]; if (!def) return;
  try { for (const o of [...D.orders]) { if (+String(o.id).slice(2) > 1012) S.dropOrder(o.id); } } catch {}
  try { for (const o of [...D.orders]) { if (+String(o.id).slice(2) > 1012) S.dropOrder(o.id); } } catch {}
  try { sessionStorage.removeItem('lumiere_orders'); } catch {}
  try {
    if (def.admin && page !== 'admin-login' && !needAdmin()) return;
    const content = def.html();
    if (content === '') return;
    $('#app').innerHTML = def.admin ? L.adminShell(def.key, content, def.title) : (L.siteHeader(D, def.active) + `<main id="main" tabindex="-1">${content}</main>` + L.siteFooter());
  } catch (e) {
    $('#app').innerHTML = (def.admin ? L.adminShell(def.key || '', '', def.title) : L.siteHeader(D, '') + '<main id="main">') + `<div class="empty"><h2>Không thể mở trang</h2><p>${esc(e.message)}</p></div>` + (def.admin ? '' : '</main>' + L.siteFooter());
  }
  const mb = $('#menu-btn'); if (mb) mb.onclick = () => { const n = $('#main-nav'); if (n) { n.style.display = n.style.display === 'flex' ? '' : 'flex'; n.classList.toggle('open'); } };
  if (S.storageError) toast(S.storageError);
  try {
    const msg = sessionStorage.getItem('lumiere_success'), title = sessionStorage.getItem('lumiere_success_title');
    if (msg) { sessionStorage.removeItem('lumiere_success'); sessionStorage.removeItem('lumiere_success_title'); success(msg, title || 'Thành công'); }
    else if (sessionStorage.getItem('lumiere_flash')) { sessionStorage.removeItem('lumiere_flash'); success('Sản phẩm đã có trong đơn hàng: chỉ ẩn khỏi cửa hàng, giữ nguyên lịch sử.'); }
  } catch {}
}
document.addEventListener('click', e => {
  const skip = e.target.closest && e.target.closest('.skip'); if (skip) return;
  const b = e.target.closest && e.target.closest('[data-act]'); if (!b) return;
  const id = b.dataset.id;
  try {
    switch (b.dataset.act) {
      /* Chua dang nhap: cham yeu thich / gio / mua ngay -> sang trang dang nhap ngay. */
      case 'favorite': { if (!D.buyerId) { const back = location.pathname.split('/').pop() + location.search; try { sessionStorage.setItem('lumiere_return', back); } catch {} location.href = 'login.html?redirect=' + encodeURIComponent(back); break; } const on = b.classList.toggle('active'); b.setAttribute('aria-pressed', String(on)); success(on ? 'Đã lưu vào thiết kế yêu thích.' : 'Đã bỏ khỏi thiết kế yêu thích.'); break; }
      case 'quick-add': location.href = 'product.html?id=' + id; break;
      case 'zoom': { const p = D.products.find(p => p.id === +id); L.confirmModal(`<img class="zoom" src="${esc(asset(p.image))}" alt="${esc(p.name)}"><p>${esc(p.name)}</p>`); break; }
      case 'confirm-cart': { L.closeModal(); pendingCart = null; success('Đã thêm sản phẩm vào giỏ hàng.'); break; }
      case 'cancel-order': L.confirmModal(`<h2>Bạn có chắc chắn muốn hủy đơn hàng này không?</h2><div class="actions"><button class="btn outline" data-act="close">Quay lại</button><button class="btn" data-act="confirm-cancel" data-id="${esc(id)}">Xác nhận hủy</button></div>`); break;
      case 'confirm-cancel': L.closeModal(); flash('Đã hủy đơn hàng thành công.'); location.href = 'orders.html'; break;
      case 'close': pendingCart = null; L.closeModal(); break;
      case 'qty': success('Đã cập nhật số lượng.'); break;
      case 'remove-cart': success('Đã xóa sản phẩm khỏi giỏ.'); break;
      case 'logout': flash('Đã đăng xuất.'); location.href = 'index.html'; break;
      case 'admin-logout': flash('Đã đăng xuất quản trị.'); location.href = 'admin-login.html'; break;
      case 'show-product': flash('Đã hiển thị lại sản phẩm.'); location.href = 'admin-products.html'; break;
      case 'hide-product': L.confirmModal(`<h2>Xác nhận ẩn sản phẩm?</h2><div class="actions"><button class="btn outline" data-act="close">Giữ lại</button><button class="btn" data-act="confirm-hide" data-id="${id}">Xác nhận ẩn</button></div>`); break;
      case 'delete-product': L.confirmModal(`<h2>Xác nhận xóa sản phẩm?</h2><div class="actions"><button class="btn outline" data-act="close">Giữ lại</button><button class="btn" data-act="confirm-delete" data-id="${id}">Xác nhận xóa</button></div>`); break;
      case 'confirm-hide': L.closeModal(); flash('Đã ẩn sản phẩm.'); location.href = 'admin-products.html'; break;
      case 'confirm-delete': L.closeModal(); flash('Đã xóa sản phẩm.'); location.href = 'admin-products.html'; break;
      case 'lock-user': { const u = D.users.find(u => u.id === +id); if (u && u.locked) { L.confirmModal(`<h2>Xác nhận mở khóa?</h2><div class="actions"><button class="btn outline" data-act="close">Giữ lại</button><button class="btn" data-act="confirm-lock" data-id="${id}">Xác nhận</button></div>`); } else { L.confirmModal(`<h2>Xác nhận khóa?</h2><div class="actions"><button class="btn outline" data-act="close">Giữ lại</button><button class="btn" data-act="confirm-lock" data-id="${id}">Xác nhận</button></div>`); } break; }
      case 'confirm-lock': { const u = D.users.find(u => u.id === +id); L.closeModal(); flash(u && u.locked ? 'Đã mở khóa tài khoản.' : 'Đã khóa tài khoản.'); location.href = 'admin-users.html'; break; }
      case 'status': L.confirmModal(`<h2>Xác nhận cập nhật đơn ${esc(id)}?</h2><p>Chuyển sang: ${statuses[b.dataset.value]}. Không thể chuyển ngược.</p><div class="actions"><button class="btn outline" data-act="close">Quay lại</button><button class="btn" data-act="confirm-status" data-id="${esc(id)}" data-value="${b.dataset.value}">Xác nhận</button></div>`); break;
      case 'confirm-status': L.closeModal(); flash('Đã cập nhật trạng thái đơn hàng.'); location.href = 'admin-orders.html'; break;
    }
  } catch (err) { toast(err.message); }
});
document.addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target, data = Object.fromEntries(new FormData(form));
  const err = form.querySelector('.form-error'); if (err) err.textContent = '';
  try {
    switch (form.getAttribute('id')) {
      /* DEMO UI/UX: tim kiem — hien popup roi moi chuyen trang (khong luu data). */
      case 'quick-search': flash('Đã tìm kiếm thành công.'); location.href = 'search.html?q=' + encodeURIComponent(data.q || ''); break;
      case 'filters': { if (data.min && data.max && +data.min > +data.max) throw Error('Giá tối thiểu không được lớn hơn giá tối đa.'); flash('Đã áp dụng bộ lọc tìm kiếm.'); const p = new URLSearchParams(); for (const [k, v] of Object.entries(data)) if (v !== '' && v != null) p.set(k, v); if (String(data.q || '').trim()) location.href = 'search.html?' + p; else location.href = 'catalog.html?' + p; break; }
      case 'search-filters': { if (data.min && data.max && +data.min > +data.max) throw Error('Giá tối thiểu không được lớn hơn giá tối đa.'); flash('Đã tìm kiếm thành công.'); const p = new URLSearchParams(); for (const [k, v] of Object.entries(data)) if (v !== '' && v != null) p.set(k, v); location.href = 'search.html?' + p; break; }
      case 'admin-search': flash('Đã tìm kiếm sản phẩm thành công.'); location.href = 'admin-products.html?q=' + encodeURIComponent(data.q || ''); break;
      case 'admin-user-search': flash('Đã tìm kiếm khách hàng thành công.'); location.href = 'admin-users.html?q=' + encodeURIComponent(data.q || ''); break;
      case 'order-filter': case 'stats-filter': { flash('Đã lọc danh sách thành công.'); const base = form.getAttribute('id') === 'order-filter' ? 'admin-orders.html' : 'admin-stats.html'; location.href = base; break; }
      /* Dang nhap/dang ky demo: van cho qua (chi nho phien, khong ghi localStorage) + popup. */
      case 'login': S.login(data.email, data.password); { const r = new URLSearchParams(location.search).get('redirect') || sessionStorage.getItem('lumiere_return') || 'account.html'; sessionStorage.removeItem('lumiere_return'); flash('Chào mừng bạn đến LUMIÈRE.'); location.href = r; } break;
      case 'admin-login': S.login(data.email, data.password, 'admin'); flash('Chào mừng bạn đến LUMIÈRE.'); location.href = 'admin-dashboard.html'; break;
      case 'register': { const u = S.saveUser(data); S.login(u.email, data.password); flash('Đã tạo tài khoản.'); location.href = sessionStorage.getItem('lumiere_return') || 'account.html'; sessionStorage.removeItem('lumiere_return'); } break;
      /* DEMO UI/UX: them/sua — chi hien popup thanh cong goc tren phai, khong doi data, o lai trang. */
      case 'add-cart': { if (!D.buyerId) { const back = location.pathname.split('/').pop() + location.search; try { sessionStorage.setItem('lumiere_return', back); } catch {} location.href = 'login.html?redirect=' + encodeURIComponent(back); break; } const buy = e.submitter && e.submitter.name === 'buy'; if (buy) { S.validateSelection(data.id, data.size, +data.qty, false); S.startBuyNow(data.id, data.size, +data.qty); try { sessionStorage.setItem('lumiere_buy_now', JSON.stringify({ userId: D.buyerId, items: [{ productId: +data.id, size: data.size, qty: +data.qty }] })); } catch {} location.href = 'checkout.html?mode=buy-now'; } else { success('Đã thêm sản phẩm vào giỏ hàng.'); } break; }
      case 'checkout': { const u0 = S.buyer(); const merged = { ...data }; for (const k of ['name', 'phone', 'email', 'address', 'region']) if (!String(merged[k] || '').trim()) merged[k] = u0[k] || ''; const isBuyNow = form.dataset.buynow === '1'; if (isBuyNow) { try { const sel = JSON.parse(sessionStorage.getItem('lumiere_buy_now') || 'null'); if (sel && sel.userId === D.buyerId && Array.isArray(sel.items) && sel.items.length) { const it = sel.items[0]; S.startBuyNow(it.productId, it.size, it.qty); } } catch {} } const o = S.checkout(merged, isBuyNow); try { sessionStorage.setItem('lumiere_last_order', JSON.stringify(o)); sessionStorage.removeItem('lumiere_orders'); sessionStorage.removeItem('lumiere_buy_now'); } catch {} flash('Đã đặt hàng thành công. Cảm ơn bạn đã chọn LUMIÈRE.'); location.href = 'success.html?id=' + encodeURIComponent(o.id); break; }
      case 'profile-form': success('Đã lưu thông tin cá nhân.'); break;
      case 'newsletter': success('LUMIÈRE đã lắng nghe.'); form.reset(); break;
      case 'product-form': flash(data.id ? 'Đã lưu thay đổi thiết kế.' : 'Đã thêm sản phẩm mới.'); location.href = 'admin-products.html'; break;
      case 'user-form': flash(data.id ? 'Đã lưu thay đổi tài khoản.' : 'Đã thêm khách hàng mới.'); location.href = 'admin-users.html'; break;
    }
  } catch (error) { if (err) err.textContent = error.message; else toast(error.message); }
});
document.addEventListener('change', e => {
  if (e.target.name === 'payment') { const box = $('#qr-box'); if (box) box.hidden = e.target.value !== 'qr'; }
  if (e.target.id === 'address-choice') { const form = $('#checkout'), u = S.buyer(), saved = e.target.value === 'saved'; for (const k of ['name', 'phone', 'email', 'address', 'region']) { if (form.elements[k]) { if (saved) form.elements[k].value = u[k] || ''; form.elements[k].disabled = saved; } } }
  if (e.target.id === 'product-upload') {
    const f = e.target.files[0]; if (!f) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(f.type) || f.size > 8 * 1024 * 1024) { toast('Chọn ảnh PNG, JPEG hoặc WebP tối đa 8 MB.'); e.target.value = ''; return; }
    const reader = new FileReader();
    reader.onerror = () => toast('Không đọc được ảnh.');
    reader.onload = () => { uploadImage = reader.result; const pv = $('#upload-preview'); if (pv) pv.innerHTML = `<img src="${uploadImage}" alt="Ảnh xem trước">`; };
    reader.readAsDataURL(f);
  }
});
document.addEventListener('DOMContentLoaded', boot);
})();
