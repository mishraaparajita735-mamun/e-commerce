// Category Tab Filter
const tabBtns = document.querySelectorAll('.tab-btn');
const productCards = document.querySelectorAll('.product-card');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Sabhi buttons se active hatao
    tabBtns.forEach(b => b.classList.remove('active'));
    // Click wale button pe active lagao
    btn.classList.add('active');
    
    const category = btn.getAttribute('data-category');
    
    // Products filter karo
    productCards.forEach(card => {
      if (category === 'all' || card.getAttribute('data-category') === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});