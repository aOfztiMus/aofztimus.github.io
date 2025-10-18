// script.js (ฉบับสมบูรณ์ล่าสุด - พร้อม Slideshow)

let slideIndex = 0; // ตัวแปรสำหรับเก็บว่ากำลังแสดงสไลด์ไหน
let slideshowTimeout; // ตัวแปรสำหรับเก็บ setTimeout เพื่อหยุด/เริ่ม slideshow

document.addEventListener('DOMContentLoaded', () => {
    // --- PRELOADER LOGIC ---
    const preloader = document.querySelector('.preloader');
    window.onload = function() {
        preloader.classList.add('preloader-hidden');
        showSlides(); // ✨ เริ่ม Slideshow ทันทีที่เว็บโหลดเสร็จ ✨
    };
    
    // --- AOS INITIALIZATION ---
    AOS.init({
        duration: 1000,
        once: true,
    });

    // --- SLIDESHOW LOGIC ---
    // ฟังก์ชันสำหรับแสดงสไลด์
    function showSlides() {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        // let dots = document.getElementsByClassName("dot"); // ถ้ามีการใช้ dot navigation

        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}    
        
        // ถ้ามีการใช้ dot navigation
        // for (i = 0; i < dots.length; i++) {
        //     dots[i].className = dots[i].className.replace(" active-dot", "");
        // }

        if (slides[slideIndex-1]) { // เช็คว่าสไลด์มีอยู่จริงก่อนที่จะแสดง
            slides[slideIndex-1].style.display = "block";  
            // if (dots[slideIndex-1]) { // ถ้ามีการใช้ dot navigation
            //     dots[slideIndex-1].className += " active-dot";
            // }
        }
        
        // ตั้งเวลาให้เปลี่ยนสไลด์อัตโนมัติทุก 5 วินาที
        clearTimeout(slideshowTimeout); // ล้าง timeout เก่าก่อนตั้งใหม่
        slideshowTimeout = setTimeout(showSlides, 5000); 
    }

    // ฟังก์ชันสำหรับเปลี่ยนสไลด์ด้วยปุ่ม Prev/Next
    // (ประกาศเป็น Global เพื่อให้ HTML onclick เรียกใช้ได้)
    window.plusSlides = function(n) {
        clearTimeout(slideshowTimeout); // หยุดการสไลด์อัตโนมัติชั่วคราว
        slideIndex += n - 1; // ปรับ index
        if (slideIndex < 0) { slideIndex = document.getElementsByClassName("mySlides").length -1;} // ถ้าไปซ้ายสุด ให้วนกลับมาภาพสุดท้าย
        if (slideIndex >= document.getElementsByClassName("mySlides").length) {slideIndex = 0;} // ถ้าไปขวาสุด ให้วนกลับมาภาพแรก

        // แสดงสไลด์ที่ถูกต้อง
        let slides = document.getElementsByClassName("mySlides");
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        if (slides[slideIndex]) { // เช็คว่าสไลด์มีอยู่จริงก่อนที่จะแสดง
            slides[slideIndex].style.display = "block";
        }
        
        // รีเซ็ตการนับเวลาสำหรับสไลด์อัตโนมัติหลังจากเปลี่ยนด้วยมือ
        slideIndex++; // เพิ่มค่ากลับไป เพื่อให้ showSlides() ทำงานต่อเนื่อง
        slideshowTimeout = setTimeout(showSlides, 5000);
    }
    
    // (ฟังก์ชัน currentSlide สำหรับ dot navigation ถ้าต้องการใช้)
    // window.currentSlide = function(n) {
    //     clearTimeout(slideshowTimeout);
    //     slideIndex = n - 1;
    //     showSlides();
    // }

    // --- ALL SCROLL-RELATED LOGIC ---
    const header = document.querySelector('.main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 1. Logic สำหรับซ่อน/แสดง Header
        if (scrollTop > 100) {
            if (scrollTop > lastScrollTop) {
                header.classList.add('header-hidden'); // เลื่อนลง
            } else {
                header.classList.remove('header-hidden'); // เลื่อนขึ้น
            }
        }
        
        // 2. Logic สำหรับพื้นหลังเบลอ
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 3. Logic สำหรับ Active Link
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollTop >= sectionTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });

        // อัปเดตตำแหน่ง scroll ล่าสุด
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    // --- MOBILE HAMBURGER MENU ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

}); // <-- ปิด DOMContentLoaded ที่นี่

// --- NEWS MODAL LOGIC ---
// (โค้ดส่วนนี้อยู่นอก DOMContentLoaded ถูกต้องแล้ว)
const newsCards = document.querySelectorAll('.news-card');
// --- TOUR MODAL LOGIC ---
const tourButtons = document.querySelectorAll('.open-tour-modal-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const closeBtn = document.querySelector('.close-btn');

// เลือก element ภายใน modal
const modalImage = document.querySelector('.modal-image');
const modalCategory = document.querySelector('.modal-category');
const modalDate = document.querySelector('.modal-date');
const modalTitle = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');
const modalTicketBtn = document.getElementById('modal-ticket-btn');


// ฟังก์ชันเปิด Modal
function openModal(card) {
    const data = card.dataset;
    modalImage.src = data.image;
    modalCategory.textContent = data.category;
    modalDate.textContent = data.date;
    modalTitle.textContent = data.title;
    modalBody.textContent = data.content;
    modalOverlay.classList.add('active');
}

// ฟังก์ชันปิด Modal
function closeModal() {
    modalOverlay.classList.remove('active');
}

// เพิ่ม Event Listener ให้การ์ดข่าวทุกใบ
newsCards.forEach(card => {
    card.addEventListener('click', () => {
        openModal(card);
    });
});

// เพิ่ม Event Listener ให้ปุ่มปิด
closeBtn.addEventListener('click', closeModal);

// เพิ่ม Event Listener ให้ Overlay (คลิกที่พื้นหลังเพื่อปิด)
modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});
tourButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault(); // ป้องกันไม่ให้ลิงก์ '#' เด้งขึ้นบน

        // หา .tour-item ที่เป็นแม่ของปุ่มที่ถูกคลิก
        const tourItem = button.closest('.tour-item');
        const data = tourItem.dataset;

        // นำข้อมูล Tour ไปใส่ใน Modal
        modalImage.src = data.image;
        modalTitle.textContent = data.title;
        modalBody.textContent = data.description;
        
        // ปรับ Header ของ Modal
        modalCategory.textContent = data.location; // ใช้ช่อง Category แสดง Location
        modalDate.textContent = data.date;
        
        // จัดการปุ่มซื้อบัตร
        if (data.status === 'available' && data.ticketLink !== '#') {
            modalTicketBtn.href = data.ticketLink;
            //modalTicketBtn.style.display = 'inline-block'; // แสดงปุ่ม
            //modalTicketBtn.textContent = 'Coming Soon';
            modalTicketBtn.classList.remove('sold-out');
        } else {
            modalTicketBtn.style.display = 'inline-block'; // แสดงปุ่ม
            modalTicketBtn.textContent = 'Out Now';
            modalTicketBtn.classList.add('sold-out'); // เพิ่มคลาส sold-out
            modalTicketBtn.href = '#'; // ไม่ให้คลิกไปไหน
        }

        // แสดง Modal
        modalOverlay.classList.add('active');
    });
});