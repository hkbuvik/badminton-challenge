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

    function showTournament(key) {
        tournamentPanel.className = "hidden";
        $$.OneTournamentController.show(key);
    }

    function renderTournamentList(listElement, tournaments) {
        const ul = document.createElement("ul");
        console.log(tournaments.toJSON());
        tournaments.forEach(tournament => {
            const a = document.createElement("a");
            a.setAttribute("href", "");
            a.innerText = tournament.val().name;
            a.onclick = (event) => {
                event && event.preventDefault();
                showTournament(tournament.key);
            };
            const li = document.createElement("li");
            li.appendChild(a);
            ul.appendChild(li);
        });
        const firstChild = listElement.firstChild;
        firstChild
            ? listElement.replaceChild(ul, firstChild)
            : listElement.appendChild(ul);
    }
}();