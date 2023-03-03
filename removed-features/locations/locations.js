"use strict"

$(() => {
	const params = new URLSearchParams(window.location.search);
	const target = params.get("highlight");
	if (target) {
		console.log("Adding highlight to: " + target);
		const elem = document.getElementById(target);
		if (elem) {
			elem.classList.add("highlight");
			elem.scrollIntoView(); //TODO FIX
		}
	}

window.onkeyup = function (e) {
	if (e.key == "Escape") {
		$(`.item.highlight`).removeClass("highlight");
		window.history.pushState({}, document.title, "/locations.html");
	}
}
});