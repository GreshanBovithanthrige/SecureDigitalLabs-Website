document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const returnButton = document.getElementById("portfolio-return");

    if (params.get("from") === "portfolio") {
        returnButton.classList.remove("d-none");
    }
});