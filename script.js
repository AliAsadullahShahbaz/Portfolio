const scroll = new LocomotiveScroll({
    el: document.querySelector("#id"),
    smooth: true
});

let timeout;
function circleMouseSkew() {
    let xscale = 1;
    let yscale = 1;
    let xprev = 0;
    let yprev = 0;
    window.addEventListener("mousemove", function (details) {
        clearTimeout(timeout);
        xscale = gsap.utils.clamp(.8, 1.2, details.clientX - xprev);
        yscale = gsap.utils.clamp(.8, 1.2, details.clientY - yprev);

        xprev = details.clientX;
        yprev = details.clientY;

        circleMouseFollower(xscale, yscale);

        timeout = setTimeout(() => {
            document.getElementById("minicircle").style.transform = `translate(${details.clientX}px,${details.clientY}px) scale(1,1)`;
        }, 100)
    });
}
circleMouseSkew();
function heroPageAnimation() {
    let tl = gsap.timeline();

    tl.from("#nav", {
        y: '-10',
        opacity: 0,
        duration: 2.5,
        ease: Expo.easeInOut
    }).to('.boundingelem', {
        y: 0,
        ease: Expo.easeInOut,
        duration: 2,
        delay: -1,
        stagger: .2
    }).from('#herofooter', {
        y: '-10',
        opacity: 0,
        duration: 2.5,
        delay: -1,
        ease: Expo.easeInOut
    }).from('.projects-container', {
        y: '-10',
        opacity: 0,
        duration: 2.5,
        delay: -1,
        ease: Expo.easeInOut
    })
}

function circleMouseFollower(xscale, yscale) {
    window.addEventListener("mousemove", function (details) {

        document.getElementById("minicircle").style.transform = `translate(${details.clientX}px,${details.clientY}px) scale(${xscale},${yscale})`;
    })
}
heroPageAnimation();

// Animation on the images of the 2nd Section of Home Page
document.querySelectorAll(".elem").forEach(function (elem) {
    let rotate = 0;
    let diff_rotate = 0 ;
    elem.addEventListener("mousemove", (details) => {
        let diff = details.clientY - elem.getBoundingClientRect().top;
        diff_rotate = details.clientX - rotate;
        rotate = details.clientX;
        gsap.to(elem.querySelector("img"), {
            opacity: 1,
            ease: "power2.inOut",
            scale: 1.1,
            top: diff,
            left: details.clientX,
            rotate:gsap.utils.clamp(-20, 20, diff_rotate*0.2)

        })
    });
    elem.addEventListener("mouseleave", (details) => {
        gsap.to(elem.querySelector("img"), {
            opacity: 0.5,
            ease: "power2.inOut",
            scale: 1
        })
    });
})