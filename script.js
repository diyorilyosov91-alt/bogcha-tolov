const API_URL = "https://sheetdb.io/api/v1/jmvg2ddwy79z3"; 

async function tolovniSaqlash() {
    const ismInput = document.getElementById('bolaIsmi');
    const summaInput = document.getElementById('summa');
    const bolaIsmi = ismInput.value;
    const summa = summaInput.value;
    const sana = new Date().toLocaleString('uz-UZ');

    if (bolaIsmi && summa) {
        const data = {
            "data": {
                "Bola ismi": bolaIsmi, // Google Sheets ustun nomi bilan mos bo'lishi shart
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
        yangilash(); // Saqlagandan keyin ro'yxatni yangilash
    }
}

async function yangilash() {
    const royxatDiv = document.getElementById('royxat');
    royxatDiv.innerHTML = 'Yuklanmoqda...';

    const response = await fetch(API_URL);
    const data = await response.json();

    royxatDiv.innerHTML = '';
    // Ma'lumotlarni teskari tartibda ko'rsatish (eng yangisi tepada)
    data.reverse().forEach(item => {
        const div = document.createElement('div');
        div.className = 'tolov-item';
        div.textContent = `👤 ${item['Bola ismi']} | ${item['Summa']} so'm | ${item['Sana']}`;
        royxatDiv.appendChild(div);
    });
}

// Sahifa yuklanganda ma'lumotlarni avtomatik yuklash
yangilash();
