$$ = window.$$ || {};
$$.domain = $$.domain || {};

$$.domain.Tournament = function (name,
                                 registrationDeadlineYear,
                                 registrationDeadlineMonth,
                                 registrationDeadlineDate,
                                 createdBy) {

    const deadLine = new Date();
    deadLine.setFullYear(registrationDeadlineYear, registrationDeadlineMonth - 1, registrationDeadlineDate);
    deadLine.setHours(23, 59, 59);
    const registrationDeadLine = deadLine.getTime();

    this.name = name;
    this.registrationDeadline = registrationDeadLine;
    this.createdBy = createdBy;
};