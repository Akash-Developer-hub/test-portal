from django.http import JsonResponse
from pymongo import MongoClient

def studentstats(request, regno):
    client = MongoClient('mongodb+srv://ihub:ihub@test-portal.lcgyx.mongodb.net/test_portal_db?retryWrites=true&w=majority')
    db = client['test_portal_db']

    # Fetch student data
    student_data = db.students.find_one({"regno": regno})
    if not student_data:
        return JsonResponse({"error": "Student not found"}, status=404)

    # Fetch contest data visible to the student
    contest_data = db.coding_assessments.find({"visible_to": regno}, {"_id": 0})
    contest_list = list(contest_data)

    # Performance stats
    total_tests = len(contest_list)
    completed_tests = sum(1 for contest in contest_list if contest.get("completed", False))
    in_progress_tests = total_tests - completed_tests

    # Response with all assessment details
    assessments = []
    for contest in contest_list:
        assessment_overview = contest.get("assessmentOverview", {})
        problems = []

        for problem in contest.get("problems", []):
            problems.append({
                "title": problem.get("title", ""),
                "level": problem.get("level", ""),
                "problem_statement": problem.get("problem_statement", ""),
                "pass_count": problem.get("pass_count", 0),
                "fail_count": problem.get("fail_count", 0)
            })

        assessments.append({
            "contestId": contest.get("contestId", ""),
            "name": assessment_overview.get("name", ""),
            "description": assessment_overview.get("description", ""),
            "registrationStart": assessment_overview.get("registrationStart", ""),
            "registrationEnd": assessment_overview.get("registrationEnd", ""),
            "guidelines": assessment_overview.get("guidelines", ""),
            "questions": contest.get("testConfiguration", {}).get("questions", ""),
            "duration": contest.get("testConfiguration", {}).get("duration", ""),
            "passPercentage": contest.get("testConfiguration", {}).get("passPercentage", ""),
            "problems": problems
        })

    response_data = {
        "student": {
            "name": student_data.get("name", ""),
            "email": student_data.get("email", ""),
            "collegename": student_data.get("collegename", ""),
            "dept": student_data.get("dept", ""),
            "regno": regno,
        },
        "performance": {
            "total_tests": total_tests,
            "completed_tests": completed_tests,
            "in_progress_tests": in_progress_tests,
            "average_score": 0,  # Placeholder for average score logic
        },
        "assessments": assessments
    }
    return JsonResponse(response_data)
