(function () {
    // 1. Cấu hình các hiệu ứng hạt (giữ nguyên logic gốc)
    function r(a) { 
        gsap.killTweensOf(a, { opacity: !0 }); 
        gsap.fromTo(a, { opacity: 1 }, { duration: .07, opacity: Math.random(), repeat: -1 }) 
    } 

    function t(a) {
        if (e) {
            a = l[d];
            gsap.set(a, { x: gsap.getProperty(".pContainer", "x"), y: gsap.getProperty(".pContainer", "y"), scale: m() });
            gsap.timeline().to(a, {
                duration: gsap.utils.random(.61, 6),
                physics2D: { velocity: gsap.utils.random(-23, 23), angle: gsap.utils.random(-180, 180), gravity: gsap.utils.random(-6, 50) },
                scale: 0,
                rotation: gsap.utils.random(-123, 360),
                ease: "power1",
                onStart: r,
                onStartParams: [a],
                onRepeat: function (b) { gsap.set(b, { scale: m() }) },
                onRepeatParams: [a]
            });
            d++;
            d = 201 <= d ? 0 : d;
        }
    }

    // 2. Khởi tạo các biến và Element
    MorphSVGPlugin.convertToPath("polygon"); 
    document.querySelector(".pContainer"); 
    var u = document.querySelector(".mainSVG"); 
    document.querySelector("#star"); 
    var c_sparkle = document.querySelector(".sparkle"); 
    document.querySelector("#tree"); 
    var e = !0; 
    var n = "#E8F6F8 #ACE8F8 #F6FBFE #A2CBDC #B74551 #5DBA72 #910B28 #910B28 #446D39".split(" "); 
    var p = ["#star", "#circ", "#cross", "#heart"]; 
    var l = [], d = 0; 

    gsap.set("svg", { visibility: "visible" }); 
    gsap.set(c_sparkle, { transformOrigin: "50% 50%", y: -100 }); 

    // Hàm lấy tọa độ đường dẫn
    var getPathPoints = function (a) { 
        var b = [], f = MotionPathPlugin.getRawPath(a)[0]; 
        f.forEach(function (v, g) { 
            var h = {}; 
            h.x = f[2 * g]; 
            h.y = f[2 * g + 1]; 
            g % 2 && b.push(h) 
        }); 
        return b 
    }; 
    
    getPathPoints(".treePath"); 
    var q = getPathPoints(".treeBottomPath"); 

    // --- TIMELINE CHÍNH (Biến c) ---
    var c = gsap.timeline({ delay: 0, repeat: 0 }); 
    var k, m = gsap.utils.random(.5, 3, .001, !0); 

    // Tạo các hạt particle
    (function () {
        for (var a = 201, b; -1 < --a;) {
            b = document.querySelector(p[a % p.length]).cloneNode(!0);
            u.appendChild(b);
            b.setAttribute("fill", n[a % n.length]);
            b.setAttribute("class", "particle");
            l.push(b);
            gsap.set(b, { x: -100, y: -100, transformOrigin: "50% 50%" });
        }
    })(); 

    // Xây dựng kịch bản vẽ cây
    (function () { 
        k = gsap.timeline({ onUpdate: t }); 
        k.to(".pContainer, .sparkle", { duration: 6, motionPath: { path: ".treePath", autoRotate: !1 }, ease: "linear" })
         .to(".pContainer, .sparkle", { duration: 1, onStart: function () { e = !1 }, x: q[0].x, y: q[0].y })
         .to(".pContainer, .sparkle", { duration: 2, onStart: function () { e = !0 }, motionPath: { path: ".treeBottomPath", autoRotate: !1 }, ease: "linear" }, "-=0")
         .from(".treeBottomMask", { duration: 2, drawSVG: "0% 0%", stroke: "#FFF", ease: "linear" }, "-=2");
    })(); 

    c.from([".treePathMask", ".treePotMask"], { drawSVG: "0% 0%", stroke: "#FFF", stagger: { each: 6 }, duration: gsap.utils.wrap([6, 1, 2]), ease: "linear" })
     .from(".treeStar", { duration: 3, scaleY: 0, scaleX: .15, transformOrigin: "50% 50%", ease: "elastic(1,0.5)" }, "-=4")
     .to(".sparkle", { duration: 3, opacity: 0, ease: "rough({strength: 2, points: 100, template: linear, taper: both, randomize: true, clamp: false})" }, "-=0")
     .to(".treeStarOutline", { duration: 1, opacity: 1, ease: "rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})" }, "+=1"); 
    
    c.add(k, 0); 
    gsap.globalTimeline.timeScale(1.5);


    // ==========================================
    // PHẦN XỬ LÝ CHỮ VÀ LẶP LẠI (LOOP)
    // ==========================================
    
    const messages = [
        "🎄 Merry Christmas 🎅❄",
        "✝️ Giáng Sinh an lành trong ơn Chúa",
        "🙏 Nguyện Chúa luôn đồng hành cùng bạn",
        "— GB _ Khánh —"
    ];

    const endMessage = document.getElementById("endMessage");
    let msgIndex = 0;
    let charIndex = 0;

    function typeWriter() {
        if (!endMessage) return;

        // Nếu còn chữ trong câu -> Gõ tiếp
        if (charIndex < messages[msgIndex].length) {
            endMessage.style.opacity = 1;
            endMessage.textContent += messages[msgIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 80); // Tốc độ gõ
        } else {
            // Đã gõ xong 1 câu -> Đợi chút rồi xóa
            setTimeout(() => {
                endMessage.style.opacity = 0; // Làm mờ

                setTimeout(() => {
                    msgIndex++; // Chuyển sang câu tiếp theo
                    charIndex = 0;
                    endMessage.textContent = "";

                    // KIỂM TRA: NẾU HẾT CÁC CÂU CHÚC -> RESET TOÀN BỘ
                    if (msgIndex >= messages.length) {
                        // Reset lại chỉ số câu
                        msgIndex = 0;
                        
                        // Dừng các hiệu ứng lấp lánh đang chạy
                        gsap.killTweensOf(".particle");
                        gsap.killTweensOf("#tree");
                        
                        // Ẩn cây đi để vẽ lại từ đầu
                        gsap.set(".particle", { x: -100, y: -100, opacity: 1, scale: 1 });
                        
                        // Restart lại Timeline chính (Vẽ lại cây)
                        c.restart();
                        return; 
                    }

                    // Nếu chưa hết câu thì chạy câu tiếp theo
                    typeWriter();
                }, 800); // Thời gian chờ khi mờ đi
            }, 2000); // Thời gian dừng lại để đọc
        }
    }

    // Khi Timeline vẽ cây chạy xong (onComplete)
    c.eventCallback("onComplete", () => {
        // 1. Tạo hiệu ứng lấp lánh cho cây trong lúc hiện chữ
        gsap.killTweensOf(".particle");
        const stars = gsap.utils.toArray(".particle");
        const paths = MotionPathPlugin.getRawPath("#treePath"); // Lưu ý: ID treePath trong SVG phải đúng
        
        // Nếu tìm thấy đường path để rải hạt
        if(paths && paths.length > 0) {
            const fullPath = paths.flat();
            stars.forEach((star, i) => {
                const p = fullPath[Math.floor((i / stars.length) * fullPath.length)];
                if (p) {
                    gsap.set(star, {
                        x: p.x + gsap.utils.random(-5, 5),
                        y: p.y + gsap.utils.random(-5, 5),
                        scale: gsap.utils.random(0.4, 0.7),
                        opacity: 0.6
                    });
                    gsap.to(star, {
                        opacity: gsap.utils.random(0.5, 0.9),
                        duration: gsap.utils.random(2, 4),
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });
                }
            });
        }

        // Hiệu ứng hào quang cây
        gsap.to("#tree", {
            filter: "drop-shadow(0 0 60px rgba(255, 215, 0, 0.8))",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // 2. Bắt đầu chạy chữ
        typeWriter();
    });

    // ==========================================
    // TẠO HIỆU ỨNG TUYẾT RƠI (BẢN NHIỀU TUYẾT)
    // ==========================================
    (function createSnow() {
        // Kiểm tra xem đã có container chưa, nếu chưa mới tạo
        if(document.querySelector('.snow-container')) return;

        const snowContainer = document.createElement('div');
        snowContainer.className = 'snow-container';
        document.body.appendChild(snowContainer);

        // --- SỬA SỐ NÀY ĐỂ TĂNG GIẢM TUYẾT ---
        const totalSnowflakes = 500; // Sửa 50 thành 200 (hoặc 300 nếu muốn dày đặc hơn)
        // -------------------------------------

        for (let i = 0; i < totalSnowflakes; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            
            // Random vị trí ngang
            snowflake.style.left = Math.random() * 100 + '%';
            
            // Random thời gian trễ để tuyết không rơi cùng lúc
            snowflake.style.animationDelay = Math.random() * 10 + 's';
            
            // Random độ mờ (có bông rõ, bông mờ)
            snowflake.style.opacity = Math.random(); 
            
            // Random kích thước bằng JS để trông tự nhiên hơn
            // (Tạo bông to nhỏ từ 2px đến 7px)
            const size = Math.random() * 5 + 2 + 'px';
            snowflake.style.width = size;
            snowflake.style.height = size;

            snowContainer.appendChild(snowflake);
        }
    })();
})();