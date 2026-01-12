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
    if (data && Array.isArray(data)) {
        data.reverse().forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'tolov-item';
            // ID ni 'id' maydonidan olamiz, SheetDB uni avtomatik qo'shadi
            const itemId = item.id; 

            div.innerHTML = `
                👤 ${item['Bola ismi']} | ${item['Summa']} so'm | ${item['Sana']}
                <button class="delete-btn" onclick="deleteTolov('${itemId}')">O'chirish</button>
            `;
            royxatDiv.appendChild(div);
        });
    } else {
        royxatDiv.innerHTML = 'Ma\'lumotlar topilmadi yoki yuklashda xato!';
    }
}

// Yangi funksiya: Ma'lumotni o'chirish (ID bo'yicha qidirib o'chiradi)
async function deleteTolov(itemId) {
    // SheetDB API orqali 'id' bo'yicha o'chiramiz
    const deleteUrl = `${API_URL}/${itemId}`;
    
    await fetch(deleteUrl, {
        method: 'DELETE'
    });
    
    yangilash(); // O'chirgandan keyin ro'yxatni yangilash
}

yangilash();
