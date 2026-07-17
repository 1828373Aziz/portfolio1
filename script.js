document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Toggle hamburger animation
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // 2. Bilingual Typewriter Effect
    const typedTextSpan = document.querySelector(".typed-text");
    const typewriterTexts = {
        ar: [
            "متدرب تعاوني في وزارة النقل والخدمات اللوجستية",
            "خريج هندسة برمجيات طموح",
            "شغوف بكتابة الكود النظيف وتصميم الـ UI/UX"
        ],
        en: [
            "Co-op Intern at Ministry of Transport & Logistics Services",
            "Ambitious Software Engineering Graduate",
            "Passionate about Clean Code and UI/UX Design"
        ]
    };
    
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;
    let isErasing = false;

    function typeEffect() {
        const currentLang = document.documentElement.getAttribute('lang') || 'ar';
        const textArray = typewriterTexts[currentLang];
        
        if (!textArray[textArrayIndex]) {
            textArrayIndex = 0;
        }
        
        const currentText = textArray[textArrayIndex];

        if (!isErasing) {
            typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentText.length) {
                isErasing = true;
                setTimeout(typeEffect, newTextDelay);
            } else {
                setTimeout(typeEffect, typingDelay);
            }
        } else {
            typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isErasing = false;
                textArrayIndex = (textArrayIndex + 1) % textArray.length;
                setTimeout(typeEffect, typingDelay + 500);
            } else {
                setTimeout(typeEffect, erasingDelay);
            }
        }
    }

    if (typedTextSpan) {
        setTimeout(typeEffect, 1000);
    }

    // 3. Project Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8) translateY(20px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // 4. Scroll Active Link Highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 5. Contact Form Submission with FormSubmit API
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentLang = document.documentElement.getAttribute('lang') || 'ar';
            
            if (currentLang === 'ar') {
                formStatus.textContent = "جاري إرسال رسالتك مباشرة لبريد عبد العزيز...";
            } else {
                formStatus.textContent = "Sending your message directly to Abdulaziz's email...";
            }
            formStatus.className = "form-status";

            const formData = new FormData(contactForm);
            
            // Send the email using FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/azizom555723@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === "true" || data.success === true) {
                    if (currentLang === 'ar') {
                        formStatus.textContent = "تم إرسال رسالتك بنجاح ووصلت لبريد عبد العزيز الشخصي!";
                    } else {
                        formStatus.textContent = "Thank you! Your message has been sent successfully directly to Abdulaziz's inbox.";
                    }
                    formStatus.className = "form-status success";
                    contactForm.reset();
                } else {
                    throw new Error("FormSubmit failed");
                }
            })
            .catch(error => {
                if (currentLang === 'ar') {
                    formStatus.textContent = "عذراً، حدث خطأ أثناء الإرسال. يرجى مراسلتي مباشرة عبر البريد الإلكتروني المكتوب.";
                } else {
                    formStatus.textContent = "Sorry, an error occurred. Please contact me directly via the displayed email.";
                }
                formStatus.className = "form-status error";
                console.error("Error sending message: ", error);
            });
        });
    }

    // 6. Language Switcher Logic
    const langBtn = document.getElementById('langBtn');
    
    const translations = {
        en: {
            "logo": "Abdulaziz.",
            "nav-home": "Home",
            "nav-about": "About",
            "nav-projects": "Projects",
            "nav-certs": "Certificates",
            "nav-workshops": "Workshops",
            "nav-contact": "Contact",
            "cv-btn": "<i class=\"fa-solid fa-download\"></i> Resume",
            "hero-tag": "Welcome to my personal website",
            "hero-title": "I am <span>Abdulaziz Alsaeed</span>",
            "hero-desc": "Software Engineering graduate from the University of Hail. I seek to apply my academic and practical skills in solving technical problems and developing software solutions. I am currently undertaking my cooperative training at the Ministry of Transport and Logistics Services to advance my professional career.",
            "contact-btn": "<i class=\"fa-solid fa-paper-plane\"></i> Contact Me",
            "download-cv": "<i class=\"fa-solid fa-file-pdf\"></i> Download CV",
            "about-tag": "Who am I?",
            "about-title": "About Me & Professional Career",
            "about-subtitle": "Passionate about Software Engineering & Smart Solutions",
            "about-desc": "Software Engineering graduate, interested in software development and modern technologies. I strive to develop my skills through continuous learning and practical application, with a passion for building technical solutions and gaining experiences.",
            "degree-title": "B.S. in Software Engineering",
            "degree-university": "University of Hail | Graduation: 2026",
            "badge-active": "Active Now",
            "internship-title": "Co-op Internship",
            "internship-dept": "Ministry of Transport & Logistics Services",
            "internship-desc": "Working as a Co-op Intern to support digital transformation and develop software, logistical, and services solutions within the Ministry's sectors in the Hail region.",
            "internship-start": "<i class=\"fa-regular fa-calendar-days\"></i> Start: June 2026",
            "internship-location": "<i class=\"fa-solid fa-location-dot\"></i> Hail, Saudi Arabia",
            "skills-title": "Key Skills & Technologies",
            "projects-tag": "Portfolio",
            "projects-title": "Academic & Personal Projects",
            "filter-all": "All",
            "filter-uni": "Academic Projects",
            "filter-pers": "Personal Projects",
            "project-badge-pers": "Personal Project",
            "project-badge-uni": "Academic Project",
            "p1-title": "ProjectFlow – Project & Task Management",
            "p1-desc": "A complete project and task tracking application designed for team collaboration and workflow management with responsive interfaces.",
            "project-links-live": "<i class=\"fa-solid fa-globe\"></i> Live Demo",
            "project-links-code": "<i class=\"fa-brands fa-github\"></i> View Code",
            "p2-title": "Student Task Management System",
            "p2-desc": "Research and design of a student task management system to organize academic assignments, study schedules, and project deadlines.",
            "project-links-doc": "<i class=\"fa-solid fa-file-pdf\"></i> View Report & Research",
            "p3-title": "Software Modelling & Simulation",
            "p3-desc": "Process modelling study for the Student Results Management System (SRMS), featuring bottleneck analysis and Monte Carlo simulations for delivery risk management.",
            "project-links-doc-srms": "<i class=\"fa-solid fa-file-pdf\"></i> View Report & Diagrams",
            "p4-title": "University Parking System",
            "p4-desc": "Design and development of a smart management system to regulate and simplify university campus parking operations for better flow.",
            "project-links-doc-parking": "<i class=\"fa-solid fa-file-pdf\"></i> View Project (PDF)",
            "p5-title": "Electronic Library System",
            "p5-desc": "A desktop library application developed in Java to manage book loans, categories, and users implementing object-oriented programming principles.",
            "project-links-code-library": "<i class=\"fa-brands fa-github\"></i> Java Code",
            "p6-title": "UX Design Project",
            "p6-desc": "Research and interface design for an end-user application, featuring prototypes and detailed usability studies.",
            "project-links-doc-ux": "<i class=\"fa-solid fa-palette\"></i> View Prototype & Design",
            "p7-title": "Data Analysis using R (R Project)",
            "p7-desc": "Statistical data analysis applied on datasets to extract insights, build charts, and compile comprehensive statistical reports.",
            "project-links-doc-r": "<i class=\"fa-solid fa-file-code\"></i> View R Code & Report",
            "certs-tag": "Certificates",
            "certs-title": "Certificates",
            "c1-title": "Infographic Design Bootcamp",
            "c1-desc": "Designing infographics and structuring visual elements attractively.",
            "view-cert": "<i class=\"fa-solid fa-arrow-up-right-from-square\"></i> View Certificate",
            "c2-title": "Software Engineering Principles",
            "c2-desc": "Core principles and foundations of software engineering in collaboration with MCIT.",
            "c3-title": "Building Sustainable Business Ventures",
            "c3-desc": "Sustainable business venture development certificate issued by JA Worldwide.",
            "c4-title": "IBM Data Fundamentals",
            "c4-desc": "Foundations of data science, database structures, and big data analysis from IBM.",
            "c5-title": "Python Programming Basics",
            "c5-desc": "Core Python programming, data structures, and problem solving from Huawei.",
            "c6-title": "Introduction to Cybersecurity",
            "c6-desc": "Cisco certified fundamentals of cybersecurity, network defense, and data protection.",
            "c7-title": "AI ERA NEON Bootcamp",
            "c7-desc": "Completed an AI bootcamp covering the fundamentals of artificial intelligence, practical applications, and modern AI technologies.",
            "workshops-tag": "Workshops",
            "workshops-title": "Workshops",
            "w1-title": "Python Programming Bootcamp",
            "w1-desc": "Attended workshop for knowledge sharing, overview, and technical skill development - Taif University.",
            "view-doc": "<i class=\"fa-solid fa-arrow-up-right-from-square\"></i> View Document",
            "w2-title": "Generative AI Course",
            "w2-desc": "Attended workshop for knowledge sharing, overview, and technical skill development - Google.",
            "w3-title": "AskZad Database & Digital Publishing",
            "w3-desc": "Attended workshop for knowledge sharing, database query, and digital publishing - SDL.",
            "w4-title": "Clean Code & SOLID Principles",
            "w4-desc": "Attended workshop for clean code best practices and SOLID architectural principles.",
            "w5-title": "Design with Intelligence: AI in Education",
            "w5-desc": "Attended workshop for AI tools integration in educational workflows.",
            "w6-title": "Cybersecurity: Building Secure Applications",
            "w6-desc": "Attended workshop for application security, threat modelling, and secure coding.",
            "w7-title": "Containerization with Nginx & Docker",
            "w7-desc": "Attended workshop for microservices deployment, Nginx proxy, and Docker containerization.",
            "contact-tag": "Contact",
            "contact-title": "Start a Conversation with Me",
            "contact-email": "Email Address",
            "contact-location": "Location",
            "contact-name-label": "Your Name",
            "contact-email-label": "Email Address",
            "contact-subj-label": "Subject",
            "contact-msg-label": "Message",
            "contact-submit": "Send Message <i class=\"fa-regular fa-paper-plane\"></i>",
            "copyright": "All Rights Reserved © 2026 | Abdulaziz Alsaeed"
        },
        ar: {
            "logo": "عبد العزيز<span>.</span>",
            "nav-home": "الرئيسية",
            "nav-about": "عني",
            "nav-projects": "مشاريعي",
            "nav-certs": "الشهادات",
            "nav-workshops": "ورش العمل",
            "nav-contact": "اتصل بي",
            "cv-btn": "<i class=\"fa-solid fa-download\"></i> السيرة الذاتية",
            "hero-tag": "أهلاً بك في موقعي الشخصي",
            "hero-title": "أنا <span>عبد العزيز السعيد</span>",
            "hero-desc": "خريج هندسة برمجيات من جامعة حائل، أسعى لتوظيف مهاراتي الأكاديمية والعملية في حل المشكلات التقنية وتطوير الحلول البرمجية. أقضي حالياً فترة تدريبي التعاوني في وزارة النقل والخدمات اللوجستية لتطوير مسيرتي المهنية.",
            "contact-btn": "<i class=\"fa-solid fa-paper-plane\"></i> تواصل معي",
            "download-cv": "<i class=\"fa-solid fa-file-pdf\"></i> تحميل السيرة الذاتية",
            "about-tag": "من أنا؟",
            "about-title": "نبذة عني ومسيرتي المهنية",
            "about-subtitle": "شغوف بالهندسة البرمجية والحلول الذكية",
            "about-desc": "خريج هندسة برمجيات، مهتم بتطوير البرمجيات والتقنيات الحديثة، وأسعى إلى تطوير مهاراتي من خلال التعلم المستمر والتطبيق العملي، مع شغف ببناء حلول تقنية واكتساب الخبرات.",
            "degree-title": "بكالوريوس هندسة برمجيات",
            "degree-university": "جامعة حائل | تخرج: 2026",
            "badge-active": "نشط حالياً",
            "internship-title": "التدريب التعاوني",
            "internship-dept": "وزارة النقل والخدمات اللوجستية",
            "internship-desc": "أعمل كمتدرب تعاوني لدعم التحول الرقمي وتطوير الحلول البرمجية واللوجستية والخدماتية داخل قطاعات الوزارة في منطقة حائل.",
            "internship-start": "<i class=\"fa-regular fa-calendar-days\"></i> البداية: يونيو 2026",
            "internship-location": "<i class=\"fa-solid fa-location-dot\"></i> حائل، المملكة العربية السعودية",
            "skills-title": "أبرز المهارات والتقنيات",
            "projects-tag": "أعمالي",
            "projects-title": "المشاريع الجامعية والشخصية",
            "filter-all": "الكل",
            "filter-uni": "مشاريع جامعية",
            "filter-pers": "مشاريع شخصية",
            "project-badge-pers": "مشروع شخصي",
            "project-badge-uni": "مشروع جامعي",
            "p1-title": "ProjectFlow – نظام إدارة المشاريع والمهام",
            "p1-desc": "تطبيق ونظام متكامل لتتبع وإدارة المشاريع والمهام اليومية وتوزيع المهام بين فرق العمل بمرونة وسهولة، مع واجهات مستخدم متجاوبة.",
            "project-links-live": "<i class=\"fa-solid fa-globe\"></i> زيارة المشروع",
            "project-links-code": "<i class=\"fa-brands fa-github\"></i> كود المشروع",
            "p2-title": "Student Task Management System",
            "p2-desc": "بحث وتصميم نظام إدارة مهام الطلاب لمساعدتهم في تنظيم التكاليف الأكاديمية وجداول الدراسة وتتبع المواعيد النهائية للمشاريع.",
            "project-links-doc": "<i class=\"fa-solid fa-file-pdf\"></i> عرض التقرير والبحث",
            "p3-title": "Software Modelling & Simulation",
            "p3-desc": "دراسة ونمذجة العمليات البرمجية لنظام نتائج الطلاب (SRMS)، مع عمل تحليل الاختناقات (Bottleneck Analysis) ومحاكاة مونت كارلو لإدارة مخاطر تسليم المشاريع.",
            "project-links-doc-srms": "<i class=\"fa-solid fa-file-pdf\"></i> عرض التقرير والرسومات",
            "p4-title": "نظام مواقف السيارات الجامعي (University Parking System)",
            "p4-desc": "مشروع تصميم وتطوير نظام إدارة ذكي لتنظيم وتسهيل عمليات مواقف السيارات داخل الحرم الجامعي لتحقيق انسيابية أفضل.",
            "project-links-doc-parking": "<i class=\"fa-solid fa-file-pdf\"></i> عرض المشروع (PDF)",
            "p5-title": "نظام المكتبة الإلكترونية (Electronic Library System)",
            "p5-desc": "تطبيق مكتبي متكامل بلغة Java لإدارة استعارة الكتب وتنظيم الأقسام والمستفيدين باستخدام مبادئ البرمجة كائنية التوجه (OOP).",
            "project-links-code-library": "<i class=\"fa-brands fa-github\"></i> كود الجافا",
            "p6-title": "مشروع تصميم تجربة المستخدم (UX Design Project)",
            "p6-desc": "بحث وتصميم واجهات تطبيق مستخدم نهائي، مع بناء النماذج الأولية ودراسة تجربة المستخدم وسهولة الاستخدام بالتفصيل.",
            "project-links-doc-ux": "<i class=\"fa-solid fa-palette\"></i> عرض النموذج والتصميم",
            "p7-title": "تحليل البيانات بلغة R (R Project)",
            "p7-desc": "تطبيق تحليل إحصائي متقدم على عينات بيانات واستخلاص الرؤى والمؤشرات وبناء التقارير الإحصائية والرسومات التوضيحية.",
            "project-links-doc-r": "<i class=\"fa-solid fa-file-code\"></i> عرض كود R والتقرير",
            "certs-tag": "الشهادات",
            "certs-title": "الشهادات",
            "c1-title": "Infographic Design Bootcamp",
            "c1-desc": "تصميم الإنفوجرافيك وتوزيع العناصر البصرية بشكل جذاب.",
            "view-cert": "<i class=\"fa-solid fa-arrow-up-right-from-square"></i> عرض الشهادة (Google Drive)",
            "c2-title": "Software Engineering Principles",
            "c2-desc": "مبادئ وأسس هندسة البرمجيات بالتعاون مع وزارة الاتصالات وتقنية المعلومات.",
            "c3-title": "Building Sustainable Business Ventures",
            "c3-desc": "شهادة تطوير المشاريع التجارية المستدامة الصادرة من منظمة JA Worldwide العالمية.",
            "c4-title": "IBM Data Fundamentals",
            "c4-desc": "أساسيات تحليل وهندسة البيانات والتعامل مع قواعد البيانات الضخمة من IBM.",
            "c5-title": "Python Programming Basics",
            "c5-desc": "أساسيات لغة بايثون للبرمجة وهيكلة البيانات وحل المشكلات من شركة Huawei.",
            "c6-title": "Introduction to Cybersecurity",
            "c6-desc": "أساسيات ومفاهيم الأمن السيبراني وحماية الشبكات وتأمين البيانات من Cisco.",
            "c7-title": "AI ERA NEON Bootcamp",
            "c7-desc": "معسكر بوتكامب في الذكاء الاصطناعي يغطي أساسيات وتطبيقات وتقنيات الذكاء الاصطناعي الحديثة.",
            "workshops-tag": "ورش العمل",
            "workshops-title": "ورش العمل",
            "w1-title": "Python Programming Bootcamp",
            "w1-desc": "ورشة عمل للاطلاع والاستفادة وتطوير المهارات التقنية - جامعة الطائف.",
            "view-doc": "<i class=\"fa-solid fa-arrow-up-right-from-square"></i> عرض المستند / الشهادة",
            "w2-title": "Generative AI Course",
            "w2-desc": "ورشة عمل للاطلاع والاستفادة وتطوير المهارات التقنية - مهارت من Google.",
            "w3-title": "AskZad Database & Digital Publishing",
            "w3-desc": "ورشة عمل للاطلاع والاستفادة وتطوير المهارات التقنية - المكتبة الرقمية السعودية.",
            "w4-title": "Clean Code & SOLID Principles",
            "w4-desc": "ورشة عمل للاطلاع والاستفادة وتطوير المهارات التقنية.",
            "w5-title": "Design with Intelligence: AI in Education",
            "w5-desc": "ورشة عمل للاطلاع والاستفادة وتطوير المهارات التقنية.",
            "w6-title": "Cybersecurity: Building Secure Applications",
            "w6-desc": "ورشة عمل للاطلاع والاستفادة وتطوير المهارات التقنية.",
            "w7-title": "Containerization with Nginx & Docker",
            "w7-desc": "ورشة عمل للاطلاع والاستفادة وتطوير المهارات التقنية.",
            "contact-tag": "تواصل",
            "contact-title": "ابدأ محادثة معي اليوم",
            "contact-email": "البريد الإلكتروني",
            "contact-location": "الموقع",
            "contact-name-label": "الاسم الكريم",
            "contact-email-label": "البريد الإلكتروني",
            "contact-subj-label": "الموضوع",
            "contact-msg-label": "الرسالة",
            "contact-submit": "إرسال الرسالة <i class=\"fa-regular fa-paper-plane\"></i>",
            "copyright": "جميع الحقوق محفوظة © 2026 | عبد العزيز السعيد"
        }
    };

    const placeholders = {
        en: {
            "name": "e.g. Abdullah Ahmad",
            "email": "e.g. example@mail.com",
            "subject": "e.g. Job / Internship opportunity",
            "message": "Write your message here..."
        },
        ar: {
            "name": "مثال: عبد الله أحمد",
            "email": "مثال: example@mail.com",
            "subject": "مثال: فرصة تدريبية / وظيفة",
            "message": "اكتب تفاصيل رسالتك هنا..."
        }
    };

    function setLanguage(lang) {
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        
        // Update language button text
        langBtn.textContent = lang === 'ar' ? 'EN' : 'العربية';
        
        // Translate all i18n marked elements
        const i18nElements = document.querySelectorAll('[data-i18n]');
        i18nElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Translate inputs placeholders
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');

        if (nameInput) nameInput.placeholder = placeholders[lang]["name"];
        if (emailInput) emailInput.placeholder = placeholders[lang]["email"];
        if (subjectInput) subjectInput.placeholder = placeholders[lang]["subject"];
        if (messageInput) messageInput.placeholder = placeholders[lang]["message"];

        // Restart typewriter with the selected language
        charIndex = 0;
        isErasing = false;
        textArrayIndex = 0;
    }

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const currentLang = document.documentElement.getAttribute('lang') || 'ar';
            const nextLang = currentLang === 'ar' ? 'en' : 'ar';
            setLanguage(nextLang);
        });
    }
});