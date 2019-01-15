document.body.style.border = "5px solid red";

document.querySelectorAll('a[title$="Waitlist"]').forEach((el) => {
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const circleEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    svgEl.setAttribute("width", 20);
    svgEl.setAttribute("height", 20);
    circleEl.setAttribute("cx", 10);
    circleEl.setAttribute("cy", 10);
    circleEl.setAttribute("r", 10);
    circleEl.setAttribute("fill", "white");
    
    svgEl.onclick = startWaitlistCheck;
    
    svgEl.appendChild(circleEl);
    el.parentNode.append(svgEl);
    
});

function startWaitlistCheck() {
}