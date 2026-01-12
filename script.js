const API_URL = "sheetdb.io"; 

async function tolovniSaqlash() {
    const ismInput = document.getElementById('bolaIsmi');
    const summaInput = document.getElementById('summa');
    const bolaIsmi = ismInput.value;
    const summa = summaInput.value;
    const sana = new Date().toLocaleString('uz-UZ');

    if (bolaIsmi && summa) {
        const data = {
            "data": {
                "Bola ismi": bolaIsmi,
                "Summa": summa,
                "Sana": sana
            }
        };

        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        ismInput.value = '';
        summaInput.value = '';
        yangilash(); 
    }
}

async function yangilash() {
    const royxatDiv = document.getElementById('royxat');
    royxatDiv.innerHTML = 'Yuklanmoqda...';

    const response = await fetch(API_URL);
    const data = await response.json();

    royxatDiv.innerHTML = '';
    // Ma'lumotlarni teskari tartibda ko'rsatish (eng yangisi tepada)
    data.reverse().forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'tolov-item';
        // HTML kontentiga o'chirish tugmasini va uning funksiyasini qo'shamiz
        div.innerHTML = `
            👤 ${item['Bola ismi']} | ${item['Summa']} so'm | ${item['Sana']}
            <button class="delete-btn" onclick="deleteTolov('${item['Sana']}')">O'chirish</button>
        `;
        royxatDiv.appendChild(div);
    });
}

// Yangi funksiya: Ma'lumotni o'chirish (Sana bo'yicha qidirib o'chiradi)
async function deleteTolov(sana) {
    // SheetDB API orqali "Sana" ustunidagi qiymat bo'yicha o'chiramiz
    const deleteUrl = `${API_URL}/Sana/${encodeURIComponent(sana)}`;
    
    await fetch(deleteUrl, {
        method: 'DELETE'
    });
    
    yangilash(); // O'chirgandan keyin ro'yxatni yangilash
}

// Sahifa yuklanganda ma'lumotlarni avtomatik yuklash
yangilash();
