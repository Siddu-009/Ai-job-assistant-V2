from services.deduplicator import remove_duplicates

jobs = [

    {
        "title": "DevOps Engineer",
        "company": "Google",
        "location": "Remote"
    },

    {
        "title": "DevOps Engineer",
        "company": "Google",
        "location": "Remote"
    },

    {
        "title": "Python Developer",
        "company": "Microsoft",
        "location": "USA"
    },

    {
        "title": "Python Developer",
        "company": "Microsoft",
        "location": "USA"
    },

    {
        "title": "Mechanical Engineer",
        "company": "Bosch",
        "location": "India"
    }

]

result = remove_duplicates(jobs)

print("Original Jobs :", len(jobs))
print("Unique Jobs   :", len(result))

for job in result:
    print(job)