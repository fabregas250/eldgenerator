function toggleAnswer(element) {
    var answer = element.nextElementSibling;
    var icon = element.querySelector('.toggle-icon');

    if (answer.style.display === "none" || !answer.style.display) {
        answer.style.display = "block";
        icon.textContent = "×"; // Change + to ×
    } else {
        answer.style.display = "none";
        icon.textContent = "+"; // Change × back to +
    }
}