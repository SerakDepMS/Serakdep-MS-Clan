document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (question && answer) {
      let arrow = question.querySelector(".faq-arrow");
      if (!arrow) {
        arrow = document.createElement("i");
        arrow.className = "fas fa-chevron-down faq-arrow";
        question.appendChild(arrow);
      }

      question.addEventListener("click", function () {
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active");
            const otherAnswer = otherItem.querySelector(".faq-answer");
            if (otherAnswer) {
              otherAnswer.style.display = "none";
            }
          }
        });

        item.classList.toggle("active");

        if (item.classList.contains("active")) {
          answer.style.display = "block";
          arrow.style.transform = "rotate(180deg)";
        } else {
          answer.style.display = "none";
          arrow.style.transform = "rotate(0deg)";
        }
      });

      answer.style.display = "none";
    }
  });

  const hash = window.location.hash;
  if (hash) {
    const targetItem = document.querySelector(hash);
    if (targetItem && targetItem.classList.contains("faq-item")) {
      setTimeout(() => {
        targetItem.querySelector(".faq-question")?.click();
      }, 100);
    }
  }
});
