// 🔥 Firebase via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// 🔧 Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCS2zrdaMEecoJzx6_UbRBhFz5lWttFYIk",
  authDomain: "ch-de-panela-df-1c755.firebaseapp.com",
  projectId: "ch-de-panela-df-1c755",
  storageBucket: "ch-de-panela-df-1c755.firebasestorage.app",
  messagingSenderId: "137374720033",
  appId: "1:137374720033:web:12771d4f5c295df8558360"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📝 Salvar presente (marcado ou desmarcado)
async function atualizarPresente(nome, comprado) {
  try {
    await setDoc(doc(db, "presentes", nome), {
      comprado: comprado,
      timestamp: serverTimestamp()
    }, { merge: true });

    console.log(`"${nome}" ${comprado ? "marcado" : "desmarcado"} no Firebase`);
  } catch (error) {
    console.error("Erro ao atualizar presente:", error);
  }
}

// 🎯 Detectar cliques nos checkboxes
document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
  checkbox.addEventListener("click", () => {
    const label = document.querySelector(`label[for="${checkbox.id}"]`);
    const nome = label?.textContent.trim();

    if (!nome) return;

    const comprado = checkbox.checked;
    atualizarPresente(nome, comprado);

    // ✨ Atualiza estilo visual
    if (comprado) {
      label.style.textDecoration = "line-through";
      label.style.color = "#888";
    } else {
      label.style.textDecoration = "none";
      label.style.color = "#000";
    }
  });
});

console.log("Firebase conectado:", app.name);

// ✅ Aplicar estilo dos presentes já comprados ao carregar
async function aplicarPresentesComprados() {
  try {
    const snapshot = await getDocs(collection(db, "presentes"));
    const comprados = {};

    snapshot.forEach((doc) => {
      if (doc.data().comprado) {
        comprados[doc.id] = true;
      }
    });

    document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
      const label = document.querySelector(`label[for="${checkbox.id}"]`);
      const nome = label?.textContent.trim();

      if (!nome) return;

      if (comprados[nome]) {
        checkbox.checked = true;
        label.style.textDecoration = "line-through";
        label.style.color = "#888";
      } else {
        checkbox.checked = false;
        label.style.textDecoration = "none";
        label.style.color = "#000";
      }
    });
  } catch (error) {
    console.error("Erro ao carregar presentes comprados:", error);
  }
}

// 🚀 Chama ao carregar a página
aplicarPresentesComprados();
