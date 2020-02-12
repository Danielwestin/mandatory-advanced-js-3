import gsap from 'gsap';

export function slide(direction, front, behind, cb){
const duration = 1;

gsap.to(behind, {
  duration: duration,
  x: `${direction === "left" ? "-" : ""}100%`,
  ease: "power1.out",
  borderBottomRightRadius: direction === "left" ? 0 : 10,
  borderTopRightRadius: direction === "left" ? 0 : 10,
  borderBottomLeftRadius: direction === "left" ? 10 : 0,
  borderTopLeftRadius: direction === "left" ? 10 : 0,
  onComplete: cb
})

gsap.to(front, {
  duration: duration,
  opacity: 0,
})
}

export function fadeIn(title, form) {

  gsap.timeline()
  .from(title, {
    duration: 0.6,
    y: 100,
    opacity: 0,
  })
  .to(form, {
    delay: -0.3,
    duration: 1.6,
    opacity: 1,
  })

}

export function deleteFadeOut(li, remove) {
  
  gsap.to(li, {
    duration: 1,
    opacity: 0,
    onComplete: remove,
  })
}
