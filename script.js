// O'zgartiring: haqiqiy SheetDB API URL/ID bilan
const API_URL = "https://sheetdb.io/api/v1/YOUR_SHEET_ID";

document.addEventListener('DOMContentLoaded', () => {
  yangilash();
  const formBtn = document.getElementById('saveBtn'); // agar bor bo'lsa
  if (formBtn) formBtn.addEventListener('click', tolovniSaqlash);
});

async function tolovniSaqlash() {
  const ismInput = document.getElementById('bolaIsmi');
  const summaInput = document.getElementById('summa');
  const bolaIsmi = ismInput.value.trim();
  const summa = parseFloat(summaInput.value);
  const sana = new Date().toLocaleString('uz-UZ');

  if (!bolaIsmi) {
    alert("Iltimos, bolaning ismini kiriting.");
    return;
  }
  if (!isFinite(summa) || summa <= 0) {
    alert("Iltimos, to'g'ri summa kiriting.");
    return;
  }

  const payload = {
    dataSumma": summa,
        "Sana": sana
      }
    ]
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server xatosi: ${res.status} ${text}`);
    }

    // Tozalash va yangilash
    ismInput.value = '';
    summaInput.value = '';
    await yangilash();
  } catch (err) {
    console.error(err);
    alert('Saqlashda xato yuz berdi: ' + err.message);
  }
}

async function yangilash() {
  const royxatDiv = document.getElementById('royxat');
  if (!royxatDiv) return;
  royxatDiv.textContent = 'Yuklanmoqda...';

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Server xatosi: ${res.status}`);
    const json = await res.json();

    // Moslashuvchan parsing: API array qaytarishi yoki { data: [...] }
    const rows = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []);
    royxatDiv.innerHTML = '';

    if (rows.length === 0) {
      royxatDiv.textContent = "Ma'lumot topilmadi.";
      return;
    }

    // Agar siz eng so'nggi yozuvlarni birinchi ko'rsatmoqchi bo'lsangiz:
    rows.reverse().forEach(item => {
      const div = document.createElement('div');
      div.className = 'tolov-item';

      const nameSpan = document.createElement('span');
      nameSpan.textContent = `${item['Bola ismi'] || ''} | ${item['Summa'] || ''} so'm | ${item['Sana'] || ''}`;

      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.textContent = "O'chirish";

      // ID topishga moslashuvchan yondashuv
      const itemId = item.id || item._row || item._id || item.ID;
      delBtn.addEventListener('click', () => {
        if (!itemId) {
          alert("Ushbu yozuvni o'chirish uchun ID topilmadi.");
          return;
        }
        if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
          deleteTolov(itemId);
        }
      });

      div.appendChild(nameSpan);
      div.appendChild(delBtn);
      royxatDiv.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    royxatDiv.textContent = "Yuklashda xatolik yuz berdi: " + err.message;
  }
}

async function deleteTolov(itemId) {
  try {
    // encodeURIComponent orqali xavfsizroq qiling
    const deleteUrl = `${API_URL}/${encodeURIComponent(itemId)}`;
    const res = await fetch(deleteUrl, { method: 'DELETE' });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`O'chirishda xato: ${res.status} ${text}`);
    }
    await yangilash();
  } catch (err) {
    console.error(err);
    alert('O\'chirishda xatolik: ' + err.message);
  }
}