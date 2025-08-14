function finalizarLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none'; // Esconde o elemento de loading
    }
    const conteudo = document.getElementById('conteudo');
    if (conteudo) {
        conteudo.style.display = 'block'; // Exibe o conteúdo principal
    }
}

async function buscarDadosClima() {
    try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=-3.1190&longitude=-60.0217&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America%2FManaus';
        const resposta = await fetch(url);
        const dados = await resposta.json();

        const labels = dados.daily.time.map(data => {
            const [ano, mes, dia] = data.split('-'); 
            return `${dia}/${mes}`;
        })
        const temperaturas = dados.daily.temperature_2m_max; // Máximas
        const temperaturasMin = dados.daily.temperature_2m_min; // Mínimas  

// GRÁFICO DE LINHA
const contextoLinha  = document.getElementById('grafico-linha').getContext('2d'); 
new Chart(contextoLinha, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Temperatura Diária (°C)',
            data: temperaturas,
            backgroundColor: 'rgba(255, 107, 107, 0.2)',
            borderColor: '#ff6b6b',
            borderWidth: 1,
            fill: true,
            tension: 0.1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    color: '#ffffff' // 🔹 Cor dos números no eixo Y
                }
            },
            x: {
                ticks: {
                    color: '#ffffff' // 🔹 Cor dos números no eixo X
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff' // 🔹 Cor da legenda
                }
            }
        }
    }
});


// GRÁFICO DE BARRAS
const contextoBarras = document.getElementById('grafico-barras').getContext('2d');
new Chart(contextoBarras, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Máxima (°C)',
                data: temperaturas,
                backgroundColor: 'rgba(255, 159, 67, 0.5)',
                borderColor: '#ff9f43',
                borderWidth: 1
            },
            {
                label: 'Mínima (°C)',
                data: temperaturasMin,
                backgroundColor: 'rgba(77, 182, 255, 0.5)',
                borderColor: '#4db6ff',
                borderWidth: 1
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    color: '#ffffff'
                }
            },
            x: {
                ticks: {
                    color: '#ffffff'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff'
                }
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
                position: 'bottom',
                labels: {
                    color: '#ffffff' // 🔹 Cor da legenda
                }
            }
        }
    }
});

finalizarLoading();

    } catch (erro) {
        console.error('Erro ao buscar dados climáticos:', erro);
    }
}
window.onload = buscarDadosClima;
