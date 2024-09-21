document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('#sidebar .nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const sections = document.querySelectorAll('.content-section');
    const notificationList = document.getElementById('notificationList');
    const transactionHistory = document.getElementById('transactionHistory');
    const catalogItems = document.getElementById('catalogItems');

    // Fungsi untuk menampilkan data user yang login
    window.onload = function() {
        // Ambil data user dari localStorage
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        const userAddress = localStorage.getItem('userAddress');
        const userPhoneNumber = localStorage.getItem('userPhoneNumber');
        const userPhoto = localStorage.getItem('userPhoto');

        if (userId) {
            // Menampilkan informasi user di halaman dashboard
            document.getElementById('fullName').value = userName;
            document.getElementById('address').value = userAddress;
            document.getElementById('phoneNumber').value = userPhoneNumber;
            document.getElementById('profilePic').src = userPhoto;
            userPhoto.src = user.photo || "../homepage/Asset homepage/photo_catt.png";

        } else {
            // Redirect ke halaman login jika user belum login
            window.location.href = "../login/login.html";
        }
    };

    // Fungsi untuk menyimpan perubahan profil user
    function saveProfile() {
        const fullName = document.getElementById('fullName').value;
        const address = document.getElementById('address').value;
        const phoneNumber = document.getElementById('phoneNumber').value;

        // Simpan data yang diperbarui ke localStorage
        localStorage.setItem('userName', fullName);
        localStorage.setItem('userAddress', address);
        localStorage.setItem('userPhoneNumber', phoneNumber);

        alert("Profil berhasil diperbarui!");
    }

    // Fungsi untuk menyembunyikan dan menampilkan section
    function showSection(targetId) {
        sections.forEach(section => {
            section.classList.remove('active');
            section.classList.add('d-none');
        });
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('d-none');
            targetSection.classList.add('active');
        }
    }

    // Sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            showSection(targetId);
        });
    });

    // Dropdown for smaller screens
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            dropdownItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            showSection(targetId);
        });
    });

    // Default section load
    const defaultLink = document.querySelector('#sidebar .nav-link.active') || document.querySelector('.dropdown-item.active');
    const defaultSectionId = defaultLink ? defaultLink.getAttribute('data-target') : 'personal-info';
    showSection(defaultSectionId);

    // Menampilkan notifikasi sebagai alert dan di bagian notifikasi
    function addNotification(message) {
        alert(message);
        const newNotification = document.createElement('div');
        newNotification.classList.add('alert', 'alert-info');
        newNotification.textContent = message;
        notificationList.appendChild(newNotification);
    }

    // Menambah riwayat transaksi
    function addTransaction(itemName) {
        const newTransaction = document.createElement('li');
        newTransaction.classList.add('list-group-item');
        newTransaction.textContent = `Barter berhasil: ${itemName}`;
        transactionHistory.appendChild(newTransaction);
    }

    // Menyimpan ke localStorage
    function saveToLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function loadFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key)) || null;
    }

    // Form edit informasi pribadi
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        const profilePic = document.getElementById('profilePic');
        const fullName = document.getElementById('fullName');
        const address = document.getElementById('address');
        const phoneNumber = document.getElementById('phoneNumber');

        // Memuat informasi pribadi dari localStorage
        const savedProfile = loadFromLocalStorage('userProfile');
        if (savedProfile) {
            fullName.value = savedProfile.fullName;
            address.value = savedProfile.address;
            phoneNumber.value = savedProfile.phoneNumber;
        }

        // Simpan perubahan ke localStorage
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userProfile = {
                profilePic: profilePic.files[0] ? URL.createObjectURL(profilePic.files[0]) : null,
                fullName: fullName.value,
                address: address.value,
                phoneNumber: phoneNumber.value
            };
            saveToLocalStorage('userProfile', userProfile);
            addNotification('Informasi pribadi berhasil diperbarui!');
        });
    }

    window.onload = function() {
        const userId = localStorage.getItem('loggedInUser');
        
        if (!userId) {
            // Redirect ke halaman login jika user belum login
            window.location.href = "../login/login.html";
        } else {
            // Tampilkan katalog pengguna
            displayCatalog(userId);
        }
    
        // Fungsi untuk menyimpan item ke katalog
        document.getElementById('addItemForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const itemName = document.getElementById('itemName').value;
            const itemImage = document.getElementById('itemImage').files[0];
    
            if (itemImage) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const catalogItem = {
                        name: itemName,
                        image: event.target.result
                    };
    
                    // Simpan ke localStorage
                    saveCatalogItem(userId, catalogItem);
                    displayCatalog(userId); // Tampilkan ulang katalog
                    alert('Item berhasil ditambahkan!');
                    document.getElementById('addItemForm').reset(); // Reset form
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
                    modal.hide(); // Tutup modal
                };
                reader.readAsDataURL(itemImage);
            }
        });
    };
    
    // Fungsi untuk menyimpan item ke dalam katalog pengguna
    function saveCatalogItem(userId, item) {
        let userCatalog = JSON.parse(localStorage.getItem('catalog')) || {};
        
        if (!userCatalog[userId]) {
            userCatalog[userId] = [];
        }
    
        userCatalog[userId].push(item);
        localStorage.setItem('catalog', JSON.stringify(userCatalog));
    }
    
    // Fungsi untuk menampilkan katalog pengguna
    function displayCatalog(userId) {
        const catalogItemsContainer = document.getElementById('catalogItems');
        catalogItemsContainer.innerHTML = '';
    
        let userCatalog = JSON.parse(localStorage.getItem('catalog')) || {};
        
        if (userCatalog[userId] && userCatalog[userId].length > 0) {
            userCatalog[userId].forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = 'col-md-4 mb-3';
                itemCard.innerHTML = `
                    <div class="card">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                        </div>
                    </div>
                `;
                catalogItemsContainer.appendChild(itemCard);
            });
        } else {
            catalogItemsContainer.innerHTML = '<p>Tidak ada item di katalog Anda.</p>';
        }
    }
    
    // Form untuk menambah katalog baju
    const addItemForm = document.getElementById('addItemForm');
    if (addItemForm) {
        addItemForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const itemName = document.getElementById('itemName').value;
            const itemImage = document.getElementById('itemImage').files[0];
            if (!itemName || !itemImage) {
                console.error('Nama produk atau gambar belum diisi.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const newItem = document.createElement('img');
                newItem.src = event.target.result;
                newItem.alt = itemName;
                newItem.classList.add('img-catalog');
                catalogItems.appendChild(newItem);

                // Simpan item ke localStorage
                const catalog = loadFromLocalStorage('catalogItems') || [];
                catalog.push({ src: event.target.result, alt: itemName });
                saveToLocalStorage('catalogItems', catalog);

                addTransaction(itemName);
                addNotification('Baju berhasil ditambahkan ke katalog!');

                // Tutup modal setelah item ditambahkan
                const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
                modal.hide();
            };
            reader.readAsDataURL(itemImage);
        });
    }

    document.getElementById('addImageButton').addEventListener('click', function() {
        var newImage = document.createElement('img');
        newImage.src = 'asset/...';
        newImage.alt = 'Baju Baru';
        newImage.classList.add('img-catalog');
        
        catalogItems.appendChild(newImage);
    });

    // Fungsi untuk menampilkan notifikasi ketertarikan pada item di katalog
    function addInterestNotification(userName, itemName) {
        const message = `${userName} tertarik dengan baju ${itemName}`;

        alert(message);
        const newNotification = document.createElement('div');
        newNotification.classList.add('alert', 'alert-info');
        newNotification.textContent = message;
        notificationList.appendChild(newNotification);
        
        // Simpan notifikasi ke localStorage
        const notifications = loadFromLocalStorage('notifications') || [];
        notifications.push(message);
        saveToLocalStorage('notifications', notifications);
    }

    // Fungsi untuk memuat notifikasi yang tersimpan di localStorage
    function loadNotifications() {
        const storedNotifications = loadFromLocalStorage('notifications');
        if (storedNotifications) {
            storedNotifications.forEach(notification => {
                const newNotification = document.createElement('div');
                newNotification.classList.add('alert', 'alert-info');
                newNotification.textContent = notification;
                notificationList.appendChild(newNotification);
            });
        }
    }

    // Memuat katalog dari localStorage
    function loadCatalogFromLocalStorage() {
        const storedItems = loadFromLocalStorage('catalogItems');
        if (storedItems) {
            storedItems.forEach(item => {
                const newItem = document.createElement('img');
                newItem.src = item.src;
                newItem.alt = item.alt;
                newItem.classList.add('img-catalog');
                catalogItems.appendChild(newItem);
            });
        }
    }

    loadCatalogFromLocalStorage();
    loadNotifications();


    // Form untuk mengganti kata sandi
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;

            const savedPassword = loadFromLocalStorage('userPassword');
            if (oldPassword === savedPassword) {
                saveToLocalStorage('userPassword', newPassword);
                addNotification('Password berhasil diganti!');
            } else {
                addNotification('Password lama tidak sesuai.');
            }
        });
    }

    // Form pengaturan privasi
    const privacySettingsForm = document.getElementById('privacySettingsForm');
    if (privacySettingsForm) {
        privacySettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const privacySetting = document.querySelector('input[name="privacy"]:checked').value;
            saveToLocalStorage('privacySetting', privacySetting);
            addNotification('Pengaturan privasi berhasil diperbarui!');
        });

        // Memuat pengaturan privasi yang tersimpan
        const savedPrivacySetting = loadFromLocalStorage('privacySetting');
        if (savedPrivacySetting) {
            document.querySelector(`input[name="privacy"][value="${savedPrivacySetting}"]`).checked = true;
        }
    }

    // Form pengaturan notifikasi
    const notificationSettingsForm = document.getElementById('notificationSettingsForm');
    if (notificationSettingsForm) {
        notificationSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailNotification = document.getElementById('emailNotification').checked;
            const pushNotification = document.getElementById('pushNotification').checked;
            const weeklySummary = document.getElementById('weeklySummary').checked;

            const notificationSettings = {
                emailNotification,
                pushNotification,
                weeklySummary
            };
            
            saveToLocalStorage('notificationSettings', notificationSettings);
            addNotification('Pengaturan notifikasi berhasil diperbarui!');
        });

        // Memuat pengaturan notifikasi yang tersimpan
        const savedNotificationSettings = loadFromLocalStorage('notificationSettings');
        if (savedNotificationSettings) {
            document.getElementById('emailNotification').checked = savedNotificationSettings.emailNotification;
            document.getElementById('pushNotification').checked = savedNotificationSettings.pushNotification;
            document.getElementById('weeklySummary').checked = savedNotificationSettings.weeklySummary;
        }
    }
});