async function buscarDadosClima() {
    try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=-3.1190&longitude=-60.0217&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America%2FManaus';
        const resposta = await fetch(url);
        const dados = await resposta.json();
        const labels = [];
        const temperaturas = [];
        const datas = dados.daily.time; // array com as datas em texto

        //GRÁFICO DE LINHA
const temperaturasMax = dados.daily.temperature_2m_max;// Pega as temperaturas máximas do retorno da API

for (let i = 0; i < datas.length; i++) {
    const dataFormatada = new Date(datas[i]).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
    });
    labels.push(dataFormatada);
    temperaturas.push(temperaturasMax[i]);
}

        console.log(labels);
        console.log(temperaturas);

    const contextoLinha = document.getElementById('grafico-linha').getContext('2d');
new Chart(contextoLinha, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Temperatura Diária (°C)',
            data: temperaturas,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: true, // Preenchimento abaixo da linha
            tension: 0.1 // Suavização da linha
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false, // Permite que o eixo Y comece em um valor diferente de zero
            }
        }
    }
});

//GRÁFICO DE BARRAS
const temperaturasMin = dados.daily.temperature_2m_min;// Pega temperaturas mínimas do mesmo retorno da API
const contextoBarras = document.getElementById('grafico-barras').getContext('2d');
new Chart(contextoBarras, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Máxima (°C)',
                data: temperaturas,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Mínima (°C)',
                data: temperaturasMin,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

//GRÁFICO DE PIZZA

// Códigos meteorológicos diários (1 para cada dia)
const codigosClima = dados.daily.weather_code;

let ensolarado = 0;
let nublado = 0;
let chuvoso = 0;

// Classificação baseada nos códigos do Open-Meteo
codigosClima.slice(0, 7).forEach(codigo => {
    if ([0, 1].includes(codigo)) {
        ensolarado++;
    } else if ([2, 3, 45, 48].includes(codigo)) {
        nublado++;
    } else {
        chuvoso++;
    }
});
const contextoPizza = document.getElementById('grafico-pizza').getContext('2d');
new Chart(contextoPizza, {
    type: 'pie',
    data: {
        labels: ['Ensolarado', 'Nublado', 'Chuvoso'],
        datasets: [{
            label: 'Quantidade de Dias',
            data: [ensolarado, nublado, chuvoso],
            backgroundColor: [
                'rgba(255, 206, 86, 0.5)', // Amarelo - sol
                'rgba(201, 203, 207, 0.5)', // Cinza - nublado
                'rgba(54, 162, 235, 0.5)'  // Azul - chuva
            ],
            borderColor: [
                'rgba(255, 206, 86, 1)',
                'rgba(201, 203, 207, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
});


    } catch (erro) {
        console.error('Erro ao buscar dados climáticos:', erro);
    }
}
window.onload = buscarDadosClima;
