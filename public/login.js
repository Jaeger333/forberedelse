btnLogin = document.getElementById('btnLogin');
btnRegister = document.getElementById('btnRegister');
btnLogin.addEventListener('click', () => showForm('login'));
btnRegister.addEventListener('click', () => showForm('register'));
const loginForm = document.getElementById('loginForm');

function showForm(form) {
    document.getElementById('loginForm').style.display = form === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = form === 'register' ? 'block' : 'none';
}

var urlParams = new URLSearchParams(location.search)
if (urlParams.has('error')) {
    const errorMsg = document.createElement('h2')
    errorMsg.innerHTML = "Error: Feilt brukernavn eller passord. Prøv igjen"
    errorMsg.style.color = 'red'
    loginForm.appendChild(errorMsg)
    
}


      