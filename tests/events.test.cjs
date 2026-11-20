/* Kiểm tra tạo HTML trong Node VM; KHÔNG thay thế Chrome/DOM/layout. */
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const app={innerHTML:''},dialog={innerHTML:'',open:false,showModal(){this.open=true},close(){this.open=false},addEventListener(){}};
const mock={addEventListener(){},classList:{add(){},remove(){},toggle(){}},setAttribute(){},textContent:''};
const handlers={};
const context={FormData:class{constructor(form){return Object.entries(form.values)}},localStorage:{getItem(){return null},setItem(){}},console,URLSearchParams,Intl,Date,Map,Set,document:{hidden:false,querySelector(s){return s==='#app'?app:s==='#dialog'?dialog:mock},querySelectorAll(){return []},addEventListener(name,fn){handlers[name]=fn;}},location:{hash:''},setInterval(){return 1},clearInterval(){},setTimeout(){return 1},clearTimeout(){},matchMedia(){return {matches:false}},scrollTo(){},scrollY:0};context.window=context;context.addEventListener=()=>{};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'js/store.js'),'utf8'),context);vm.runInContext(fs.readFileSync(path.join(root,'js/app.js'),'utf8'),context);

const run=code=>vm.runInContext(code,context);
function submit(id,values,buy=false){handlers.submit({preventDefault(){},target:{id:{tagName:'INPUT'},values,getAttribute(){return id},querySelector(){return null}},submitter:buy?{name:'buy'}:{}});}
function click(act,id){handlers.click({target:{closest(selector){return selector==='.skip'?null:{dataset:{act,id},disabled:false}}}});}
run("S.login('khach@lumiere.vn','Lumiere123')");
submit('add-cart',{id:'1',size:'12',qty:'2'});
assert.match(dialog.innerHTML,/Bạn có muốn thêm/);assert.equal(run('D.cart.length'),0);
click('close');assert.equal(run('D.cart.length'),0);
submit('add-cart',{id:'1',size:'12',qty:'2'});click('confirm-cart');assert.equal(run('D.cart[0].qty'),2);click('confirm-cart');assert.equal(run('D.cart[0].qty'),2);
click('close');submit('add-cart',{id:'2',size:'14',qty:'1'},true);assert.equal(context.location.hash,'/checkout?mode=buy-now');assert.equal(run('D.cart[0].productId'),1);
run("params=new URLSearchParams('mode=buy-now')");submit('checkout',{name:'Test',phone:'0901234567',address:'Test address',region:'Test region',payment:'cash'});assert.equal(run('D.orders[D.orders.length-1].items[0].productId'),2);assert.equal(run('D.cart[0].qty'),2);
click('favorite','1');assert.equal(run('D.favorites[0]'),1);assert.match(run('product(1)'),/favorite-detail active/);assert.match(run('card(D.products[0])'),/favorite active/);
click('edit-profile');assert.equal(run("location.hash"),'/account/edit');run("render()");assert.match(app.innerHTML,/profile-form/);submit('profile-form',{name:'Test edited',email:'edited@demo.test',phone:'0901234567',address:'New address',region:'New region'});assert.equal(run('S.buyer().name'),'Test edited');assert.equal(run("location.hash"),'/account');
const order=run('D.orders[D.orders.length-1].id');click('cancel-order',order);assert.match(dialog.innerHTML,/Xác nhận hủy/);click('confirm-cancel',order);assert.equal(run('D.orders[D.orders.length-1].status'),'cancelled');
console.log('PASS delegated submit with form.id shadowed, confirm/cancel modal, double-click guard, buy-now isolation, heart markup, profile submit, customer cancellation (Node VM event simulation)');
