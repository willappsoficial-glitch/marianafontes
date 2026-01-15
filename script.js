// ATENÇÃO: Cole a URL do seu Web App do Apps Script aqui
const SCRIPT_URL = 'AQUI_VAI_A_SUA_URL_DO_APPS_SCRIPT';

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Menu Mobile (Hambúrguer)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Efeito visual no ícone
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Fechar menu ao clicar em link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (menuToggle.querySelector('i').classList.contains('fa-times')) {
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }

    // 2. Animação de Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

    // 3. Envio do Formulário para Apps Script
    const form = document.getElementById('gymForm');
    const statusDiv = document.getElementById('statusMessage');
    const btnText = document.getElementById('btnText');
    const btnSubmit = document.getElementById('btnSubmit');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            
            // Feedback Visual de Carregamento
            btnText.textContent = 'Enviando...';
            btnSubmit.disabled = true;
            btnSubmit.style.opacity = '0.7';

            // Preparar dados
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.data_registro = new Date().toLocaleString();

            fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                mode: 'no-cors', // Permite envio simples sem verificação de CORS estrita
                headers: { 'Content-Type': 'text/plain;charset=utf-8' }
            })
            .then(() => {
                statusDiv.innerHTML = '<p style="color: #4CAF50; margin-top:10px; font-weight:bold;">Sucesso! Entraremos em contato em breve.</p>';
                form.reset();
            })
            .catch(error => {
                console.error('Erro:', error);
                statusDiv.innerHTML = '<p style="color: #ff4500; margin-top:10px;">Erro ao enviar. Tente novamente ou contate via WhatsApp.</p>';
            })
            .finally(() => {
                btnText.textContent = 'Confirmar Inscrição';
                btnSubmit.disabled = false;
                btnSubmit.style.opacity = '1';
            });
        });
    }
});