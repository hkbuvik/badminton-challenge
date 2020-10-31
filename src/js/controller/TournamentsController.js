$$ = window.$$ || {};

$$.TournamentsController = function () {

    const tournamentPanel = document.getElementById("tournament-panel");
    const tournamentList = document.getElementById("tournament-list");
    const newTournamentDiv = document.getElementById("new-tournament");
    const newTournamentButton = document.getElementById("new-tournament-button");
    const newTournamentNameInput = document.getElementById("new-tournament-name-input");

    newTournamentButton.onclick = () => addTournament();

    return {
        init: init
    };

    function init() {
        $$.Tournaments.onValueChange(snapshot => renderTournamentList(tournamentList, snapshot));
        tournamentPanel.className = "";
        $$.Admins.onContainsCurrentUser(() => newTournamentDiv.className = "")
    }

    function addTournament() {
        newTournamentNameInput.disabled = true;
        $$.Tournaments.add(newTournamentNameInput.value, () => newTournamentNameInput.disabled = false);
    }

    function showOneTournament(key) {
        tournamentPanel.className = "hidden";
        $$.OneTournamentController.show(key);
    }

    function renderTournamentList(listElement, tournaments) {
        const ul = document.createElement("ul");
        tournaments.forEach(tournament => {
            const newChild = renderOneTournament(tournament);
            ul.appendChild(newChild);
        });
        if (listElement.firstChild) {
            listElement.replaceChild(ul, listElement.firstChild);
        } else {
            listElement.appendChild(ul);
        }
    }

    function renderOneTournament(tournament) {
        const a = document.createElement("a");
        a.setAttribute("href", "");
        a.innerText = tournament.val().name;
        a.onclick = (event) => {
            event && event.preventDefault();
            showOneTournament(tournament.key);
        };
        const li = document.createElement("li");
        li.appendChild(a);
        return li;
    }
}();