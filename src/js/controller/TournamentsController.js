$$ = window.$$ || {};

$$.TournamentsController = function () {

    const tournamentPanel = document.getElementById("tournament-panel");
    const tournamentList = document.getElementById("tournament-list");
    const newTournamentDiv = document.getElementById("new-tournament");
    const newTournamentButton = document.getElementById("new-tournament-button");
    const newTournamentNameInput = document.getElementById("new-tournament-name-input");
    const registrationDeadlineDateInput = document.getElementById("registration-deadline-date");
    const registrationDeadlineMonthInput = document.getElementById("registration-deadline-month");
    const registrationDeadlineYearInput = document.getElementById("registration-deadline-year");

    newTournamentButton.onclick = addTournament;

    return {
        init: init,
        show: show
    };

    function init() {
        $$.Tournaments.onValueChange(snapshot => renderTournamentList(tournamentList, snapshot));
        tournamentPanel.className = "";
        $$.CurrentUser.isAdmin(() => newTournamentDiv.className = "")
    }

    function show() {
        tournamentPanel.className = "";
    }

    function addTournament() {
        newTournamentNameInput.disabled = true;
        const registrationDeadline = new Date();
        registrationDeadline.setFullYear(
            registrationDeadlineYearInput.value,
            registrationDeadlineMonthInput.value - 1,
            registrationDeadlineDateInput.value);
        registrationDeadline.setHours(23, 59, 59);
        $$.Tournaments.add(
            newTournamentNameInput.value,
            registrationDeadline.getTime(),
            () => {
                newTournamentNameInput.disabled = false;
                newTournamentNameInput.value = "";
                registrationDeadlineDateInput.value = "";
                registrationDeadlineMonthInput.value = "";
                registrationDeadlineYearInput.value = "";
            });
    }

    function showOneTournament(tournament) {
        tournamentPanel.className = "hidden";
        if (tournament.val().started) {
            $$.OneTournamentController.show(tournament.key);
        } else {
            $$.OneTournamentRegistrationController.show(tournament.key);
        }
    }

    function renderTournamentList(listElement, tournaments) {
        const ul = document.createElement("ul");
        tournaments.forEach(tournament => {
            ul.appendChild(renderOneTournament(tournament));
        });
        if (listElement.firstChild) {
            listElement.replaceChild(ul, listElement.firstChild);
        } else {
            listElement.appendChild(ul);
        }
        if (ul.childNodes.length === 1) {
            $$.CurrentUser.isNotAdmin(() => ul.firstChild.firstChild.click());
        }
    }

    function renderOneTournament(tournament) {
        const a = document.createElement("a");
        a.setAttribute("href", "");
        a.innerText = tournament.val().name;
        a.onclick = (event) => {
            event && event.preventDefault();
            showOneTournament(tournament);
        };
        const li = document.createElement("li");
        li.appendChild(a);
        return li;
    }

}();