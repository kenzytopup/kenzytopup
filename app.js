import { firebaseConfig, paymentConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const games = [
  {id:"mlbb",name:"Mobile Legends",icon:"⚔️",subtitle:"Diamonds",server:true,packages:[["Weekly Pass","$1.65"],["86 Diamonds","$1.75"],["172 Diamonds","$3.45"],["257 Diamonds","$5.10"],["706 Diamonds","$13.60"],["1412 Diamonds","$27.00"]]},
  {id:"freefire",name:"Free Fire",icon:"🔥",subtitle:"Diamonds",server:false,packages:[["100 Diamonds","$0.99"],["210 Diamonds","$1.99"],["530 Diamonds","$4.99"],["1080 Diamonds","$9.99"],["2180 Diamonds","$19.99"],["5600 Diamonds","$49.99"]]},
  {id:"pubgm",name:"PUBG Mobile",icon:"🪖",subtitle:"UC",server:false,packages:[["60 UC","$0.99"],["325 UC","$4.99"],["660 UC","$9.99"],["1800 UC","$24.99"],["3850 UC","$49.99"],["8100 UC","$99.99"]]},
  {id:"roblox",name:"Roblox",icon:"🧱",subtitle:"Robux",server:false,packages:[["80 Robux","$0.99"],["400 Robux","$4.99"],["800 Robux","$9.99"],["1700 Robux","$19.99"],["4500 Robux","$49.99"],["10000 Robux","$99.99"]]}
];
const $=id=>document.getElementById(id);
let selectedGame=games[0],selectedPackage=null,method="KHQR",db=null;
const money=s=>Number(String(s).replace("$",""));
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),3500)}
function initFirebase(){try{if(firebaseConfig.apiKey.startsWith("PASTE_")||firebaseConfig.projectId.startsWith("YOUR_"))return null;return getFirestore(initializeApp(firebaseConfig))}catch(e){console.error(e);return null}}
db=initFirebase();
function renderGames(){
  $("gameGrid").innerHTML=games.map(g=>`<button class="game-card ${g.id===selectedGame.id?"selected":""}" data-game="${g.id}"><span class="game-icon">${g.icon}</span><strong>${g.name}</strong><small>${g.subtitle} Top Up</small></button>`).join("");
  $("gameGrid").querySelectorAll("[data-game]").forEach(b=>b.addEventListener("click",()=>selectGame(b.dataset.game,true)));
  $("gameSelect").innerHTML=games.map(g=>`<option value="${g.id}">${g.name}</option>`).join("");
  $("gameSelect").value=selectedGame.id;
}
function selectGame(id,scroll=false){selectedGame=games.find(g=>g.id===id)||games[0];selectedPackage=null;$("gameSelect").value=id;$("serverWrap").style.display=selectedGame.server?"block":"none";renderGames();renderPackages();updateSummary();if(scroll)$("order").scrollIntoView({behavior:"smooth"})}
function renderPackages(){$("packageGrid").innerHTML=selectedGame.packages.map((p,i)=>`<button class="package-option ${selectedPackage===i?"selected":""}" data-package="${i}"><strong>${p[0]}</strong><small>${p[1]}</small></button>`).join("");$("packageGrid").querySelectorAll("[data-package]").forEach(b=>b.addEventListener("click",()=>{selectedPackage=Number(b.dataset.package);renderPackages();updateSummary()}))}
function updateSummary(){const p=selectedPackage===null?null:selectedGame.packages[selectedPackage];$("summaryIcon").textContent=selectedGame.icon;$("summaryGame").textContent=selectedGame.name;$("summaryPackage").textContent=p?p[0]:"សូមជ្រើសរើសកញ្ចប់";$("summaryPrice").textContent=p?p[1]:"$0.00";$("summaryTotal").textContent=p?p[1]:"$0.00"}
function showPayment(){const id=$("playerId").value.trim(),name=$("customerName").value.trim(),contact=$("customerContact").value.trim();if(!id||!name||!contact){toast("សូមបំពេញ Game ID ឈ្មោះ និងលេខទំនាក់ទំនង");return}if(selectedGame.server&&!$("serverId").value.trim()){toast("សូមបញ្ចូល Server ID");return}if(selectedPackage===null){toast("សូមជ្រើសរើសកញ្ចប់ Top Up");return}method="KHQR";updatePayInfo();$("paymentModal").hidden=false}
function updatePayInfo(){document.querySelectorAll(".pay-tab").forEach(b=>b.classList.toggle("active",b.dataset.method===method));if(method==="KHQR"){$("payInfo").innerHTML=`<div class="pay-center"><b>ស្កេន KHQR ដើម្បីបង់ប្រាក់</b><img src="${paymentConfig.khqrImageUrl}" alt="KHQR" onerror="this.style.display='none'"><b>${paymentConfig.khqrAccountName}</b><br>ចំនួនទឹកប្រាក់: <b>${selectedGame.packages[selectedPackage][1]}</b><br><small>ដាក់ QR ផ្ទាល់ខ្លួននៅ assets/your-khqr.png</small></div>`}else{$("payInfo").innerHTML=`<b>ABA Pay</b><br>ឈ្មោះគណនី: <b>${paymentConfig.abaAccountName}</b><br>លេខគណនី: <b>${paymentConfig.abaAccountNumber}</b><br>ចំនួនទឹកប្រាក់: <b>${selectedGame.packages[selectedPackage][1]}</b><br><small>សូមផ្ទៀងផ្ទាត់ឈ្មោះអ្នកទទួលមុនផ្ទេរប្រាក់។</small>`}}
async function submitOrder(){
  const p=selectedGame.packages[selectedPackage],transactionRef=$("transactionRef").value.trim();
  if(!transactionRef){toast("សូមបញ្ចូល Transaction ID");return}
  if(!db){toast("សូមកំណត់ Firebase config ជាមុនសិន — មើល README");return}
  const btn=$("submitOrder");btn.disabled=true;btn.textContent="កំពុងដាក់បញ្ជាទិញ...";
  const order={gameId:selectedGame.id,gameName:selectedGame.name,playerId:$("playerId").value.trim(),serverId:$("serverId").value.trim(),packageName:p[0],price:money(p[1]),currency:"USD",customerName:$("customerName").value.trim(),customerContact:$("customerContact").value.trim(),paymentMethod:method,transactionRef,paymentNote:$("paymentNote").value.trim(),status:"Pending",createdAt:serverTimestamp()};
  try{const ref=await addDoc(collection(db,"orders"),order);$("paymentModal").hidden=true;toast(`បានទទួលការបញ្ជាទិញ! លេខកូដ: ${ref.id.slice(0,8).toUpperCase()} — រង់ចាំ Admin ពិនិត្យ។`);$("transactionRef").value="";$("paymentNote").value=""}
  catch(e){console.error(e);toast("បញ្ជាទិញមិនបានសម្រេច។ សូមពិនិត្យ Firebase និង Internet។")}
  finally{btn.disabled=false;btn.textContent="ខ្ញុំបានបង់ប្រាក់រួច — ដាក់បញ្ជាទិញ"}
}
renderGames();renderPackages();updateSummary();$("year").textContent=new Date().getFullYear();
$("gameSelect").addEventListener("change",e=>selectGame(e.target.value));
$("continueBtn").addEventListener("click",showPayment);
$("closeModal").addEventListener("click",()=>$("paymentModal").hidden=true);
$("paymentModal").addEventListener("click",e=>{if(e.target===$("paymentModal"))$("paymentModal").hidden=true});
document.querySelectorAll(".pay-tab").forEach(b=>b.addEventListener("click",()=>{method=b.dataset.method;updatePayInfo()}));
$("submitOrder").addEventListener("click",submitOrder);
