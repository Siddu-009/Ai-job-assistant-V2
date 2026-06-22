def score_answer(answer):

    length = len(answer.split())

    if length > 40:
        return 9, "Excellent answer"

    elif length > 20:
        return 7, "Good answer"

    elif length > 10:
        return 5, "Average answer"

    return 3, "Needs improvement"
