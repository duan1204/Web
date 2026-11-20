/* Kiểm tra tạo HTML trong Node VM; KHÔNG thay thế Chrome/DOM/layout. */
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const app={innerHTML:''},dialog={innerHTML:'',open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){}};
const mock={addEventListener(){},classList:{add(){},remove(){},toggle(){}},setAttribute(){},textContent:''};
const context={localStorage:{getItem(){return null},setItem(){}},console,URLSearchParams,Intl,Date,Map,Set,document:{hidden:false,querySelector(s){return s==='#app'?app:s==='#dialog'?dialog:mock},querySelectorAll(){return []},addEventListener(){}},location:{hash:''},setInterval(){return 1},clearInterval(){},setTimeout(){return 1},clearTimeout(){},matchMedia(){return {matches:false}},scrollTo(){},scrollY:0};context.window=context;context.addEventListener=()=>{};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'js/store.js'),'utf8'),context);vm.runInContext(fs.readFileSync(path.join(root,'js/app.js'),'utf8'),context);
let count=0;const assetPaths=new Set();
function view(route){context.location.hash='#/'+route;vm.runInContext('render()',context);assert.ok(!app.innerHTML.includes('Không thể mở trang'),route);for(const m of app.innerHTML.matchAll(/(?:src|href)="([^"#][^"]*)"/g)){if(m[1].startsWith('assets/'))assetPaths.add(m[1]);}count++;return app.innerHTML;}
for(const route of ['', 'catalog','catalog?page=2','catalog?q=doesnotexist','catalog?category=Nhẫn','catalog?min=100&max=1','collections','product/1','product/999','cart','login','register','checkout','orders','wishlist','about','guide','policy','account','admin/login','admin/products'])view(route);
assert.equal((view('catalog').match(/<article class="product">/g)||[]).length,8);assert.equal((view('catalog?page=2').match(/<article class="product">/g)||[]).length,8);
for(let id=1;id<=60;id++)view('product/'+id);
assert.equal((view('catalog?page=8').match(/<article class="product">/g)||[]).length,4);
vm.runInContext("S.login('khach@lumiere.vn','Lumiere123');S.addCart(1,'12',2)",context);
view('cart');view('checkout');view('account');view('orders');assert.ok(!view('orders/LM1002').includes('Minh Trần'));view('orders/LM1001');
vm.runInContext("const placed=S.checkout({name:'Khách',phone:'0901234567',address:'12 Đường A',region:'Quận 1',payment:'online'});",context);view('success/LM1013');
vm.runInContext("S.login('admin@lumiere.vn','Admin123','admin')",context);
for(const route of ['admin/dashboard','admin/products','admin/products?q=none','admin/products/new','admin/products/1','admin/products/1/edit','admin/products/999','admin/users','admin/users/new','admin/users/1','admin/users/1/edit','admin/orders','admin/orders/LM1001','admin/orders/LM1003','admin/orders?from=2026-10-01&to=2026-10-12','admin/orders?from=2026-10-20&to=2026-10-01','admin/stats','admin/stats?from=2027-01-01','admin/stats?from=2026-10-20&to=2026-10-01'])view(route);
view('account/edit');
assert.ok(view('admin/products/1').includes('Sửa thiết kế'));assert.ok(view('admin/products/1/edit').includes('Ảnh hiện tại'));assert.ok(view('admin/products/1/edit').includes('value="Nhẫn" selected'));assert.ok(view('admin/users/1').includes('Sửa khách hàng'));assert.ok(view('admin/users/1/edit').includes('khach@lumiere.vn'));assert.ok(view('account/edit').includes('profile-form'));
vm.runInContext("D.users[0].name='<img src=x onerror=alert(1)>';D.products[0].name='<script>bad</script>';",context);assert.ok(!view('account').includes('<img src=x'));assert.ok(view('product/1').includes('&lt;script&gt;bad&lt;/script&gt;'));
for(const asset of assetPaths)assert.ok(fs.existsSync(path.join(root,asset)),asset);
const source=['index.html','js/app.js','js/store.js','css/main.css'].map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n');assert.ok(!/(?:fetch\s*\(|sessionStorage\.|indexedDB\.|https?:\/\/|type="module")/.test(source),'No external fetch, persistent browser storage or module loading');
console.log(`PASS ${count} HTML template render checks (Node VM, not Chrome)`);console.log(`PASS ${assetPaths.size} image references exist`);console.log('PASS form prefill, HTML escaping, order ownership and no network dependencies');
