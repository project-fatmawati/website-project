document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const favoriteButton = document.querySelector('.favorite-button');
    const favoriteCount = document.getElementById('favoriteCount');
    const reviewForm = document.getElementById('submitReview');
    const reviewerName = document.getElementById('reviewerName');
    const reviewText = document.getElementById('reviewText');
    const reviewList = document.querySelector('.review-list');
    const stars = document.querySelectorAll('.star');
    const popup = document.getElementById('popup');
    const popupClose = document.querySelector('.popup-close');
    const interestButtons = document.querySelectorAll('.interest-button');
    const currentUser = "User123";

    // Change main image when thumbnail is clicked
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', (e) => {
            const newSrc = e.target.getAttribute('data-src');
            mainImage.src = newSrc;
        });
    });

    // Favorite button functionality
    let favoriteCountValue = parseInt(localStorage.getItem('favoriteCount') || '0', 10);
    favoriteCount.textContent = favoriteCountValue;

    function toggleFavorite() {
        favoriteCountValue += 1;
        favoriteCount.textContent = favoriteCountValue;
        localStorage.setItem('favoriteCount', favoriteCountValue);
    }

    favoriteButton.addEventListener('click', toggleFavorite);

    interestButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const itemName = e.target.dataset.itemName; // The name of the item user is interested in
            const itemOwner = e.target.dataset.itemOwner; // The owner of the item
            const userName = "UserA"; // Current logged-in user
    
            const message = `${userName} tertarik dengan baju ${itemName}`;
            
            // Store the notification for the item owner
            let ownerNotifications = JSON.parse(localStorage.getItem(itemOwner + '_notifications')) || [];
            ownerNotifications.push(message);
            localStorage.setItem(itemOwner + '_notifications', JSON.stringify(ownerNotifications));
    
            alert('Ketertarikan kamu telah dikirim ke pemilik baju!');
        });
    });
    
    // Review functionality
    reviewForm.addEventListener('click', () => {
        const name = reviewerName.value.trim();
        const review = reviewText.value.trim();
        const rating = document.querySelector('.star.active')?.dataset.value || '0';

        if (name && review) {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review');
            reviewElement.innerHTML = `<strong>${name}</strong><p>${review}</p><p>Rating: ${rating} &#9733;</p>`;
            reviewList.appendChild(reviewElement);

            // Clear form
            reviewerName.value = '';
            reviewText.value = '';
            stars.forEach(star => star.classList.remove('active'));

            // Save review to local storage
            const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
            reviews.push({ name, review, rating });
            localStorage.setItem('reviews', JSON.stringify(reviews));
        }
    });

    // Load saved reviews
    const savedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    savedReviews.forEach(({ name, review, rating }) => {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
        reviewElement.innerHTML = `<strong>${name}</strong><p>${review}</p><p>Rating: ${rating} &#9733;</p>`;
        reviewList.appendChild(reviewElement);
    });

    
    // Load saved rating
    const savedRating = localStorage.getItem('rating');
    if (savedRating) {
        stars.forEach(star => {
            star.classList.toggle('active', star.dataset.value <= savedRating);
        });
    }

    // Rating functionality
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.dataset.value;
            localStorage.setItem('rating', rating);
            stars.forEach(star => {
                star.classList.toggle('active', star.dataset.value <= rating);
            });
        });
    });

    // Popup functionality
    const showPopup = () => {
        popup.style.display = 'flex';
    };

    const closePopup = () => {
        popup.style.display = 'none';
    };

    document.querySelector('.btn').addEventListener('click', showPopup);
    popupClose.addEventListener('click', closePopup);
    popup.addEventListener('click', (e) => {
        if (e.target === popup) closePopup();
    });
});
