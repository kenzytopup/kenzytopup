import {firebaseConfig,adminUids} from "./firebase-config.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth,signInWithEmailAndPassword,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {getFirestore,collection,query,orderBy,limit,onSnapshot,doc,updateDoc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const $=id=>document.getElementById(id);let auth,db,unsubscribe=null;
const configured=!firebaseConfig.apiKey.startsWith("PASTE_")&&!firebaseConfig.projectId.startsWith("YOUR_");
if(configured){const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app)}else{$("adminMessage").textContent="សូមកំណត់ Firebase config ក្នុង firebase-config.js ជាមុនសិន។"}
$("loginBtn").addEventListener("click",async()=>{try{await signInWithEmailAndPassword(auth,$("email").value.trim(),$("password").value)}catch(e){$("adminMessage").textContent="Login មិនបានសម្រេច: "+e.message}});
$("logoutBtn").addEventListener("click",()=>signOut(auth));
if(configured) onAuthStateChanged(auth,user=>{
 if(!user){$("loginCard").hidden=false;$("ordersCard").hidden=true;if(unsubscribe){unsubscribe();unsubscribe=null}return}
 if(!adminUids.includes(user.uid)){ $("adminMessage").textContent="គណនីនេះមិនមានសិទ្ធិ Admin ទេ។ សូមបញ្ចូល UID ក្នុង adminUids និង Firestore Rules។";signOut(auth);return}
 $("loginCard").hidden=true;$("ordersCard").hidden=false;watchOrders();
});
function watchOrders(){if(unsubscribe)unsubscribe();const q=query(collection(db,"orders"),orderBy("createdAt","desc"),limit(100));unsubscribe=onSnapshot(q,snap=>{if(snap.empty){$("ordersList").textContent="មិនទាន់មានការបញ្ជាទិញ";return}
 $("ordersList").innerHTML=snap.docs.map(d=>{const o=d.data(),date=o.createdAt?.toDate?.().toLocaleString("km-KH")||"ថ្មីៗ";return `<article class="admin-row"><div><b>${esc(o.gameName)} — ${esc(o.packageName)}</b><small>Order: ${d.id.slice(0,8).toUpperCase()} · ${esc(o.customerName)} · ${esc(o.customerContact)}</small><small>Player: ${esc(o.playerId)} ${o.serverId?"· Server: "+esc(o.serverId):""}</small><small>${esc(o.paymentMethod)} · Txn: ${esc(o.transactionRef)} · $${Number(o.price).toFixed(2)} · ${date}</small></div><div class="admin-actions"><span class="status">${esc(o.status)}</span><button data-id="${d.id}" data-status="Paid">Paid</button><button class="done" data-id="${d.id}" data-status="Completed">Completed</button><button data-id="${d.id}" data-status="Rejected">Rejected</button></div></article>`}).join("");
 $("ordersList").querySelectorAll("button[data-id]").forEach(b=>b.addEventListener("click",async()=>{try{await updateDoc(doc(db,"orders",b.dataset.id),{status:b.dataset.status})}catch(e){alert("Update failed: "+e.message)}}));
},e=>{$("adminMessage").textContent="មិនអាចអាន Orders: "+e.message})}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
