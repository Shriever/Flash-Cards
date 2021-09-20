// Problem class: Represents a Problem
class Problem {
  constructor(question, answer) {
    this.question = question;
    this.answer = answer;
  }
}

// Store Class: Stores the Questions in LocalStorage
class Store {
  static getProblems() {
    let problems;
    let data = localStorage.getItem("problems");

    if (data === null) {
      problems = [];
    } else {
      problems = JSON.parse(data);
    }

    return problems;
  }
  static addProblem(problem) {
    const problems = Store.getProblems();

    problems.push(problem);

    localStorage.setItem("problems", JSON.stringify(problems));
  }
  static removeProblem(question) {
    const problems = Store.getProblems();

    problems.forEach((problem, index) => {
      if (problem.question === question) {
        problems.splice(index, 1);
      }
    });

    localStorage.setItem("problems", JSON.stringify(problems));
  }
}

// UI Class: Deals with UI Control
class UI {
  static displayProblems() {
    const problems = Store.getProblems();

    problems.forEach((problem) => UI.addProblemToList(problem));
  }

  static addProblemToList(problem) {
    const list = document.getElementById("cards-list");

    const card = document.createElement("div");

    card.classList = "question border";

    card.innerHTML = `
    <h2>${problem.question}</h2>
          <a href="#" class="toggle-answer">Show/Hide Answer</a>
          <h3 class="hide answer">${problem.answer}</h3>
          <input type="submit" class="btn btn-primary m-1 edit" value="EDIT" />
          <input
            type="submit"
            class="delete btn btn-danger float-right m-1"
            value="DELETE" />
    `;

    list.appendChild(card);
  }

  static deleteProblem(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.remove();
      Store.removeProblem(el.parentElement.children[0].textContent);
      UI.showAlert("Flashcard Removed", "success");
    }
  }

  static editProblem(el) {
    if (el.classList.contains("edit")) {
      const question = el.parentElement.children[0].textContent;
      const answer = el.parentElement.children[2].textContent;

      Store.removeProblem(question);

      el.parentElement.remove();

      UI.ShowForm();

      document.getElementById("question").value = question;
      document.getElementById("answer").value = answer;
    }
  }

  static clearFields() {
    const question = document.getElementById("question");
    const answer = document.getElementById("answer");

    question.value = "";
    answer.value = "";
  }

  static showAlert(message, type) {
    const container = document.getElementById("top-half");

    const button = document.getElementById("show-form");

    const div = document.createElement("div");

    div.classList = `alert alert-${type}`;

    div.textContent = message;

    container.insertBefore(div, button);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  static toggleAnswer(el) {
    if (el.classList.contains("toggle-answer")) {
      el.nextElementSibling.classList.toggle("hide");
    }
  }

  static ShowForm() {
    const form = document.querySelector("#card-form");

    form.classList.remove("hide");
  }
  static HideForm() {
    const form = document.querySelector("#card-form");

    form.classList.add("hide");
  }
}

// Event: Display Problems
document.addEventListener("DOMContentLoaded", UI.displayProblems);

// Event: Add Problem
document.getElementById("card-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const question = document.querySelector("#question").value;
  const answer = document.querySelector("#answer").value;

  if (question === "" || answer === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // instantiate problem
    const problem = new Problem(question, answer);

    // Add Problem to UI
    UI.addProblemToList(problem);

    // Add Problem to Store
    Store.addProblem(problem);

    UI.clearFields();

    UI.showAlert("Flashcard Created", "success");
  }
});
// Event: Delete Problem
document.querySelector("#cards-list").addEventListener("click", (e) => {
  UI.deleteProblem(e.target);
});
// Event: Edit Problem
document.querySelector("#cards-list").addEventListener("click", (e) => {
  UI.editProblem(e.target);
});

// Event: Show Form
document.getElementById("show-form").addEventListener("click", UI.ShowForm);

// Event: Hide Form
document.getElementById("hide-form").addEventListener("click", UI.HideForm);

// Event: Toggle Answer
document.getElementById("cards-list").addEventListener("click", (e) => {
  e.preventDefault();
  UI.toggleAnswer(e.target);
});
