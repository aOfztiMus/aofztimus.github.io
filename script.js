// script.js (ฉบับสมบูรณ์ แก้ไขล่าสุด)

let slideIndex = 1; // ✨ เริ่มต้นที่สไลด์ 1 ✨
let slideshowTimeout;

// --- เลือก Elements หลักที่ใช้บ่อยๆ ---
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

    // ✨ ทำให้ index วนลูปถูกต้อง ✨
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    // ซ่อนสไลด์ทั้งหมด
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // แสดงสไลด์ปัจจุบัน
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = "block";
    }

    // ตั้งเวลาสไลด์ถัดไป (ถ้าไม่ได้เรียกด้วย plusSlides)
    clearTimeout(slideshowTimeout);
    slideshowTimeout = setTimeout(() => {
        showSlides(slideIndex += 1); // เลื่อนไปสไลด์ถัดไป
    }, 10000); // ✨ แก้เวลาตรงนี้ (10 วินาที) ✨
}

// ฟังก์ชันสำหรับปุ่ม Prev/Next
window.plusSlides = function(n) {
    clearTimeout(slideshowTimeout); // หยุด auto slide ชั่วคราว
    showSlides(slideIndex += n); // แสดงสไลด์ที่ต้องการ
}

// Modal Functions
function openModal(card) {
    const data = card.dataset;
    modalImage.src = data.image;
    modalImage.alt = `Image for news post: ${data.title}`; // เพิ่ม Alt Text
    modalCategory.textContent = data.category;
    modalDate.textContent = data.date;
    modalTitle.textContent = data.title;
    modalBody.textContent = data.content;
    modalTicketBtn.style.display = 'none';
    modalOverlay.classList.add('active');
}

function openTourModal(tourItem) {
    const data = tourItem.dataset;
    modalImage.src = data.image;
    modalImage.alt = `Promotional image for event: ${data.title}`; // เพิ่ม Alt Text
    modalTitle.textContent = data.title;
    modalBody.textContent = data.description;
    modalCategory.textContent = data.location;
    modalDate.textContent = data.date;

    modalTicketBtn.style.display = 'none';

    // 1. ตรวจสอบเงื่อนไขการแสดงปุ่ม "Buy Tickets"
    if (data.status === 'available' && data.ticketLink && data.ticketLink !== '#') {
        // เงื่อนไข: สถานะ Available และมีลิงก์ตั๋วที่ใช้งานได้จริง
        modalTicketBtn.href = data.ticketLink;
        modalTicketBtn.textContent = 'Buy Tickets';
        modalTicketBtn.classList.remove('sold-out');
        modalTicketBtn.style.display = 'inline-block'; // << แสดงปุ่ม
        
    } else if (data.status === 'sold-out') {
        // เงื่อนไข: สถานะเป็น Sold Out 
        // เราจะแสดงปุ่ม "Sold Out" ที่กดไม่ได้แทน
        modalTicketBtn.href = '#'; // ไม่ให้คลิกไปไหน
        modalTicketBtn.textContent = 'Sold Out';
        modalTicketBtn.classList.add('sold-out');
        modalTicketBtn.style.display = 'inline-block'; // << แสดงปุ่ม
        
    } 
    // ถ้าไม่ใช่เงื่อนไขข้างบนทั้งหมด (เช่น ไม่มีสถานะ หรือ data-ticket-link ไม่มี/เป็น #) 
    // ปุ่มจะถูกซ่อนไว้ตามค่าเริ่มต้น 'display = none' ที่เรากำหนดไว้ด้านบน
    
    // กำหนดให้ Category และ Date แสดงใน Modal ด้วยความเรียบร้อย
    modalCategory.style.display = 'inline-block';
    modalDate.style.display = 'inline-block';

    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}


// --- Main Execution after DOM is ready ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Start Preloader & Slideshow ---
    window.onload = function() {
        if (preloader) {
             preloader.classList.add('preloader-hidden');
        }
        showSlides(slideIndex); // เริ่ม Slideshow ที่สไลด์แรก
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
        if (header) { // Check if header exists
            if (scrollTop > 100) {
                if (scrollTop > lastScrollTop) {
                    header.classList.add('header-hidden');
                } else {
                    header.classList.remove('header-hidden');
                }
            } else {
                header.classList.remove('header-hidden');
            }

            // 2. Header Scrolled Background Logic
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
            // ✨ ปรับ Offset ให้แม่นยำขึ้นตามความสูง Header ✨
            const headerHeight = header ? header.offsetHeight : 70; // ความสูง Header โดยประมาณ
            if (scrollTop >= sectionTop - headerHeight * 1.5) { // เช็คที่ระยะ 1.5 เท่าของ Header
                currentSectionId = section.getAttribute('id');
            }
        });
         navLinks.forEach(link => {
             link.classList.remove('active');
             const linkHref = link.getAttribute('href');
             // ใช้ endsWith เพื่อให้แม่นยำสำหรับ #home-slideshow
             if (linkHref && currentSectionId && linkHref.endsWith(currentSectionId)) {
                 link.classList.add('active');
             // ✨ ทำให้ Home active ตอนอยู่บนสุด (เช็คกับ ID slideshow) ✨
             } else if (!currentSectionId && linkHref && linkHref.endsWith('home-slideshow')) {
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

        // Update last scroll position
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

// News Modals
if (newsCards) {
    newsCards.forEach(card => {
        card.addEventListener('click', () => {
            openModal(card);
        });
    });
}

// Tour Modals
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

// General Modal Close Listeners
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
        // Close only if clicking the overlay itself, not the content inside
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
}

// Back to Top Button Click (Smooth scroll handled by CSS `scroll-behavior: smooth`)
// No extra JS needed unless customizing scroll behavior further.