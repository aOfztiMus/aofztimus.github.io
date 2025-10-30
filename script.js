// script.js (ฉบับสมบูรณ์ แก้ไขล่าสุด)

let slideIndex = 1;
let slideshowTimeout;
let newsData = {}; // ✨ [เพิ่ม] ตัวแปรสำหรับเก็บข้อมูลข่าว

// --- เลือก Elements หลัก ---
const preloader = document.querySelector('.preloader');
const header = document.querySelector('.main-header');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const backToTopButton = document.getElementById('back-to-top-btn');
const newsCards = document.querySelectorAll('.news-card');
const tourButtons = document.querySelectorAll('.open-tour-modal-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const closeBtn = document.querySelector('.close-btn');
const modalImage = document.querySelector('.modal-image');
const modalCategory = document.querySelector('.modal-category');
const modalDate = document.querySelector('.modal-date');
const modalTitle = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');
const modalTicketBtn = document.getElementById('modal-ticket-btn');

// --- Functions ---

// Slideshow Functions
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    if (!slides || slides.length === 0) return;
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = "block";
    }
    clearTimeout(slideshowTimeout);
    slideshowTimeout = setTimeout(() => {
        showSlides(slideIndex += 1);
    }, 10000); // (ตั้งเวลา 10 วินาทีตามที่เราเคยแก้)
}

window.plusSlides = function(n) {
    clearTimeout(slideshowTimeout);
    showSlides(slideIndex += n);
}

// Modal Functions
function openModal(card) {
    // ✨ [แก้ไข] ดึงข้อมูลจาก Element โดยตรง และจาก JSON ✨
    const id = card.dataset.id; // ดึง "news-post-1"
    const title = card.querySelector('.news-title').textContent;
    const category = card.querySelector('.news-category').textContent;
    const date = card.querySelector('.news-date').textContent;
    const imageSrc = card.querySelector('.news-image img').src;
    
    // ดึง content_html จาก newsData โดยใช้ id
    const modalHtmlContent = newsData[id] ? newsData[id].content_html : "<p>Error: Content not found.</p>";

    modalImage.src = imageSrc;
    modalImage.alt = `Image for news post: ${title}`;
    modalCategory.textContent = category;
    modalDate.textContent = date;
    modalTitle.textContent = title;
    modalBody.innerHTML = modalHtmlContent; // ✨ ใช้ innerHTML
    modalTicketBtn.style.display = 'none';
    
    modalOverlay.classList.add('active');
}

function openTourModal(tourItem) {
    const data = tourItem.dataset;
    modalImage.src = data.image;
    modalImage.alt = `Promotional image for event: ${data.title}`;
    modalTitle.textContent = data.title;
    modalBody.textContent = data.description;
    modalCategory.textContent = data.location;
    modalDate.textContent = data.date;

    if (data.status === 'available' && data.ticketLink && data.ticketLink !== '#') {
        modalTicketBtn.href = data.ticketLink;
        modalTicketBtn.style.display = 'inline-block';
        modalTicketBtn.textContent = 'Buy Tickets';
        modalTicketBtn.classList.remove('sold-out');
    } else {
        modalTicketBtn.style.display = 'inline-block';
        modalTicketBtn.textContent = 'Sold Out';
        modalTicketBtn.classList.add('sold-out');
        modalTicketBtn.href = '#';
    }
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}


// --- Main Execution after DOM is ready ---
document.addEventListener('DOMContentLoaded', () => {

    // --- ✨ [เพิ่ม] Fetch ข้อมูลข่าวตอนโหลดหน้า ✨ ---
    async function loadNewsData() {
        try {
            const response = await fetch('content.json'); // โหลดไฟล์ JSON
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            newsData = await response.json(); // เก็บข้อมูลในตัวแปร newsData
        } catch (error) {
            console.error('Failed to load news content:', error);
        }
    }
    loadNewsData();
    // --- ---

    // --- Start Preloader & Slideshow ---
    window.onload = function() {
        if (preloader) {
             preloader.classList.add('preloader-hidden');
        }
        showSlides(slideIndex);
    };

    // --- AOS INITIALIZATION ---
    AOS.init({
        duration: 1000,
        once: true,
    });

    // --- SINGLE SCROLL LISTENER FOR ALL EFFECTS ---
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 1. Header Hide/Show Logic
        if (header) { 
            if (scrollTop > 100) {
                if (scrollTop > lastScrollTop) {
                    header.classList.add('header-hidden');
                } else {
                    header.classList.remove('header-hidden');
                }
            } else {
                header.classList.remove('header-hidden');
            }
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // 3. Active Link Logic
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const headerHeight = header ? header.offsetHeight : 70;
            if (scrollTop >= sectionTop - headerHeight * 1.5) {
                currentSectionId = section.getAttribute('id');
            }
        });
         navLinks.forEach(link => {
             link.classList.remove('active');
             const linkHref = link.getAttribute('href');
             if (linkHref && currentSectionId && linkHref.endsWith(currentSectionId)) {
                 link.classList.add('active');
             } else if (!currentSectionId && linkHref && (linkHref.endsWith('home-slideshow') || linkHref === 'index.html')) {
                  link.classList.add('active');
             }
         });

        // 4. Back To Top Button Logic
        if (backToTopButton) {
            if (scrollTop > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // --- MOBILE HAMBURGER MENU ---
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
             if (hamburger.classList.contains('active')) {
                 hamburger.classList.remove('active');
                 navMenu.classList.remove('active');
             }
        }));
    }

}); // <-- End of DOMContentLoaded

// --- ATTACH MODAL LISTENERS ---
if (newsCards) {
    newsCards.forEach(card => {
        card.addEventListener('click', () => {
            openModal(card);
        });
    });
}
if (tourButtons) {
    tourButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const tourItem = button.closest('.tour-item');
            if (tourItem) {
                 openTourModal(tourItem);
            }
        });
    });
}
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
}