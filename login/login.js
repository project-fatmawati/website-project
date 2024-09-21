document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
  
    function validateForm(form) {
      const inputs = form.querySelectorAll('input[required]');
      for (let input of inputs) {
        if (!input.value.trim()) {
          alert(`Kolom ${input.previousElementSibling.textContent} harus diisi!`);
          input.focus();
          return false;
        }
      }
      return true;
    }
  
    function saveUserData(newUser) {
      let users = JSON.parse(localStorage.getItem('users')) || {};
      users[newUser.email] = newUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
  
        if (!validateForm(this)) {
          return;
        }
  
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        let users = JSON.parse(localStorage.getItem('users')) || {};
  
        if (users[email] && users[email].password === password) {
          alert('Login berhasil!');
          localStorage.setItem('loggedInUser', email);
  
          // Arahkan pengguna ke homepage
          window.location.href = '../homepage/index.html'; // Pastikan path benar
        } else {
          alert('Email atau password salah!');
        }
      });
    }
  
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
  
        if (!validateForm(this)) {
          return;
        }
  
        const newUser = {
          firstName: document.getElementById('first-name').value,
          lastName: document.getElementById('last-name').value,
          email: document.getElementById('email-signup').value,
          phone: document.getElementById('phone').value,
          address: document.getElementById('address').value,
          password: document.getElementById('password-signup').value
        };
  
        if (newUser.password !== document.getElementById('confirm-password').value) {
          alert('Password dan konfirmasi password tidak cocok!');
          return;
        }
  
        let users = JSON.parse(localStorage.getItem('users')) || {};
        const isEmailTaken = Object.values(users).some(user => user.email === newUser.email);
        const isPhoneTaken = Object.values(users).some(user => user.phone === newUser.phone);
  
        if (isEmailTaken) {
          alert('Email sudah terdaftar! Silakan login.');
          return;
        } else if (isPhoneTaken) {
          alert('Nomor HP sudah terdaftar! Silakan login.');
          return;
        }
  
        saveUserData(newUser);
        alert('Pendaftaran berhasil!');
  
        // Arahkan pengguna ke homepage setelah pendaftaran
        window.location.href = '../homepage/index.html'; // Pastikan path benar
      });
    }
  });
  