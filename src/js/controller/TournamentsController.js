$$ = window.$$ || {};

$$.TournamentsController = function () {

    const tournamentPanel = document.getElementById("tournaments-panel");
    const tournamentList = document.getElementById("tournament-list");
    const newTournamentPanel = document.getElementById("new-tournament-panel");
    const newTournamentButton = document.getElementById("new-tournament-button");
    const newTournamentNameInput = document.getElementById("new-tournament-name-input");
    const registrationDeadlineDateInput = document.getElementById("registration-deadline-date");
    const registrationDeadlineMonthInput = document.getElementById("registration-deadline-month");
    const registrationDeadlineYearInput = document.getElementById("registration-deadline-year");

    let listener = null;

    newTournamentButton.onclick = addTournament;

    return {
        show: show
    };

    function show() {
        listener = $$.TournamentDescriptions.onValueChange(snapshot => {
            if (snapshot.exists()) {
                renderTournamentList(snapshot);
            }
        });
        newTournamentPanel.className = $$.CurrentUser.isAdmin() ? "" : "hidden";
        tournamentPanel.className = "";
    }

    function hide() {
        tournamentPanel.className = "hidden";
        listener.off();
        listener = null;
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
        hide();
        // noinspection JSUnresolvedVariable
        if (tournamentDescription.val().started) {
            $$.StartedTournamentController.show(tournamentDescription.key);
        } else {
            $$.TournamentRegistrationController.show(tournamentDescription.key);
        }
    }

    function renderTournamentList(tournaments) {
        const ul = document.createElement("ul");
        tournaments.forEach(tournament => {
            ul.appendChild(renderOneTournament(tournament));
        });
        if (tournamentList.firstChild) {
            tournamentList.replaceChild(ul, tournamentList.firstChild);
        } else {
            tournamentList.appendChild(ul);
        }
        if (ul.childNodes.length === 1 && $$.CurrentUser.isNotAdmin()) {
            // noinspection JSUnresolvedFunction
            ul.firstChild.firstChild.click();
        }
    }

    function renderOneTournament(tournamentDescription) {
        const a = document.createElement("a");
        a.setAttribute("href", "");
        // noinspection JSUnresolvedVariable
        a.innerText = tournamentDescription.val().name + " (" + (tournamentDescription.val().started ? "pågår" : "ikke startet") + ")";
        a.onclick = (event) => {
            event && event.preventDefault();
            showOneTournament(tournamentDescription);
        };
        const li = document.createElement("li");
        li.appendChild(a);
        return li;
    }

}();