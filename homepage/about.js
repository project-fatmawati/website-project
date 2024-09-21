document.addEventListener('DOMContentLoaded', function () {
  function updateNavbar() {
      const loggedInUser = localStorage.getItem('loggedInUser'); // Mengambil pengguna yang login dari localStorage
      const loginNavItem = document.getElementById('loginNavItem');
      const registerNavItem = document.getElementById('registerNavItem');
      const profileNavItem = document.getElementById('profileNavItem');
      const userName = document.getElementById('userName');
      const userPhoto = document.getElementById('userPhoto');

      if (loggedInUser) {
          const users = JSON.parse(localStorage.getItem('users')) || {};
          const user = users[loggedInUser];

          if (user) {
              // Sembunyikan login dan register
              loginNavItem.style.display = 'none';
              registerNavItem.style.display = 'none';
              // Tampilkan profil
              profileNavItem.style.display = 'block';
              // Isi nama dan foto user
              userName.textContent = user.firstName || 'User';
              userPhoto.src = user.photo || '../homepage/Asset homepage/photo_catt.png';
          }
      } else {
          // Tampilkan login dan register
          loginNavItem.style.display = 'block';
          registerNavItem.style.display = 'block';
          // Sembunyikan profil
          profileNavItem.style.display = 'none';
      }
  }

  // Panggil fungsi updateNavbar untuk mengatur tampilan berdasarkan status login
  updateNavbar();

  // Logout handler
  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', function () {
      localStorage.removeItem('loggedInUser'); // Menghapus data pengguna dari localStorage
      window.location.href = '../homepage/index.html'; // Redirect ke homepage
  });
});
