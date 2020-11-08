$$ = window.$$ || {};

$$.TournamentsController = function () {

    const tournamentPanel = document.getElementById("tournaments-panel");
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
        // No need to unregister listener yet, only one invocation of init() so far.
        $$.TournamentDescriptions.onValueChange(snapshot => renderTournamentList(tournamentList, snapshot));
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
        $$.TournamentDescriptions.add(
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

    function showOneTournament(tournamentDescription) {
        tournamentPanel.className = "hidden";
        // noinspection JSUnresolvedVariable
        if (tournamentDescription.val().started) {
            $$.StartedTournamentController.show(tournamentDescription.key);
        } else {
            $$.TournamentRegistrationController.show(tournamentDescription.key);
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
            // noinspection JSUnresolvedFunction
            $$.CurrentUser.isNotAdmin(() => ul.firstChild.firstChild.click());
        }
    }

    function renderOneTournament(tournamentDescription) {
        const a = document.createElement("a");
        a.setAttribute("href", "");
        a.innerText = tournamentDescription.val().name;
        a.onclick = (event) => {
            event && event.preventDefault();
            showOneTournament(tournamentDescription);
        };
        const li = document.createElement("li");
        li.appendChild(a);
        return li;
    }

}();